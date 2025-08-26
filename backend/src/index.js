const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIo = require("socket.io");
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 5000;

// app.use(cors());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/select_db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);

const activeUsers = new Map();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-admin", (adminId) => {
    socket.join("admin-room");
    socket.adminId = adminId;
    console.log(`Admin ${adminId} joined admin room`);
  });

  socket.on("join-user", async (userId) => {
    socket.join(`user-${userId}`);
    socket.userId = userId;

    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(userId, {
        isOnline: true,
        lastActivity: new Date(),
      });

      activeUsers.set(userId, {
        socketId: socket.id,
        isOnline: true,
        isEvaluating: false,
        lastActivity: new Date(),
      });

      const user = await User.findById(userId).select("name email");
      socket.to("admin-room").emit("user-status-update", {
        userId: userId,
        userName: user?.name || user?.email || "Unknown User",
        status: "online",
        isOnline: true,
        isEvaluating: false,
        timestamp: new Date(),
        activityType: "user_online",
      });

      console.log(`User ${userId} connected and marked online`);
    } catch (error) {
      console.error("Error updating user online status:", error);
    }
  });

  socket.on("evaluation-started", async (data) => {
    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(data.userId, {
        isEvaluating: true,
        lastActivity: new Date(),
      });

      if (activeUsers.has(data.userId)) {
        activeUsers.set(data.userId, {
          ...activeUsers.get(data.userId),
          isEvaluating: true,
          lastActivity: new Date(),
        });
      }

      const user = await User.findById(data.userId).select("name email");
      socket.to("admin-room").emit("user-status-update", {
        userId: data.userId,
        userName: user?.name || user?.email || "Unknown User",
        status: "evaluating",
        isOnline: true,
        isEvaluating: true,
        timestamp: new Date(),
        activityType: "evaluation_started",
        attemptNumber: data.attemptNumber || 1,
      });

      console.log(`User ${data.userId} started evaluation`);
    } catch (error) {
      console.error("Error updating evaluation status:", error);
    }
  });

  socket.on("evaluation-update", (data) => {
    const cappedProgress = Math.min(
      100,
      Math.max(0, data.completionPercentage || 0)
    );

    socket.to("admin-room").emit("user-evaluation-update", {
      userId: data.userId,
      currentStep: data.currentStep,
      completionPercentage: cappedProgress,
      stepName: data.stepName,
      timestamp: new Date(),
      activityType: "evaluation_progress",
    });
  });

  socket.on("user-logout", async (userId) => {
    try {
      const User = require("./models/User");
      const UserActivity = require("./models/UserActivity");

      await User.findByIdAndUpdate(userId, {
        isOnline: false,
        isEvaluating: false,
        lastActivity: new Date(),
      });

      const activity = new UserActivity({
        userId: userId,
        activityType: "logout",
        logoutTime: new Date(),
        timestamp: new Date(),
      });
      await activity.save();

      activeUsers.delete(userId);

      const user = await User.findById(userId).select("name email");
      socket.to("admin-room").emit("user-status-update", {
        userId: userId,
        userName: user?.name || user?.email || "Unknown User",
        status: "logged_out",
        isOnline: false,
        isEvaluating: false,
        timestamp: new Date(),
        activityType: "user_logout",
      });

      console.log(`User ${userId} logged out`);
    } catch (error) {
      console.error("Error handling user logout:", error);
    }
  });

  socket.on("user-status-change", (data) => {
    socket.to("admin-room").emit("user-status-update", {
      userId: data.userId,
      status: data.status,
      isOnline: data.isOnline,
      isEvaluating: data.isEvaluating,
      timestamp: new Date(),
    });
  });

  socket.on("disconnect", async () => {
    console.log("User disconnected:", socket.id);

    if (socket.userId) {
      try {
        const User = require("./models/User");

        await User.findByIdAndUpdate(socket.userId, {
          isOnline: false,
          isEvaluating: false,
          lastActivity: new Date(),
        });

        activeUsers.delete(socket.userId);

        const user = await User.findById(socket.userId).select("name email");
        socket.to("admin-room").emit("user-status-update", {
          userId: socket.userId,
          userName: user?.name || user?.email || "Unknown User",
          status: "offline",
          isOnline: false,
          isEvaluating: false,
          timestamp: new Date(),
          activityType: "user_offline",
        });

        console.log(
          `User ${socket.userId} marked offline due to disconnection`
        );
      } catch (error) {
        console.error("Error handling user disconnection:", error);
      }
    }

    if (socket.adminId) {
      console.log(`Admin ${socket.adminId} disconnected`);
    }
  });

  socket.on("heartbeat", (userId) => {
    if (activeUsers.has(userId)) {
      activeUsers.set(userId, {
        ...activeUsers.get(userId),
        lastActivity: new Date(),
      });
    }
  });
});

setInterval(async () => {
  const now = new Date();
  const timeout = 60000;

  for (const [userId, userData] of activeUsers.entries()) {
    if (now - userData.lastActivity > timeout) {
      try {
        const User = require("./models/User");

        await User.findByIdAndUpdate(userId, {
          isOnline: false,
          isEvaluating: false,
          lastActivity: new Date(),
        });

        activeUsers.delete(userId);

        io.to("admin-room").emit("user-status-update", {
          userId: userId,
          status: "offline",
          isOnline: false,
          isEvaluating: false,
          timestamp: new Date(),
        });

        console.log(`User ${userId} timed out and marked offline`);
      } catch (error) {
        console.error("Error during user timeout cleanup:", error);
      }
    }
  }
}, 30000);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = { app, io };

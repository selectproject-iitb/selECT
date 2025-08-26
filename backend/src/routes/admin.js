const express = require("express");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");
const EvaluationSession = require("../models/EvaluationSession");
const Feedback = require("../models/Feedback");
const { authenticateToken, requireAdmin } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
  try {
    const { name, designation, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(400)
        .json({ message: "Admin already exists with this email" });
    }

    const admin = new Admin({
      name,
      designation,
      email,
      password,
    });

    await admin.save();

    const token = generateToken(admin._id, admin.role);

    res.status(201).json({
      message: "Admin created successfully",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        designation: admin.designation,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin signup error:", error);
    res.status(500).json({ message: "Server error during admin signup" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(admin._id, admin.role);

    res.json({
      message: "Admin login successful",
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        designation: admin.designation,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ message: "Server error during admin login" });
  }
});

router.get("/dashboard", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();

    const users = await User.find(
      {},
      {
        password: 0,
      }
    ).sort({ createdAt: -1 });

    const usersWithActivity = await Promise.all(
      users.map(async (user) => {
        const latestActivity = await UserActivity.findOne({
          userId: user._id,
        }).sort({ createdAt: -1 });

        const evaluationStats = await EvaluationSession.aggregate([
          { $match: { userId: user._id } },
          {
            $group: {
              _id: "$userId",
              totalAttempts: { $sum: 1 },
              totalTimeSpent: { $sum: "$totalDuration" },
              completedSessions: {
                $sum: { $cond: ["$isCompleted", 1, 0] },
              },
              incompleteSessions: {
                $sum: {
                  $cond: [
                    {
                      $and: [
                        { $ne: ["$isCompleted", true] },
                        { $eq: ["$hasStarted", true] },
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
              restartCount: {
                $sum: { $cond: ["$isRestart", 1, 0] },
              },
              exportCount: {
                $sum: { $cond: ["$hasExported", 1, 0] },
              },
              maxAttemptNumber: { $max: "$attemptNumber" },
            },
          },
        ]);

        const evaluationAttempts = await EvaluationSession.find({
          userId: user._id,
        })
          .sort({ createdAt: -1 })
          .limit(10)
          .select({
            attemptNumber: 1,
            startTime: 1,
            endTime: 1,
            isCompleted: 1,
            completionPercentage: 1,
            currentStep: 1,
            totalSteps: 1,
            isRestart: 1,
            hasExported: 1,
            totalDuration: 1,
          });

        const stats = evaluationStats[0] || {
          totalAttempts: 0,
          totalTimeSpent: 0,
          completedSessions: 0,
          incompleteSessions: 0,
          restartCount: 0,
          exportCount: 0,
          maxAttemptNumber: 0,
        };

        const currentEvaluation = await EvaluationSession.findOne({
          userId: user._id,
          isCompleted: false,
        }).sort({ createdAt: -1 });

        let currentEvaluationData = null;
        if (currentEvaluation) {
          const completionPercentage = Math.min(
            100,
            Math.max(0, currentEvaluation.completionPercentage || 0)
          );

          currentEvaluationData = {
            sessionId: currentEvaluation._id,
            attemptNumber: currentEvaluation.attemptNumber || 1,
            currentStep: currentEvaluation.currentStep || 0,
            completionPercentage,
            startTime: currentEvaluation.startTime,
            isEvaluating:
              !currentEvaluation.isCompleted && currentEvaluation.hasStarted,
            stepName: currentEvaluation.currentStepName || "Not Started",
            totalSteps: currentEvaluation.totalSteps || 3,
          };
        }

        let userStatus = "logged_out"; // Default status

        if (
          currentEvaluation &&
          !currentEvaluation.isCompleted &&
          currentEvaluation.hasStarted
        ) {
          userStatus = "evaluating";
        } else if (user.isOnline) {
          userStatus = "online";
        } else if (
          user.lastActivity &&
          new Date() - new Date(user.lastActivity) < 300000
        ) {
          userStatus = "offline"; // Recently active but disconnected
        }

        return {
          ...user.toObject(),
          userStatus,
          activityData: {
            lastLoginTime: latestActivity?.loginTime,
            lastLogoutTime: latestActivity?.logoutTime,
            userStatus, // Also include in activity data
            isOnline: user.isOnline,
            totalTimeSpent: stats.totalTimeSpent,
            totalAttempts: stats.totalAttempts,
            completedEvaluations: stats.completedSessions,
            incompleteEvaluations: stats.incompleteSessions,
            restartCount: stats.restartCount,
            exportCount: stats.exportCount,
            maxAttemptNumber: stats.maxAttemptNumber,
            currentEvaluation: currentEvaluationData,
            evaluationHistory: evaluationAttempts,
          },
        };
      })
    );

    const evaluatingUsers = await EvaluationSession.countDocuments({
      isCompleted: false,
      hasStarted: true,
    });

    res.json({
      message: "Admin dashboard data",
      admin: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        designation: req.user.designation,
        role: req.user.role,
      },
      dashboardData: {
        totalUsers,
        onlineUsers: await User.countDocuments({ isOnline: true }),
        evaluatingUsers,
        users: usersWithActivity,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

router.post("/track-evaluation-start", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    const targetUserId = userId || req.user._id;

    const lastSession = await EvaluationSession.findOne({
      userId: targetUserId,
    }).sort({ attemptNumber: -1 });

    const attemptNumber = (lastSession?.attemptNumber || 0) + 1;

    const evaluationSession = new EvaluationSession({
      userId: targetUserId,
      sessionId: `eval_${targetUserId}_${Date.now()}`,
      attemptNumber,
      startTime: new Date(),
      hasStarted: true,
      currentStep: 1,
      currentStepName: "Overview Completed",
      completionPercentage: 0,
      totalSteps: 3,
      isCompleted: false,
    });

    await evaluationSession.save();

    await User.findByIdAndUpdate(targetUserId, {
      isEvaluating: true,
      lastActivity: new Date(),
    });

    res.json({
      message: "Evaluation tracking started",
      sessionId: evaluationSession._id,
      attemptNumber,
    });
  } catch (error) {
    console.error("Track evaluation start error:", error);
    res.status(500).json({ message: "Error starting evaluation tracking" });
  }
});

router.post("/track-restart", authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (sessionId) {
      await EvaluationSession.findByIdAndUpdate(sessionId, {
        isCompleted: false,
        isAbandoned: true,
        endTime: new Date(),
        totalDuration:
          Date.now() - new Date(sessionId.startTime || Date.now()).getTime(),
      });
    }

    const lastSession = await EvaluationSession.findOne({
      userId: req.user._id,
    }).sort({ attemptNumber: -1 });

    const attemptNumber = (lastSession?.attemptNumber || 0) + 1;

    const newSession = new EvaluationSession({
      userId: req.user._id,
      sessionId: `eval_${req.user._id}_${Date.now()}`,
      attemptNumber,
      startTime: new Date(),
      hasStarted: true,
      currentStep: 1,
      currentStepName: "Restarted",
      completionPercentage: 0,
      totalSteps: 3,
      isCompleted: false,
      isRestart: true,
    });

    await newSession.save();

    res.json({
      message: "Restart tracked successfully",
      sessionId: newSession._id,
      attemptNumber,
    });
  } catch (error) {
    console.error("Track restart error:", error);
    res.status(500).json({ message: "Error tracking restart" });
  }
});

router.post("/track-export", authenticateToken, async (req, res) => {
  try {
    const { sessionId, exportType = "results" } = req.body;

    if (sessionId) {
      await EvaluationSession.findByIdAndUpdate(sessionId, {
        hasExported: true,
        exportTime: new Date(),
        exportType,
      });
    }

    const activity = new UserActivity({
      userId: req.user._id,
      activityType: "export_results",
      details: { exportType, sessionId },
      timestamp: new Date(),
    });

    await activity.save();

    res.json({
      message: "Export tracked successfully",
    });
  } catch (error) {
    console.error("Track export error:", error);
    res.status(500).json({ message: "Error tracking export" });
  }
});

router.get("/stats", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const onlineUsers = await User.countDocuments({ isOnline: true });
    const evaluatingUsers = await User.countDocuments({ isEvaluating: true });

    const evaluationStats = await EvaluationSession.aggregate([
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: { $cond: ["$isCompleted", 1, 0] },
          },
          totalTimeSpent: { $sum: "$totalDuration" },
        },
      },
    ]);

    const stats = evaluationStats[0] || {
      totalSessions: 0,
      completedSessions: 0,
      totalTimeSpent: 0,
    };

    res.json({
      totalUsers,
      onlineUsers,
      evaluatingUsers,
      totalEvaluationSessions: stats.totalSessions,
      completedEvaluations: stats.completedSessions,
      totalPlatformTime: stats.totalTimeSpent,
    });
  } catch (error) {
    console.error("Stats error:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// Submit feedback
router.post("/feedback", authenticateToken, async (req, res) => {
  try {
    const { feedback, category = "general", sessionId } = req.body;

    if (!feedback || !feedback.trim()) {
      return res.status(400).json({ message: "Feedback message is required" });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newFeedback = new Feedback({
      userId: req.user._id,
      userEmail: user.email,
      userName: user.name || user.email,
      feedback: feedback.trim(),
      category,
      sessionId: sessionId || null,
    });

    await newFeedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedbackId: newFeedback._id,
    });
  } catch (error) {
    console.error("Submit feedback error:", error);
    res.status(500).json({ message: "Error submitting feedback" });
  }
});

// Get all feedback
router.get("/feedback", authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    const filter = {};
    if (status && ["pending", "reviewed", "resolved"].includes(status)) {
      filter.status = status;
    }

    const feedback = await Feedback.find(filter)
      .populate("userId", "name email schoolName")
      .populate("respondedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number.parseInt(limit));

    const totalFeedback = await Feedback.countDocuments(filter);
    const totalPages = Math.ceil(totalFeedback / limit);

    const stats = await Feedback.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const feedbackStats = {
      pending: 0,
      reviewed: 0,
      resolved: 0,
    };

    stats.forEach((stat) => {
      feedbackStats[stat._id] = stat.count;
    });

    res.json({
      message: "Feedback retrieved successfully",
      feedback,
      pagination: {
        currentPage: Number.parseInt(page),
        totalPages,
        totalFeedback,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      stats: feedbackStats,
    });
  } catch (error) {
    console.error("Get feedback error:", error);
    res.status(500).json({ message: "Error retrieving feedback" });
  }
});

module.exports = router;

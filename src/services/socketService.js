import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
  }

  connect(token) {
    if (this.socket) {
      this.disconnect();
    }

    const serverUrl =
      process.env.REACT_APP_SOCKET_API_URL || "http://localhost:5000";

    this.socket = io(serverUrl, {
      auth: {
        token: token,
      },
      transports: ["websocket", "polling"],
    });

    this.socket.on("connect", () => {
      this.isConnected = true;
    });

    this.socket.on("disconnect", () => {
      console.log("Socket disconnected");
      this.isConnected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      this.isConnected = false;
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }

  // User
  joinUserRoom(userId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-user", userId);
    }
  }

  // Admin
  joinAdminRoom(adminId) {
    if (this.socket && this.isConnected) {
      this.socket.emit("join-admin", adminId);
    }
  }

  // Evaluation track
  emitEvaluationUpdate(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit("evaluation-update", data);
    }
  }

  emitUserStatusChange(data) {
    if (this.socket && this.isConnected) {
      this.socket.emit("user-status-change", data);
    }
  }

  // Event listener
  onUserEvaluationUpdate(callback) {
    if (this.socket) {
      this.socket.on("user-evaluation-update", callback);
    }
  }

  onUserStatusUpdate(callback) {
    if (this.socket) {
      this.socket.on("user-status-update", callback);
    }
  }

  // Remove listeners
  offUserEvaluationUpdate() {
    if (this.socket) {
      this.socket.off("user-evaluation-update");
    }
  }

  offUserStatusUpdate() {
    if (this.socket) {
      this.socket.off("user-status-update");
    }
  }

  getSocket() {
    return this.socket;
  }

  isSocketConnected() {
    return this.isConnected;
  }
}

const socketService = new SocketService();
export default socketService;

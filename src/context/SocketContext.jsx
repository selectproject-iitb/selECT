import { createContext, useContext, useEffect, useState } from "react";
import socketService from "../services/socketService";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    userUpdates: [],
    evaluationUpdates: [],
  });
  const { user, token } = useAuth();

  useEffect(() => {
    if (token && user) {
      const socket = socketService.connect(token);

      if (socket) {
        socket.on("connect", () => {
          setIsConnected(true);

          if (user.role === "admin") {
            socketService.joinAdminRoom(user.id);
          } else {
            socketService.joinUserRoom(user.id);
          }
        });

        socket.on("disconnect", () => {
          console.log("Socket disconnected");
          setIsConnected(false);
        });

        socket.on("connect_error", (error) => {
          console.error("Socket connection error:", error);
          setIsConnected(false);
        });

        if (user.role === "admin") {
          socketService.onUserEvaluationUpdate((data) => {
            console.log("Received evaluation update:", data);
            setRealTimeData((prev) => ({
              ...prev,
              evaluationUpdates: [data, ...prev.evaluationUpdates.slice(0, 49)],
            }));
          });

          socketService.onUserStatusUpdate((data) => {
            console.log("Received user status update:", data);
            setRealTimeData((prev) => ({
              ...prev,
              userUpdates: [data, ...prev.userUpdates.slice(0, 49)],
            }));
          });
        }

        const heartbeatInterval = setInterval(() => {
          if (socket.connected && user) {
            socket.emit("heartbeat", user.id);
          }
        }, 30000);

        return () => {
          clearInterval(heartbeatInterval);
          if (socketService.isSocketConnected()) {
            socketService.offUserEvaluationUpdate();
            socketService.offUserStatusUpdate();
            socketService.disconnect();
            setIsConnected(false);
          }
        };
      }
    }

    return () => {
      if (socketService.isSocketConnected()) {
        socketService.disconnect();
        setIsConnected(false);
      }
    };
  }, [token, user]);

  const emitEvaluationUpdate = (stepData) => {
    if (user && isConnected) {
      socketService.emitEvaluationUpdate({
        userId: user.id,
        currentStep: stepData.currentStep,
        completionPercentage: stepData.completionPercentage,
        stepName: stepData.stepName,
      });
    }
  };

  const emitUserStatusChange = (statusData) => {
    if (user && isConnected) {
      socketService.emitUserStatusChange({
        userId: user.id,
        isOnline: statusData.isOnline,
        isEvaluating: statusData.isEvaluating,
      });
    }
  };

  const value = {
    isConnected,
    realTimeData,
    emitEvaluationUpdate,
    emitUserStatusChange,
    socketService,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

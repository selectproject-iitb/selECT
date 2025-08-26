import { useEffect, useRef, useState } from "react";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import apiService from "../services/apiService";

export const useRealTimeTracking = () => {
  const { emitEvaluationUpdate, emitUserStatusChange, isConnected } =
    useSocket();
  const { user } = useAuth();
  const { state } = useApp();
  const lastStepRef = useRef(null);
  const sessionStartRef = useRef(null);
  const currentSessionRef = useRef(null);
  const [trackingStatus, setTrackingStatus] = useState("connecting");

  const trackEvaluationStart = async () => {
    try {
      const response = await apiService.post("/admin/track-evaluation-start");
      currentSessionRef.current = response.sessionId;
      console.log("Evaluation tracking started:", response.sessionId);
    } catch (error) {
      console.error("Failed to track evaluation start:", error);
    }
  };

  const trackRestart = async () => {
    try {
      const response = await apiService.post("/admin/track-restart", {
        sessionId: currentSessionRef.current,
      });
      currentSessionRef.current = response.sessionId;
      console.log("Restart tracked:", response.sessionId);
    } catch (error) {
      console.error("Failed to track restart:", error);
    }
  };

  const trackExport = async (exportType = "results") => {
    try {
      await apiService.post("/admin/track-export", {
        sessionId: currentSessionRef.current,
        exportType,
      });
      console.log("Export tracked:", exportType);
    } catch (error) {
      console.error("Failed to track export:", error);
    }
  };

  useEffect(() => {
    if (isConnected && user) {
      setTrackingStatus("connected");
    } else if (user) {
      setTrackingStatus("connecting");
    } else {
      setTrackingStatus("disconnected");
    }
  }, [isConnected, user]);

  // Track evaluation progress changes
  useEffect(() => {
    if (!user || !isConnected) return;

    let currentStep = 0;
    let stepName = "Not Started";
    let completionPercentage = 0;

    if (state.globalContextCompleted) {
      currentStep = 2;
      stepName = "Configure Videos";
      completionPercentage = 33;
    }

    const hasStartedScoring = state.videos.some(
      (video) =>
        video.assessmentData?.content?.answers &&
        Object.keys(video.assessmentData.content.answers).length > 0
    );

    if (hasStartedScoring) {
      currentStep = 3;
      stepName = `Scoring Video ${state.currentVideoIndex + 1}`;

      const completedVideos = state.videos.filter(
        (video) => video.score > 0
      ).length;
      const videoProgress = Math.round(
        (completedVideos / state.videos.length) * 67
      );
      completionPercentage = Math.min(100, 33 + videoProgress);
    }

    const allVideosCompleted =
      state.videos.length > 0 && state.videos.every((video) => video.score > 0);
    if (allVideosCompleted) {
      currentStep = 4;
      stepName = "Evaluation Complete";
      completionPercentage = 100;
    }

    if (lastStepRef.current !== currentStep && currentStep > 0) {
      console.log("Emitting evaluation update:", {
        currentStep,
        stepName,
        completionPercentage,
      });
      emitEvaluationUpdate({
        currentStep,
        stepName,
        completionPercentage: Math.min(100, Math.max(0, completionPercentage)),
        sessionId: currentSessionRef.current,
      });
      lastStepRef.current = currentStep;
    }
  }, [state, user, isConnected, emitEvaluationUpdate]);

  useEffect(() => {
    if (!user || !isConnected) return;

    const isEvaluating =
      state.globalContextCompleted ||
      state.videos.some((video) => video.score > 0) ||
      state.videos.some(
        (video) =>
          video.assessmentData?.content?.answers &&
          Object.keys(video.assessmentData.content.answers).length > 0
      );

    emitUserStatusChange({
      isOnline: true,
      isEvaluating,
    });
  }, [state, user, isConnected, emitUserStatusChange]);

  useEffect(() => {
    if (!user || !isConnected) return;

    if (!sessionStartRef.current) {
      sessionStartRef.current = Date.now();
      emitUserStatusChange({
        isOnline: true,
        isEvaluating: false,
      });
    }

    return () => {
      if (sessionStartRef.current) {
        emitUserStatusChange({
          isOnline: false,
          isEvaluating: false,
        });
      }
    };
  }, [user, isConnected, emitUserStatusChange]);

  return {
    isConnected,
    trackingStatus,
    currentStep: lastStepRef.current,
    trackEvaluationStart,
    trackRestart,
    trackExport,
    currentSessionId: currentSessionRef.current,
  };
};

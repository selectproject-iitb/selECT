import { useEffect } from "react";

const ReloadWarning = () => {
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      try {
        const savedState = localStorage.getItem("select-state");
        if (savedState) {
          const parsedState = JSON.parse(savedState);
          const hasData =
            parsedState.globalContextCompleted ||
            parsedState.videos?.some(
              (v) => v.score > 0 || v.completedSteps?.assessment
            );

          if (hasData) {
            const message =
              "You have unsaved assessment progress. Are you sure you want to leave? All progress will be lost.";
            event.preventDefault();
            event.returnValue = message;
            return message;
          }
        }
      } catch (error) {
        console.error("Error checking state:", error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  return null;
};

export default ReloadWarning;

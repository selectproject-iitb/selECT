import { useState } from "react";
import Button from "../components/UI/Button";
import Stepper from "../components/UI/Stepper";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import OverviewVideosSection from "../components/Overview/VideosSection";
import OverviewHowItWorksSection from "../components/Overview/HowItWorksSection";
import OverviewJourneySection from "../components/Overview/JourneySection";
import { useRealTimeTracking } from "../hooks/useRealTimeTracking";

const Overview = () => {
  const navigate = useNavigate();
  const [currentOverviewStep, setCurrentOverviewStep] = useState(1);
  const { trackEvaluationStart } = useRealTimeTracking();

  const overviewStepsConfig = [
    { label: "Introduction", description: "Learn about selECT" },
    { label: "How it Works", description: "Understand the process" },
    { label: "Choose your context", description: "Visualize the flow" },
  ];

  const handleNextStep = async () => {
    if (currentOverviewStep < overviewStepsConfig.length) {
      setCurrentOverviewStep((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      await trackEvaluationStart();
      navigate("/assess");
    }
  };

  const handlePreviousStep = () => {
    if (currentOverviewStep > 1) {
      setCurrentOverviewStep((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:py-10">
      <Stepper
        steps={overviewStepsConfig}
        current={currentOverviewStep}
        onStepClick={(stepNum) => {
          setCurrentOverviewStep(stepNum);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
      <div className="space-y-6 sm:space-y-8">
        {currentOverviewStep === 1 && <OverviewVideosSection />}
        {currentOverviewStep === 2 && <OverviewHowItWorksSection />}
        {currentOverviewStep === 3 && <OverviewJourneySection />}
      </div>
      {currentOverviewStep < overviewStepsConfig.length && (
        <div className="mt-6 sm:mt-8 flex justify-between">
          <Button variant="outline" onClick={handlePreviousStep} size="md">
            <FiArrowLeft className="mr-2" /> Previous
          </Button>
          <Button onClick={handleNextStep} size="md">
            Next <FiArrowRight className="ml-2" />
          </Button>
        </div>
      )}
      {currentOverviewStep === overviewStepsConfig.length && (
        <div className="mt-6 sm:mt-8 flex justify-end">
          <Button onClick={handleNextStep} size="md">
            Start Evaluation <FiArrowRight className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default Overview;

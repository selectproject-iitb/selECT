import React from "react";

const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepsConfig,
  currentSubStep = null,
  totalSubSteps = null,
}) => {
  return (
    <div className="mb-8 sm:mb-12">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {stepsConfig.map((step, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-base sm:text-lg font-bold transition-all duration-300 ${
                  index + 1 <= currentStep
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.icon || index + 1}
              </div>
              <div className="mt-1 sm:mt-2">
                <div
                  className={`font-medium text-sm ${
                    index + 1 <= currentStep ? "text-primary" : "text-gray-500"
                  }`}
                >
                  {step.label}
                </div>
                {step.description && (
                  <div className="text-xs text-gray-500 mt-0.5 max-w-[80px] sm:max-w-20">
                    {step.description}
                  </div>
                )}
              </div>
            </div>

            {index < stepsConfig.length - 1 && (
              <div
                className={`w-8 sm:w-16 h-0.5 sm:h-1 mx-2 sm:mx-4 transition-all duration-300 ${
                  index + 1 < currentStep ? "bg-primary" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      {currentSubStep !== null && totalSubSteps !== null && (
        <div className="text-center mt-3 sm:mt-4 text-gray-600 text-sm">
          Sub-step {currentSubStep} of {totalSubSteps}
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;

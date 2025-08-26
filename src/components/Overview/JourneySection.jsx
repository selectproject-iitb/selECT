import React from "react";
import { FiUpload, FiPlay, FiTarget } from "react-icons/fi";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-light-bg rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

const OverviewJourneySection = () => {
  const steps = [
    {
      icon: FiUpload,
      title: "Gather Videos",
      subtitle:
        "Select up to three videos on your chosen topic from Diksha, YouTube, or other educational channels.",
    },
    {
      icon: FiPlay,
      title: "Use SeleCT",
      subtitle: "For each chosen video, follow the SeleCT evaluation steps.",
    },
    {
      icon: FiTarget,
      title: "Get Score",
      subtitle:
        "After evaluation, you will receive a score for the video based on the evaluation criteria.",
    },
  ];

  return (
    <Card className="mb-6 p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Your Evaluation Journey
        </h3>
        <p className="text-gray-600 text-lg">
          Follow these steps to evaluate your educational videos
        </p>
      </div>

      <div className="relative">
        <div className="absolute top-8 left-8 right-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent hidden sm:block" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              <div className="bg-gray-50/50 hover:bg-gray-50 border border-gray-100 hover:border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                <div className="w-16 h-16 bg-white border border-gray-200 rounded-full flex items-center justify-center mb-4 group-hover:border-gray-300 transition-colors duration-300 shadow-sm">
                  <step.icon className="w-6 h-6 text-gray-600 group-hover:text-gray-700 transition-colors duration-300" />
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 text-lg">
                    {step.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.subtitle}
                  </p>
                </div>

                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 transform -translate-y-1/2 text-gray-300 z-10">
                    <svg
                      className="w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default OverviewJourneySection;

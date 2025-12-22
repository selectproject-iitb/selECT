import React from "react";
import { FiVideo } from "react-icons/fi";
import { MdTask } from "react-icons/md";

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-light-bg rounded-xl shadow-sm border border-gray-100 ${className}`}
  >
    {children}
  </div>
);

// Custom Score Meter Icon Component (Gauge/Meter representing score)
const ScoreIcon = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Semicircle gauge arc (bottom half) */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M4 24a12 12 0 0124 0"
    />
    {/* Needle pointing to score (from center bottom pointing up-left) */}
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={4}
      d="M16 24l-4-7"
    />
    {/* Center pivot point */}
    <circle cx="16" cy="24" r="2.5" fill="currentColor" />
  </svg>
);

const OverviewJourneySection = () => {
  const steps = [
    {
      icon: FiVideo,
      title: "Gather Videos",
      subtitle:
        "Select up to three videos on your chosen topic from Diksha, YouTube, or other educational channels.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: MdTask,
      title: "Use SeleCT",
      subtitle: "For each chosen video, follow the SeleCT evaluation steps.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      icon: ScoreIcon,
      title: "Get Score",
      subtitle:
        "After evaluation, you will receive a score for the video based on the evaluation criteria.",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
  ];

  return (
    <Card className="mb-6 p-6 sm:p-8 lg:p-10">
      <div className="mb-10 text-center sm:text-left">
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          Your Evaluation Journey
        </h3>
        <p className="text-gray-600 text-base max-w-2xl">
          Follow these steps to evaluate your educational videos
        </p>
      </div>

      <div className="relative">
        {/* Connecting line for desktop */}
        <div className="hidden lg:block absolute top-20 left-0 right-0 h-0.5">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-green-200 opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute -right-4 top-20 transform -translate-y-1/2 z-20">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md border border-gray-200">
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative h-full bg-white border border-gray-200 rounded-xl p-6 sm:p-7 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-gray-300 group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50">
                  {/* Step number badge */}
                  <div className="absolute -top-3 -left-3 w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg ring-4 ring-white">
                    {index + 1}
                  </div>

                  {/* Icon container */}
                  <div className="mb-5 mt-2">
                    <div
                      className={`w-16 h-16 ${step.bgColor} rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md`}
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${step.color} rounded-lg flex items-center justify-center shadow-sm`}
                      >
                        <IconComponent className={`w-6 h-6 text-white`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2 text-xl group-hover:text-gray-800 transition-colors">
                      {step.title}
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {step.subtitle}
                    </p>
                  </div>

                  {/* Decorative element */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-b-xl" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default OverviewJourneySection;

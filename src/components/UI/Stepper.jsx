import { FiCheckCircle } from "react-icons/fi";

const Stepper = ({ steps, current, onStepClick }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 mb-8">
      {steps.map((s, idx) => {
        const stepNum = idx + 1;
        const active = stepNum === current;
        const completed = stepNum < current || s.completed;
        return (
          <div key={s.label} className="flex items-center">
            <button
              className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                completed
                  ? "bg-primary text-white"
                  : active
                  ? "bg-white border-2 border-primary text-primary"
                  : "bg-gray-200 text-gray-600"
              }`}
              onClick={() => onStepClick?.(stepNum)}
              aria-label={`Go to ${s.label}`}
              disabled={!onStepClick}
            >
              {completed ? <FiCheckCircle /> : stepNum}
            </button>
            <div className="ml-2 sm:ml-3 mr-3 sm:mr-5">
              <div
                className={`text-xs sm:text-sm font-medium ${
                  active ? "text-primary" : "text-gray-600"
                }`}
              >
                {s.label}
              </div>
              {s.sub && <div className="text-xs text-gray-500">{s.sub}</div>}
            </div>
            {idx < steps.length - 1 && (
              <div className="w-6 sm:w-10 h-0.5 bg-gray-200" />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Stepper;

import { FiFileText } from "react-icons/fi";

const Card = ({ children, className = "", padding = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 ${className} ${padding}`}
  >
    {children}
  </div>
);

const AssessmentScoringTable = ({
  criteria,
  answers,
  onScore,
  rawContentScore,
  currentVideoTotalScore,
}) => {
  const scoreOptions = [
    { value: 5, label: "Minimal", description: "5 pts" },
    { value: 15, label: "Partial", description: "15 pts" },
    { value: 30, label: "Complete", description: "30 pts" },
  ];

  return (
    <>
      <Card className="overflow-hidden">
        <div className="p-6 pb-0">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Evaluation Scoring
          </h3>
          <p className="text-gray-600 text-sm">
            Rate each criterion based on how well it's incorporated
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            {criteria.map((criterion, idx) => (
              <div key={criterion.id} className="group">
                <div className="mb-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-900 mb-1">
                      {criterion.title}
                    </h4>
                    {criterion.guidelineUrl && (
                      <a
                        href={criterion.guidelineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group/btn inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary rounded-full transition-all duration-300 overflow-hidden"
                      >
                        <FiFileText className="w-4 h-4 flex-shrink-0" />
                        <span className="whitespace-nowrap opacity-0 w-0 group-hover/btn:opacity-100 group-hover/btn:w-auto transition-all duration-300">
                          Scoring Guidelines
                        </span>
                      </a>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{criterion.desc}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {scoreOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`
                      relative cursor-pointer rounded-xl border-2 p-4 transition-all duration-200
                      ${
                        answers[criterion.id] === option.value
                          ? "border-primary bg-gray-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50/50"
                      }
                    `}
                    >
                      <input
                        type="radio"
                        name={`criterion-${criterion.id}`}
                        value={option.value}
                        checked={answers[criterion.id] === option.value}
                        onChange={() => onScore(criterion.id, option.value)}
                        className="sr-only"
                      />

                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">
                          {option.label}
                        </span>
                        <div
                          className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors duration-200
                        ${
                          answers[criterion.id] === option.value
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }
                      `}
                        >
                          {answers[criterion.id] === option.value && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                      </div>

                      <span className="text-sm text-gray-500">
                        {option.description}
                      </span>
                    </label>
                  ))}
                </div>

                <div className="mt-3 text-right">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-900">
                    Score: {answers[criterion.id] || 0} pts
                  </span>
                </div>

                {idx < criteria.length - 1 && (
                  <div className="mt-6 border-b border-gray-100" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="text-sm text-gray-600">Assessment Summary</div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Total Points:</span>
                <span className="font-semibold text-gray-900">
                  {rawContentScore} pts
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default AssessmentScoringTable;

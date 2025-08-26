import { FiX } from "react-icons/fi";
import Card from "../UI/Card";
import { assessmentCriteria } from "../../lib/assessment-criteria";

const DetailedReportModal = ({ open, onClose, video }) => {
  if (!open || !video) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm"
          onClick={onClose}
        />
        <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900">
              {video.name} - Detailed Report
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              <FiX size={20} />
            </button>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Video Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subject:</span>
                    <span className="font-medium">
                      {video.userSelections?.subject || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Grade:</span>
                    <span className="font-medium">
                      {video.userSelections?.grade || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Language:</span>
                    <span className="font-medium">
                      {video.userSelections?.language || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technology:</span>
                    <span className="font-medium">
                      {video.userSelections?.technology || "-"}
                    </span>
                  </div>
                  <div className="md:col-span-2 flex justify-between">
                    <span className="text-gray-600">Infrastructure:</span>
                    <span className="font-medium">
                      {video.userSelections?.infrastructure || "-"}
                    </span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-gray-900">
                    Score Breakdown
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      {video.score || 0}
                    </div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                </div>

                <div className="space-y-3">
                  {assessmentCriteria.map((criteria) => {
                    const score =
                      video.assessmentData?.content?.answers?.[criteria.id] ||
                      0;

                    return (
                      <div
                        key={criteria.id}
                        className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1 pr-4">
                          <div className="font-medium text-gray-900 text-sm">
                            {criteria.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1">
                            {criteria.desc}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-semibold text-gray-900">
                            {score} pts
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedReportModal;

import Modal from "../UI/Modal";
import Card from "../UI/Card";
import { assessmentCriteria } from "../../lib/assessment-criteria";

const DetailModal = ({ open, onClose, currentVideo, currentVideoIndex }) => {
  if (!currentVideo) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Detailed Analysis — ${
        currentVideo.name || `Video ${currentVideoIndex + 1}`
      }`}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <strong>Subject:</strong>{" "}
              {currentVideo.userSelections.subject || "-"}
            </div>
            <div>
              <strong>Grade:</strong> {currentVideo.userSelections.grade || "-"}
            </div>
            <div>
              <strong>Language:</strong>{" "}
              {currentVideo.userSelections.language || "-"}
            </div>
            <div>
              <strong>Technology:</strong>{" "}
              {currentVideo.userSelections.technology || "-"}
            </div>
            <div className="md:col-span-2">
              <strong>Infrastructure:</strong>{" "}
              {currentVideo.userSelections.infrastructure || "-"}
            </div>
          </div>
        </Card>

        <Card padding="p-0">
          <div className="space-y-2 max-h-[60vh] overflow-y-auto">
            {assessmentCriteria.map((c) => {
              const score =
                currentVideo.assessmentData.content.answers?.[c.id] || 0;
              return (
                <div
                  key={c.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="pr-3 mb-1 sm:mb-0">
                    <div className="font-medium text-sm sm:text-base">
                      {c.title}
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      {c.desc}
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="font-semibold text-sm sm:text-base">
                      {score} pts
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </Modal>
  );
};

export default DetailModal;

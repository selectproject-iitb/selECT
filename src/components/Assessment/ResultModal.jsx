import {
  FiFileText,
  FiMessageSquare,
  FiTrendingUp,
  FiCheckCircle,
} from "react-icons/fi";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

const ResultModal = ({
  open,
  onClose,
  currentVideo,
  currentVideoIndex,
  videos,
  onShowDetails,
  onShowFeedback,
  onNext,
  onGoToResults,
}) => {
  if (!currentVideo) return null;

  const remainingVideos = videos.length - currentVideoIndex - 1;
  const hasMoreVideos = currentVideoIndex < videos.length - 1;
  const isLastVideo = currentVideoIndex === videos.length - 1;

  return (
    <Modal open={open} onClose={onClose} title="" maxWidth="max-w-lg">
      <div className="text-center space-y-6">
        <div className="relative">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            {isLastVideo ? (
              <FiCheckCircle className="text-3xl text-white" />
            ) : (
              <FiTrendingUp className="text-3xl text-white" />
            )}
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="bg-white border-2 border-primary rounded-full px-3 py-1">
              <span className="text-sm font-semibold text-primary">
                {isLastVideo ? "Assessment Complete" : "Video Evaluated"}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {currentVideo.name || `Video ${currentVideoIndex + 1}`}
          </h3>
          <p className="text-gray-600 text-sm">
            {isLastVideo
              ? "All videos have been successfully evaluated"
              : "Content evaluation completed successfully"}
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-6 text-white">
          <div className="text-4xl font-bold mb-1">{currentVideo.score}</div>
          <div className="text-primary-100 text-sm">Score Points</div>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={onShowDetails}
              className="w-full bg-white border-gray-200 hover:bg-gray-50"
            >
              <FiFileText className="mr-2" size={16} />
              <span className="text-sm">Details</span>
            </Button>

            <Button
              variant="outline"
              onClick={onShowFeedback}
              className="w-full bg-white border-gray-200 hover:bg-gray-50"
            >
              <FiMessageSquare className="mr-2" size={16} />
              <span className="text-sm">Feedback</span>
            </Button>
          </div>

          <div className="pt-2">
            {hasMoreVideos ? (
              <Button
                onClick={onNext}
                className="w-full bg-primary hover:bg-accent text-white"
              >
                Continue Assessment ({remainingVideos} remaining)
              </Button>
            ) : (
              <Button
                onClick={onGoToResults}
                className="w-full bg-primary hover:bg-accent text-white"
              >
                View All Results
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ResultModal;

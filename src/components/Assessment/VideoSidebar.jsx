import Card from "../UI/Card";
import Badge from "../UI/Badge";

const VideoSidebar = ({
  videos,
  currentVideoIndex,
  onVideoSelect,
  globalContextCompleted,
  mainStep,
}) => {
  return (
    <Card className="lg:sticky lg:top-24 lg:self-start" padding="p-0">
      <div className="p-6 border-b border-gray-100">
        <h2 className="font-semibold text-gray-900 mb-1">
          Evaluation Progress
        </h2>
        <p className="text-sm text-gray-600">
          {mainStep === 3
            ? `Video ${currentVideoIndex + 1} of ${videos.length}`
            : "Setup in progress"}
        </p>
      </div>
      <div className="divide-y divide-gray-100">
        {mainStep === 3 &&
          videos.map((video, index) => (
            <button
              key={video.id}
              onClick={() => onVideoSelect(index)}
              className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                index === currentVideoIndex
                  ? "bg-gray-50 border-r-2 border-gray-900"
                  : ""
              }`}
              disabled={!globalContextCompleted}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 truncate">
                    {video.name || `Video ${index + 1}`}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge
                      variant={
                        video.completedSteps.assessment ? "success" : "default"
                      }
                      size="sm"
                    >
                      Score {video.completedSteps.assessment ? "✓" : "○"}
                    </Badge>
                  </div>
                </div>
                {index === currentVideoIndex && (
                  <div className="w-2 h-2 bg-gray-900 rounded-full ml-2" />
                )}
              </div>
            </button>
          ))}
        {mainStep !== 3 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            Video list will appear after configuration.
          </div>
        )}
      </div>
    </Card>
  );
};

export default VideoSidebar;

import { FiEye } from "react-icons/fi";
import Card from "../UI/Card";
import Button from "../UI/Button";

const VideoResultCard = ({ video, status, onViewReport }) => {
  return (
    <Card
      className={`${status.bg} ring-1 ${status.ring} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
              {video.name}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                {video.userSelections.subject}
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-accent rounded-full mr-2"></span>
                Grade {video.userSelections.grade}
              </div>
            </div>
          </div>
          <div className={`text-right ${status.color}`}>
            <div className="text-2xl font-bold">{video.score}</div>
            <div className="text-xs uppercase tracking-wide">points</div>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200"
          onClick={() => onViewReport(video)}
        >
          <FiEye className="mr-2" size={16} />
          View Report
        </Button>
      </div>
    </Card>
  );
};

export default VideoResultCard;

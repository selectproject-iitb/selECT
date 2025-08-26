import { GiTrophyCup } from "react-icons/gi";

const TopPerformerCard = ({ video, completed }) => {
  if (!video) return null;

  return (
    <div className="mb-12 overflow-hidden bg-gradient-to-r from-primary to-accent text-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-white/20 rounded-full mr-4 backdrop-blur-sm">
            <GiTrophyCup className="text-3xl text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-1">
              {completed.length > 1 ? "Top Performer" : "Your Assessment"}
            </h2>
            <p className="text-white/80">
              {completed.length > 1
                ? "Highest scoring video"
                : "Video assessment complete"}
            </p>
          </div>
        </div>

        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4 text-white">
            {video.name}
          </h3>
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-2xl px-8 py-4 border border-white/30">
            <span className="text-5xl font-bold mr-3 text-white">
              {video.score}
            </span>
            <div className="text-left">
              <div className="text-sm text-white/90">Points</div>
              <div className="text-xs text-white/70">Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopPerformerCard;

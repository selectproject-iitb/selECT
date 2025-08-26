import { useEffect } from "react";
import { FiArrowRight, FiVideo, FiPlus, FiMinus, FiTag } from "react-icons/fi";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";

const mockToast = {
  error: (message) => alert(message),
};

const OverviewConfigureVideosSection = ({ onNext = () => {} }) => {
  const navigate = useNavigate();
  const { state, setNumVideos, setVideoName, setCurrentVideoIndex } = useApp();
  const { numVideosToEvaluate, videos } = state;

  const currentNames = videos.map((v) => v.name);

  useEffect(() => {
    if (numVideosToEvaluate < 3) {
      setNumVideos(3);
    }
  }, [numVideosToEvaluate, setNumVideos]);

  const handleCountChange = (newCount) => {
    const validCount = Math.max(3, Math.min(10, newCount));
    setNumVideos(validCount);
  };

  const handleNameChange = (index, name) => {
    setVideoName(index, name);
  };

  const handleStart = () => {
    if (numVideosToEvaluate < 3) {
      mockToast.error("Please enter at least 3 videos for comparison");
      return;
    }
    videos.forEach((_, i) => {
      if (!currentNames[i] || currentNames[i].trim() === "") {
        setVideoName(i, `Video ${i + 1}`);
      }
    });

    setCurrentVideoIndex(0);
    onNext();
    navigate("/assess");
  };

  return (
    <Card className="p-6 sm:p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">
          Configure Videos for Evaluation
        </h3>
        <p className="text-gray-600">
          Set up your video collection for criteria-based assessment
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Number of Videos
            </label>

            <div className="flex items-center gap-3 mb-4">
              <button
                onClick={() => handleCountChange(numVideosToEvaluate - 1)}
                disabled={numVideosToEvaluate <= 3}
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:bg-gray-50"
              >
                <FiMinus className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex-1 relative">
                <input
                  type="number"
                  min={3}
                  max={10}
                  value={numVideosToEvaluate}
                  onChange={(e) =>
                    handleCountChange(
                      Number.parseInt(e.target.value || "3", 10)
                    )
                  }
                  className="w-full p-3 text-center text-lg font-semibold border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <button
                onClick={() => handleCountChange(numVideosToEvaluate + 1)}
                disabled={numVideosToEvaluate >= 10}
                className="w-10 h-10 rounded-full border-2 border-gray-200 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:bg-gray-50"
              >
                <FiPlus className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Choose between 3-10 videos for comparison
            </p>
          </div>

          <div className="p-4 rounded-xl border border-blue-100">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <FiTag className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Naming Your Videos
                </h4>
                <p className="text-sm text-blue-700">
                  You can assign a name to each video to help you identify them
                  during the evaluation process. If left blank, default names
                  like "Video 1", "Video 2" will be used automatically.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-900">
              Video Names
            </label>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              Optional
            </span>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto">
            {videos.map((video, i) => (
              <div
                key={video.id}
                className="group flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:bg-gray-50/50 transition-all duration-200"
              >
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold shadow-sm">
                  {i + 1}
                </div>

                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition-colors duration-200">
                  <FiVideo className="w-4 h-4 text-gray-600" />
                </div>

                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm"
                    placeholder={`Enter name for video ${i + 1}`}
                    value={video.name}
                    onChange={(e) => handleNameChange(i, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          {numVideosToEvaluate > 6 && (
            <p className="text-xs text-gray-500 mt-3 text-center">
              Scroll to see all video inputs
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
        <Button
          onClick={handleStart}
          className="shadow-sm hover:shadow-md transform hover:scale-105 transition-all duration-200"
        >
          Start Evaluation
          <FiArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </Card>
  );
};

export default OverviewConfigureVideosSection;

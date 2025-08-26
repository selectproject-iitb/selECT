import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useRealTimeTracking } from "../hooks/useRealTimeTracking";
import ResultsHeader from "../components/Result/ResultsHeader";
import TopPerformerCard from "../components/Result/TopPerformerCard";
import VideoResultCard from "../components/Result/VideoResultCard";
import EmptyResults from "../components/Result/EmptyResults";
import ResultsActions from "../components/Result/ResultsActions";
import DetailedReportModal from "../components/Result/DetailedReportModal";

const Results = () => {
  const { state, reset, updateOverall } = useApp();
  const navigate = useNavigate();
  const { videos } = state;
  const [reportVideo, setReportVideo] = useState(null);
  const { trackRestart, trackExport } = useRealTimeTracking();

  const completed = useMemo(() => videos.filter((v) => v.score > 0), [videos]);

  const highestScorerVideo = useMemo(() => {
    if (completed.length === 0) return null;
    return completed.reduce((prev, current) =>
      prev.score > current.score ? prev : current
    );
  }, [completed]);

  const highestScore = highestScorerVideo ? highestScorerVideo.score : 0;

  const getScoreStatus = (score, highestScore) => {
    if (highestScore === 0)
      return {
        color: "text-gray-600",
        bg: "bg-gray-50",
        ring: "ring-gray-200",
      };
    if (score === highestScore)
      return {
        color: "text-emerald-700",
        bg: "bg-emerald-50",
        ring: "ring-emerald-200",
      };
    if (score >= highestScore * 0.7)
      return {
        color: "text-amber-700",
        bg: "bg-amber-50",
        ring: "ring-amber-200",
      };
    return {
      color: "text-red-600",
      bg: "bg-red-50",
      ring: "ring-red-200",
    };
  };

  const exportJson = async () => {
    const payload = {
      generatedAt: new Date().toISOString(),
      videos: completed.map((v) => ({
        name: v.name || `Video ${videos.indexOf(v) + 1}`,
        userSelections: v.userSelections,
        score: v.score,
        assessmentData: v.assessmentData,
      })),
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `select-results-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
    URL.revokeObjectURL(url);

    // Track the export action
    try {
      await trackExport("results");
    } catch (error) {
      console.error("Failed to track export:", error);
    }
  };

  const handleStartOver = async () => {
    try {
      await trackRestart();
    } catch (error) {
      console.error("Failed to track restart:", error);
    }
    reset();
    navigate("/");
  };

  React.useEffect(() => {
    updateOverall();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <ResultsHeader />

        {completed.length > 0 ? (
          <>
            <TopPerformerCard
              video={highestScorerVideo}
              completed={completed}
            />

            {completed.length > 1 && (
              <>
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 text-center mb-2">
                    All Results
                  </h2>
                  <p className="text-gray-600 text-center">
                    Compare performance across all evaluated videos
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {completed.map((video) => {
                    const status = getScoreStatus(video.score, highestScore);
                    return (
                      <VideoResultCard
                        key={video.id}
                        video={video}
                        status={status}
                        onViewReport={setReportVideo}
                      />
                    );
                  })}
                </div>
              </>
            )}
          </>
        ) : (
          <EmptyResults />
        )}

        <ResultsActions onExport={exportJson} onStartOver={handleStartOver} />

        <DetailedReportModal
          open={!!reportVideo}
          onClose={() => setReportVideo(null)}
          video={reportVideo}
        />
      </div>
    </div>
  );
};

export default Results;

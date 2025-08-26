import { useMemo, useState, useEffect } from "react";
import Button from "../components/UI/Button";
import Stepper from "../components/UI/Stepper";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AssessmentContextSteps from "../components/Assessment/ContextSteps";
import AssessmentScoringTable from "../components/Assessment/ScoringTable";
import OverviewConfigureVideosSection from "../components/Overview/ConfigureVideosSection";
import VideoSidebar from "../components/Assessment/VideoSidebar";
import AssessmentHeader from "../components/Assessment/AssessmentHeader";
import ResultModal from "../components/Assessment/ResultModal";
import DetailModal from "../components/Assessment/DetailModal";
import FeedbackModal from "../components/Assessment/FeedbackModal";
import { assessmentCriteria } from "../lib/assessment-criteria";
import { useApp } from "../context/AppContext";
import { useRealTimeTracking } from "../hooks/useRealTimeTracking";
import apiService from "../services/apiService";

const Assessment = () => {
  const navigate = useNavigate();
  const {
    state,
    markGlobalContextComplete,
    setContentData,
    updateVideoScores,
    setCurrentVideoIndex,
    updateOverall,
  } = useApp();

  const { isConnected } = useRealTimeTracking();
  const [evaluationSessionId, setEvaluationSessionId] = useState(null);

  const {
    videos,
    currentVideoIndex,
    globalContextCompleted,
    globalContextSelections,
  } = state;
  const currentVideo = videos[currentVideoIndex];

  const [mainStep, setMainStep] = useState(() => {
    if (!globalContextCompleted) return 1;
    if (
      videos.length === 0 ||
      videos.every((v) => v.name === `Video ${videos.indexOf(v) + 1}`)
    )
      return 2;
    return 3;
  });

  const [subStep, setSubStep] = useState(1);
  const [answers, setAnswers] = useState(
    currentVideo?.assessmentData.content.answers || {}
  );
  const [resultOpen, setResultOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  useEffect(() => {
    const initializeEvaluationSession = async () => {
      if (!evaluationSessionId && (globalContextCompleted || mainStep > 1)) {
        try {
          const response = await apiService.startEvaluation();
          setEvaluationSessionId(response.sessionId);
          console.log("Started evaluation session:", response.sessionId);
        } catch (error) {
          console.error("Failed to start evaluation session:", error);
        }
      }
    };

    initializeEvaluationSession();
  }, [globalContextCompleted, mainStep, evaluationSessionId]);

  useEffect(() => {
    const updateEvaluationStep = async () => {
      if (!evaluationSessionId) return;

      const stepNumber = mainStep;
      let stepName = "Context Selection";

      if (mainStep === 2) {
        stepName = "Configure Videos";
      } else if (mainStep === 3) {
        stepName = `Scoring Video ${currentVideoIndex + 1}`;
      }

      try {
        await apiService.updateEvaluationStep(
          evaluationSessionId,
          stepNumber,
          stepName
        );
        console.log("Updated evaluation step:", stepNumber, stepName);
      } catch (error) {
        console.error("Failed to update evaluation step:", error);
      }
    };

    if (evaluationSessionId) {
      updateEvaluationStep();
    }
  }, [mainStep, currentVideoIndex, evaluationSessionId]);

  const mainSteps = [
    { label: "Global Context", completed: globalContextCompleted },
    {
      label: "Configure Videos",
      completed:
        videos.length > 0 &&
        videos.every(
          (v) => v.name !== `Video ${videos.indexOf(v) + 1}` || v.score > 0
        ),
    },
    {
      label: "Score Videos",
      completed: currentVideo?.completedSteps.assessment,
    },
  ];

  const selectionOptions = {
    subject: [
      { value: "Science", label: "Science" },
      { value: "Math", label: "Math (Coming Soon)", disabled: true },
      { value: "English", label: "English (Coming Soon)", disabled: true },
    ],
    grade: [
      { value: "6-8", label: "6 - 8" },
      { value: "9-10", label: "9 - 10" },
      { value: "11-12", label: "11 - 12 (Coming Soon)", disabled: true },
    ],
    language: [
      { value: "English", label: "English" },
      { value: "Bilingual", label: "Bilingual (Coming Soon)", disabled: true },
    ],
    technology: [
      {
        value: "projector-ifp-internet",
        image: "/assets/Projector.png",
        label: "Projector / IFP with Internet",
        description:
          "My classroom has a computer and projector or interactive flat panel with internet connection.",
      },
      {
        value: "computer-lab-access",
        image: "/assets/computer-lab.jpg",
        label: "Computer Lab Access",
        description:
          "My school has a computer lab where a group of students can use one computer.",
      },
      {
        value: "personal-student-devices",
        image: "/assets/tablet.jpg",
        label: "Personal Student Devices",
        description:
          "Each student has a device such as a phone or tablet (in classroom or at home).",
      },
    ],
  };

  const infraOptions = useMemo(() => {
    return [
      {
        value: "educational-videos-classroom",
        image: "/assets/projector2.jpg",
        description:
          "I want to select educational videos for showing in my classroom that explain specific topics or concepts present in the syllabus.",
      },
      {
        value: "interactive-content-assessment",
        image: "/assets/interact.png",
        description:
          "Students can understand topics or concept using interactive content followed by assessment.",
      },
      {
        value: "personalized-adaptive-content",
        image: "/assets/game.png",
        description:
          "The educational content is personalized and adapts to the learning level of the student.",
      },
      {
        value: "Demo",
        label: "Demo",
        description: "Demo D",
      },
    ];
  }, []);

  const criteria = assessmentCriteria;

  const onScore = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  const rawContentScore = useMemo(() => {
    return Object.values(answers).reduce((s, v) => s + (Number(v) || 0), 0);
  }, [answers]);

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
    setAnswers(videos[index].assessmentData.content.answers || {});
  };

  const submitScores = async () => {
    const missing = criteria.filter((c) => !answers[c.id]);
    if (missing.length > 0) {
      toast.error(`Please score all criteria (${missing.length} pending).`);
      return;
    }

    setContentData({ answers, score: rawContentScore });
    updateVideoScores(rawContentScore);

    if (evaluationSessionId) {
      try {
        const isLastVideo = currentVideoIndex === videos.length - 1;
        if (isLastVideo) {
          await apiService.completeEvaluation(evaluationSessionId, {
            videos: videos.map((v, i) => ({
              name: v.name,
              score: i === currentVideoIndex ? rawContentScore : v.score,
            })),
            totalScore: rawContentScore,
          });
          console.log("Completed evaluation session");
        }
      } catch (error) {
        console.error("Failed to update evaluation completion:", error);
      }
    }

    setResultOpen(true);
  };

  const nextFromResult = () => {
    const nextIdx = currentVideoIndex + 1;
    if (nextIdx < videos.length) {
      setCurrentVideoIndex(nextIdx);
      setMainStep(3);
      setSubStep(1);
      setResultOpen(false);
      setDetailsOpen(false);
      setFeedbackOpen(false);
      setAnswers(videos[nextIdx].assessmentData.content.answers || {});
      toast.success(
        `Now evaluating ${videos[nextIdx].name || `Video ${nextIdx + 1}`}`
      );
    } else {
      updateOverall();
      setResultOpen(false);
      navigate("/results");
    }
  };

  const gotoResults = () => {
    updateOverall();
    setResultOpen(false);
    navigate("/results");
  };

  const validateContextSubStep = () => {
    const sel = globalContextSelections;
    if (subStep === 1) {
      if (!sel.subject || !sel.grade || !sel.language) {
        toast.error("Please select subject, grade and language.");
        return false;
      }
    }
    if (subStep === 2) {
      if (!sel.technology) {
        toast.error("Please choose one technology option.");
        return false;
      }
    }
    if (subStep === 3) {
      if (!sel.infrastructure) {
        toast.error("Please choose one infrastructure option.");
        return false;
      }
    }
    return true;
  };

  const next = () => {
    if (mainStep === 1) {
      if (!validateContextSubStep()) return;
      if (subStep < 3) {
        setSubStep((s) => s + 1);
        return;
      }
      markGlobalContextComplete();
      setMainStep(2);
      toast.success("Global context saved!");
    } else if (mainStep === 2) {
      toast.error(
        "Please use the 'Start Assessment' button in the Configure Videos section."
      );
    } else if (mainStep === 3) {
      submitScores();
    }
  };

  const prev = () => {
    if (mainStep === 1) {
      if (subStep > 1) setSubStep((s) => s - 1);
      else navigate("/overview");
    } else if (mainStep === 2) {
      setMainStep(1);
      setSubStep(3);
    } else if (mainStep === 3) {
      if (currentVideoIndex === 0) {
        setMainStep(2);
      } else {
        setCurrentVideoIndex(currentVideoIndex - 1);
        setAnswers(
          videos[currentVideoIndex - 1].assessmentData.content.answers || {}
        );
      }
    }
  };

  const handleStepClick = (n) => {
    if (n === 1) {
      setMainStep(1);
      setSubStep(1);
    } else if (n === 2 && globalContextCompleted) {
      setMainStep(2);
    } else if (n === 3 && globalContextCompleted && videos.length > 0) {
      setMainStep(3);
      setCurrentVideoIndex(0);
      setAnswers(videos[0]?.assessmentData.content.answers || {});
    } else {
      toast.error("Please complete the previous steps first.");
    }
  };

  if (!globalContextCompleted && mainStep !== 1) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl text-gray-400">⚙️</span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Setup Required
          </h3>
          <p className="text-gray-600 mb-6">
            Please complete the global context settings first.
          </p>
          <Button onClick={() => setMainStep(1)}>Go to Global Context</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {!isConnected && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm text-yellow-800">
                Real-time tracking temporarily unavailable. Your progress is
                still being saved.
              </span>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-[320px_1fr] gap-8">
          <VideoSidebar
            videos={videos}
            currentVideoIndex={currentVideoIndex}
            onVideoSelect={handleVideoSelect}
            globalContextCompleted={globalContextCompleted}
            mainStep={mainStep}
          />

          <div className="space-y-6">
            <AssessmentHeader
              mainStep={mainStep}
              currentVideo={currentVideo}
              currentVideoIndex={currentVideoIndex}
              subStep={subStep}
            />

            <Stepper
              steps={mainSteps}
              current={mainStep}
              onStepClick={handleStepClick}
            />

            {mainStep === 1 && (
              <AssessmentContextSteps
                subStep={subStep}
                setSubStep={setSubStep}
                selectionOptions={selectionOptions}
                infraOptions={infraOptions}
              />
            )}

            {mainStep === 2 && (
              <OverviewConfigureVideosSection
                onNext={() => {
                  setMainStep(3);
                  setCurrentVideoIndex(0);
                  setAnswers(videos[0]?.assessmentData.content.answers || {});
                }}
              />
            )}

            {mainStep === 3 && currentVideo && (
              <AssessmentScoringTable
                criteria={criteria}
                answers={answers}
                onScore={onScore}
                rawContentScore={rawContentScore}
                currentVideoTotalScore={rawContentScore}
              />
            )}

            {mainStep !== 2 && (
              <div className="flex items-center justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={prev}
                  disabled={
                    mainStep === 1 && subStep === 1 && currentVideoIndex === 0
                  }
                >
                  <FiArrowLeft className="mr-2" size={16} />
                  Previous
                </Button>

                <Button onClick={next}>
                  {mainStep === 1
                    ? subStep === 3
                      ? "Complete Context"
                      : "Next"
                    : "Submit Assessment"}
                  <FiArrowRight className="ml-2" size={16} />
                </Button>
              </div>
            )}
          </div>
        </div>

        <ResultModal
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          currentVideo={currentVideo}
          currentVideoIndex={currentVideoIndex}
          videos={videos}
          onShowDetails={() => setDetailsOpen(true)}
          onShowFeedback={() => setFeedbackOpen(true)}
          onNext={nextFromResult}
          onGoToResults={gotoResults}
        />

        <DetailModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          currentVideo={currentVideo}
          currentVideoIndex={currentVideoIndex}
        />

        <FeedbackModal
          open={feedbackOpen}
          onClose={() => setFeedbackOpen(false)}
        />
      </div>
    </div>
  );
};

export default Assessment;

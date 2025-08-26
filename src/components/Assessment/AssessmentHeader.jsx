import Card from "../UI/Card";

const AssessmentHeader = ({
  mainStep,
  currentVideo,
  currentVideoIndex,
  subStep,
}) => {
  const getStepDescription = () => {
    if (mainStep === 1) {
      if (subStep === 1)
        return "Step 1a: Choose Grade, Subject, Medium of Instruction";
      if (subStep === 2)
        return "Step 1b: Technology availability; select any one";
      if (subStep === 3)
        return "Step 1c: School infrastructure; select any one";
    }
    if (mainStep === 2) return "Step 2: Configure Videos";
    if (mainStep === 3) return "Step 3: Scoring";
    return "";
  };

  const getTitle = () => {
    if (mainStep === 3) {
      return currentVideo?.name || `Video ${currentVideoIndex + 1}`;
    }
    return "Select your Context";
  };

  const getSubtitle = () => {
    if (mainStep === 1) return "Set a context for all videos";
    if (mainStep === 2) return "Configure videos for evaluation";
    if (mainStep === 3) return "Assessment in progress";
    return "";
  };

  return (
    <Card>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-600 mt-1">{getSubtitle()}</p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600">{getStepDescription()}</div>
        </div>
      </div>
    </Card>
  );
};

export default AssessmentHeader;

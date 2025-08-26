import { GiTrophyCup } from "react-icons/gi";
import Card from "../UI/Card";
import Button from "../UI/Button";
import { useNavigate } from "react-router-dom";

const EmptyResults = () => {
  const navigate = useNavigate();

  const handleStartAssessment = () => {
    navigate("/assess");
  };

  return (
    <Card className="text-center py-16 bg-light-bg border border-primary/20">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <GiTrophyCup className="text-2xl text-primary" />
        </div>
        <h3 className="text-xl font-semibold text-secondary mb-2">
          No Results Yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start assessing videos to see comprehensive results and comparisons.
        </p>
        <Button
          onClick={handleStartAssessment}
          className="bg-primary hover:bg-accent text-white"
        >
          Start Assessment
        </Button>
      </div>
    </Card>
  );
};

export default EmptyResults;

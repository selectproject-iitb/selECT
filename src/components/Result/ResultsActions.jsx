import { FiDownload, FiRefreshCw, FiPlus } from "react-icons/fi";
import Button from "../UI/Button";

const ResultsActions = ({ onExport, onStartOver }) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Button
        variant="outline"
        onClick={onExport}
        className="bg-white border-primary text-primary hover:bg-primary hover:text-white"
      >
        <FiDownload className="mr-2" size={18} />
        Export Results
      </Button>
      <Button
        variant="outline"
        onClick={onStartOver}
        className="bg-white border-gray-300 text-gray-700 hover:bg-gray-100"
      >
        <FiRefreshCw className="mr-2" size={18} />
        Start Over
      </Button>
    </div>
  );
};

export default ResultsActions;

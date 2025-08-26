import SelectionGrid from "../UI/SelectionGrid";
import Card from "../UI/Card";
import { useApp } from "../../context/AppContext";

const AssessmentContextSteps = ({
  subStep,
  setSubStep,
  selectionOptions,
  infraOptions,
}) => {
  const { state, setGlobalSelection } = useApp();
  const { globalContextSelections } = state;

  const currentTechnology = globalContextSelections.technology;
  const filteredInfraOptions = infraOptions.filter((option) => {
    if (currentTechnology === "projector-ifp-internet") {
      return option.value === "educational-videos-classroom";
    }
    if (currentTechnology === "computer-lab-access") {
      return [
        "interactive-content-assessment",
        "personalized-adaptive-content",
      ].includes(option.value);
    }
    if (currentTechnology === "personal-student-devices") {
      return option.value === "Demo";
    }
    return false;
  });

  return (
    <div className="space-y-6">
      {subStep === 1 && (
        <div className="space-y-6">
          <SelectionGrid
            title="Choose a Subject"
            options={selectionOptions.subject}
            selectedValue={globalContextSelections.subject}
            onSelect={(val) => setGlobalSelection("subject", val)}
            columns={3}
          />
          <SelectionGrid
            title="Choose Grade Range"
            options={selectionOptions.grade}
            selectedValue={globalContextSelections.grade}
            onSelect={(val) => setGlobalSelection("grade", val)}
            columns={3}
          />
          <SelectionGrid
            title="Language of Instruction"
            options={selectionOptions.language}
            selectedValue={globalContextSelections.language}
            onSelect={(val) => setGlobalSelection("language", val)}
            columns={2}
          />
        </div>
      )}
      {subStep === 2 && (
        <SelectionGrid
          title="Technology availability — select any one"
          options={selectionOptions.technology}
          selectedValue={globalContextSelections.technology}
          onSelect={(val) => setGlobalSelection("technology", val)}
          columns={1}
        />
      )}
      {subStep === 3 && (
        <div className="space-y-4">
          {currentTechnology ? (
            <SelectionGrid
              title="School infrastructure — select any one"
              options={filteredInfraOptions}
              selectedValue={globalContextSelections.infrastructure}
              onSelect={(val) => setGlobalSelection("infrastructure", val)}
              columns={1}
            />
          ) : (
            <Card className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 text-sm">
              Please select a technology option first in Step 1b.
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AssessmentContextSteps;

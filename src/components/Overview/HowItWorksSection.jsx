import Card from "../UI/Card";
// import { FiSearch, FiTarget } from "react-icons/fi";
// import { IoBulbOutline } from "react-icons/io5";
import { FcSearch } from "react-icons/fc";
import { FcIdea } from "react-icons/fc";
import { TbTargetArrow } from "react-icons/tb";

const OverviewHowItWorksSection = () => {
  const howItWorksSteps = [
    {
      step: "01",
      title: "Set Your Context",
      description:
        "Choose your unique needs like grade, subject, language and tech availability",
      icon: FcSearch,
    },
    {
      step: "02",
      title: "Evaluate the Content",
      description: "Assess shortlisted resources using guided criteria",
      icon: FcIdea,
    },
    {
      step: "03",
      title: "Compare & Choose",
      description:
        "Achieve evidence based decision-making using score-based comparisons",
      icon: TbTargetArrow,
    },
  ];

  return (
    <section className="py-20 bg-light-bg rounded-xl shadow-lg px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            How SelECT Works?
          </h2>
          <p className="text-xl text-gray-600">
            A simple 3-step process to evaluate educational technology solutions
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {howItWorksSteps.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Card
                key={index}
                className="text-center hover:-translate-y-1 transition-transform duration-200 ease-in-out shadow-lg hover:shadow-xl"
              >
                <div className="mb-6">
                  <div className="flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="text-6xl drop-shadow-sm" />
                  </div>
                  <h3 className="text-xl font-semibold text-secondary mb-3">
                    Step {item.step}: {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OverviewHowItWorksSection;

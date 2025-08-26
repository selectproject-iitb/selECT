import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import { FiPlay, FiSearch, FiTarget } from "react-icons/fi";
import { IoBulbOutline } from "react-icons/io5";
import { useApp } from "../context/AppContext";

const Home = () => {
  const navigate = useNavigate();
  const { state } = useApp();

  const handleStartAssessment = () => {
    navigate("/overview");
  };

  const howItWorksSteps = [
    {
      step: "01",
      title: "Set Your Context",
      description:
        "Choose your unique needs like grade, subject, language and tech availability",
      icon: FiSearch,
    },
    {
      step: "02",
      title: "Evaluate the Content",
      description: "Assess shortlisted resources using guided criteria",
      icon: IoBulbOutline,
    },
    {
      step: "03",
      title: "Compare & Choose",
      description:
        "Achieve evidence based decision-making using score-based comparisons",
      icon: FiTarget,
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="min-h-[calc(100vh-64px)] flex items-center bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="lg:pr-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 drop-shadow-sm">
                SelECT
              </h1>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 text-white">
                Your solution to quality EdTech content
              </h2>
              <p className="text-lg md:text-xl text-blue-100 mb-8 leading-relaxed">
                Empowering educators with the tools and knowledge to make
                informed decisions about educational technology, ensuring the
                best learning outcomes for students.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/overview")}
                className="bg-secondary text-primary hover:bg-gray-500 shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                {/* <FiPlay /> */}
                Learn More
              </Button>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-2xl">
                <img
                  src="/assets/landing-image.gif"
                  alt="SelECT Platform Demo"
                  className="w-full h-auto"
                  style={{
                    minHeight: "400px",
                    objectFit: "cover",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

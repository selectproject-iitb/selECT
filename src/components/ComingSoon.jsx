import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const ComingSoon = () => {
  return (
    <div className="bg-gradient-to-br flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full text-center">
        <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            🚧 Coming Soon 🚧
          </h1>
          <p className="text-gray-600 text-lg">
            We’re working hard to bring you this. Stay tuned!
          </p>

          <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/"
              className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg "
            >
              <FiArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;

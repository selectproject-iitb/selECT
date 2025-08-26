import Card from "../UI/Card";
import { FiPlay } from "react-icons/fi";

const OverviewVideosSection = () => {
  return (
    <section className="py-10 bg-white rounded-xl shadow-lg px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-secondary mb-3 sm:mb-4">
            Have you faced any of these situations?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="text-center p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Video 1
            </h3>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3 sm:mb-4">
              <video
                className="w-full h-full"
                controls
                src="/assets/videos/Video1.mp4"
              />
            </div>
          </div>
          <div className="text-center p-5 sm:p-6">
            <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">
              Video 2
            </h3>
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden mb-3 sm:mb-4">
              <video
                className="w-full h-full"
                controls
                src="/assets/videos/Video2.mp4"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverviewVideosSection;

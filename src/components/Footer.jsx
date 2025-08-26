import { FiMail } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:py-6 flex flex-col sm:flex-row items-center justify-between text-xs sm:text-sm text-gray-600">
        <p className="mb-2 sm:mb-0">© 2024 EdTech. All rights reserved.</p>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <a href="#" className="hover:text-gray-800 flex items-center">
            <FiMail className="mr-1 text-base sm:text-sm" /> Contact
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

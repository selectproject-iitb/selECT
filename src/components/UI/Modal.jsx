import { FiX } from "react-icons/fi";

const Modal = ({ open, onClose, title, children, maxWidth = "max-w-2xl" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 animate-fade-in">
      <div
        className={`bg-white rounded-2xl w-full ${maxWidth} max-h-[90vh] overflow-y-auto animate-slide-up
        ${
          maxWidth === "max-w-4xl"
            ? "max-w-full sm:max-w-4xl"
            : "max-w-full sm:max-w-2xl"
        }
      `}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
          <button
            aria-label="Close"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiX size={22} />
          </button>
        </div>
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

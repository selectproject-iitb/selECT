import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import apiService from "../../services/apiService";
import Modal from "../UI/Modal";
import Button from "../UI/Button";

const FeedbackModal = ({ open, onClose }) => {
  const [feedback, setFeedback] = useState("");
  const [category, setCategory] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error("Feedback cannot be empty.");
      return;
    }

    if (!user) {
      toast.error("You must be logged in to submit feedback.");
      return;
    }

    setIsSubmitting(true);

    try {
      await apiService.submitFeedback({
        feedback: feedback.trim(),
        category,
      });

      toast.success("Thank you for your feedback! We appreciate your input.");
      setFeedback("");
      setCategory("general");
      onClose();
    } catch (error) {
      console.error("Feedback submission error:", error);
      toast.error(
        error.message || "Failed to submit feedback. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback("");
      setCategory("general");
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Share your feedback">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Feedback Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            disabled={isSubmitting}
          >
            <option value="general">General Feedback</option>
            <option value="technical">Technical Issue</option>
            <option value="ui">User Interface</option>
            <option value="content">Content Related</option>
            <option value="bug">Bug Report</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Feedback
          </label>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
            placeholder="Tell us about your experience with this assessment..."
            disabled={isSubmitting}
            maxLength={2000}
          />
          <div className="text-xs text-gray-500 mt-1">
            {feedback.length}/2000 characters
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !feedback.trim()}
          >
            {isSubmitting ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackModal;

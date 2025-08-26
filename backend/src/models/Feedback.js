const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["general", "technical", "ui", "content", "bug"],
      default: "general",
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
    // adminResponse: {
    //   type: String,
    //   trim: true,
    // },
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    // respondedAt: {
    //   type: Date,
    // },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "EvaluationSession",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
feedbackSchema.index({ userId: 1, createdAt: -1 });
feedbackSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("Feedback", feedbackSchema);

const mongoose = require("mongoose");

const evaluationStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true,
  },
  stepName: {
    type: String,
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
  },
  timeSpent: {
    type: Number,
    default: 0,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const evaluationSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    attemptNumber: {
      type: Number,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    totalDuration: {
      type: Number,
      default: 0,
    },
    currentStep: {
      type: Number,
      default: 1,
    },
    steps: [evaluationStepSchema],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    completionPercentage: {
      type: Number,
      default: 0,
    },
    results: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("EvaluationSession", evaluationSessionSchema);

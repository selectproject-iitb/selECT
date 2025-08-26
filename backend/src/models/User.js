const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    schoolName: {
      type: String,
      required: true,
    },
    schoolType: {
      type: String,
      required: true,
      enum: ["Government", "Private", "Aided"],
    },
    state: {
      type: String,
      required: true,
    },
    scienceGrades: [
      {
        type: String,
      },
    ],
    otherScienceGrade: {
      type: String,
    },
    teachingExperience: {
      type: String,
      required: true,
    },
    edtechExperience: {
      type: String,
      required: true,
    },
    otherEdtechExperience: {
      type: String,
    },
    edtechSolutions: [
      {
        type: String,
      },
    ],
    otherEdtechSolution: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    totalEvaluationAttempts: {
      type: Number,
      default: 0,
    },
    totalTimeSpent: {
      type: Number,
      default: 0,
    },
    lastLoginTime: {
      type: Date,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    currentEvaluationStep: {
      type: Number,
      default: 0,
    },
    isEvaluating: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

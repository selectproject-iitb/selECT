const express = require("express");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const User = require("../models/User");
const UserActivity = require("../models/UserActivity");
const EvaluationSession = require("../models/EvaluationSession");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const generateToken = (userId, role) => {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
};

router.post("/signup", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      contactNumber,
      schoolName,
      schoolType,
      state,
      scienceGrades,
      otherScienceGrade,
      teachingExperience,
      edtechExperience,
      otherEdtechExperience,
      edtechSolutions,
      otherEdtechSolution,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with this email" });
    }

    const user = new User({
      name,
      email,
      password,
      contactNumber,
      schoolName,
      schoolType,
      state,
      scienceGrades,
      otherScienceGrade,
      teachingExperience,
      edtechExperience,
      otherEdtechExperience,
      edtechSolutions,
      otherEdtechSolution,
    });

    await user.save();

    const token = generateToken(user._id, user.role);

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error during signup" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const sessionId = uuidv4();
    const token = generateToken(user._id, user.role);

    const userActivity = new UserActivity({
      userId: user._id,
      sessionId,
      loginTime: new Date(),
      ipAddress: req.ip,
      userAgent: req.get("User-Agent"),
    });
    await userActivity.save();

    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastLoginTime: new Date(),
    });

    res.json({
      message: "Login successful",
      token,
      sessionId,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login" });
  }
});

router.post("/logout", authenticateToken, async (req, res) => {
  try {
    const { sessionId } = req.body;
    const userId = req.user._id;

    const activity = await UserActivity.findOne({
      userId,
      sessionId,
      isActive: true,
    });

    if (activity) {
      const logoutTime = new Date();
      const totalDuration = logoutTime - activity.loginTime;

      await UserActivity.findByIdAndUpdate(activity._id, {
        logoutTime,
        totalDuration,
        isActive: false,
      });

      await User.findByIdAndUpdate(userId, {
        $inc: { totalTimeSpent: totalDuration },
        isOnline: false,
        isEvaluating: false,
        currentEvaluationStep: 0,
      });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error during logout" });
  }
});

router.post("/evaluation/start", authenticateToken, async (req, res) => {
  try {
    const userId = req.user._id;
    const sessionId = uuidv4();

    const attemptCount = await EvaluationSession.countDocuments({ userId });

    const evaluationSession = new EvaluationSession({
      userId,
      sessionId,
      attemptNumber: attemptCount + 1,
      startTime: new Date(),
      steps: [
        {
          stepNumber: 1,
          stepName: "Context Selection",
          startTime: new Date(),
        },
      ],
    });

    await evaluationSession.save();

    await User.findByIdAndUpdate(userId, {
      isEvaluating: true,
      currentEvaluationStep: 1,
      $inc: { totalEvaluationAttempts: 1 },
    });

    res.json({
      message: "Evaluation started",
      sessionId,
      attemptNumber: attemptCount + 1,
    });
  } catch (error) {
    console.error("Start evaluation error:", error);
    res.status(500).json({ message: "Error starting evaluation" });
  }
});

router.post("/evaluation/step", authenticateToken, async (req, res) => {
  try {
    const { sessionId, stepNumber, stepName } = req.body;
    const userId = req.user._id;

    const session = await EvaluationSession.findOne({
      userId,
      sessionId,
      isCompleted: false,
    });

    if (!session) {
      return res.status(404).json({ message: "Evaluation session not found" });
    }

    const currentStepIndex = session.steps.findIndex((s) => !s.completed);
    if (currentStepIndex !== -1) {
      const currentStep = session.steps[currentStepIndex];
      currentStep.endTime = new Date();
      currentStep.timeSpent = currentStep.endTime - currentStep.startTime;
      currentStep.completed = true;
    }

    if (stepNumber && stepName) {
      session.steps.push({
        stepNumber,
        stepName,
        startTime: new Date(),
      });
    }

    const completedSteps = session.steps.filter((s) => s.completed).length;
    const totalSteps = 3;
    session.completionPercentage = Math.round(
      (completedSteps / totalSteps) * 100
    );
    session.currentStep = stepNumber || session.currentStep;

    await session.save();

    await User.findByIdAndUpdate(userId, {
      currentEvaluationStep: stepNumber || session.currentStep,
    });

    res.json({
      message: "Step updated",
      completionPercentage: session.completionPercentage,
      currentStep: session.currentStep,
    });
  } catch (error) {
    console.error("Update step error:", error);
    res.status(500).json({ message: "Error updating evaluation step" });
  }
});

router.post("/evaluation/complete", authenticateToken, async (req, res) => {
  try {
    const { sessionId, results } = req.body;
    const userId = req.user._id;

    const session = await EvaluationSession.findOne({
      userId,
      sessionId,
      isCompleted: false,
    });

    if (!session) {
      return res.status(404).json({ message: "Evaluation session not found" });
    }

    const lastStepIndex = session.steps.length - 1;
    if (lastStepIndex >= 0 && !session.steps[lastStepIndex].completed) {
      const lastStep = session.steps[lastStepIndex];
      lastStep.endTime = new Date();
      lastStep.timeSpent = lastStep.endTime - lastStep.startTime;
      lastStep.completed = true;
    }

    const endTime = new Date();
    const totalDuration = endTime - session.startTime;

    session.endTime = endTime;
    session.totalDuration = totalDuration;
    session.isCompleted = true;
    session.completionPercentage = 100;
    session.results = results;

    await session.save();

    await User.findByIdAndUpdate(userId, {
      isEvaluating: false,
      currentEvaluationStep: 0,
    });

    res.json({
      message: "Evaluation completed",
      totalDuration,
      results,
    });
  } catch (error) {
    console.error("Complete evaluation error:", error);
    res.status(500).json({ message: "Error completing evaluation" });
  }
});

router.get("/me", authenticateToken, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
});

module.exports = router;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../UI/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";

const SignupForm = ({ onSwitchToLogin, isAdmin = false }) => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signupData, setSignupData] = useState(
    isAdmin
      ? {
          name: "",
          designation: "",
          email: "",
          password: "",
          confirmPassword: "",
        }
      : {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
          contactNumber: "",
          schoolName: "",
          schoolType: "",
          state: "",
          scienceGrades: [],
          otherScienceGrade: "",
          teachingExperience: "",
          edtechExperience: "",
          otherEdtechExperience: "",
          edtechSolutions: [],
          otherEdtechSolution: "",
        }
  );

  const gradeOptions = [
    { value: "6-8", label: "6-8" },
    { value: "9-10", label: "9-10" },
    { value: "11-12", label: "11-12" },
    { value: "not-teaching", label: "Not teaching science" },
    { value: "other", label: "Other" },
  ];

  const edtechSolutionOptions = [
    { value: "audio-video", label: "Audio-Video content" },
    { value: "practice-questions", label: "Practice questions/ assessments" },
    { value: "simulations", label: "Simulations / experiments" },
    { value: "additional-resources", label: "Additional resources" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isAdmin) {
      if (
        !signupData.name ||
        !signupData.designation ||
        !signupData.email ||
        !signupData.password
      ) {
        return;
      }
    } else {
      if (
        !signupData.email ||
        !signupData.password ||
        !signupData.contactNumber ||
        !signupData.schoolName ||
        !signupData.schoolType ||
        !signupData.state
      ) {
        return;
      }

      if (signupData.scienceGrades.length === 0) {
        return;
      }

      if (!signupData.teachingExperience) {
        return;
      }

      if (!signupData.edtechExperience) {
        return;
      }

      if (signupData.edtechSolutions.length === 0) {
        return;
      }
    }

    if (signupData.password !== signupData.confirmPassword) {
      return;
    }

    if (signupData.password.length < 6) {
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = signupData;
      await signup(dataToSend, isAdmin);

      if (isAdmin) {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  const handleCheckboxChange = (field, value) => {
    setSignupData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  if (isAdmin) {
    return (
      <>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name *
            </label>
            <input
              type="text"
              required
              value={signupData.name}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Designation *
            </label>
            <input
              type="text"
              required
              value={signupData.designation}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  designation: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your designation"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={signupData.password}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Create a password (min 6 characters)"
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Admin Account"}
          </Button>
        </form>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name (Optional)
            </label>
            <input
              type="text"
              value={signupData.name}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={signupData.email}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number / Mobile *
            </label>
            <input
              type="tel"
              required
              value={signupData.contactNumber}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  contactNumber: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your contact number"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name *
            </label>
            <input
              type="text"
              required
              value={signupData.schoolName}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  schoolName: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your school name"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              State *
            </label>
            <input
              type="text"
              required
              value={signupData.state}
              onChange={(e) =>
                setSignupData((prev) => ({ ...prev, state: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              placeholder="Enter your state"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                value={signupData.password}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Create a password (min 6 characters)"
                minLength={6}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                required
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                disabled={isLoading}
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
            Teaching Information
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Please select your school type *
            </label>
            <select
              required
              value={signupData.schoolType}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  schoolType: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            >
              <option value="">Select school type</option>
              <option value="Government">Government</option>
              <option value="Private">Private</option>
              <option value="Aided">Aided</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Which grade levels are you currently teaching? (select all that
              apply) *
            </label>
            <div className="space-y-2">
              {gradeOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={signupData.scienceGrades.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("scienceGrades", option.value)
                    }
                    className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {signupData.scienceGrades.includes("other") && (
              <input
                type="text"
                value={signupData.otherScienceGrade}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    otherScienceGrade: e.target.value,
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Please specify other grade range"
                disabled={isLoading}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How many years of teaching experience do you have? *
            </label>
            <select
              required
              value={signupData.teachingExperience}
              onChange={(e) =>
                setSignupData((prev) => ({
                  ...prev,
                  teachingExperience: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            >
              <option value="">Select experience range</option>
              <option value="0-1">0-1 years</option>
              <option value="2-5">2-5 years</option>
              <option value="6-10">6-10 years</option>
              <option value="11-15">11-15 years</option>
              <option value="16-20">16-20 years</option>
              <option value="20+">20+ years</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Do you have experience of teaching using edtech learning
              solutions? *
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="edtechExperience"
                  value="yes"
                  checked={signupData.edtechExperience === "yes"}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      edtechExperience: e.target.value,
                    }))
                  }
                  className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Yes</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="edtechExperience"
                  value="no"
                  checked={signupData.edtechExperience === "no"}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      edtechExperience: e.target.value,
                    }))
                  }
                  className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">No</span>
              </label>
              {/* <label className="flex items-center">
                <input
                  type="radio"
                  name="edtechExperience"
                  value="other"
                  checked={signupData.edtechExperience === "other"}
                  onChange={(e) =>
                    setSignupData((prev) => ({
                      ...prev,
                      edtechExperience: e.target.value,
                    }))
                  }
                  className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                  disabled={isLoading}
                />
                <span className="text-sm text-gray-700">Other</span>
              </label> */}
            </div>
            {signupData.edtechExperience === "other" && (
              <input
                type="text"
                value={signupData.otherEdtechExperience}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    otherEdtechExperience: e.target.value,
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Please specify your edtech experience"
                disabled={isLoading}
              />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What kind of edtech learning solutions do you wish to use in your
              lesson plan? (select all that apply) *
            </label>
            <div className="space-y-2">
              {edtechSolutionOptions.map((option) => (
                <label key={option.value} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={signupData.edtechSolutions.includes(option.value)}
                    onChange={() =>
                      handleCheckboxChange("edtechSolutions", option.value)
                    }
                    className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {signupData.edtechSolutions.includes("other") && (
              <input
                type="text"
                value={signupData.otherEdtechSolution}
                onChange={(e) =>
                  setSignupData((prev) => ({
                    ...prev,
                    otherEdtechSolution: e.target.value,
                  }))
                }
                className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Please specify other edtech solutions"
                disabled={isLoading}
              />
            )}
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{" "}
          <button
            onClick={onSwitchToLogin}
            className="text-primary hover:text-accent font-medium transition-colors"
            disabled={isLoading}
          >
            Sign in here
          </button>
        </p>
      </div>
    </>
  );
};

export default SignupForm;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../UI/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import {
  validateEmail,
  validateMobile,
  // validatePassword,
  validateConfirmPassword,
} from "../../utils/validations";

const SignupForm = ({ onSwitchToLogin, isAdmin = false }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const { signup, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Add validation errors state
  const [errors, setErrors] = useState({});

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

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "email":
        error = validateEmail(value);
        break;
      case "contactNumber":
        error = validateMobile(value);
        break;
      // case "password":
      //   error = validatePassword(value);
      //   break;
      case "confirmPassword":
        error = validateConfirmPassword(value, signupData.password);
        break;
      default:
        break;
    }

    setErrors((prev) => ({
      ...prev,
      [field]: error,
    }));

    return error === "";
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    newErrors.email = validateEmail(signupData.email);
    if (newErrors.email) isValid = false;

    if (!isAdmin) {
      newErrors.contactNumber = validateMobile(signupData.contactNumber);
      if (newErrors.contactNumber) isValid = false;
    }

    // newErrors.password = validatePassword(signupData.password);
    if (newErrors.password) isValid = false;

    newErrors.confirmPassword = validateConfirmPassword(
      signupData.confirmPassword,
      signupData.password
    );
    if (newErrors.confirmPassword) isValid = false;

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleBlur = (field, value) => {
    validateField(field, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

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

  const handleStepSubmit = (e) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handleSubmit(e);
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
              onChange={(e) => handleInputChange("name", e.target.value)}
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
              onChange={(e) => handleInputChange("designation", e.target.value)}
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
              onChange={(e) => handleInputChange("email", e.target.value)}
              onBlur={(e) => handleBlur("email", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email}</p>
            )}
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
                onChange={(e) => handleInputChange("password", e.target.value)}
                onBlur={(e) => handleBlur("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Create a password (min 6 characters)"
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
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password}</p>
            )}
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
                  handleInputChange("confirmPassword", e.target.value)
                }
                onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
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
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">
                {errors.confirmPassword}
              </p>
            )}
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
      <form onSubmit={handleStepSubmit} className="space-y-6">
        {step === 1 && (
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
                onChange={(e) => handleInputChange("name", e.target.value)}
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
                onChange={(e) => handleInputChange("email", e.target.value)}
                onBlur={(e) => handleBlur("email", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
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
                  handleInputChange("contactNumber", e.target.value)
                }
                onBlur={(e) => handleBlur("contactNumber", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                  errors.contactNumber ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter your contact number"
                disabled={isLoading}
              />
              {errors.contactNumber && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.contactNumber}
                </p>
              )}
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
                  handleInputChange("schoolName", e.target.value)
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
                onChange={(e) => handleInputChange("state", e.target.value)}
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
                    handleInputChange("password", e.target.value)
                  }
                  onBlur={(e) => handleBlur("password", e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Create a password (min 6 characters)"
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
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
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
                    handleInputChange("confirmPassword", e.target.value)
                  }
                  onBlur={(e) => handleBlur("confirmPassword", e.target.value)}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
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
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        )}

        {step === 2 && (
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
                  handleInputChange("schoolType", e.target.value)
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
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {signupData.scienceGrades.includes("other") && (
                <input
                  type="text"
                  value={signupData.otherScienceGrade}
                  onChange={(e) =>
                    handleInputChange("otherScienceGrade", e.target.value)
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
                  handleInputChange("teachingExperience", e.target.value)
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
                      handleInputChange("edtechExperience", e.target.value)
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
                      handleInputChange("edtechExperience", e.target.value)
                    }
                    className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    disabled={isLoading}
                  />
                  <span className="text-sm text-gray-700">No</span>
                </label>
              </div>
              {signupData.edtechExperience === "other" && (
                <input
                  type="text"
                  value={signupData.otherEdtechExperience}
                  onChange={(e) =>
                    handleInputChange("otherEdtechExperience", e.target.value)
                  }
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Please specify your edtech experience"
                  disabled={isLoading}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                What kind of edtech learning solutions do you wish to use in
                your lesson plan? (select all that apply) *
              </label>
              <div className="space-y-2">
                {edtechSolutionOptions.map((option) => (
                  <label key={option.value} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={signupData.edtechSolutions.includes(
                        option.value
                      )}
                      onChange={() =>
                        handleCheckboxChange("edtechSolutions", option.value)
                      }
                      className="mr-3 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <span className="text-sm text-gray-700">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
              {signupData.edtechSolutions.includes("other") && (
                <input
                  type="text"
                  value={signupData.otherEdtechSolution}
                  onChange={(e) =>
                    handleInputChange("otherEdtechSolution", e.target.value)
                  }
                  className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Please specify other edtech solutions"
                  disabled={isLoading}
                />
              )}
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : step === 1 ? "Next" : "Create Account"}
        </Button>
      </form>

      {step === 1 && (
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
      )}
    </>
  );
};

export default SignupForm;

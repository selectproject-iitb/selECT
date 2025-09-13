import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Button from "../UI/Button";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { validateEmail, validatePassword } from "../../utils/validations";

const LoginForm = ({ onSwitchToSignup, isAdmin = false }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const validateField = (field, value) => {
    let error = "";

    switch (field) {
      case "email":
        error = validateEmail(value);
        break;
      case "password":
        error = validatePassword(value);
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

    newErrors.email = validateEmail(loginData.email);
    if (newErrors.email) isValid = false;

    newErrors.password = validatePassword(loginData.password);
    if (newErrors.password) isValid = false;

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (field, value) => {
    setLoginData((prev) => ({ ...prev, [field]: value }));

    // Clear err when user starts typing
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

    if (!loginData.email || !loginData.password) {
      return;
    }

    try {
      await login(loginData, isAdmin);
      const redirectPath = location.state?.from?.pathname;
      let targetPath;
      if (
        redirectPath &&
        redirectPath !== "/login" &&
        redirectPath !== "/admin/login"
      ) {
        targetPath = redirectPath;
      } else if (isAdmin) {
        targetPath = "/admin/dashboard";
      } else {
        targetPath = "/";
      }
      setTimeout(() => {
        navigate(targetPath, { replace: true });
      }, 1000);
    } catch (error) {
      // Error is handled in the auth context
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            type="email"
            required
            value={loginData.email}
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
              value={loginData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              onBlur={(e) => handleBlur("password", e.target.value)}
              className={`w-full px-3 py-2 pr-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter your password"
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

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      {!isAdmin && (
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              onClick={onSwitchToSignup}
              className="text-primary hover:text-accent font-medium transition-colors"
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>
      )}
    </>
  );
};

export default LoginForm;

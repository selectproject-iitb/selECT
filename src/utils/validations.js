// Email validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) return "Email is required";
  if (!regex.test(email)) return "Please enter a valid email address";
  return null;
};

// Mobile Number validation
export const validateMobile = (mobile) => {
  const regex = /^[6-9]\d{9}$/;
  if (!mobile) return "Mobile number is required";
  if (!regex.test(mobile)) return "Please enter a valid 10-digit mobile number";
  return null;
};

// Password validation
// export const validatePassword = (password) => {
//   const regex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
//   if (!password) return "Password is required";
//   if (!regex.test(password)) {
//     return "Password must be at least 6 characters, include uppercase, lowercase, number & special character";
//   }
//   return null;
// };

// Confirm Password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Confirm password is required";
  if (password !== confirmPassword) return "Passwords do not match";
  return null;
};

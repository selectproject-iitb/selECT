import { useState } from "react";
import Card from "../components/UI/Card";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-600">
            {isSignup
              ? "Join SelECT to start evaluating educational content"
              : "Access your SelECT account to begin your journey."}
          </p>
        </div>

        <Card className="p-8">
          {isSignup ? (
            <SignupForm onSwitchToLogin={() => setIsSignup(false)} />
          ) : (
            <LoginForm onSwitchToSignup={() => setIsSignup(true)} />
          )}
        </Card>
      </div>
    </div>
  );
};

export default Login;

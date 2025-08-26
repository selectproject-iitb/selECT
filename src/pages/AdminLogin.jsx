import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/UI/Card";
import LoginForm from "../components/Auth/LoginForm";
import SignupForm from "../components/Auth/SignupForm";

const AdminLogin = () => {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isSignup ? "Create Admin Account" : "Admin Login"}
          </h1>
          <p className="text-gray-600">
            {isSignup
              ? "Create a new admin account for SelECT"
              : "Sign in to your admin dashboard"}
          </p>
          <div className="mt-4">
            <Link
              to="/login"
              className="text-sm text-primary hover:text-accent font-medium transition-colors"
            >
              ← Back to User Login
            </Link>
          </div>
        </div>

        <Card className="p-8">
          {isSignup ? (
            <SignupForm
              onSwitchToLogin={() => setIsSignup(false)}
              isAdmin={true}
            />
          ) : (
            <>
              <LoginForm
                onSwitchToSignup={() => setIsSignup(true)}
                isAdmin={true}
              />
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Need to create an admin account?{" "}
                  <button
                    onClick={() => setIsSignup(true)}
                    className="text-primary hover:text-accent font-medium transition-colors"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

export default AdminLogin;

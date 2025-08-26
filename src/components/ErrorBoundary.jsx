import React from "react";
import Card from "./UI/Card";
import Button from "./UI/Button";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error boundary:", error, errorInfo);
    this.setState({ error, errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full">
            <Card className="text-center p-6 sm:p-8">
              <div className="mb-4">
                <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FiAlertTriangle className="text-red-600" size={22} />
                </div>
                <h1 className="text-xl font-bold text-gray-900">
                  Something went wrong
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Please try again or return home.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  size="sm"
                >
                  <FiRefreshCw className="mr-2" /> Reload
                </Button>
                <Link to="/" className="inline-flex">
                  <Button variant="ghost" size="sm">
                    <FiHome className="mr-2" /> Go Home
                  </Button>
                </Link>
              </div>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <pre className="text-xs text-left bg-gray-100 p-3 rounded mt-4 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              )}
            </Card>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AppProvider } from "./context/AppContext";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PublicRoute from "./components/Auth/PublicRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Overview from "./pages/Overview";
import Assessment from "./pages/Assessment";
import Results from "./pages/Results";
import Login from "./pages/Login";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorBoundary from "./components/ErrorBoundary";
import ReloadWarning from "./components/UI/ReloadWarning";
import ComingSoon from "./components/ComingSoon";

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <AuthProvider>
          <SocketProvider>
            <AppProvider>
              <ReloadWarning />
              <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-1 pt-16">
                  <Routes>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/overview" element={<Overview />} />
                    <Route path="/toolkit" element={<ComingSoon />} />
                    <Route path="/resources" element={<ComingSoon />} />
                    <Route path="/contact" element={<ComingSoon />} />

                    {/* Auth routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/admin/login"
                      element={
                        <PublicRoute redirectTo="/admin/dashboard">
                          <AdminLogin />
                        </PublicRoute>
                      }
                    />

                    {/* Protected user routes */}
                    <Route
                      path="/assess"
                      element={
                        <ProtectedRoute>
                          <Assessment />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/results"
                      element={
                        <ProtectedRoute>
                          <Results />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected admin routes */}
                    <Route
                      path="/admin/dashboard"
                      element={
                        <ProtectedRoute adminOnly={true}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </main>
                <Footer />
              </div>

              <Toaster
                position="top-center"
                toastOptions={{
                  duration: 3500,
                  style: { background: "#1f2937", color: "#fff" },
                }}
              />
            </AppProvider>
          </SocketProvider>
        </AuthProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;

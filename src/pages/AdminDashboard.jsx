import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import apiService from "../services/apiService";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import {
  FiUsers,
  FiBarChart2,
  FiActivity,
  FiClock,
  FiRefreshCw,
  FiMessageSquare,
} from "react-icons/fi";
import { formatDistanceToNow, format } from "date-fns";
import { FaReply } from "react-icons/fa";

const AdminDashboard = () => {
  const { user, token } = useAuth();
  const { realTimeData, isConnected } = useSocket();
  const [dashboardData, setDashboardData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [liveActivity, setLiveActivity] = useState([]);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("dashboard");
  const [feedbackData, setFeedbackData] = useState([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true);
      const [dashboardResponse, statsResponse] = await Promise.all([
        apiService.getAdminDashboard(),
        apiService.getAdminStats(),
      ]);
      setDashboardData(dashboardResponse.dashboardData);
      setStats(statsResponse);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchFeedbackData = async () => {
    try {
      setFeedbackLoading(true);
      const response = await apiService.getFeedback();
      setFeedbackData(response.feedback);
    } catch (error) {
      console.error("Failed to fetch feedback data:", error);
    } finally {
      setFeedbackLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  useEffect(() => {
    if (token && activeTab === "feedback") {
      fetchFeedbackData();
    }
  }, [token, activeTab]);

  // Auto refresh at every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (token && !loading) {
        fetchDashboardData();
        if (activeTab === "feedback") {
          fetchFeedbackData();
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [token, loading, activeTab]);

  useEffect(() => {
    if (realTimeData?.userStatusUpdates) {
      setLiveActivity((prev) => {
        const newActivity = [...prev, ...realTimeData.userStatusUpdates];
        // Keep only last 20 activities and sort by timestamp
        return newActivity
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 20);
      });
    }
  }, [realTimeData]);

  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0m";
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = (user) => {
    switch (user.userStatus || user.activityData?.userStatus) {
      case "evaluating":
        return "bg-green-100 text-green-800 border border-green-200";
      case "online":
        return "bg-blue-100 text-blue-800 border border-blue-200";
      case "offline":
        return "bg-yellow-100 text-yellow-800 border border-yellow-200";
      case "logged_out":
        return "bg-gray-100 text-gray-800 border border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-200";
    }
  };

  const getStatusText = (user) => {
    switch (user.userStatus || user.activityData?.userStatus) {
      case "evaluating":
        return "Evaluating";
      case "online":
        return "Online";
      case "offline":
        return "Offline";
      case "logged_out":
        return "Logged Out";
      default:
        return "Unknown";
    }
  };

  const getStatusIcon = (user) => {
    switch (user.userStatus || user.activityData?.userStatus) {
      case "evaluating":
        return <FiActivity className="w-3 h-3" />;
      case "online":
        return <div className="w-3 h-3 bg-blue-500 rounded-full"></div>;
      case "offline":
        return <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>;
      case "logged_out":
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  const getFeedbackCategoryColor = (category) => {
    switch (category) {
      case "technical":
        return "bg-red-100 text-red-800";
      case "ui":
        return "bg-purple-100 text-purple-800";
      case "content":
        return "bg-blue-100 text-blue-800";
      case "bug":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setUserModalOpen(true);
  };

  const handleCloseUserModal = () => {
    setUserModalOpen(false);
    setSelectedUser(null);
  };

  const handleFeedbackClick = (feedback) => {
    setSelectedFeedback(feedback);
    setFeedbackModalOpen(true);
  };

  const handleCloseFeedbackModal = () => {
    setFeedbackModalOpen(false);
    setSelectedFeedback(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg text-gray-600">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Welcome back, {user?.name || user?.email}
            </p>
            {user?.designation && (
              <p className="text-sm text-gray-500">{user.designation}</p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isConnected ? "Live Updates" : "Disconnected"}
              </span>
            </div>
            <button
              onClick={
                activeTab === "dashboard"
                  ? fetchDashboardData
                  : fetchFeedbackData
              }
              disabled={refreshing || feedbackLoading}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50"
            >
              <FiRefreshCw
                className={refreshing || feedbackLoading ? "animate-spin" : ""}
                size={16}
              />
              Refresh
            </button>
          </div>
        </div>

        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "dashboard"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FiBarChart2 size={16} />
                  Dashboard
                </div>
              </button>
              <button
                onClick={() => setActiveTab("feedback")}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === "feedback"
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-2">
                  <FiMessageSquare size={16} />
                  Feedback
                </div>
              </button>
            </nav>
          </div>
        </div>

        {activeTab === "dashboard" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                    <FiUsers size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Users
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalUsers || 0}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats?.onlineUsers || 0} online
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                    <FiActivity size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Evaluating Now
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.evaluatingUsers || 0}
                    </p>
                    <p className="text-xs text-blue-600">Active sessions</p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                    <FiBarChart2 size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Total Evaluations
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {stats?.totalEvaluationSessions || 0}
                    </p>
                    <p className="text-xs text-green-600">
                      {stats?.completedEvaluations || 0} completed
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-6">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-orange-100 text-orange-600 mr-4">
                    <FiClock size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">
                      Platform Time
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatDuration(stats?.totalPlatformTime)}
                    </p>
                    <p className="text-xs text-gray-600">Total usage</p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Users List */}
              <div className="lg:col-span-2">
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Users & Activity
                    </h2>
                    <span className="text-sm text-gray-500">
                      {dashboardData?.users?.length || 0} total users
                    </span>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {dashboardData?.users?.map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => handleUserClick(user)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {(user.name || user.email)
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.name || "No Name"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {user.email}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user.schoolName}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2 mb-1">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(
                                user
                              )}`}
                            >
                              {getStatusIcon(user)}
                              {getStatusText(user)}
                            </span>
                          </div>
                          {user.userStatus === "evaluating" &&
                            user.activityData?.currentEvaluation
                              ?.isEvaluating && (
                              <div className="text-xs text-green-600 font-medium mb-1">
                                Step{" "}
                                {
                                  user.activityData.currentEvaluation
                                    .currentStep
                                }{" "}
                                of{" "}
                                {user.activityData.currentEvaluation
                                  .totalSteps || "N/A"}{" "}
                                -{" "}
                                {
                                  user.activityData.currentEvaluation
                                    .completionPercentage
                                }
                                %
                              </div>
                            )}
                          <div className="text-xs text-gray-500">
                            {user.activityData?.totalAttempts || 0} attempts •{" "}
                            {formatDuration(user.activityData?.totalTimeSpent)}
                          </div>
                          {user.activityData?.lastLoginTime && (
                            <div className="text-xs text-gray-400">
                              {user.userStatus === "logged_out" &&
                              user.activityData?.lastLogoutTime ? (
                                <>
                                  Logged out:{" "}
                                  {formatDistanceToNow(
                                    new Date(user.activityData.lastLogoutTime),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </>
                              ) : (
                                <>
                                  Last login:{" "}
                                  {formatDistanceToNow(
                                    new Date(user.activityData.lastLoginTime),
                                    {
                                      addSuffix: true,
                                    }
                                  )}
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {(!dashboardData?.users ||
                      dashboardData.users.length === 0) && (
                      <div className="text-center py-8 text-gray-500">
                        <FiUsers
                          size={48}
                          className="mx-auto mb-4 opacity-50"
                        />
                        <p>No users found</p>
                        <p className="text-sm">
                          Users will appear here once they sign up
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              {/* Live Activity */}
              <div>
                <Card className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    Live Activity
                  </h2>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {liveActivity.map((activity, index) => (
                      <div
                        key={index}
                        className={`flex items-start space-x-3 p-2 rounded-lg ${
                          activity.activityType === "user_online"
                            ? "bg-green-50"
                            : activity.activityType === "user_offline"
                            ? "bg-yellow-50"
                            : activity.activityType === "user_logout"
                            ? "bg-gray-50"
                            : activity.activityType === "evaluation_started"
                            ? "bg-blue-50"
                            : activity.activityType === "evaluation_progress"
                            ? "bg-purple-50"
                            : "bg-gray-50"
                        }`}
                      >
                        {activity.activityType === "user_online" && (
                          <div className="w-3 h-3 bg-green-500 rounded-full mt-1"></div>
                        )}
                        {activity.activityType === "user_offline" && (
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mt-1"></div>
                        )}
                        {activity.activityType === "user_logout" && (
                          <div className="w-3 h-3 bg-gray-400 rounded-full mt-1"></div>
                        )}
                        {activity.activityType === "evaluation_started" && (
                          <FiActivity
                            className="text-blue-600 mt-1"
                            size={16}
                          />
                        )}
                        {activity.activityType === "evaluation_progress" && (
                          <FiBarChart2
                            className="text-purple-600 mt-1"
                            size={16}
                          />
                        )}
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">
                              {activity.userName}
                            </span>{" "}
                            {activity.activityType === "user_online" &&
                              "came online"}
                            {activity.activityType === "user_offline" &&
                              "went offline"}
                            {activity.activityType === "user_logout" &&
                              "logged out"}
                            {activity.activityType === "evaluation_started" &&
                              `started evaluation (Attempt ${
                                activity.attemptNumber || 1
                              })`}
                            {activity.activityType === "evaluation_progress" &&
                              `reached ${activity.stepName} (${activity.completionPercentage}%)`}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatDistanceToNow(new Date(activity.timestamp), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    {realTimeData?.evaluationUpdates
                      ?.slice(0, 5)
                      .map((update, index) => (
                        <div
                          key={`eval-${index}`}
                          className="flex items-start space-x-3 p-2 bg-blue-50 rounded-lg"
                        >
                          <FiActivity
                            className="text-blue-600 mt-1"
                            size={16}
                          />
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">
                              User reached{" "}
                              <span className="font-medium">
                                {update.stepName}
                              </span>
                            </p>
                            <p className="text-xs text-gray-600">
                              {Math.min(100, update.completionPercentage)}%
                              complete •{" "}
                              {formatDistanceToNow(new Date(update.timestamp), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      ))}
                    {liveActivity.length === 0 &&
                      !realTimeData?.evaluationUpdates?.length && (
                        <div className="text-center py-4 text-gray-500">
                          <FiActivity
                            size={32}
                            className="mx-auto mb-2 opacity-50"
                          />
                          <p className="text-sm">No recent activity</p>
                        </div>
                      )}
                  </div>
                </Card>
              </div>
            </div>
          </>
        )}

        {activeTab === "feedback" && (
          <>
            <Card className="p-6">
              <p className="text-xl font-semibold pb-4">All Feedbacks</p>

              {feedbackLoading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading feedback...
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {feedbackData.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => handleFeedbackClick(feedback)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-medium">
                              {feedback.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {feedback.userName}
                            </p>
                            <p className="text-sm text-gray-600">
                              {feedback.userEmail}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedbackCategoryColor(
                              feedback.category
                            )}`}
                          >
                            {feedback.category}
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3 line-clamp-2">
                        {feedback.feedback}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>
                          {formatDistanceToNow(new Date(feedback.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                      </div>
                    </div>
                  ))}
                  {feedbackData.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FiMessageSquare
                        size={48}
                        className="mx-auto mb-4 opacity-50"
                      />
                      <p>No feedback found</p>
                      <p className="text-sm">User feedback will appear here</p>
                    </div>
                  )}
                </div>
              )}
            </Card>
          </>
        )}
      </div>

      {/* User Details Modal */}
      <Modal
        open={userModalOpen}
        onClose={handleCloseUserModal}
        title={
          selectedUser
            ? `${selectedUser.name || "User"} Details`
            : "User Details"
        }
        maxWidth="max-w-4xl"
      >
        {selectedUser && (
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">
                    {(selectedUser.name || selectedUser.email)
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedUser.name || "No Name"}
                  </h3>
                  <p className="text-gray-600 mb-2">{selectedUser.email}</p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(
                        selectedUser
                      )}`}
                    >
                      {getStatusIcon(selectedUser)}
                      {getStatusText(selectedUser)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">School</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.schoolName || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">State</p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.state || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Teaching Experience
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.teachingExperience || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    EdTech Experience
                  </p>
                  <p className="font-medium text-gray-900">
                    {selectedUser.edtechExperience || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {selectedUser.activityData?.totalAttempts || 0}
                </div>
                <div className="text-sm text-blue-700">Total Attempts</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {selectedUser.activityData?.completedEvaluations || 0}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {(selectedUser.activityData?.totalAttempts || 0) -
                    (selectedUser.activityData?.completedEvaluations || 0)}
                </div>
                <div className="text-sm text-yellow-700">Incomplete</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {formatDuration(selectedUser.activityData?.totalTimeSpent)}
                </div>
                <div className="text-sm text-purple-700">Time Spent</div>
              </div>
            </div>

            {selectedUser.activityData?.currentEvaluation && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Evaluation
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Attempt Number</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {
                        selectedUser.activityData.currentEvaluation
                          .attemptNumber
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Current Step</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedUser.activityData.currentEvaluation.currentStep}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Progress</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {Math.min(
                        100,
                        selectedUser.activityData.currentEvaluation
                          .completionPercentage
                      )}
                      %
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.min(
                        100,
                        selectedUser.activityData.currentEvaluation
                          .completionPercentage
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {selectedUser.activityData?.evaluationHistory?.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  Evaluation History
                </h4>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedUser.activityData.evaluationHistory.map(
                    (attempt, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              attempt.isCompleted
                                ? "bg-green-500"
                                : "bg-yellow-500"
                            }`}
                          ></div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-gray-900">
                                Attempt {attempt.attemptNumber}
                              </span>
                              {attempt.isRestart && (
                                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                                  Restart
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {format(
                                new Date(attempt.startTime),
                                "MMM dd, yyyy 'at' HH:mm"
                              )}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-sm font-medium ${
                              attempt.isCompleted
                                ? "text-green-600"
                                : "text-yellow-600"
                            }`}
                          >
                            {attempt.isCompleted
                              ? "Completed"
                              : `${Math.min(
                                  100,
                                  attempt.completionPercentage || 0
                                )}% Complete`}
                          </div>
                          {attempt.endTime && (
                            <div className="text-xs text-gray-500">
                              Duration:{" "}
                              {formatDuration(
                                new Date(attempt.endTime) -
                                  new Date(attempt.startTime)
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Additional Statistics
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600 mb-1">
                    {selectedUser.activityData?.restartCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Restarts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 mb-1">
                    {selectedUser.activityData?.exportCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Exports</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600 mb-1">
                    {selectedUser.activityData?.lastLoginTime
                      ? format(
                          new Date(selectedUser.activityData.lastLoginTime),
                          "MMM dd"
                        )
                      : "Never"}
                  </div>
                  <div className="text-sm text-gray-600">Last Login</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-gray-600 mb-1">
                    {format(new Date(selectedUser.createdAt), "MMM dd, yyyy")}
                  </div>
                  <div className="text-sm text-gray-600">Joined</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={feedbackModalOpen}
        onClose={handleCloseFeedbackModal}
        title="Feedback Details"
        maxWidth="max-w-4xl"
      >
        {selectedFeedback && (
          <div className="space-y-6">
            <div className=" rounded-lg p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold">
                    {selectedFeedback.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {selectedFeedback.userName}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {selectedFeedback.userEmail}
                  </p>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getFeedbackCategoryColor(
                        selectedFeedback.category
                      )}`}
                    >
                      {selectedFeedback.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(
                        new Date(selectedFeedback.createdAt),
                        "MMM dd, yyyy 'at' HH:mm"
                      )}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  User Feedback:
                </h4>
                <p className="text-gray-700 bg-white p-4">
                  {selectedFeedback.feedback}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminDashboard;

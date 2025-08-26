import { useEffect, useState } from "react";
import { FiActivity, FiClock, FiUsers } from "react-icons/fi";
import { useSocket } from "../../context/SocketContext";
import { useAuth } from "../../context/AuthContext";

const ActivityTracker = ({ className = "" }) => {
  const { isConnected, realTimeData } = useSocket();
  const { user } = useAuth();
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  if (user?.role === "admin") {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg shadow-sm border border-gray-200 p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-gray-900">Session Activity</h3>
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-xs text-gray-500">
            {isConnected ? "Live" : "Offline"}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiClock className="text-blue-600" size={16} />
            <span className="text-sm text-gray-600">Session Time</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {formatTime(sessionTime)}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FiActivity className="text-green-600" size={16} />
            <span className="text-sm text-gray-600">Status</span>
          </div>
          <span className="text-sm font-medium text-green-600">Active</span>
        </div>

        {realTimeData?.evaluationUpdates?.length > 0 && (
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center space-x-2 mb-2">
              <FiUsers className="text-purple-600" size={16} />
              <span className="text-xs text-gray-600">Recent Activity</span>
            </div>
            <div className="space-y-1">
              {realTimeData.evaluationUpdates
                .slice(0, 3)
                .map((update, index) => (
                  <div key={index} className="text-xs text-gray-500">
                    {update.stepName} - {update.completionPercentage}%
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityTracker;

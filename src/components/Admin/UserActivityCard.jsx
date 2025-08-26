import { formatDistanceToNow } from "date-fns";

const UserActivityCard = ({ user, onSelect, isSelected }) => {
  const formatDuration = (milliseconds) => {
    if (!milliseconds) return "0m";
    const minutes = Math.floor(milliseconds / 60000);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }
    return `${minutes}m`;
  };

  const getStatusColor = () => {
    if (user.isOnline && user.activityData?.currentEvaluation?.isEvaluating) {
      return "bg-green-100 text-green-800";
    }
    if (user.isOnline) {
      return "bg-blue-100 text-blue-800";
    }
    return "bg-gray-100 text-gray-800";
  };

  const getStatusText = () => {
    if (user.isOnline && user.activityData?.currentEvaluation?.isEvaluating) {
      return "Evaluating";
    }
    if (user.isOnline) {
      return "Online";
    }
    return "Offline";
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:bg-gray-50"
      }`}
      onClick={() => onSelect(user)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-medium">
              {(user.name || user.email).charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.name || "No Name"}
            </p>
            <p className="text-sm text-gray-600">{user.email}</p>
            <p className="text-xs text-gray-500">{user.schoolName}</p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={`px-2 py-1 rounded-full text-xs ${getStatusColor()}`}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {user.activityData?.currentEvaluation?.isEvaluating && (
        <div className="mt-3 p-2 bg-green-50 rounded-lg">
          <div className="flex items-center justify-between text-sm">
            <span className="text-green-700">Currently Evaluating</span>
            <span className="text-green-600">
              {user.activityData.currentEvaluation.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-green-200 rounded-full h-1.5 mt-1">
            <div
              className="bg-green-600 h-1.5 rounded-full"
              style={{
                width: `${user.activityData.currentEvaluation.completionPercentage}%`,
              }}
            ></div>
          </div>
          <p className="text-xs text-green-600 mt-1">
            Step {user.activityData.currentEvaluation.currentStep}
          </p>
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
          <span>{user.activityData?.totalAttempts || 0} attempts</span>
          <span>{formatDuration(user.activityData?.totalTimeSpent)}</span>
        </div>
        {user.activityData?.lastLoginTime && (
          <span>
            Last:{" "}
            {formatDistanceToNow(new Date(user.activityData.lastLoginTime), {
              addSuffix: true,
            })}
          </span>
        )}
      </div>
    </div>
  );
};

export default UserActivityCard;

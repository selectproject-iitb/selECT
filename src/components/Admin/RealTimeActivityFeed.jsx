import { FiActivity, FiUsers, FiCheckCircle } from "react-icons/fi";
import { formatDistanceToNow } from "date-fns";

const RealTimeActivityFeed = ({ updates, maxItems = 10 }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "evaluation":
        return <FiActivity className="text-blue-600" size={16} />;
      case "user_status":
        return <FiUsers className="text-green-600" size={16} />;
      case "evaluation_complete":
        return <FiCheckCircle className="text-green-600" size={16} />;
      default:
        return <FiActivity className="text-gray-600" size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case "evaluation":
        return "bg-blue-50 border-blue-200";
      case "user_status":
        return "bg-green-50 border-green-200";
      case "evaluation_complete":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const allUpdates = [
    ...(updates.evaluationUpdates || []).map((update) => ({
      ...update,
      type: "evaluation",
      message: `User reached ${update.stepName}`,
      detail: `${update.completionPercentage}% complete`,
    })),
    ...(updates.userUpdates || []).map((update) => ({
      ...update,
      type: "user_status",
      message: `User ${update.isOnline ? "came online" : "went offline"}`,
      detail: update.isEvaluating ? "Currently evaluating" : "",
    })),
  ]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, maxItems);

  return (
    <div className="space-y-3">
      {allUpdates.map((update, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 p-3 rounded-lg border ${getActivityColor(
            update.type
          )}`}
        >
          <div className="mt-0.5">{getActivityIcon(update.type)}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">{update.message}</p>
            {update.detail && (
              <p className="text-xs text-gray-600">{update.detail}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formatDistanceToNow(new Date(update.timestamp), {
                addSuffix: true,
              })}
            </p>
          </div>
        </div>
      ))}

      {allUpdates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <FiActivity size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">No recent activity</p>
          <p className="text-xs">Live updates will appear here</p>
        </div>
      )}
    </div>
  );
};

export default RealTimeActivityFeed;

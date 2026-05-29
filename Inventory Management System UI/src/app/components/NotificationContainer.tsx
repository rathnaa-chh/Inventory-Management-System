import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-md">
      {notifications.map((notification) => {
        const icons = {
          success: <CheckCircle className="w-5 h-5 text-green-600" />,
          error: <AlertCircle className="w-5 h-5 text-red-600" />,
          warning: <AlertTriangle className="w-5 h-5 text-yellow-600" />,
          info: <Info className="w-5 h-5 text-blue-600" />,
        };

        const bgColors = {
          success: 'bg-green-50 border-green-200',
          error: 'bg-red-50 border-red-200',
          warning: 'bg-yellow-50 border-yellow-200',
          info: 'bg-blue-50 border-blue-200',
        };

        const textColors = {
          success: 'text-green-900',
          error: 'text-red-900',
          warning: 'text-yellow-900',
          info: 'text-blue-900',
        };

        return (
          <div
            key={notification.id}
            className={`${bgColors[notification.type]} border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-200`}
          >
            <div className="flex-shrink-0 mt-0.5">{icons[notification.type]}</div>
            <div className="flex-1 min-w-0">
              <h3 className={`font-semibold ${textColors[notification.type]}`}>{notification.title}</h3>
              {notification.message && (
                <p className={`text-sm mt-1 ${textColors[notification.type]}`}>{notification.message}</p>
              )}
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className={`flex-shrink-0 ${textColors[notification.type]} hover:opacity-70 transition-opacity`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

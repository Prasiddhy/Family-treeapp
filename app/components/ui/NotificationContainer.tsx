'use client';

import { useNotification } from '../../contexts/NotificationContext';
import { X, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';

export default function NotificationContainer() {
  const { notifications, removeNotification } = useNotification();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationClass = (type: string) => {
    switch (type) {
      case 'success':
        return 'notification notification-success';
      case 'error':
        return 'notification notification-error';
      case 'warning':
        return 'notification notification-warning';
      case 'info':
        return 'notification notification-info';
      default:
        return 'notification notification-info';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${getNotificationClass(notification.type)} slide-in`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {getIcon(notification.type)}
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-gray-900">
                {notification.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}


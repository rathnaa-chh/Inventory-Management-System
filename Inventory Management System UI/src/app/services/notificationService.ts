import { useNotification } from '../context/NotificationContext';

export const useNotificationService = () => {
  const { addNotification } = useNotification();

  return {
    // Success notifications
    notifySuccess: (title: string, message?: string) => {
      addNotification({
        type: 'success',
        title,
        message,
        duration: 4000,
      });
    },

    // Error notifications
    notifyError: (title: string, message?: string) => {
      addNotification({
        type: 'error',
        title,
        message,
        duration: 5000,
      });
    },

    // Warning notifications
    notifyWarning: (title: string, message?: string) => {
      addNotification({
        type: 'warning',
        title,
        message,
        duration: 5000,
      });
    },

    // Info notifications
    notifyInfo: (title: string, message?: string) => {
      addNotification({
        type: 'info',
        title,
        message,
        duration: 4000,
      });
    },

    // Specific scenarios
    notifyLowStock: (productName: string, quantity: number, threshold: number) => {
      addNotification({
        type: 'warning',
        title: 'Low Stock Alert',
        message: `${productName} is running low (${quantity} left, threshold: ${threshold})`,
        duration: 6000,
      });
    },

    notifyTransactionSuccess: (type: 'IN' | 'OUT', productName: string, quantity: number) => {
      const action = type === 'IN' ? 'received' : 'sent out';
      addNotification({
        type: 'success',
        title: 'Transaction Completed',
        message: `${quantity} units of ${productName} ${action}`,
        duration: 4000,
      });
    },

    notifyTransactionError: (error: string) => {
      addNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: error,
        duration: 5000,
      });
    },

    notifyAuthSuccess: (message: string) => {
      addNotification({
        type: 'success',
        title: 'Authentication',
        message,
        duration: 3000,
      });
    },

    notifyAuthError: (error: string) => {
      addNotification({
        type: 'error',
        title: 'Authentication Failed',
        message: error,
        duration: 5000,
      });
    },

    notifyProfileUpdate: (success: boolean, message?: string) => {
      addNotification({
        type: success ? 'success' : 'error',
        title: success ? 'Profile Updated' : 'Update Failed',
        message: message || (success ? 'Your profile has been updated successfully' : 'Failed to update profile'),
        duration: 4000,
      });
    },

    notifyDataLoadError: (resource: string) => {
      addNotification({
        type: 'error',
        title: 'Failed to Load',
        message: `Could not load ${resource}. Please try again.`,
        duration: 5000,
      });
    },
  };
};

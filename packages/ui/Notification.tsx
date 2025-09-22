import React, { createContext, useCallback, useContext, useEffect, useReducer } from 'react';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  actions?: NotificationAction[];
  onClose?: () => void;
  timestamp: number;
}

export interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export interface NotificationContextValue {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  success: (message: string, options?: Partial<Notification>) => string;
  error: (message: string, options?: Partial<Notification>) => string;
  warning: (message: string, options?: Partial<Notification>) => string;
  info: (message: string, options?: Partial<Notification>) => string;
}

type NotificationAction_Internal = 
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL' };

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: []
};

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function notificationReducer(state: NotificationState, action: NotificationAction_Internal): NotificationState {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload]
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(notification => notification.id !== action.payload)
      };
    case 'CLEAR_ALL':
      return {
        ...state,
        notifications: []
      };
    default:
      return state;
  }
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export interface NotificationProviderProps {
  children: React.ReactNode;
  maxNotifications?: number;
  defaultDuration?: number;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
  maxNotifications = 5,
  defaultDuration = 5000,
  position = 'top-right'
}) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);

  const removeNotification = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  }, []);

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const id = generateId();
    const newNotification: Notification = {
      ...notification,
      id,
      timestamp: Date.now(),
      duration: notification.duration ?? defaultDuration
    };

    dispatch({ type: 'ADD_NOTIFICATION', payload: newNotification });

    // Auto-remove after duration (unless persistent)
    if (!newNotification.persistent && newNotification.duration && newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    // Remove oldest if exceeding max
    if (state.notifications.length >= maxNotifications) {
      const oldestId = state.notifications[0]?.id;
      if (oldestId) {
        removeNotification(oldestId);
      }
    }

    return id;
  }, [defaultDuration, maxNotifications, removeNotification, state.notifications.length]);

  const clearAll = useCallback(() => {
    dispatch({ type: 'CLEAR_ALL' });
  }, []);

  const success = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'success', message });
  }, [addNotification]);

  const error = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'error', message, persistent: options?.persistent ?? true });
  }, [addNotification]);

  const warning = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'warning', message });
  }, [addNotification]);

  const info = useCallback((message: string, options?: Partial<Notification>) => {
    return addNotification({ ...options, type: 'info', message });
  }, [addNotification]);

  const contextValue: NotificationContextValue = {
    notifications: state.notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer position={position} />
    </NotificationContext.Provider>
  );
};

interface NotificationContainerProps {
  position: string;
}

const NotificationContainer: React.FC<NotificationContainerProps> = ({ position }) => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('NotificationContainer must be used within NotificationProvider');
  }

  const { notifications, removeNotification } = context;

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={`notification-container notification-container--${position}`}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClose }) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const [isExiting, setIsExiting] = React.useState(false);

  useEffect(() => {
    // Trigger enter animation
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
      if (notification.onClose) {
        notification.onClose();
      }
    }, 300); // Match CSS transition duration
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  };

  return (
    <div 
      className={`
        notification 
        notification--${notification.type}
        ${isVisible ? 'notification--visible' : ''}
        ${isExiting ? 'notification--exiting' : ''}
      `}
      role='alert'
      aria-live='polite'
    >
      <div className='notification__content'>
        <div className='notification__icon'>
          {getIcon()}
        </div>
        
        <div className='notification__body'>
          {notification.title && (
            <div className='notification__title'>
              {notification.title}
            </div>
          )}
          <div className='notification__message'>
            {notification.message}
          </div>
          
          {notification.actions && notification.actions.length > 0 && (
            <div className='notification__actions'>
              {notification.actions.map((action, index) => (
                <button
                  key={index}
                  type='button'
                  onClick={action.onClick}
                  className={`notification__action notification__action--${action.variant || 'secondary'}`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          )}
        </div>
        
        <button
          type='button'
          onClick={handleClose}
          className='notification__close'
          aria-label='Close notification'
        >
          ✕
        </button>
      </div>
      
      {!notification.persistent && notification.duration && notification.duration > 0 && (
        <div 
          className='notification__progress'
          style={{ 
            animationDuration: `${notification.duration}ms` 
          }}
        />
      )}
    </div>
  );
};

// Hook to use notifications
export const useNotifications = (): NotificationContextValue => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  
  return context;
};

// Standalone Toast component for simple usage
export interface ToastProps {
  message: string;
  type?: NotificationType;
  duration?: number;
  onClose?: () => void;
  show?: boolean;
}

export const Toast: React.FC<ToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  show = true
}) => {
  const [isVisible, setIsVisible] = React.useState(show);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300);
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  if (!isVisible) {
    return null;
  }

  const getIcon = () => {
    switch (type) {
      case 'success': return '✓';
      case 'error': return '✕';
      case 'warning': return '⚠';
      case 'info': return 'ℹ';
      default: return '';
    }
  };

  return (
    <div className={`toast toast--${type} ${isVisible ? 'toast--visible' : ''}`}>
      <div className='toast__icon'>{getIcon()}</div>
      <div className='toast__message'>{message}</div>
      {onClose && (
        <button
          type='button'
          onClick={onClose}
          className='toast__close'
          aria-label='Close'
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default NotificationProvider;
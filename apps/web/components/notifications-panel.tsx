'use client';

import { useState } from 'react';
import { Bell, X, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'assignment' | 'status_change' | 'comment';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  icon: string;
}

export function NotificationsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'assignment',
      title: 'Issue Assigned to You',
      description: 'DEV-2: Fix login bug on mobile',
      timestamp: '5 minutes ago',
      read: false,
      icon: '🎯',
    },
    {
      id: '2',
      type: 'status_change',
      title: 'Status Updated',
      description: 'DEV-3 moved to Review by Emma Wilson',
      timestamp: '1 hour ago',
      read: false,
      icon: '✓',
    },
    {
      id: '3',
      type: 'comment',
      title: 'New Comment',
      description: 'Alex Kim commented on DEV-1',
      timestamp: '2 hours ago',
      read: true,
      icon: '💬',
    },
    {
      id: '4',
      type: 'status_change',
      title: 'Issue Closed',
      description: 'OPS-2 marked as Done',
      timestamp: '3 hours ago',
      read: true,
      icon: '✓',
    },
    {
      id: '5',
      type: 'assignment',
      title: 'Sprint Started',
      description: 'Sprint 1 has been started',
      timestamp: '1 day ago',
      read: true,
      icon: '🚀',
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIconComponent = (type: string) => {
    switch (type) {
      case 'assignment':
        return <AlertCircle size={18} className="text-primary" />;
      case 'status_change':
        return <CheckCircle2 size={18} className="text-green-600" />;
      case 'comment':
        return <MessageSquare size={18} className="text-blue-600" />;
      default:
        return <Bell size={18} />;
    }
  };

  return (
    <div className="relative">
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications panel */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Panel */}
          <div className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg border border-border shadow-xl z-50 max-h-96 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-bold text-foreground">Notifications</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-muted rounded transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Notifications list */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-muted transition-colors cursor-pointer ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-xl">{notification.icon}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-sm text-foreground">
                                {notification.title}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">
                                {notification.description}
                              </p>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              className="p-1 hover:bg-background rounded transition-colors flex-shrink-0"
                            >
                              <X size={14} />
                            </button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{notification.timestamp}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <p className="text-sm">No notifications yet</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-border text-center">
                <button className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { notificationsAPI } from '../api/api';

// --- SVG Icon Components ---
const Icon = ({ path, className = "w-5 h-5" }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={{ width: '20px', height: '20px' }}>
        <path fillRule="evenodd" d={path} clipRule="evenodd" />
    </svg>
);

const BellIcon = () => <Icon path="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />;
const XIcon = () => <Icon path="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />;
const CheckIcon = () => <Icon path="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />;
const FolderIcon = () => <Icon path="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />;
const UserIcon = () => <Icon path="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />;

// Notification Item Component
const NotificationItem = ({ notification, onMarkAsRead, onDelete }) => {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return date.toLocaleDateString();
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'project_invitation':
                return <FolderIcon />;
            case 'task_assigned':
                return <UserIcon />;
            default:
                return <BellIcon />;
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'project_invitation':
                return 'notification-project';
            case 'task_assigned':
                return 'notification-task';
            default:
                return 'notification-default';
        }
    };

    return (
        <div className={`notification-item ${!notification.read_at ? 'notification-unread' : ''}`}>
            <div className={`notification-icon ${getNotificationColor(notification.type)}`}>
                {getNotificationIcon(notification.type)}
            </div>
            <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <div className="notification-meta">
                    <span className="notification-time">{formatDate(notification.created_at)}</span>
                    {notification.data?.project_name && (
                        <span className="notification-project-name">
                            • {notification.data.project_name}
                        </span>
                    )}
                </div>
            </div>
            <div className="notification-actions">
                {!notification.read_at && (
                    <button
                        onClick={() => onMarkAsRead(notification.id)}
                        className="notification-action-btn"
                        title="Mark as read"
                    >
                        <CheckIcon />
                    </button>
                )}
                <button
                    onClick={() => onDelete(notification.id)}
                    className="notification-action-btn notification-delete"
                    title="Delete notification"
                >
                    <XIcon />
                </button>
            </div>
        </div>
    );
};

// Notifications Dropdown Component
const NotificationsDropdown = ({ isOpen, onClose, notifications, onMarkAsRead, onDelete, onMarkAllAsRead }) => {
    if (!isOpen) return null;

    const unreadCount = notifications.filter(n => !n.read_at).length;

    return (
        <div className="notifications-dropdown">
            <div className="notifications-header">
                <h3>Notifications</h3>
                <div className="notifications-header-actions">
                    {unreadCount > 0 && (
                        <button
                            onClick={onMarkAllAsRead}
                            className="btn btn-sm btn-secondary"
                        >
                            Mark all read
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="notifications-close"
                    >
                        <XIcon />
                    </button>
                </div>
            </div>
            <div className="notifications-list">
                {notifications.length === 0 ? (
                    <div className="notifications-empty">
                        <BellIcon />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    notifications.map(notification => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                            onMarkAsRead={onMarkAsRead}
                            onDelete={onDelete}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

// Main Notifications Component
const NotificationsBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fetchNotifications = async () => {
        try {
            setIsLoading(true);
            const response = await notificationsAPI.getAll();
            if (response.success) {
                setNotifications(response.data || []);
                setUnreadCount(response.data?.filter(n => !n.read_at).length || 0);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsRead = async (notificationId) => {
        try {
            await notificationsAPI.markAsRead(notificationId);
            setNotifications(prev =>
                prev.map(n =>
                    n.id === notificationId
                        ? { ...n, read_at: new Date().toISOString() }
                        : n
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleDelete = async (notificationId) => {
        try {
            await notificationsAPI.delete(notificationId);
            setNotifications(prev => prev.filter(n => n.id !== notificationId));
            // Update unread count if the deleted notification was unread
            const deletedNotification = notifications.find(n => n.id === notificationId);
            if (deletedNotification && !deletedNotification.read_at) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsAPI.markAllAsRead();
            setNotifications(prev =>
                prev.map(n => ({ ...n, read_at: n.read_at || new Date().toISOString() }))
            );
            setUnreadCount(0);
        } catch (error) {
            console.error('Error marking all notifications as read:', error);
        }
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
        if (!isDropdownOpen) {
            fetchNotifications();
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Poll for new notifications every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isDropdownOpen && !event.target.closest('.notifications-container')) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    return (
        <div className="notifications-container">
            <button
                onClick={toggleDropdown}
                className={`notifications-bell ${isDropdownOpen ? 'active' : ''}`}
                title="Notifications"
            >
                <BellIcon />
                {unreadCount > 0 && (
                    <span className="notifications-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
                )}
            </button>
            
            <NotificationsDropdown
                isOpen={isDropdownOpen}
                onClose={() => setIsDropdownOpen(false)}
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onDelete={handleDelete}
                onMarkAllAsRead={handleMarkAllAsRead}
            />
        </div>
    );
};

export default NotificationsBell;

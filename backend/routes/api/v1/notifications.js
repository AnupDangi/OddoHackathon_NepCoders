import express from 'express';
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications
} from '../../../controllers/notificationController.js';
import { authenticateToken } from '../../../middlewares/auth.js';

const router = express.Router();

// All notification routes require authentication
router.use(authenticateToken);

/**
 * @route GET /api/v1/notifications/
 * @desc Get all notifications for the authenticated user
 * @access Private
 * @query {number} limit - Number of notifications to fetch (default: 20)
 * @query {number} offset - Offset for pagination (default: 0)  
 * @query {boolean} unread_only - Filter only unread notifications
 * @query {string} type - Filter by notification type
 */
router.get('/', getNotifications);

/**
 * @route GET /api/v1/notifications/unread-count
 * @desc Get count of unread notifications
 * @access Private
 */
router.get('/unread-count', getUnreadCount);

/**
 * @route PUT /api/v1/notifications/:id/read
 * @desc Mark a specific notification as read
 * @access Private
 * @param {string} id - Notification ID
 */
router.put('/:id/read', markAsRead);

/**
 * @route PUT /api/v1/notifications/read-all
 * @desc Mark all notifications as read for the authenticated user
 * @access Private
 */
router.put('/read-all', markAllAsRead);

router.delete('/:id', deleteNotification);

/**
 * @route DELETE /api/v1/notifications/read
 * @desc Delete all read notifications for the authenticated user
 * @access Private
 */
router.delete('/read', deleteReadNotifications);

export default router;

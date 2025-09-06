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

router.get('/', getNotifications);
router.get('/unread-count', getUnreadCount);
router.put('/:id/read', markAsRead);
router.put('/read-all', markAllAsRead);

router.delete('/:id', deleteNotification);
router.delete('/read', deleteReadNotifications);

export default router;

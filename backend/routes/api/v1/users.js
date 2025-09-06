import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  uploadAvatar
} from '../../../controllers/userController.js';
import { authenticateToken } from '../../../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// User routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/all', getAllUsers);
router.post('/avatar', uploadAvatar);

export default router;

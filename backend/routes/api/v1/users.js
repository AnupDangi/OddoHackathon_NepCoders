import express from 'express';
import {
  getProfile,
  updateProfile,
  getAllUsers,
  searchUsersByEmail,
  getUserById,
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
router.get('/search', searchUsersByEmail);
router.get('/:id', getUserById);
router.post('/avatar', uploadAvatar);

export default router;

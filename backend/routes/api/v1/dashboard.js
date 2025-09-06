import express from 'express';
import {
  getDashboard,
  getStats
} from '../../../controllers/dashboardController.js';
import { authenticateToken } from '../../../middlewares/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Dashboard routes
router.get('/', getDashboard);
router.get('/stats', getStats);

export default router;

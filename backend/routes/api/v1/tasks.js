import express from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject
} from '../../../controllers/taskController.js';
import { authenticateToken } from '../../../middlewares/auth.js';
import { validateTask } from '../../../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Task routes
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.post('/', validateTask, createTask);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Get tasks by project
router.get('/project/:projectId', getTasksByProject);

export default router;

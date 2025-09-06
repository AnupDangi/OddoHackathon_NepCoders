import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getProjectMembers,
  updateMemberRole
} from '../../../controllers/projectController.js';
import { authenticateToken } from '../../../middlewares/auth.js';
import { validateProject } from '../../../middlewares/validation.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Project routes
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', validateProject, createProject);
router.put('/:id', validateProject, updateProject);
router.delete('/:id', deleteProject);

// Member management routes
router.post('/:id/members', addMember);
router.get('/:id/members', getProjectMembers);
router.put('/:id/members/:userId', updateMemberRole);
router.delete('/:id/members/:userId', removeMember);

// API Documentation
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0',
    description: 'Project management endpoints',
    endpoints: {
      'GET /': 'Get all user projects',
      'GET /:id': 'Get project by ID',
      'POST /': 'Create new project',
      'PUT /:id': 'Update project (owner/manager only)',
      'DELETE /:id': 'Delete project (owner only)',
      'POST /:id/members': 'Add member to project',
      'DELETE /:id/members/:userId': 'Remove member from project'
    },
    examples: {
      createProject: {
        method: 'POST',
        url: '/api/v1/projects',
        headers: {
          'Authorization': 'Bearer your-jwt-token',
          'Content-Type': 'application/json'
        },
        body: {
          name: 'My Project',
          description: 'Project description',
          deadline: '2024-12-31',
          priority: 'High',
          tags: ['web', 'react']
        }
      }
    }
  });
});

export default router;

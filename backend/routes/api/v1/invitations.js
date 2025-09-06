import express from 'express';
import {
  sendInvitation,
  acceptInvitation,
  declineInvitation,
  getProjectInvitations,
  cancelInvitation
} from '../../../controllers/invitationController.js';
import { authenticateToken } from '../../../middlewares/auth.js';

const router = express.Router();

// All routes require authentication except decline (can be anonymous)
router.use(authenticateToken);

// Invitation management routes
router.post('/projects/:projectId/invite', sendInvitation);
router.get('/projects/:projectId/invitations', getProjectInvitations);
router.delete('/projects/:projectId/invitations/:invitationId', cancelInvitation);

// Invitation response routes
router.put('/:token/accept', acceptInvitation);
router.put('/:token/decline', declineInvitation);

// API Documentation
router.get('/docs', (req, res) => {
  res.json({
    version: '1.0',
    description: 'Project invitation management endpoints',
    endpoints: {
      'POST /projects/:projectId/invite': 'Send invitation to user by email',
      'GET /projects/:projectId/invitations': 'Get project invitations (managers only)',
      'DELETE /projects/:projectId/invitations/:invitationId': 'Cancel invitation',
      'PUT /:token/accept': 'Accept invitation using token',
      'PUT /:token/decline': 'Decline invitation using token'
    },
    examples: {
      sendInvitation: {
        method: 'POST',
        url: '/api/v1/invitations/projects/123e4567-e89b-12d3-a456-426614174000/invite',
        headers: {
          'Authorization': 'Bearer your-jwt-token',
          'Content-Type': 'application/json'
        },
        body: {
          email: 'user@example.com',
          role: 'member'
        }
      },
      acceptInvitation: {
        method: 'PUT',
        url: '/api/v1/invitations/abc123def456/accept',
        headers: {
          'Authorization': 'Bearer your-jwt-token'
        }
      }
    }
  });
});

export default router;

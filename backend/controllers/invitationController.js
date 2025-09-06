import { supabaseAdmin } from '../config/supabase.js';
import { emailTemplates, sendEmail } from '../config/supabase.js';

// Send project invitation
export const sendInvitation = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { email, role = 'member' } = req.body;
    const inviterId = req.user.id;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: true,
        message: 'Invalid email format'
      });
    }

    // Check if user is authorized to invite (project manager or manager role)
    const { data: authCheck } = await supabaseAdmin
      .from('projects')
      .select(`
        id, name, project_manager,
        project_members!inner(user_id, role)
      `)
      .eq('id', projectId)
      .or(`project_manager.eq.${inviterId},and(project_members.user_id.eq.${inviterId},project_members.role.eq.manager)`)
      .single();

    if (!authCheck) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to invite members to this project'
      });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('user_id')
      .eq('project_id', projectId)
      .eq('profiles.email', email)
      .single();

    if (existingMember) {
      return res.status(400).json({
        error: true,
        message: 'User is already a member of this project'
      });
    }

    // Check if there's already a pending invitation
    const { data: existingInvitation } = await supabaseAdmin
      .from('project_invitations')
      .select('id, status')
      .eq('project_id', projectId)
      .eq('invitee_email', email)
      .eq('status', 'pending')
      .single();

    if (existingInvitation) {
      return res.status(400).json({
        error: true,
        message: 'An invitation is already pending for this email'
      });
    }

    // Check if invitee exists in the system
    const { data: inviteeProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name')
      .eq('email', email)
      .single();

    // Create invitation record
    const { data: invitation, error: invitationError } = await supabaseAdmin
      .from('project_invitations')
      .insert({
        project_id: projectId,
        inviter_id: inviterId,
        invitee_email: email,
        invitee_id: inviteeProfile?.id || null,
        role: role,
        status: 'pending'
      })
      .select(`
        *,
        projects(name),
        inviter:profiles!inviter_id(first_name, last_name)
      `)
      .single();

    if (invitationError) {
      console.error('Invitation creation error:', invitationError);
      return res.status(400).json({
        error: true,
        message: invitationError.message
      });
    }

    // Send email invitation
    const inviterName = `${invitation.inviter.first_name} ${invitation.inviter.last_name}`;
    const projectName = invitation.projects.name;
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const acceptLink = `${baseUrl}/invitations/${invitation.invitation_token}/accept`;
    const declineLink = `${baseUrl}/invitations/${invitation.invitation_token}/decline`;

    const emailTemplate = emailTemplates.projectInvitation(
      inviterName,
      projectName,
      acceptLink,
      declineLink
    );

    const emailResult = await sendEmail(email, emailTemplate);

    if (!emailResult.success) {
      // Log email error but don't fail the invitation
      console.error('Failed to send invitation email:', emailResult.error);
    }

    res.status(201).json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        id: invitation.id,
        email: invitation.invitee_email,
        role: invitation.role,
        status: invitation.status,
        expires_at: invitation.expires_at,
        email_sent: emailResult.success
      }
    });
  } catch (error) {
    next(error);
  }
};

// Accept invitation
export const acceptInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userId = req.user.id;
    const userEmail = req.user.email;

    // Find the invitation
    const { data: invitation, error: findError } = await supabaseAdmin
      .from('project_invitations')
      .select(`
        *,
        projects(id, name),
        inviter:profiles!inviter_id(first_name, last_name)
      `)
      .eq('invitation_token', token)
      .eq('invitee_email', userEmail)
      .eq('status', 'pending')
      .single();

    if (findError || !invitation) {
      return res.status(404).json({
        error: true,
        message: 'Invalid or expired invitation'
      });
    }

    // Check if invitation has expired
    if (new Date() > new Date(invitation.expires_at)) {
      // Update status to expired
      await supabaseAdmin
        .from('project_invitations')
        .update({ status: 'expired' })
        .eq('id', invitation.id);

      return res.status(400).json({
        error: true,
        message: 'This invitation has expired'
      });
    }

    // Check if user is already a member
    const { data: existingMember } = await supabaseAdmin
      .from('project_members')
      .select('user_id')
      .eq('project_id', invitation.project_id)
      .eq('user_id', userId)
      .single();

    if (existingMember) {
      // Update invitation status
      await supabaseAdmin
        .from('project_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitation.id);

      return res.status(400).json({
        error: true,
        message: 'You are already a member of this project'
      });
    }

    // Add user to project members
    const { error: memberError } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: invitation.project_id,
        user_id: userId,
        role: invitation.role
      });

    if (memberError) {
      console.error('Error adding member:', memberError);
      return res.status(400).json({
        error: true,
        message: 'Failed to add you to the project'
      });
    }

    // Update invitation status
    const { error: updateError } = await supabaseAdmin
      .from('project_invitations')
      .update({ 
        status: 'accepted',
        invitee_id: userId 
      })
      .eq('id', invitation.id);

    if (updateError) {
      console.error('Error updating invitation:', updateError);
    }

    res.json({
      success: true,
      message: `Successfully joined project "${invitation.projects.name}"`,
      data: {
        project_id: invitation.project_id,
        project_name: invitation.projects.name,
        role: invitation.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Decline invitation
export const declineInvitation = async (req, res, next) => {
  try {
    const { token } = req.params;
    const userEmail = req.user?.email || req.body.email; // Allow anonymous decline

    // Find and update the invitation
    const { data: invitation, error: updateError } = await supabaseAdmin
      .from('project_invitations')
      .update({ status: 'declined' })
      .eq('invitation_token', token)
      .eq('invitee_email', userEmail)
      .eq('status', 'pending')
      .select('projects(name)')
      .single();

    if (updateError || !invitation) {
      return res.status(404).json({
        error: true,
        message: 'Invalid invitation or already processed'
      });
    }

    res.json({
      success: true,
      message: `Invitation to "${invitation.projects.name}" declined`
    });
  } catch (error) {
    next(error);
  }
};

// Get project invitations (for project managers)
export const getProjectInvitations = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user has permission to view invitations
    const { data: authCheck } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        project_members!inner(user_id, role)
      `)
      .eq('id', projectId)
      .or(`project_manager.eq.${userId},and(project_members.user_id.eq.${userId},project_members.role.eq.manager)`)
      .single();

    if (!authCheck) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view invitations for this project'
      });
    }

    const { data: invitations, error } = await supabaseAdmin
      .from('project_invitations')
      .select(`
        id,
        invitee_email,
        role,
        status,
        created_at,
        expires_at,
        inviter:profiles!inviter_id(first_name, last_name),
        invitee:profiles!invitee_id(first_name, last_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching invitations:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      data: invitations || []
    });
  } catch (error) {
    next(error);
  }
};

// Cancel invitation (for project managers)
export const cancelInvitation = async (req, res, next) => {
  try {
    const { projectId, invitationId } = req.params;
    const userId = req.user.id;

    // Check if user has permission to cancel invitations
    const { data: authCheck } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        project_members!inner(user_id, role)
      `)
      .eq('id', projectId)
      .or(`project_manager.eq.${userId},and(project_members.user_id.eq.${userId},project_members.role.eq.manager)`)
      .single();

    if (!authCheck) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to cancel invitations'
      });
    }

    const { error } = await supabaseAdmin
      .from('project_invitations')
      .delete()
      .eq('id', invitationId)
      .eq('project_id', projectId)
      .eq('status', 'pending');

    if (error) {
      console.error('Error canceling invitation:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Invitation canceled successfully'
    });
  } catch (error) {
    next(error);
  }
};

import { supabaseAdmin } from '../config/supabase.js';

// Get all projects for the user
export const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        project_members!inner(
          role,
          user_id,
          profiles(first_name, last_name)
        ),
        tasks(
          id,
          status
        )
      `)
      .eq('project_members.user_id', userId);

    if (error) {
      console.error('Projects fetch error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    // Add task statistics
    const projectsWithStats = (data || []).map(project => ({
      ...project,
      stats: {
        totalTasks: project.tasks?.length || 0,
        todoTasks: project.tasks?.filter(t => t.status === 'To-Do').length || 0,
        inProgressTasks: project.tasks?.filter(t => t.status === 'In Progress').length || 0,
        doneTasks: project.tasks?.filter(t => t.status === 'Done').length || 0
      }
    }));

    res.json({
      success: true,
      data: projectsWithStats
    });
  } catch (error) {
    next(error);
  }
};

// Get single project by ID
export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user has access to this project
    const { data: membership, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', userId)
      .single();

    if (memberError || !membership) {
      return res.status(403).json({
        error: true,
        message: 'Access denied to this project'
      });
    }

    const { data: project, error } = await supabaseAdmin
      .from('projects')
      .select(`
        *,
        project_members(
          role,
          user_id,
          profiles(first_name, last_name)
        ),
        tasks(
          *,
          assignee_profile:profiles(first_name, last_name)
        )
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        error: true,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: {
        ...project,
        userRole: membership.role
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create new project
export const createProject = async (req, res, next) => {
  try {
    const { name, description, deadline, priority, tags, image } = req.body;
    const userId = req.user.id;

    // Create project
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .insert({
        name,
        description,
        deadline,
        priority: priority || 'Medium',
        tags: tags || [],
        image,
        project_manager: userId
      })
      .select()
      .single();

    if (projectError) {
      console.error('Project creation error:', projectError);
      return res.status(400).json({
        error: true,
        message: projectError.message
      });
    }

    // Add creator as project member with manager role
    const { error: memberError } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: project.id,
        user_id: userId,
        role: 'manager'
      });

    if (memberError) {
      console.error('Error adding project creator as member:', memberError);
    }

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    next(error);
  }
};

// Update project
export const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, deadline, priority, tags, image } = req.body;

    // Check if user is project manager or has manager role
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('project_manager')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({
        error: true,
        message: 'Project not found'
      });
    }

    // Check if user is project manager OR has manager role in project_members
    const { data: membership } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', userId)
      .single();

    const isProjectManager = project.project_manager === userId;
    const hasManagerRole = membership?.role === 'manager';

    if (!isProjectManager && !hasManagerRole) {
      return res.status(403).json({
        error: true,
        message: 'Only project managers can update projects'
      });
    }

    const { data: updatedProject, error } = await supabaseAdmin
      .from('projects')
      .update({
        name,
        description,
        deadline,
        priority,
        tags,
        image
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: updatedProject
    });
  } catch (error) {
    next(error);
  }
};

// Delete project
export const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if user is project manager
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('project_manager')
      .eq('id', id)
      .single();

    if (projectError || !project) {
      return res.status(404).json({
        error: true,
        message: 'Project not found'
      });
    }

    if (project.project_manager !== userId) {
      return res.status(403).json({
        error: true,
        message: 'Only project managers can delete projects'
      });
    }

    const { error } = await supabaseAdmin
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Add member to project
export const addMember = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { userId: newMemberId, role = 'member' } = req.body;
    const currentUserId = req.user.id;

    // Check if current user is project manager or has manager role
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('project_manager')
      .eq('id', id)
      .single();

    const { data: membership } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', currentUserId)
      .single();

    const isProjectManager = project?.project_manager === currentUserId;
    const hasManagerRole = membership?.role === 'manager';

    if (!isProjectManager && !hasManagerRole) {
      return res.status(403).json({
        error: true,
        message: 'Only project managers can add members'
      });
    }

    // Add new member
    const { data, error } = await supabaseAdmin
      .from('project_members')
      .insert({
        project_id: id,
        user_id: newMemberId,
        role
      })
      .select(`
        *,
        profiles(first_name, last_name)
      `)
      .single();

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Member added successfully',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Remove member from project
export const removeMember = async (req, res, next) => {
  try {
    const { id, userId: targetUserId } = req.params;
    const currentUserId = req.user.id;

    // Check if current user is project manager or has manager role
    const { data: project } = await supabaseAdmin
      .from('projects')
      .select('project_manager')
      .eq('id', id)
      .single();

    const { data: membership } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', id)
      .eq('user_id', currentUserId)
      .single();

    const isProjectManager = project?.project_manager === currentUserId;
    const hasManagerRole = membership?.role === 'manager';

    if (!isProjectManager && !hasManagerRole) {
      return res.status(403).json({
        error: true,
        message: 'Only project managers can remove members'
      });
    }

    // Cannot remove project manager
    if (project && project.project_manager === targetUserId) {
      return res.status(400).json({
        error: true,
        message: 'Cannot remove project manager'
      });
    }

    const { error } = await supabaseAdmin
      .from('project_members')
      .delete()
      .eq('project_id', id)
      .eq('user_id', targetUserId);

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Member removed successfully'
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember
};

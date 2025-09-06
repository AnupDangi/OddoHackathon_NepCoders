import { supabaseAdmin } from '../config/supabase.js';

// Get all tasks for the user
export const getTasks = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        projects(name, project_manager),
        assignee_profile:profiles(first_name, last_name)
      `)
      .eq('assignee', userId);

    if (error) {
      console.error('Tasks fetch error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    next(error);
  }
};

// Get single task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const { data: task, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        projects(
          name,
          project_manager,
          project_members!inner(user_id, role)
        ),
        assignee_profile:profiles(first_name, last_name)
      `)
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        error: true,
        message: 'Task not found'
      });
    }

    // Check if user has access to this task (is assignee or project member)
    const isAssignee = task.assignee === userId;
    const isProjectMember = task.projects?.project_members?.some(member => member.user_id === userId);
    
    if (!isAssignee && !isProjectMember) {
      return res.status(403).json({
        error: true,
        message: 'Access denied to this task'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Create new task
export const createTask = async (req, res, next) => {
  try {
    const { project_id, name, description, assignee, deadline, tags, image, status } = req.body;
    const userId = req.user.id;

    // Check if user has access to the project
    const { data: membership, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', project_id)
      .eq('user_id', userId)
      .single();

    if (memberError || !membership) {
      return res.status(403).json({
        error: true,
        message: 'Access denied to this project'
      });
    }

    // Create task
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .insert({
        project_id,
        name,
        description,
        assignee: assignee || userId, // Default to current user if no assignee specified
        deadline,
        tags: tags || [],
        image,
        status: status || 'To-Do'
      })
      .select(`
        *,
        projects(name),
        assignee_profile:profiles(first_name, last_name)
      `)
      .single();

    if (taskError) {
      console.error('Task creation error:', taskError);
      return res.status(400).json({
        error: true,
        message: taskError.message
      });
    }

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, assignee, deadline, tags, image, status } = req.body;

    // Get task and check permissions
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        projects(
          project_manager,
          project_members(user_id, role)
        )
      `)
      .eq('id', id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({
        error: true,
        message: 'Task not found'
      });
    }

    // Check if user can update this task
    const isAssignee = task.assignee === userId;
    const isProjectManager = task.projects?.project_manager === userId;
    const hasManagerRole = task.projects?.project_members?.some(
      member => member.user_id === userId && member.role === 'manager'
    );

    if (!isAssignee && !isProjectManager && !hasManagerRole) {
      return res.status(403).json({
        error: true,
        message: 'You can only update tasks assigned to you or tasks in projects you manage'
      });
    }

    const { data: updatedTask, error } = await supabaseAdmin
      .from('tasks')
      .update({
        name,
        description,
        assignee,
        deadline,
        tags,
        image,
        status
      })
      .eq('id', id)
      .select(`
        *,
        projects(name),
        assignee_profile:profiles(first_name, last_name)
      `)
      .single();

    if (error) {
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get task and check permissions
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        projects(
          project_manager,
          project_members(user_id, role)
        )
      `)
      .eq('id', id)
      .single();

    if (taskError || !task) {
      return res.status(404).json({
        error: true,
        message: 'Task not found'
      });
    }

    // Only project manager or members with manager role can delete tasks
    const isProjectManager = task.projects?.project_manager === userId;
    const hasManagerRole = task.projects?.project_members?.some(
      member => member.user_id === userId && member.role === 'manager'
    );

    if (!isProjectManager && !hasManagerRole) {
      return res.status(403).json({
        error: true,
        message: 'Only project managers can delete tasks'
      });
    }

    const { error } = await supabaseAdmin
      .from('tasks')
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
      message: 'Task deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get tasks by project ID
export const getTasksByProject = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Check if user has access to this project
    const { data: membership, error: memberError } = await supabaseAdmin
      .from('project_members')
      .select('role')
      .eq('project_id', projectId)
      .eq('user_id', userId)
      .single();

    if (memberError || !membership) {
      return res.status(403).json({
        error: true,
        message: 'Access denied to this project'
      });
    }

    const { data, error } = await supabaseAdmin
      .from('tasks')
      .select(`
        *,
        assignee_profile:profiles(first_name, last_name)
      `)
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Project tasks fetch error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data || []
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject
};

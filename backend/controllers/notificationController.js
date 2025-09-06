import { supabaseAdmin } from '../config/supabase.js';

// Get all notifications for the user
export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { 
      limit = 20, 
      offset = 0, 
      unread_only = false,
      type 
    } = req.query;

    let query = supabaseAdmin
      .from('notifications')
      .select(`
        *,
        projects(name, image),
        tasks(name)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);

    // Filter by read status if requested
    if (unread_only === 'true') {
      query = query.eq('is_read', false);
    }

    // Filter by notification type if specified
    if (type) {
      query = query.eq('type', type);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Notifications fetch error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      data: data || [],
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        total: data?.length || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get unread notification count
export const getUnreadCount = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { count, error } = await supabaseAdmin
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('is_read', false);

    if (error) {
      console.error('Unread count error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      data: {
        unread_count: count || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Mark notification as read
export const markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Mark as read error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: true,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification marked as read',
      data
    });
  } catch (error) {
    next(error);
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
      .select('id');

    if (error) {
      console.error('Mark all as read error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'All notifications marked as read',
      data: {
        updated_count: data?.length || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete notification
export const deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Delete notification error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    if (!data) {
      return res.status(404).json({
        error: true,
        message: 'Notification not found'
      });
    }

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Delete all read notifications
export const deleteReadNotifications = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .delete()
      .eq('user_id', userId)
      .eq('is_read', true)
      .select('id');

    if (error) {
      console.error('Delete read notifications error:', error);
      return res.status(400).json({
        error: true,
        message: error.message
      });
    }

    res.json({
      success: true,
      message: 'Read notifications deleted successfully',
      data: {
        deleted_count: data?.length || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create notification utility function
export const createNotification = async (notificationData) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: notificationData.user_id,
        project_id: notificationData.project_id || null,
        task_id: notificationData.task_id || null, // Fixed: task_id not task
        type: notificationData.type,
        message: notificationData.message
      })
      .select()
      .single();

    if (error) {
      console.error('Notification creation error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Notification utility error:', error);
    return null;
  }
};

// Bulk create notifications (for multiple users)
export const createBulkNotifications = async (notifications) => {
  try {
    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert(notifications)
      .select();

    if (error) {
      console.error('Bulk create notifications error:', error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Bulk notification creation failed:', error);
    throw error;
  }
};

// Notification helper functions for common scenarios
export const notificationHelpers = {
  // Task assigned notification
  taskAssigned: (userId, projectId, taskId, taskName, assignedBy, projectName) => ({
    user_id: userId,
    project_id: projectId,
    task_id: taskId,
    type: 'task_assigned',
    title: 'New Task Assigned',
    message: `You have been assigned to task: ${taskName}`,
    metadata: {
      task_name: taskName,
      project_name: projectName,
      assigned_by: assignedBy
    }
  }),

  // Project invitation notification
  projectInvitation: (userId, projectId, projectName, invitedBy, role) => ({
    user_id: userId,
    project_id: projectId,
    type: 'project_invitation',
    title: 'Project Invitation',
    message: `You have been added to project: ${projectName}`,
    metadata: {
      project_name: projectName,
      invited_by: invitedBy,
      role: role
    }
  }),

  // Task status changed notification
  taskStatusChanged: (userId, projectId, taskId, taskName, oldStatus, newStatus, changedBy) => ({
    user_id: userId,
    project_id: projectId,
    task_id: taskId,
    type: 'task_status_changed',
    title: 'Task Status Updated',
    message: `Task "${taskName}" status changed from ${oldStatus} to ${newStatus}`,
    metadata: {
      task_name: taskName,
      old_status: oldStatus,
      new_status: newStatus,
      changed_by: changedBy
    }
  }),

  // Project update notification
  projectUpdate: (userId, projectId, projectName, updatedBy, changes) => ({
    user_id: userId,
    project_id: projectId,
    type: 'project_update',
    title: 'Project Updated',
    message: `Project "${projectName}" has been updated`,
    metadata: {
      project_name: projectName,
      updated_by: updatedBy,
      changes: changes
    }
  }),

  // Deadline reminder notification
  deadlineReminder: (userId, projectId, taskId, name, type, deadline) => ({
    user_id: userId,
    project_id: projectId,
    task_id: taskId,
    type: 'deadline_reminder',
    title: 'Deadline Reminder',
    message: `${type === 'task' ? 'Task' : 'Project'} "${name}" deadline is approaching (${deadline})`,
    metadata: {
      name: name,
      type: type,
      deadline: deadline
    }
  })
};

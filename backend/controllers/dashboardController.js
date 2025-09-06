import { supabaseAdmin } from '../config/supabase.js';

// Get dashboard data
export const getDashboard = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get user's projects
    const { data: projects, error: projectsError } = await supabaseAdmin
      .from('projects')
      .select(`
        id,
        name,
        priority,
        deadline,
        created_at,
        project_members!inner(role),
        tasks(id, status)
      `)
      .eq('project_members.user_id', userId);

    if (projectsError) {
      console.error('Dashboard projects fetch error:', projectsError);
      return res.status(400).json({
        error: true,
        message: projectsError.message
      });
    }

    // Get user's tasks
    const { data: tasks, error: tasksError } = await supabaseAdmin
      .from('tasks')
      .select(`
        id,
        name,
        status,
        deadline,
        created_at,
        projects(id, name)
      `)
      .eq('assignee', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (tasksError) {
      console.error('Dashboard tasks fetch error:', tasksError);
      return res.status(400).json({
        error: true,
        message: tasksError.message
      });
    }

    // Calculate statistics
    const projectsWithStats = (projects || []).map(project => ({
      ...project,
      stats: {
        totalTasks: project.tasks?.length || 0,
        todoTasks: project.tasks?.filter(t => t.status === 'To-Do').length || 0,
        inProgressTasks: project.tasks?.filter(t => t.status === 'In Progress').length || 0,
        doneTasks: project.tasks?.filter(t => t.status === 'Done').length || 0
      }
    }));

    const stats = {
      totalProjects: projects?.length || 0,
      totalTasks: tasks?.length || 0,
      todoTasks: tasks?.filter(t => t.status === 'To-Do').length || 0,
      inProgressTasks: tasks?.filter(t => t.status === 'In Progress').length || 0,
      doneTasks: tasks?.filter(t => t.status === 'Done').length || 0,
      overdueTasks: tasks?.filter(t => 
        t.deadline && new Date(t.deadline) < new Date() && t.status !== 'Done'
      ).length || 0
    };

    // Get recent activity (last 5 projects and tasks)
    const recentProjects = projectsWithStats.slice(0, 5);
    const recentTasks = tasks?.slice(0, 5) || [];

    res.json({
      success: true,
      data: {
        stats,
        recentProjects,
        recentTasks,
        projects: projectsWithStats
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
export const getStats = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Get project count where user is a member
    const { count: projectCount, error: projectError } = await supabaseAdmin
      .from('project_members')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (projectError) {
      console.error('Project count error:', projectError);
    }

    // Get task statistics
    const { data: taskStats, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select('status')
      .eq('assignee', userId);

    if (taskError) {
      console.error('Task stats error:', taskError);
    }

    // Calculate task breakdown
    const taskBreakdown = {
      total: taskStats?.length || 0,
      todo: taskStats?.filter(t => t.status === 'To-Do').length || 0,
      inProgress: taskStats?.filter(t => t.status === 'In Progress').length || 0,
      done: taskStats?.filter(t => t.status === 'Done').length || 0
    };

    res.json({
      success: true,
      data: {
        projectCount: projectCount || 0,
        taskBreakdown,
        completionRate: taskBreakdown.total > 0 
          ? Math.round((taskBreakdown.done / taskBreakdown.total) * 100) 
          : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getDashboard,
  getStats
};

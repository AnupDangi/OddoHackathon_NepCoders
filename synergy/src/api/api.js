const API_BASE_URL = 'http://localhost:5000/api/v1';

// API utility functions
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = localStorage.getItem('access_token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
};

// Authentication API functions
export const authAPI = {
  // User signup
  signup: async (userData) => {
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // User login
  login: async (credentials) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Get current user
  getCurrentUser: async () => {
    return apiRequest('/auth/me');
  },

  // Logout
  logout: async () => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },
};

// Projects API functions
export const projectsAPI = {
  // Get all projects
  getAll: async () => {
    return apiRequest('/projects/');
  },

  // Create new project
  create: async (projectData) => {
    return apiRequest('/projects/', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  // Get project by ID
  getById: async (id) => {
    return apiRequest(`/projects/${id}`);
  },

  // Update project
  update: async (id, projectData) => {
    return apiRequest(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(projectData),
    });
  },

  // Delete project
  delete: async (id) => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tasks API functions
export const tasksAPI = {
  // Get all user tasks
  getAll: async () => {
    return apiRequest('/tasks/');
  },

  // Create new task
  create: async (taskData) => {
    return apiRequest('/tasks/', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Get tasks by project
  getByProject: async (projectId) => {
    return apiRequest(`/tasks/project/${projectId}`);
  },

  // Get task by ID
  getById: async (id) => {
    return apiRequest(`/tasks/${id}`);
  },

  // Update task
  update: async (id, taskData) => {
    return apiRequest(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  },

  // Delete task
  delete: async (id) => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Users API functions
export const usersAPI = {
  // Get user profile
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  // Update user profile
  updateProfile: async (userData) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Get all users
  getAll: async (search = '') => {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/users/all${queryParam}`);
  },
};

// Dashboard API functions
export const dashboardAPI = {
  // Get dashboard data
  getData: async () => {
    return apiRequest('/dashboard/');
  },

  // Get dashboard statistics
  getStats: async () => {
    return apiRequest('/dashboard/stats');
  },
};

// Notifications API functions
export const notificationsAPI = {
  // Get all notifications
  getAll: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const endpoint = queryParams ? `/notifications/?${queryParams}` : '/notifications/';
    return apiRequest(endpoint);
  },

  // Get unread count
  getUnreadCount: async () => {
    return apiRequest('/notifications/unread-count');
  },

  // Mark as read
  markAsRead: async (id) => {
    return apiRequest(`/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  // Mark all as read
  markAllAsRead: async () => {
    return apiRequest('/notifications/read-all', {
      method: 'PUT',
    });
  },

  // Delete notification
  delete: async (id) => {
    return apiRequest(`/notifications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Project Members API functions
export const membersAPI = {
  // Get project members
  getProjectMembers: async (projectId) => {
    return apiRequest(`/projects/${projectId}/members`);
  },

  // Add member to project (direct - not via invitation)
  addMember: async (projectId, memberData) => {
    return apiRequest(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Update member role
  updateMemberRole: async (projectId, userId, role) => {
    return apiRequest(`/projects/${projectId}/members/${userId}`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },

  // Remove member from project
  removeMember: async (projectId, userId) => {
    return apiRequest(`/projects/${projectId}/members/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Invitations API functions
export const invitationsAPI = {
  // Send invitation
  sendInvitation: async (projectId, invitationData) => {
    return apiRequest(`/invitations/projects/${projectId}/invite`, {
      method: 'POST',
      body: JSON.stringify(invitationData),
    });
  },

  // Get project invitations
  getProjectInvitations: async (projectId) => {
    return apiRequest(`/invitations/projects/${projectId}/invitations`);
  },

  // Cancel invitation
  cancelInvitation: async (projectId, invitationId) => {
    return apiRequest(`/invitations/projects/${projectId}/invitations/${invitationId}`, {
      method: 'DELETE',
    });
  },

  // Accept invitation
  acceptInvitation: async (token) => {
    return apiRequest(`/invitations/${token}/accept`, {
      method: 'PUT',
    });
  },

  // Decline invitation
  declineInvitation: async (token) => {
    return apiRequest(`/invitations/${token}/decline`, {
      method: 'PUT',
    });
  },
};

// Enhanced Users API functions
export const enhancedUsersAPI = {
  // Search users by email
  searchByEmail: async (email) => {
    return apiRequest(`/users/search?email=${encodeURIComponent(email)}`);
  },

  // Get user by ID
  getUserById: async (userId) => {
    return apiRequest(`/users/${userId}`);
  },

  // Get all users with search
  getAll: async (search = '') => {
    const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiRequest(`/users/all${queryParam}`);
  },
};
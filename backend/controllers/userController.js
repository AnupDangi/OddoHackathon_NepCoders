import { supabaseAdmin } from '../config/supabase.js';

// Get user profile
export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      return res.status(404).json({
        error: true,
        message: 'Profile not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: req.user,
        profile
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { first_name, last_name, avatar_url } = req.body;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        first_name,
        last_name,
        avatar_url
      })
      .eq('id', userId)
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
      message: 'Profile updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (for project member assignment)
export const getAllUsers = async (req, res, next) => {
  try {
    const { search } = req.query;
    
    let query = supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .order('first_name');

    // Add search filter if provided
    if (search) {
      query = query.or(`first_name.ilike.%${search}%,last_name.ilike.%${search}%`);
    }

    const { data, error } = await query.limit(50);

    if (error) {
      console.error('Users fetch error:', error);
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

// Search users by email (for invitations)
export const searchUsersByEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({
        error: true,
        message: 'Email query parameter is required'
      });
    }

    // Search in auth.users for email (since profiles don't store email)
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
    
    if (authError) {
      console.error('Auth users fetch error:', authError);
      return res.status(400).json({
        error: true,
        message: 'Failed to search users'
      });
    }

    // Filter users by email
    const matchingUsers = authUsers.users.filter(user => 
      user.email.toLowerCase().includes(email.toLowerCase())
    );

    // Get profiles for matching users
    const userIds = matchingUsers.map(user => user.id);
    
    if (userIds.length === 0) {
      return res.json({
        success: true,
        data: []
      });
    }

    const { data: profiles, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', userIds);

    if (profileError) {
      console.error('Profiles fetch error:', profileError);
      return res.status(400).json({
        error: true,
        message: profileError.message
      });
    }

    // Combine auth and profile data
    const combinedData = matchingUsers.map(authUser => {
      const profile = profiles.find(p => p.id === authUser.id);
      return {
        id: authUser.id,
        email: authUser.email,
        first_name: profile?.first_name || '',
        last_name: profile?.last_name || '',
        avatar_url: profile?.avatar_url || null,
        full_name: profile ? `${profile.first_name} ${profile.last_name}` : authUser.email
      };
    });

    res.json({
      success: true,
      data: combinedData
    });
  } catch (error) {
    next(error);
  }
};

// Get user profile by ID (for displaying member info)
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const { data: profile, error } = await supabaseAdmin
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({
        error: true,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// Upload avatar (placeholder - actual implementation would handle file upload)
export const uploadAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { avatar_url } = req.body;

    const { data: updatedProfile, error } = await supabaseAdmin
      .from('profiles')
      .update({
        avatar_url
      })
      .eq('id', userId)
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
      message: 'Avatar updated successfully',
      data: updatedProfile
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getProfile,
  updateProfile,
  getAllUsers,
  searchUsersByEmail,
  getUserById,
  uploadAvatar
};

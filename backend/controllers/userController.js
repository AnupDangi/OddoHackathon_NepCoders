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
      .select('id, first_name, last_name')
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
  uploadAvatar
};

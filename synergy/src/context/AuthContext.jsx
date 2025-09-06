import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../api/api';

// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setLoading(false);
        return;
      }

      // Verify token with backend
      const response = await authAPI.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        // Invalid token, remove it
        localStorage.removeItem('access_token');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Remove invalid token
      localStorage.removeItem('access_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.login({ email, password });
      
      if (response.success && response.data) {
        const { access_token, user: userData, profile } = response.data;
        
        // Store token in localStorage
        localStorage.setItem('access_token', access_token);
        
        // Combine user data with profile
        const combinedUserData = {
          ...userData,
          ...profile,
          first_name: profile?.first_name || userData.user_metadata?.first_name,
          last_name: profile?.last_name || userData.user_metadata?.last_name
        };
        
        // Set user data
        setUser(combinedUserData);
        
        return response;
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      setError(error.message);
      // Clear any invalid tokens
      localStorage.removeItem('access_token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (email, password, firstName, lastName) => {
    try {
      setError(null);
      setLoading(true);

      const response = await authAPI.signup({
        email,
        password,
        firstName,
        lastName,
      });

      if (response.success && response.data) {
        const { access_token, user: userData, profile } = response.data;
        
        // Store token in localStorage
        if (access_token) {
          localStorage.setItem('access_token', access_token);
          
          // Combine user data with profile
          const combinedUserData = {
            ...userData,
            ...profile,
            first_name: profile?.first_name || userData.user_metadata?.first_name || firstName,
            last_name: profile?.last_name || userData.user_metadata?.last_name || lastName
          };
          
          // Set user data
          setUser(combinedUserData);
        }
        
        return response;
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      setError(error.message);
      // Clear any invalid tokens
      localStorage.removeItem('access_token');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API (optional, depending on backend implementation)
      try {
        await authAPI.logout();
      } catch (error) {
        // Ignore logout API errors, still proceed with local logout
        console.warn('Logout API call failed:', error);
      }
      
      // Clear local storage
      localStorage.removeItem('access_token');
      
      // Clear user state
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if API call fails
      localStorage.removeItem('access_token');
      setUser(null);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      const response = await authAPI.getCurrentUser();
      
      if (response.success && response.data) {
        setUser(response.data);
        return response;
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('access_token');
  };

  // Get current user
  const getCurrentUser = () => {
    return user;
  };

  // Clear error
  const clearError = () => {
    setError(null);
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    getCurrentUser,
    clearError,
    checkAuthStatus,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

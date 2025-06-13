"use client";

import { Form, FormResponse } from '../types/form';
import Cookies from 'js-cookie';

// API base URL - force explicit URL to ensure consistent connection
const API_URL = 'http://localhost:5000/api';

// Cookie options
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const // Change to lax for better cross-domain handling
};

/**
 * Custom fetch wrapper with automatic error handling and token inclusion
 */
async function fetchWithAuth(
  endpoint: string, 
  options: RequestInit = {}
) {
  try {
    // Get token from cookies if it exists
    const token = typeof window !== 'undefined' ? Cookies.get('formwave_token') : null;
    
    // For endpoints that require authentication, check if token exists
    if (!token && endpoint !== '/auth/login' && endpoint !== '/auth/register') {
      // For auth/me endpoint, return null user instead of throwing error
      if (endpoint === '/auth/me') {
        return { user: null };
      }
      throw new Error('Authentication required. Please log in.');
    }
    
    // Set up headers
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    };
    
    // Make the request
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: 'include' // Include cookies
    });
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return { success: true };
    }
    
    // Parse the JSON response
    const data = await response.json();
    
    // If the response is not ok, throw an error
    if (!response.ok) {
      // Special case for 401 (Unauthorized) - clear token
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          Cookies.remove('formwave_token');
        }
      }
      
      // Map common error messages to user-friendly ones
      const errorMessage = mapErrorMessage(data.error || `HTTP error! Status: ${response.status}`, response.status);
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Map backend error messages to user-friendly messages
 */
function mapErrorMessage(error: string, status?: number): string {
  // Common authentication errors
  if (error.toLowerCase().includes('invalid login credentials') || 
      error.toLowerCase().includes('invalid email or password') ||
      status === 401) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  
  if (error.toLowerCase().includes('user already exists') || 
      error.toLowerCase().includes('email already in use')) {
    return 'An account with this email already exists. Please try logging in instead.';
  }
  
  if (error.toLowerCase().includes('weak password')) {
    return 'Password is too weak. Please use at least 8 characters with a mix of letters and numbers.';
  }
  
  if (error.toLowerCase().includes('invalid email')) {
    return 'Please enter a valid email address.';
  }
  
  if (error.toLowerCase().includes('network') || error.toLowerCase().includes('fetch')) {
    return 'Connection error. Please check your internet connection and try again.';
  }
  
  if (status === 500) {
    return 'Server error. Please try again later or contact support if the problem persists.';
  }
  
  if (status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  // Return original error if no mapping found, but make it more user-friendly
  return error || 'An unexpected error occurred. Please try again.';
}

/**
 * Authentication API
 */
export const auth = {
  /**
   * Register a new user
   */
  register: async (email: string, password: string) => {
    try {
      const data = await fetchWithAuth('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Store token if available
      if (data.token) {
        Cookies.set('formwave_token', data.token, COOKIE_OPTIONS);
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  /**
   * Login a user
   */
  login: async (email: string, password: string) => {
    try {
      const data = await fetchWithAuth('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      // Store token if available
      if (data.token) {
        Cookies.set('formwave_token', data.token, COOKIE_OPTIONS);
      }
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  /**
   * Logout the current user
   */
  logout: async () => {
    try {
      await fetchWithAuth('/auth/logout', {
        method: 'POST'
      });
      
      // Clear token
      Cookies.remove('formwave_token');
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove the token even if the API call fails
      Cookies.remove('formwave_token');
      throw error;
    }
  },
  
  /**
   * Get the current user
   */
  getCurrentUser: async () => {
    try {
      if (!Cookies.get('formwave_token')) {
        return { user: null };
      }
      return await fetchWithAuth('/auth/me');
    } catch (error) {
      console.error('Get current user failed:', error);
      // If there's an error, clear token and return null
      Cookies.remove('formwave_token');
      return { user: null };
    }
  },
  
  /**
   * Request a password reset
   */
  requestPasswordReset: async (email: string) => {
    try {
      return fetchWithAuth('/auth/reset-password/request', {
        method: 'POST',
        body: JSON.stringify({ email })
      });
    } catch (error) {
      console.error('Password reset request failed:', error);
      throw error;
    }
  },
  
  /**
   * Reset password with token
   */
  resetPassword: async (password: string) => {
    try {
      return fetchWithAuth('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (updates: { name?: string; avatar?: string }) => {
    try {
      return fetchWithAuth('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  }
};

/**
 * Forms API
 */
export const forms = {
  /**
   * Get all forms for the current user
   */
  getUserForms: async () => {
    const data = await fetchWithAuth('/forms');
    return data.data as Form[];
  },
  
  /**
   * Get a form by ID
   */
  getFormById: async (formId: string) => {
    const data = await fetchWithAuth(`/forms/${formId}`);
    return data.data as Form;
  },
  
  /**
   * Create a new form
   */
  createForm: async (form: Partial<Form>) => {
    const data = await fetchWithAuth('/forms', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    return data.data as Form;
  },
  
  /**
   * Update a form
   */
  updateForm: async (formId: string, form: Partial<Form>) => {
    const data = await fetchWithAuth(`/forms/${formId}`, {
      method: 'PUT',
      body: JSON.stringify(form)
    });
    return data.data as Form;
  },
  
  /**
   * Delete a form
   */
  deleteForm: async (formId: string) => {
    await fetchWithAuth(`/forms/${formId}`, {
      method: 'DELETE'
    });
  }
};

/**
 * Responses API
 */
export const responses = {
  /**
   * Submit a response to a form
   */
  submitFormResponse: async (formId: string, responseData: Record<string, any>) => {
    const data = await fetchWithAuth(`/forms/${formId}/responses`, {
      method: 'POST',
      body: JSON.stringify(responseData)
    });
    return data.data;
  },
  
  /**
   * Get all responses for a form
   */
  getFormResponses: async (formId: string) => {
    const data = await fetchWithAuth(`/forms/${formId}/responses`);
    return data.data as FormResponse[];
  },
  
  /**
   * Get a response by ID
   */
  getResponseById: async (responseId: string) => {
    const data = await fetchWithAuth(`/responses/${responseId}`);
    return data.data as FormResponse;
  },
  
  /**
   * Delete a response
   */
  deleteResponse: async (responseId: string) => {
    await fetchWithAuth(`/responses/${responseId}`, {
      method: 'DELETE'
    });
  }
}; 
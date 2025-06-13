"use client";

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { auth } from './api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  email_verified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar?: string }) => Promise<void>;
  isEmailVerified: () => boolean;
  redirectToDashboard: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Check for user on mount and set up authentication
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Check if token exists first to avoid unnecessary API calls
        const token = Cookies.get('formwave_token');
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        const { user } = await auth.getCurrentUser();
        if (user) {
          setUser(user);
        } else {
          // If no user but token exists, clear invalid token
          Cookies.remove('formwave_token');
          setUser(null);
        }
      } catch (error) {
        console.error('Failed to load user:', error);
        // Clear invalid token
        Cookies.remove('formwave_token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, []);

  const redirectToDashboard = () => {
    // Use Next.js router for client-side navigation
    router.push('/dashboard');
  };

  const login = async (email: string, password: string, rememberMe: boolean = false) => {
    setLoading(true);
    try {
      const result = await auth.login(email, password);
      
      if (result.user) {
        setUser(result.user);
        
        // Store token with appropriate expiration based on remember me
        if (result.token) {
          const cookieOptions = {
            expires: rememberMe ? 30 : 7, // 30 days if remember me, 7 days otherwise
            path: '/',
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax' as const
          };
          
          Cookies.set('formwave_token', result.token, cookieOptions);
        }
        
        // Navigate to dashboard after successful login
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { user, token } = await auth.register(email, password);
      
      // Store the token if provided
      if (token) {
        Cookies.set('formwave_token', token, {
          expires: 7, // 7 days
          path: '/',
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax'
        });
      }
      
      setUser(user);
      
      // Don't redirect automatically - let the registration page handle this
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      // Always clear local state regardless of API response
      Cookies.remove('formwave_token');
      setUser(null);
      setLoading(false);
      
      // Redirect to login page
      router.push('/login');
    }
  };

  const updateProfile = async (updates: { name?: string; avatar?: string }) => {
    setLoading(true);
    try {
      const { user } = await auth.updateProfile(updates);
      setUser(user);
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isEmailVerified = () => {
    return user?.email_verified === true;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      register, 
      logout, 
      updateProfile,
      isEmailVerified,
      redirectToDashboard
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
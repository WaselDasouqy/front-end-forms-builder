"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        router.push(redirectTo);
      } else if (!requireAuth && user) {
        router.push('/');
      }
    }
  }, [user, loading, requireAuth, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  // If auth is required but user is not logged in, don't render children
  if (requireAuth && !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  // If auth is not required but user is logged in (for login/register pages)
  if (!requireAuth && user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <LoadingSpinner size="large" />
        <p className="mt-4 text-gray-500">Redirecting to home...</p>
      </div>
    );
  }

  return <>{children}</>;
} 
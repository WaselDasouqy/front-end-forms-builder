"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'white' | 'indigo';
  className?: string;
}

export default function LoadingSpinner({ 
  size = 'medium', 
  color = 'indigo',
  className = ''
}: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-6 h-6',
    large: 'w-8 h-8'
  };
  
  const colorClasses = {
    white: 'text-white',
    indigo: 'text-indigo-600'
  };
  
  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} border-current`} role="status">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
} 
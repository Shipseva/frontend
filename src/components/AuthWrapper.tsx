"use client";

import { useSelector } from 'react-redux';
import { useGetUserQuery } from '@/store/api/userApi';
import { RootState } from '@/store';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.user);
  
  // Call getUser API - everything is handled in the API (success, error, redirect)
  const { isLoading } = useGetUserQuery();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If authenticated, render children
  return <>{children}</>;
};

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/home',
}) => {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || !allowedRoles.includes(user.role))) {
      router.push(redirectTo);
    }
  }, [user, isLoading, allowedRoles, router, redirectTo]);

  if (isLoading) {
    return <div>Loading...</div>; // Or a proper loading component
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return null; // Or unauthorized message
  }

  return <>{children}</>;
};

export default ProtectedRoute;
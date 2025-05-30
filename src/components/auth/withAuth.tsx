import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../store/auth.store';
import { showError } from '../../utils';
import LoadingScreen from '../../features/common/components/LoadingScreen';

export const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return function WithAuthComponent(props: P) {
    const navigate = useNavigate();
    const { user, isLoading, error, fetchUser } = useAuthStore();

    useEffect(() => {
      if (!user && !isLoading) {
        fetchUser().catch(() => {
          showError('Please login to access this page');
          navigate('/login');
        });
      }
    }, [user, isLoading, fetchUser, navigate]);

    if (isLoading) {
      return <LoadingScreen message="Checking authentication..." />;
    }

    if (error) {
      return <div>Error: {error}</div>;
    }

    if (!user) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
}; 
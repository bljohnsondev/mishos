import * as React from 'react';
import { Navigate } from 'react-router-dom';

import { config } from '@/config';
import { loadUser, hasToken } from '@/lib/auth';
import { useAppStore } from '@/stores';

interface ProtectedProps {
  children: React.ReactNode;
}

export const Protected = ({ children }: ProtectedProps) => {
  const { setUser, user } = useAppStore();

  const loadCurrentUser = async () => {
    loadUser().then(loadedUser => {
      if (!loadedUser) setUser(null);
      else setUser(loadedUser);
    });
  };

  if (!hasToken || user === null) {
    return <Navigate to={config.loginUrl} />;
  }

  if (user === undefined) {
    loadCurrentUser();
    return null;
  } else {
    return children;
  }
};

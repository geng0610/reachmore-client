// src/hooks/useSetupAxiosInterceptors.ts
import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setupAxiosInterceptors } from '../services/api';

export const useSetupAxiosInterceptors = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    if (getToken) {
      setupAxiosInterceptors(getToken); // Pass the token getter function to setup the interceptors
    }
  }, [getToken]);
};

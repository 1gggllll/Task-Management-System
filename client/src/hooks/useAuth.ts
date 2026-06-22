import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store';
import { getProfile } from '../features/auth/authSlice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, token, loading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [token, user, dispatch]);

  const isAuthenticated = !!token && !!user;

  const requireAuth = () => {
    if (!isAuthenticated && !loading) {
      navigate('/login');
    }
  };

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    requireAuth
  };
};
import { lazy } from 'react';
import type { RouteObject } from 'react-router';

const AuthCallback = lazy(() => import('./auth-callback'));

export const authRoutes: RouteObject[] = [
  {
    path: '/auth/callback',
    element: <AuthCallback />,
  },
];

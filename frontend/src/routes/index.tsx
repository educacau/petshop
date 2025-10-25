import {Suspense, lazy} from 'react';
import {useRoutes} from 'react-router-dom';

import {AppLayout} from '../layouts/AppLayout';
import {PrivateRoute} from './private-route';

const DashboardPage = lazy(() => import('../pages/DashboardPage').then(mod => ({default: mod.DashboardPage})));
const LoginPage = lazy(() => import('../pages/LoginPage').then(mod => ({default: mod.LoginPage})));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(mod => ({default: mod.NotFoundPage})));
const PetsPage = lazy(() => import('../pages/PetsPage').then(mod => ({default: mod.PetsPage})));
const SchedulesPage = lazy(() => import('../pages/SchedulesPage').then(mod => ({default: mod.SchedulesPage})));
const UsersPage = lazy(() => import('../pages/UsersPage').then(mod => ({default: mod.UsersPage})));
const ReportsPage = lazy(() => import('../pages/ReportsPage').then(mod => ({default: mod.ReportsPage})));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(mod => ({default: mod.SettingsPage})));

export const AppRoutes = () => {
  const element = useRoutes([
    {path: '/login', element: <LoginPage />},
    {
      path: '/',
      element: <PrivateRoute roles={['ADMIN', 'STAFF', 'CUSTOMER']} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            {path: 'dashboard', element: <DashboardPage />},
            {path: 'schedules', element: <SchedulesPage />},
            {path: 'pets', element: <PetsPage />},
            {
              path: 'users/*',
              element: <PrivateRoute roles={['ADMIN']} redirect="/dashboard" />,
              children: [{path: '', element: <UsersPage /> }]
            },
            {
              path: 'reports/*',
              element: <PrivateRoute roles={['ADMIN']} redirect="/dashboard" />,
              children: [{path: '', element: <ReportsPage /> }]
            },
            {
              path: 'settings/*',
              element: <PrivateRoute roles={['ADMIN']} redirect="/dashboard" />,
              children: [{path: '', element: <SettingsPage /> }]
            },
            {path: '', element: <DashboardPage />}
          ]
        }
      ]
    },
    {path: '*', element: <NotFoundPage />}
  ]);

  return <Suspense fallback={<div className="p-6 text-slate-500">Carregando...</div>}>{element}</Suspense>;
};

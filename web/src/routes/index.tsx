import { useRoutes, Navigate, Outlet } from 'react-router-dom';

import { MainLayout } from '@/components/layout';
import { Login, Protected } from '@/features/auth';
import { SearchRoute } from '@/features/search';
import { ShowDetailsRoute, ShowListRoute, ShowPreviewRoute } from '@/features/shows';
import { TaskRoute } from '@/features/tasks';
import { WatchListRoute } from '@/features/watchlist';

const App = () => {
  return (
    <Protected>
      <MainLayout>
        <Outlet />
      </MainLayout>
    </Protected>
  );
};

const appRoutes = [
  { path: '/login', element: <Login /> },
  { path: '/', element: <Navigate to="/watchlist" /> },
  {
    path: '/show',
    element: <App />,
    children: [
      { path: 'list', element: <ShowListRoute /> },
      { path: 'view/:id', element: <ShowDetailsRoute /> },
      { path: 'preview/:id', element: <ShowPreviewRoute /> },
      { path: 'search/:query', element: <SearchRoute /> },
    ],
  },
  {
    path: '/watchlist',
    element: <App />,
    children: [{ path: '', element: <WatchListRoute /> }],
  },
  {
    path: '/task',
    element: <App />,
    children: [{ path: 'list', element: <TaskRoute /> }],
  },
];

export const AppRoutes = () => useRoutes(appRoutes);

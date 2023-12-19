import { BrowserRouter as Router } from 'react-router-dom';

import { ToastMessage } from '@/components/notifications/toast-message';

import { LoadingOverlay } from './components/loading-overlay';
import { AppRoutes } from './routes';
import { useAppStore } from './stores';

export const App = () => {
  const { colorScheme = 'dark' } = useAppStore();

  return (
    <div className={colorScheme}>
      <ToastMessage />
      <div className="fixed top-0 left-0 w-screen h-screen min-w-full min-h-full overflow-auto bg-neutral-200 text-neutral-800 dark:bg-black dark:text-neutral-200">
        <LoadingOverlay />
        <Router>
          <AppRoutes />
        </Router>
      </div>
    </div>
  );
};

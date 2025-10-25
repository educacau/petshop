import {useCallback, useState} from 'react';
import {Outlet} from 'react-router-dom';

import {AppShell} from '../ui/templates/AppShell';
import {AppSidebar} from '../ui/organisms/AppSidebar';
import {AppHeader} from '../ui/organisms/AppHeader';

const SIDEBAR_STORAGE_KEY = 'petshop:sidebar-collapsed';

/**
 * Bridges routing outlet with the new design system shell.
 */
export const AppLayout = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === '1';
  });

  const toggleSidebar = useCallback(() => {
    setIsSidebarCollapsed(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, next ? '1' : '0');
      }
      return next;
    });
  }, []);

  const renderSidebar = useCallback(
    (options?: {collapsed?: boolean; onNavigate?: () => void; variant?: 'desktop' | 'mobile'}) => (
      <AppSidebar
        collapsed={options?.collapsed ?? isSidebarCollapsed}
        onNavigate={options?.onNavigate}
        variant={options?.variant}
      />
    ),
    [isSidebarCollapsed]
  );

  return (
    <AppShell
      sidebar={() => renderSidebar()}
      header={
        <AppHeader
          renderSidebar={({onNavigate} = {}) =>
            renderSidebar({collapsed: false, onNavigate, variant: 'mobile'})
          }
          isSidebarCollapsed={isSidebarCollapsed}
          onSidebarToggle={toggleSidebar}
        />
      }
      isSidebarCollapsed={isSidebarCollapsed}
    >
      <Outlet />
    </AppShell>
  );
};

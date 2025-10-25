import type {ReactNode} from 'react';
import clsx from 'clsx';
import {motion} from 'framer-motion';

type AppShellProps = {
  sidebar: ReactNode | (() => ReactNode);
  header: ReactNode;
  children: ReactNode;
  isSidebarCollapsed?: boolean;
};

/**
 * App-wide shell coordinating sidebar + header + animated content.
 */
export const AppShell = ({sidebar, header, children, isSidebarCollapsed = false}: AppShellProps) => {
  const renderSidebar = typeof sidebar === 'function' ? sidebar : () => sidebar;

  return (
    <div className="flex min-h-screen bg-surface">
      <motion.aside
        layout
        transition={{duration: 0.3, ease: [0.33, 1, 0.68, 1]}}
        className={clsx(
          'hidden shrink-0 border-r border-border bg-surface-muted/40 py-6 md:flex md:flex-col',
          isSidebarCollapsed ? 'w-20 px-3' : 'w-72 px-6'
        )}
      >
        {renderSidebar()}
      </motion.aside>
      <div className="flex flex-1 flex-col">
        <motion.div
          layout
          className={clsx('border-b border-border bg-surface-elevated/80 backdrop-blur-xl')}
        >
          {header}
        </motion.div>
        <motion.main
          layout
          className="app-scroll flex-1 px-4 py-6 sm:px-8"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.35, ease: [0.33, 1, 0.68, 1]}}
        >
          <div className="mx-auto flex max-w-6xl flex-col gap-8">{children}</div>
        </motion.main>
      </div>
    </div>
  );
};

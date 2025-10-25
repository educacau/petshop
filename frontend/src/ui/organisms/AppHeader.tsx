import {useState, type ReactNode} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {LogOut, Menu, PanelLeftClose, PanelLeftOpen} from 'lucide-react';

import {useAuth} from '../../hooks/useAuth';
import {ThemeToggle} from '../../components/ThemeToggle';
import {Heading} from '../atoms/Heading';
import {Text} from '../atoms/Text';
import {IconButton} from '../atoms/IconButton';
import {Button} from '../atoms/Button';

type AppHeaderProps = {
  renderSidebar: (options?: {onNavigate?: () => void}) => ReactNode;
  isSidebarCollapsed: boolean;
  onSidebarToggle: () => void;
};

const roleLabels: Record<string, string> = {
  ADMIN: 'Administrador',
  STAFF: 'Colaborador',
  CUSTOMER: 'Cliente'
};

/**
 * Barra superior com ações rápidas, controle do menu lateral e navegação mobile.
 */
export const AppHeader = ({
  renderSidebar,
  isSidebarCollapsed,
  onSidebarToggle
}: AppHeaderProps) => {
  const {user, logout} = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarContent = renderSidebar({onNavigate: () => setMobileOpen(false)});

  return (
    <header className="relative flex flex-col gap-4 px-4 py-5 sm:px-8 sm:py-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <IconButton
            className="md:hidden"
            variant="outline"
            size="sm"
            icon={<Menu className="h-4 w-4" />}
            label={mobileOpen ? 'Fechar navegação' : 'Abrir navegação'}
            onClick={() => setMobileOpen(prev => !prev)}
          />
          <Button
            className="hidden md:inline-flex"
            variant="outline"
            size="sm"
            icon={
              isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )
            }
            onClick={onSidebarToggle}
            title={isSidebarCollapsed ? 'Expandir navegação lateral' : 'Recolher navegação lateral'}
          >
            Menu
          </Button>
          <div>
            <Text size="sm" tone="muted">
              Bem-vindo de volta,
            </Text>
            <Heading as={3}>{user?.name}</Heading>
            {user?.role && (
              <Text size="sm" tone="soft" className="font-medium uppercase tracking-wide">
                {roleLabels[user.role] ?? user.role}
              </Text>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Button
            variant="outline"
            size="sm"
            icon={<LogOut className="h-4 w-4" />}
            onClick={logout}
          >
            Sair
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-nav"
            initial={{opacity: 0, y: -12}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: -12}}
            transition={{duration: 0.25, ease: [0.33, 1, 0.68, 1]}}
            className="md:hidden"
          >
            <div className="rounded-2xl border border-border bg-surface-elevated p-4 shadow-soft">
              {sidebarContent}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

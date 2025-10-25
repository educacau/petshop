import clsx from 'clsx';
import {CalendarClock, LayoutDashboard, PawPrint, Settings, Users, BarChart2} from 'lucide-react';
import type {LucideIcon} from 'lucide-react';
import {NavLink} from 'react-router-dom';

import logo from '../../assets/pet-brucky-logo.svg';
import {useAuth} from '../../hooks/useAuth';
import type {Role} from '../../types';

type NavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  roles?: Role[];
};

type AppSidebarProps = {
  collapsed?: boolean;
  onNavigate?: () => void;
  variant?: 'desktop' | 'mobile';
};

const navItems: NavItem[] = [
  {label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard},
  {label: 'Agendamentos', to: '/schedules', icon: CalendarClock},
  {label: 'Pets', to: '/pets', icon: PawPrint},
  {label: 'Usuários', to: '/users', icon: Users, roles: ['ADMIN']},
  {label: 'Relatórios', to: '/reports', icon: BarChart2, roles: ['ADMIN']},
  {label: 'Configurações', to: '/settings', icon: Settings, roles: ['ADMIN']}
];

/**
 * Navegação lateral principal da aplicação com suporte a modo compacto.
 */
export const AppSidebar = ({
  collapsed = false,
  onNavigate,
  variant = 'desktop'
}: AppSidebarProps) => {
  const {user} = useAuth();
  const role = user?.role ?? 'CUSTOMER';

  const items = navItems.filter(item => !item.roles || item.roles.includes(role));
  const isCompact = collapsed && variant === 'desktop';

  return (
    <div
      className={clsx(
        'flex h-full w-full flex-col gap-6',
        isCompact ? 'items-center' : undefined
      )}
    >
      <div
        className={clsx(
          'flex items-center rounded-2xl bg-surface-elevated/60 py-3 shadow-soft',
          isCompact ? 'justify-center px-2' : 'gap-3 px-4'
        )}
      >
        <img
          src={logo}
          alt="Pet Brucky"
          className={clsx('h-9 w-9 rounded-xl bg-white p-1.5 shadow-soft', isCompact ? 'h-10 w-10' : undefined)}
        />
        {isCompact ? (
          <span className="sr-only">Pet Brucky</span>
        ) : (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-content-strong">Pet Brucky</span>
            <span className="text-xs font-medium text-content-muted">Painel de gestão</span>
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/dashboard'}
              onClick={onNavigate}
              title={isCompact ? item.label : undefined}
              className={({isActive}) =>
                clsx(
                  'group flex items-center rounded-2xl px-3 py-2 text-sm font-semibold transition-colors duration-200',
                  isCompact ? 'justify-center px-0' : 'gap-3',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-soft'
                    : 'text-content-muted hover:bg-surface-elevated/60 hover:text-content-strong'
                )
              }
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className={clsx('truncate', isCompact ? 'sr-only' : undefined)}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

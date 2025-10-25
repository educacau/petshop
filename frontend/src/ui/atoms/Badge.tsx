import type {HTMLAttributes} from 'react';
import clsx from 'clsx';

type BadgeTone = 'default' | 'info' | 'success' | 'warning' | 'danger';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneClasses: Record<BadgeTone, string> = {
  default: 'bg-surface-muted text-base',
  info: 'bg-primary-soft text-primary',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  danger: 'bg-danger-soft text-danger'
};

/**
 * Used for statuses and metadata labels.
 */
export const Badge = ({tone = 'default', className, ...props}: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      toneClasses[tone],
      className
    )}
    {...props}
  />
);

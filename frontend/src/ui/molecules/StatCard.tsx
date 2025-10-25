import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import clsx from 'clsx';
import {Text} from '../atoms/Text';

type StatCardProps = {
  label: string;
  value: ReactNode;
  trend?: ReactNode;
  icon?: ReactNode;
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
  className?: string;
};

const toneMap = {
  neutral: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger'
};

/**
 * Summary KPI with optional icon/trend meta.
 */
export const StatCard = ({
  label,
  value,
  trend,
  icon,
  tone = 'neutral',
  className
}: StatCardProps) => (
  <motion.div
    initial={{opacity: 0, y: 10}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
    className={clsx(
      'rounded-2xl border border-border bg-surface-elevated p-6 shadow-soft backdrop-blur',
      className
    )}
  >
    <div className="flex justify-between">
      <Text size="sm" tone="muted" className="font-medium uppercase tracking-wide">
        {label}
      </Text>
      {icon && <div className={clsx('text-xl', toneMap[tone])}>{icon}</div>}
    </div>
    <div className="mt-3 flex items-end justify-between">
      <span className={clsx('text-3xl font-semibold text-content-strong', toneMap[tone])}>{value}</span>
      {trend && (
        <Text size="sm" tone="soft" className="font-medium">
          {trend}
        </Text>
      )}
    </div>
  </motion.div>
);

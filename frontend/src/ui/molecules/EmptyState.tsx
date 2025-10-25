import type {ReactNode} from 'react';
import clsx from 'clsx';
import {motion} from 'framer-motion';
import {Heading} from '../atoms/Heading';
import {Text} from '../atoms/Text';

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

/**
 * Friendly empty state pattern with optional action affordance.
 */
export const EmptyState = ({title, description, icon, action, className}: EmptyStateProps) => (
  <motion.section
    initial={{opacity: 0, y: 12}}
    animate={{opacity: 1, y: 0}}
    transition={{duration: 0.35, ease: [0.33, 1, 0.68, 1]}}
    className={clsx(
      'flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border-muted bg-surface-muted/60 p-12 text-center',
      className
    )}
  >
    {icon && <div className="text-4xl text-primary">{icon}</div>}
    <div className="space-y-2">
      <Heading as={3}>{title}</Heading>
      <Text tone="muted">{description}</Text>
    </div>
    {action}
  </motion.section>
);

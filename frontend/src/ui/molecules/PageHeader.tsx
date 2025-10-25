import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import clsx from 'clsx';
import {Heading} from '../atoms/Heading';
import {Text} from '../atoms/Text';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

/**
 * Consistent top-of-page introduction with staggered entrance.
 */
export const PageHeader = ({title, subtitle, icon, actions, className}: PageHeaderProps) => {
  return (
    <motion.header
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.35, ease: [0.33, 1, 0.68, 1]}}
      className={clsx('flex flex-col gap-6 md:flex-row md:items-center md:justify-between', className)}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
            {icon}
          </div>
        )}
        <div className="space-y-2">
          <Heading as={1}>{title}</Heading>
          {subtitle && (
            <Text tone="muted" size="sm">
              {subtitle}
            </Text>
          )}
        </div>
      </div>
      {actions && <div className="flex flex-col gap-3 md:flex-row">{actions}</div>}
    </motion.header>
  );
};

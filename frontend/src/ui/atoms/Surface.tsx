import clsx from 'clsx';
import {motion} from 'framer-motion';
import type {HTMLMotionProps} from 'framer-motion';

type SurfaceProps = HTMLMotionProps<'div'> & {
  padding?: 'none' | 'sm' | 'md' | 'lg';
  elevation?: 'none' | 'soft';
  rounded?: 'lg' | 'xl';
};

const paddingMap: Record<NonNullable<SurfaceProps['padding']>, string> = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8'
};

/**
 * Elevated container with animated entrance. Acts as the base card component.
 */
export const Surface = ({
  padding = 'md',
  rounded = 'xl',
  elevation = 'soft',
  className,
  children,
  ...props
}: SurfaceProps) => {
  return (
    <motion.div
      initial={{opacity: 0, y: 12}}
      animate={{opacity: 1, y: 0}}
      transition={{duration: 0.4, ease: [0.33, 1, 0.68, 1]}}
      className={clsx(
        'bg-surface-elevated text-base shadow-sm ring-1 ring-border/60 backdrop-blur',
        rounded === 'xl' ? 'rounded-2xl' : 'rounded-xl',
        elevation === 'soft' ? 'shadow-soft' : 'shadow-none',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
};

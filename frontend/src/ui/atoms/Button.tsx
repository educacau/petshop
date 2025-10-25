import {forwardRef} from 'react';
import type {ReactNode} from 'react';
import {motion} from 'framer-motion';
import type {HTMLMotionProps} from 'framer-motion';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'soft' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = Omit<HTMLMotionProps<'button'>, 'children'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  children?: ReactNode;
};

const baseClasses =
  'relative inline-flex transform-gpu items-center justify-center transition-all duration-200 ease-soft-spring focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-50';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-primary-foreground shadow-soft hover:bg-primary/90',
  soft: 'bg-primary-soft/50 text-primary hover:bg-primary-soft',
  outline:
    'border border-border text-base hover:border-primary hover:text-primary focus-visible:border-primary focus-visible:text-primary',
  ghost: 'text-base hover:bg-surface-muted/65 hover:text-base-strong',
  danger: 'bg-danger text-white shadow-soft hover:bg-danger/90 focus-visible:ring-danger'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 rounded-lg px-3 text-xs font-semibold',
  md: 'h-11 rounded-xl px-4 text-sm font-semibold',
  lg: 'h-12 rounded-xl px-5 text-base font-semibold'
};

export const buttonClasses = (variant: ButtonVariant, size: ButtonSize, className?: string) =>
  clsx(baseClasses, variantClasses[variant], sizeClasses[size], className);

/**
 * Modern motion-ready button inspired by Material 3. Keeps variants compact and accessible.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({variant = 'primary', size = 'md', icon, className, children, disabled, ...props}, ref) => {
    const hasChildren = children !== undefined && children !== null && children !== false;
    const content = (
      <span className="flex items-center gap-2">
        {icon}
        {hasChildren && <span>{children}</span>}
      </span>
    );

    return (
      <motion.button
        ref={ref}
        className={buttonClasses(variant, size, className)}
        whileTap={{scale: disabled ? 1 : 0.97}}
        whileHover={disabled ? undefined : {translateY: -1}}
        disabled={disabled}
        {...props}
      >
        {content}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

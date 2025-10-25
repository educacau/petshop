import {forwardRef} from 'react';
import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Button, type ButtonProps} from './Button';

type IconButtonProps = Omit<ButtonProps, 'children'> & {
  icon: ReactNode;
  label: string;
  size?: 'sm' | 'md';
};

/**
 * Icon-only action with accessible label.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({icon, label, className, size = 'md', variant = 'ghost', ...props}, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={label}
        className={clsx(
          'aspect-square !px-0',
          {
            'h-10 w-10 rounded-xl': size === 'md',
            'h-9 w-9 rounded-lg': size === 'sm'
          },
          className
        )}
        icon={icon}
        {...props}
      />
    );
  }
);

IconButton.displayName = 'IconButton';

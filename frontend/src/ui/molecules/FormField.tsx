import type {ReactNode} from 'react';
import clsx from 'clsx';
import {Text} from '../atoms/Text';

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  helper?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
  required?: boolean;
};

/**
 * Wraps form controls with semantic label, helper, and error states.
 */
export const FormField = ({
  label,
  htmlFor,
  helper,
  error,
  className,
  children,
  required
}: FormFieldProps) => {
  return (
    <div className={clsx('space-y-2', className)}>
      <label
        htmlFor={htmlFor}
        className="flex items-center gap-2 text-sm font-medium text-content-strong"
      >
        {label}
        {required && <span className="rounded-full bg-primary-soft px-2 py-0.5 text-xs text-primary">Obrigatório</span>}
      </label>
      {children}
      {helper && <Text size="sm" tone="soft">{helper}</Text>}
      {error && (
        <Text size="sm" tone="default" className="text-danger">
          {error}
        </Text>
      )}
    </div>
  );
};

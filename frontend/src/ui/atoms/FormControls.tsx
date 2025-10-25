import {forwardRef} from 'react';
import type {InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes} from 'react';
import clsx from 'clsx';

const baseControl =
  'w-full rounded-xl border border-border bg-surface-elevated px-4 py-3 text-sm text-content shadow-sm transition duration-200 ease-soft-spring placeholder:text-content-muted/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:ring-offset-0 focus-visible:border-primary disabled:bg-surface-muted disabled:text-content-muted disabled:opacity-70';

type InputProps = InputHTMLAttributes<HTMLInputElement>;
type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;
type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

/**
 * Shared input styling to guarantee consistent spacing and focus affordance.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({className, type = 'text', ...props}, ref) => (
  <input ref={ref} type={type} className={clsx(baseControl, className)} {...props} />
));

Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({className, ...props}, ref) => (
  <select ref={ref} className={clsx(baseControl, 'appearance-none bg-no-repeat pr-10', className)} {...props} />
));

Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({className, rows = 3, ...props}, ref) => (
  <textarea ref={ref} rows={rows} className={clsx(baseControl, 'resize-none', className)} {...props} />
));

Textarea.displayName = 'Textarea';

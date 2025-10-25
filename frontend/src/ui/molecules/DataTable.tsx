import type {HTMLAttributes, ReactNode} from 'react';
import clsx from 'clsx';

type DataTableProps = HTMLAttributes<HTMLDivElement> & {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  empty?: ReactNode;
};

/**
 * Provides a scrollable, rounded container for tabular data.
 */
export const DataTable = ({header, body, footer, empty, className, ...props}: DataTableProps) => (
  <div
    className={clsx('overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-soft', className)}
    {...props}
  >
    <div className="relative">
      <table className="min-w-full divide-y divide-border-muted">
        {header}
        {body}
        {footer}
      </table>
      {empty}
    </div>
  </div>
);

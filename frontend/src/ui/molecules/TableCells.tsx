import type {HTMLAttributes} from 'react';
import clsx from 'clsx';

export const TableHeadCell = ({className, ...props}: HTMLAttributes<HTMLTableCellElement>) => (
  <th
    className={clsx(
      'bg-surface-muted px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-content-muted',
      className
    )}
    {...props}
  />
);

export const TableCell = ({className, ...props}: HTMLAttributes<HTMLTableCellElement>) => (
  <td className={clsx('px-4 py-4 text-sm text-content', className)} {...props} />
);

export const TableRow = ({className, ...props}: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={clsx('transition hover:bg-primary-soft/30', className)} {...props} />
);

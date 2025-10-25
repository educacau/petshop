import {createElement} from 'react';
import type {HTMLAttributes} from 'react';
import clsx from 'clsx';

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: HeadingLevel;
  subtle?: boolean;
};

const sizeMap: Record<HeadingLevel, string> = {
  1: 'text-3xl md:text-4xl font-semibold tracking-tight',
  2: 'text-2xl md:text-3xl font-semibold tracking-tight',
  3: 'text-xl md:text-2xl font-semibold',
  4: 'text-lg font-semibold',
  5: 'text-base font-semibold uppercase tracking-wide',
  6: 'text-sm font-semibold uppercase tracking-wider'
};

/**
 * Typography primitive to keep heading hierarchy consistent.
 */
export const Heading = ({as = 2, subtle = false, className, ...props}: HeadingProps) => {
  const tag = (`h${as}` as unknown) as keyof JSX.IntrinsicElements;
  return createElement(tag, {
    ...props,
    className: clsx(sizeMap[as], subtle ? 'text-content-muted' : 'text-content', className)
  });
};

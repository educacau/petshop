import type {ComponentPropsWithoutRef, ElementType} from 'react';
import clsx from 'clsx';

type TextSize = 'sm' | 'md' | 'lg';
type TextTone = 'default' | 'muted' | 'soft';
type TextWeight = 'normal' | 'medium';

type TextOwnProps<T extends ElementType> = {
  size?: TextSize;
  tone?: TextTone;
  weight?: TextWeight;
  as?: T;
};

type PolymorphicProps<T extends ElementType> = TextOwnProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T>>;

const sizeMap: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg'
};

const toneMap: Record<TextTone, string> = {
  default: 'text-content',
  muted: 'text-content-muted',
  soft: 'text-content/70'
};

/**
 * Harmonised body text primitive.
 */
export const Text = <T extends ElementType = 'p'>({
  size = 'md',
  tone = 'default',
  weight = 'normal',
  as,
  className,
  ...props
}: PolymorphicProps<T>) => {
  const Component = (as ?? 'p') as ElementType;

  return (
    <Component
      className={clsx(sizeMap[size], toneMap[tone], weight === 'medium' && 'font-medium', className)}
      {...props}
    />
  );
};

import * as React from 'react';

export type ButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'type' | 'className'
> & {
  /** BEM modifier: btn--{variant} */
  variant?: 'primary' | (string & {});
  /** BEM modifier: btn--{size} */
  size?: 'md' | (string & {});
  /** Adds btn--fullWidth */
  fullWidth?: boolean;
  className?: string;
};

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth,
  className,
  children,
  ...props
}: ButtonProps) {
  const bemClasses = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--fullWidth' : null,
    className ?? null,
  ].filter(Boolean);

  return (
    <button {...props} className={bemClasses.join(' ')}>
      {children}
    </button>
  );
}

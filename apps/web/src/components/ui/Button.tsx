import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp' | 'gold';
type Size = 'sm' | 'md' | 'lg' | 'xl';

interface CommonProps {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children?: ReactNode;
  className?: string;
}

type AsButton = CommonProps & ButtonHTMLAttributes<HTMLButtonElement> & { to?: undefined; href?: undefined };
type AsRouterLink = CommonProps & Omit<LinkProps, 'children' | 'className'> & { to: LinkProps['to']; href?: undefined };
type AsAnchor = CommonProps & AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; to?: undefined };

export type ButtonProps = AsButton | AsRouterLink | AsAnchor;

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-emerald text-cream hover:bg-emerald-dark active:bg-emerald-dark',
  secondary: 'bg-cream text-emerald border-2 border-emerald hover:bg-emerald hover:text-cream',
  ghost: 'bg-transparent text-emerald hover:bg-emerald/10',
  whatsapp: 'bg-[#25D366] text-white hover:bg-[#1FAA52]',
  gold: 'bg-gold text-walnut hover:bg-gold-light',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-5 py-3 text-base rounded-xl',
  lg: 'px-6 py-3.5 text-base rounded-xl',
  xl: 'px-8 py-4 text-lg rounded-2xl',
};

export const Button = forwardRef<HTMLElement, ButtonProps>(function Button(props, ref) {
  const {
    variant = 'primary',
    size = 'md',
    isLoading,
    leftIcon,
    rightIcon,
    fullWidth,
    className,
    children,
    ...rest
  } = props;

  const classes = cn('btn-base', VARIANTS[variant], SIZES[size], fullWidth && 'w-full', className);

  const content = isLoading ? (
    <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
  ) : (
    <>
      {leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      <span>{children}</span>
      {rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </>
  );

  if ('to' in rest && rest.to !== undefined) {
    return (
      <Link
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as Omit<LinkProps, 'className' | 'children'>)}
      >
        {content}
      </Link>
    );
  }

  if ('href' in rest && rest.href !== undefined) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      type={(rest as ButtonHTMLAttributes<HTMLButtonElement>).type ?? 'button'}
      disabled={
        (rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading
      }
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

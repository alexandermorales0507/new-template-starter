import React, { forwardRef } from "react";
import { cn } from "./cn";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = "primary", size = "md", loading = false, disabled, children, ...props },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium font-sans transition-all duration-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none template-focus-ring";

    const variantStyles = {
      primary:
        "bg-[var(--wedding-primary)] text-[var(--wedding-on-primary)] hover:bg-[var(--wedding-primary-hover)] active:scale-[0.98] shadow-soft",
      secondary:
        "bg-[var(--wedding-surface)] text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)] active:scale-[0.98] border border-[var(--wedding-border)]",
      ghost: "text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)]",
      outline:
        "border border-[var(--wedding-border)] text-[var(--wedding-text)] hover:bg-[var(--wedding-surface-alt)] active:scale-[0.98]",
    };

    const sizeStyles = {
      sm: "h-9 px-3 text-xs rounded-md gap-1.5 min-h-[36px]",
      md: "h-11 px-5 text-sm rounded-xl gap-2 min-h-[44px]",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5 min-h-[48px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

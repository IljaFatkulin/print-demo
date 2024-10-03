import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import cn from "classnames";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-base text-primary montserrat-font ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-full bg-red-500 text-white",
        outline_red: "rounded-full border border-red-500 text-primary",
        gray: "rounded-full bg-gray-500 text-white",
        outline_gray: "rounded-full border border-gray-500 text-primary",
      },
      size: {
        default: "min-h-11 px-4 py-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    const Comp = "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

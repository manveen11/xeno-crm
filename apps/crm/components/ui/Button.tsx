import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-hairline-strong disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-on-primary hover:bg-primary-hover font-medium",
        secondary: "bg-surface text-ink border border-hairline hover:bg-surface-2 font-medium",
        send: "bg-accent text-on-primary hover:bg-accent-hover font-medium",
        ghost: "bg-transparent text-ink-body hover:bg-surface-2 font-medium",
      },
      size: {
        default: "h-8 px-3 text-[14px] rounded-pill", // small pill for nav
        lg: "h-12 px-4 text-[16px] rounded-pill", // marketing CTA
        chat: "h-10 px-4 text-[16px] rounded-md", // send button
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
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

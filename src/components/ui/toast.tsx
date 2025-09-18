/*import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-md shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  title?: string
  description?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    )
  }
)

Toast.displayName = "Toast"

export { Toast }*/
// src/components/ui/toast.tsx


/*import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-md shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ToastProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof toastVariants> {
  heading?: string
  description?: string
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, heading, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {heading && <div className="font-semibold">{heading}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    )
  }
)

Toast.displayName = "Toast"

export { Toast }*/
/*import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toastVariants = cva(
  "fixed bottom-4 right-4 z-50 w-full max-w-sm rounded-md shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

// ✅ redefine props safely (override `title` from HTMLAttributes)
export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode
  description?: React.ReactNode
  variant?: "default" | "destructive"
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90">{description}</div>}
      </div>
    )
  }
)

Toast.displayName = "Toast"

// ✅ export properly (no duplicate type exports)
export { Toast }
export type { ToastProps }*/
// src/components/ui/toast.tsx
"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toastVariants = cva(
  "max-w-sm rounded-md shadow-lg transition-all",
  {
    variants: {
      variant: {
        default: "bg-white text-gray-900",
        destructive: "bg-red-600 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// Omit the built-in `title` from HTML attributes to avoid type collision
export interface ToastProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "title">,
    VariantProps<typeof toastVariants> {
  title?: React.ReactNode;
  description?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLDivElement, ToastProps>(
  ({ className, variant, title, description, ...props }, ref) => {
    return (
      <div ref={ref} className={cn(toastVariants({ variant }), "p-3", className)} {...props}>
        {title && <div className="font-semibold">{title}</div>}
        {description && <div className="text-sm opacity-90 mt-1">{description}</div>}
      </div>
    );
  }
);

Toast.displayName = "Toast";

export { Toast };



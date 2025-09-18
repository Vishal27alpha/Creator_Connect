/*"use client"

import * as React from "react"

type ToastType = {
  id: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

const ToastContext = React.createContext<{
  toasts: ToastType[]
  addToast: (toast: Omit<ToastType, "id">) => void
  removeToast: (id: string) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastType[]>([])

  const addToast = (toast: Omit<ToastType, "id">) => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => removeToast(id), 4000) // auto-remove after 4s
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider")
  }
  return ctx
}*/
// src/components/ui/use-toast.tsx
// src/components/ui/use-toast.tsx
"use client";

import * as React from "react";
import { Toast, type ToastProps } from "./toast";

type InternalToast = ToastProps & { id: string; duration?: number };

type ToastContextValue = {
  toasts: InternalToast[];
  addToast: (t: Omit<InternalToast, "id">) => string;
  removeToast: (id: string) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

// module-level API ref for imperative `toast()` usage
let apiRef: {
  addToast?: ToastContextValue["addToast"];
  removeToast?: ToastContextValue["removeToast"];
} = {};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<InternalToast[]>([]);

  const addToast = React.useCallback((t: Omit<InternalToast, "id">) => {
    const id = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const toastObj: InternalToast = { ...t, id };
    setToasts((prev) => [toastObj, ...prev].slice(0, 6)); // keep up to 6

    const duration = (t as any).duration ?? 5000;
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), duration);

    return id;
  }, []);

  const removeToast = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    apiRef.addToast = addToast;
    apiRef.removeToast = removeToast;
    return () => {
      apiRef = {};
    };
  }, [addToast, removeToast]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {/* visual container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col-reverse items-end gap-2 p-2">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}

/**
 * Imperative helper: import { toast } from '@/components/ui/use-toast'
 * toast({ title: "Saved", description: "Profile updated" })
 */
export function toast(opts: Omit<InternalToast, "id">): string | undefined {
  if (!apiRef.addToast) {
    console.warn("toast() called before ToastProvider mounted", opts);
    return undefined;
  }
  return apiRef.addToast(opts);
}

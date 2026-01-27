import React, { createContext, useContext, useMemo, useState } from "react";

type ToastItem = { id: string; message: string; type: "success" | "error" };
type ToastCtxType = { toast: (message: string, type?: ToastItem["type"]) => void };

const ToastCtx = createContext<ToastCtxType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  function toast(message: string, type: ToastItem["type"] = "success") {
    const id = crypto.randomUUID();
    setItems((p) => [...p, { id, message, type }]);
    setTimeout(() => setItems((p) => p.filter((x) => x.id !== id)), 2500);
  }

  const value = useMemo(() => ({ toast }), []);

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div className="fixed bottom-20 left-0 right-0 z-50 mx-auto max-w-[560px] px-4">
        <div className="space-y-2">
          {items.map((t) => (
            <div
              key={t.id}
              className={`rounded-xl px-4 py-3 text-sm shadow-md border ${
                t.type === "error"
                  ? "bg-white border-red-200 text-red-700"
                  : "bg-white border-teal-200 text-teal-800"
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

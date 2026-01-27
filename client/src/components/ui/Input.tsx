import React from "react";
import clsx from "clsx";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className, ...props }: Props) {
  return (
    <label className="block">
      {label && <div className="mb-1 text-sm font-medium text-slate-700">{label}</div>}
      <input
        className={clsx(
          "h-11 w-full rounded-xl border bg-white px-3 text-sm outline-none focus:ring-2 focus:ring-teal-600",
          error ? "border-red-300" : "border-slate-200",
          className
        )}
        {...props}
      />
      {error && <div className="mt-1 text-xs text-red-600">{error}</div>}
    </label>
  );
}

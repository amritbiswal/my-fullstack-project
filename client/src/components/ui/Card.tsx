import React from "react";
import clsx from "clsx";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx("rounded-2xl bg-white shadow-sm border border-slate-100", className)}
      {...props}
    />
  );
}

import clsx from "clsx";

export function Badge({
  children,
  tone = "slate"
}: {
  children: React.ReactNode;
  tone?: "slate" | "teal" | "orange" | "red";
}) {
  const tones: Record<string, string> = {
    slate: "bg-slate-100 text-slate-700",
    teal: "bg-teal-50 text-teal-700",
    orange: "bg-orange-50 text-orange-700",
    red: "bg-red-50 text-red-700"
  };
  return <span className={clsx("px-2 py-1 text-xs rounded-lg", tones[tone])}>{children}</span>;
}

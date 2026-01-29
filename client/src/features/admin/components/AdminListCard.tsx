import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";

export function AdminListCard({
  title,
  subtitle,
  rightBadge,
  metaLines
}: {
  title: string;
  subtitle?: string;
  rightBadge?: { text: string; tone?: "slate" | "teal" | "orange" | "red" };
  metaLines?: string[];
}) {
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold">{title}</div>
          {subtitle ? <div className="mt-1 text-xs text-slate-600">{subtitle}</div> : null}
        </div>
        {rightBadge ? <Badge tone={rightBadge.tone ?? "slate"}>{rightBadge.text}</Badge> : null}
      </div>

      {metaLines?.length ? (
        <div className="mt-3 space-y-1">
          {metaLines.map((m, i) => (
            <div key={i} className="text-xs text-slate-600">
              {m}
            </div>
          ))}
        </div>
      ) : null}
    </Card>
  );
}

import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <Card className="p-5 text-center">
      <div className="text-base font-semibold">{title}</div>
      {description && <div className="mt-1 text-sm text-slate-600">{description}</div>}
      {actionLabel && onAction && (
        <div className="mt-4">
          <Button onClick={onAction} className="w-full">
            {actionLabel}
          </Button>
        </div>
      )}
    </Card>
  );
}

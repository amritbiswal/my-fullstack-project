import { useNavigate } from "react-router-dom";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import type { VerificationTask } from "../staffTypes";

function tone(status: VerificationTask["status"]) {
  switch (status) {
    case "PENDING":
      return "orange";
    case "IN_PROGRESS":
      return "teal";
    case "COMPLETED":
      return "slate";
    case "CANCELLED":
      return "red";
    default:
      return "slate";
  }
}

export function TaskCard({ task }: { task: VerificationTask }) {
  const nav = useNavigate();

  return (
    <button className="w-full text-left" onClick={() => nav(`/staff/task/${task._id}?unitId=${task.unitId}`)}>
      <Card className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">{task.type}</div>
            <div className="mt-1 text-xs text-slate-600">
              Task #{task._id.slice(-6)} • Unit #{task.unitId?.slice(-6)}
            </div>
          </div>
          <Badge tone={tone(task.status) as any}>{task.status}</Badge>
        </div>
      </Card>
    </button>
  );
}

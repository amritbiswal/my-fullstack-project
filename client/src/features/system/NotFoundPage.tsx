import { useNavigate } from "react-router-dom";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

export function NotFoundPage() {
  const nav = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-[560px] min-h-screen bg-white px-4 py-10">
        <Card className="p-5 text-center">
          <div className="text-2xl font-semibold text-slate-900">Page not found</div>
          <div className="mt-2 text-sm text-slate-600">
            The page you’re looking for doesn’t exist or was moved.
          </div>

          <div className="mt-6 space-y-2">
            <Button className="w-full" onClick={() => nav("/app/home")}>
              Go to Tourist Home
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => nav(-1)}>
              Go back
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

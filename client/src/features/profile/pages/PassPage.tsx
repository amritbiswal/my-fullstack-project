import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { api } from "../../../api/client";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { useToast } from "../../../components/ui/Toast";

export function PassPage() {
  const { toast } = useToast();
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function refresh() {
    try {
      setLoading(true);
      const res = await api.post("/api/pass/token");
      setToken(res.data.data.token || res.data.data); // supports either shape
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Failed to generate pass", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 60000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-base font-semibold">Packless Pass</div>
        <div className="mt-1 text-sm text-slate-600">
          Show this QR at partner counters. No personal data is stored in the QR.
        </div>
      </Card>

      <Card className="p-6 flex items-center justify-center">
        {token ? <QRCodeCanvas value={token} size={220} /> : <div className="text-sm text-slate-500">No token yet</div>}
      </Card>

      <Button className="w-full" onClick={refresh} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh QR"}
      </Button>
    </div>
  );
}

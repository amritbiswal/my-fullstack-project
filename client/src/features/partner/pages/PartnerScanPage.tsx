import { useEffect, useMemo, useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Input } from "../../../components/ui/Input";
import { Button } from "../../../components/ui/Button";
import { Badge } from "../../../components/ui/Badge";
import { Skeleton } from "../../../components/ui/Skeleton";
import { useToast } from "../../../components/ui/Toast";
import { useScanResult, useStartScan } from "../hooks";
import type { ScanStatus } from "../partnerTypes";

function statusTone(s: ScanStatus) {
  if (s === "APPROVED") return "teal";
  if (s === "WAITING_FOR_CONSENT") return "orange";
  if (s === "DENIED" || s === "INVALID" || s === "EXPIRED" || s === "ERROR") return "red";
  return "slate";
}

export function PartnerScanPage() {
  const { toast } = useToast();

  const [token, setToken] = useState("");
  const [scanId, setScanId] = useState<string | null>(null);
  const [pollingEnabled, setPollingEnabled] = useState(false);

  const start = useStartScan();
  const result = useScanResult(scanId ?? undefined, pollingEnabled);

  const derivedStatus: ScanStatus | null = useMemo(() => {
    if (result.data?.status) return result.data.status;
    return null;
  }, [result.data]);

  useEffect(() => {
    if (!result.data) return;
    // stop polling when resolved
    if (result.data.status !== "WAITING_FOR_CONSENT") setPollingEnabled(false);
  }, [result.data]);

  async function onStart() {
    const t = token.trim();
    if (!t) {
      toast("Paste a token or scan QR first", "error");
      return;
    }

    try {
      const res = await start.mutateAsync(t);
      setScanId(res.scanId);
      setPollingEnabled(true);
      toast("Scan started. Waiting for tourist consent…");
    } catch (e: any) {
      toast(e?.response?.data?.error?.message ?? "Scan failed", "error");
    }
  }

  function reset() {
    setToken("");
    setScanId(null);
    setPollingEnabled(false);
  }

  return (
    <div className="space-y-3">
      <Card className="p-4">
        <div className="text-lg font-semibold">Partner verification</div>
        <div className="mt-1 text-sm text-slate-600">
          Scan Packless Pass QR (token). Wait for customer consent, then verify details.
        </div>
      </Card>

      <Card className="p-4 space-y-3">
        <Input
          label="QR token (paste)"
          placeholder="Paste token from QR"
          value={token}
          onChange={(e) => setToken(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Button className="w-full" onClick={onStart} disabled={start.isPending}>
            {start.isPending ? "Starting..." : "Start scan"}
          </Button>
          <Button className="w-full" variant="secondary" onClick={reset}>
            Reset
          </Button>
        </div>

        <div className="text-xs text-slate-500">
          Tip: In v2, replace paste with camera scanning. This MVP keeps it reliable and easy.
        </div>
      </Card>

      {scanId && (
        <Card className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Scan session</div>
              <div className="mt-1 text-xs text-slate-600">Scan ID: {scanId}</div>
            </div>
            {derivedStatus ? <Badge tone={statusTone(derivedStatus) as any}>{derivedStatus}</Badge> : <Badge tone="slate">…</Badge>}
          </div>

          <div className="mt-3">
            {result.isLoading && <Skeleton className="h-20" />}

            {!result.isLoading && !result.data && (
              <div className="text-sm text-slate-600">Waiting for response…</div>
            )}

            {result.data?.status === "WAITING_FOR_CONSENT" && (
              <div className="text-sm text-slate-700">
                Customer is being asked for consent. Keep this screen open.
              </div>
            )}

            {result.data?.status === "APPROVED" && result.data.payload && (
              <div className="space-y-3">
                <div className="text-sm font-semibold text-teal-800">Verified ✅</div>

                <div className="rounded-xl border border-slate-100 p-3">
                  <div className="text-sm font-semibold">{result.data.payload.displayName}</div>
                  <div className="mt-1 text-xs text-slate-600">User ID: {result.data.payload.userId}</div>
                  <div className="mt-1 text-xs text-slate-600">Verified at: {result.data.payload.verifiedAt}</div>
                  {result.data.payload.tier ? (
                    <div className="mt-2">
                      <Badge tone="teal">{result.data.payload.tier}</Badge>
                    </div>
                  ) : null}
                </div>

                <div className="text-xs text-slate-500">
                  Only the minimum needed information is shown (privacy-first).
                </div>
              </div>
            )}

            {result.data?.status === "DENIED" && (
              <div className="text-sm text-red-700">
                Consent denied. {result.data.reason ? `Reason: ${result.data.reason}` : ""}
              </div>
            )}

            {result.data?.status === "EXPIRED" && (
              <div className="text-sm text-red-700">
                Token expired. Ask customer to refresh their QR.
              </div>
            )}

            {result.data?.status === "INVALID" && (
              <div className="text-sm text-red-700">
                Invalid token. Please rescan.
              </div>
            )}

            {result.data?.status === "ERROR" && (
              <div className="text-sm text-red-700">
                Something went wrong. Try again.
              </div>
            )}
          </div>

          {scanId && (
            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => setPollingEnabled(true)}
                disabled={pollingEnabled || result.data?.status !== "WAITING_FOR_CONSENT"}
              >
                {pollingEnabled ? "Polling..." : "Poll again"}
              </Button>
              <Button className="w-full" onClick={reset}>
                New scan
              </Button>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}

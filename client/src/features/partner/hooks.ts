import { useMutation, useQuery } from "@tanstack/react-query";
import { getPartnerScanResult, startPartnerScan } from "./partnerApi";

export function useStartScan() {
  return useMutation({
    mutationFn: (token: string) => startPartnerScan(token)
  });
}

export function useScanResult(scanId?: string, enabled?: boolean) {
  return useQuery({
    queryKey: ["partner", "scanResult", scanId],
    queryFn: () => getPartnerScanResult(scanId!),
    enabled: Boolean(scanId && enabled),
    refetchInterval: (data) => {
      // poll while waiting
      if (!data) return 1500;
      if ((data as any).status === "WAITING_FOR_CONSENT") return 1500;
      return false;
    },
    retry: 1
  });
}

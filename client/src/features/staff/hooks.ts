import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveTask,
  claimTask,
  fetchPendingUnitsByCity,
  fetchQueue,
  fetchUnitHistory,
  rejectTask,
  releaseTask
} from "./staffApi";

export function useStaffQueue(params: {
  cityId?: string;
  type?: string;
  status?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["staff", "queue", params],
    queryFn: () => fetchQueue(params as any),
    enabled: Boolean(params.cityId) // keep your current UX: require city selection
  });
}

export function usePendingUnitsByCity(params?: { cityId?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ["staff", "pendingUnits", params],
    queryFn: () => fetchPendingUnitsByCity(params as any),
    enabled: Boolean(params?.cityId)
  });
}

export function useUnitHistory(unitId?: string) {
  return useQuery({
    queryKey: ["staff", "unitHistory", unitId],
    queryFn: () => fetchUnitHistory(unitId!),
    enabled: Boolean(unitId)
  });
}

export function useClaimTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => claimTask(taskId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "queue"] })
  });
}

export function useReleaseTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => releaseTask(taskId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "queue"] })
  });
}

export function useApproveTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { checklist: any; evidence: string[]; notes?: string }) => approveTask(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff", "queue"] });
      qc.invalidateQueries({ queryKey: ["staff", "unitHistory"] });
      qc.invalidateQueries({ queryKey: ["provider", "units"] });
      qc.invalidateQueries({ queryKey: ["catalog", "search"] });
    }
  });
}

export function useRejectTask(taskId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: { checklist: any; evidence: string[]; notes?: string }) => rejectTask(taskId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["staff", "queue"] });
      qc.invalidateQueries({ queryKey: ["staff", "unitHistory"] });
      qc.invalidateQueries({ queryKey: ["provider", "units"] });
    }
  });
}


// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
// import { approveTask, claimTask, fetchPendingUnitsByCity, fetchQueue, fetchUnitHistory, rejectTask, releaseTask } from "./staffApi";

// export function useStaffQueue(params: { cityId?: string; type?: string; status?: string; page?: number; limit?: number }) {
//   return useQuery({
//     queryKey: ["staff", "queue", params],
//     queryFn: () => fetchQueue(params as any),
//     enabled: Boolean(params.cityId)
//   });
// }

// export function usePendingUnitsByCity(params?: { cityId?: string; page?: number; limit?: number }) {
//   return useQuery({
//     queryKey: ["staff", "pendingUnits", params],
//     queryFn: () => fetchPendingUnitsByCity(params as any),
//     enabled: Boolean(params?.cityId)
//   });
// }

// export function useUnitHistory(unitId?: string) {
//   return useQuery({
//     queryKey: ["staff", "unitHistory", unitId],
//     queryFn: () => fetchUnitHistory(unitId!),
//     enabled: Boolean(unitId)
//   });
// }

// export function useApproveTask(taskId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: any) => approveTask(taskId, payload),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["staff", "queue"] });
//       qc.invalidateQueries({ queryKey: ["staff", "unitHistory"] });
//       qc.invalidateQueries({ queryKey: ["provider", "units"] }); // in case staff approves unit => it becomes ACTIVE
//     }
//   });
// }

// export function useRejectTask(taskId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: (payload: any) => rejectTask(taskId, payload),
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["staff", "queue"] });
//       qc.invalidateQueries({ queryKey: ["staff", "unitHistory"] });
//       qc.invalidateQueries({ queryKey: ["provider", "units"] });
//     }
//   });
// }

// export function useClaimTask(taskId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: () => claimTask(taskId),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "queue"] })
//   });
// }

// export function useReleaseTask(taskId: string) {
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: () => releaseTask(taskId),
//     onSuccess: () => qc.invalidateQueries({ queryKey: ["staff", "queue"] })
//   });
// }

export type TaskStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type TaskType = "UNIT_ONBOARDING" | "PRE_HANDOFF" | "POST_RETURN";

export type VerificationTask = {
  _id: string;
  type: TaskType;
  status: TaskStatus;
  cityId: string;
  unitId?: string;
  bookingId?: string;
  assignedToUserId?: string | null;
  createdAt?: string;

  // Optional enrichment if backend returns:
  unitSummary?: {
    title?: string;
    skuId?: string;
    providerId?: string;
    condition?: string;
    status?: string;
    photos?: string[];
  };
};

export type VerificationReport = {
  _id: string;
  taskId: string;
  result: "PASS" | "FAIL";
  checklist?: Record<string, any>;
  evidence?: string[];
  notes?: string;
  createdByUserId?: string;
  createdAt?: string;
};

export type UnitVerificationHistory = {
  unitId: string;
  tasks: Array<{
    task: VerificationTask;
    report?: VerificationReport;
  }>;
};

export type PendingUnit = {
  _id: string;
  cityId: string;
  skuId: string;
  providerId?: string;
  status: string; // e.g. SUBMITTED
  title?: string;
  photos?: string[];
};
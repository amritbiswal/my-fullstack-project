import { z } from "zod";

export const decisionSchema = z.object({
  notes: z.string().optional().or(z.literal("")),
  evidence: z.array(z.string()).default([]),
  checklist: z.record(z.any()).default({})
});

export type DecisionForm = z.infer<typeof decisionSchema>;

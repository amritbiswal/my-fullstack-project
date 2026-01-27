const { Schema, model, Types } = require("mongoose");

const VERIFICATION_RESULTS = ["PASS", "FAIL"];

const VerificationReportSchema = new Schema(
  {
    taskId: { type: Types.ObjectId, ref: "VerificationTask", required: true, index: true },
    result: { type: String, enum: VERIFICATION_RESULTS, required: true },
    checklist: { type: Object, required: true }, // example: { itemClean: true, fullyWorking: true }
    evidence: [{ type: String }], // URLs/paths
    notes: { type: String },
    createdByUserId: { type: Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

// VerificationReportSchema.index({ taskId: 1 });

module.exports = model("VerificationReport", VerificationReportSchema);
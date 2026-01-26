const { Schema, model, Types } = require("mongoose");

const VERIFICATION_RESULT = ["PASSED", "FAILED"];

const VerificationReportSchema = new Schema(
  {
    taskId: { type: Types.ObjectId, ref: "VerificationTask", required: true, index: true },
    result: { type: String, enum: VERIFICATION_RESULT, required: true },
    notes: String
  },
  { timestamps: true }
);

module.exports = model("VerificationReport", VerificationReportSchema);
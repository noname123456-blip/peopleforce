import mongoose from "mongoose";

const DOC_TYPES = ["certificate", "letter", "slip", "report", "other"];
const DOC_STATUSES = ["pending", "ready", "completed"];
const PRIORITIES = ["normal", "high", "urgent"];

const DocumentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    document_type: { type: String, enum: DOC_TYPES, default: "other" },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    file_url: { type: String, default: null },
    file_name: { type: String, default: null },
    status: { type: String, enum: DOC_STATUSES, default: "pending" },
    priority: { type: String, enum: PRIORITIES, default: "normal" },
    requested_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

DocumentSchema.index({ employee_id: 1, title: 1 });

export default mongoose.models.Document ||
  mongoose.model("Document", DocumentSchema);

import mongoose from "mongoose";

const STATUSES = ["requested", "approved", "rejected"];

const ResignationLetterSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    title: { type: String, default: null },
    description: { type: String, default: null },
    planned_to_leave_on: { type: Date, required: true },
    status: { type: String, enum: STATUSES, default: "requested" },
    offboarding_employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingEmployee",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.ResignationLetter ||
  mongoose.model("ResignationLetter", ResignationLetterSchema);

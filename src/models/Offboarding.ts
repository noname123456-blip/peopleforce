import mongoose from "mongoose";

const STATUSES = ["ongoing", "completed"];

const OffboardingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    status: { type: String, enum: STATUSES, default: "ongoing" },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Offboarding ||
  mongoose.model("Offboarding", OffboardingSchema);

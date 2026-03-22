import mongoose from "mongoose";

const WorkTypeSchema = new mongoose.Schema(
  {
    work_type: { type: String, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.WorkType ||
  mongoose.model("WorkType", WorkTypeSchema);

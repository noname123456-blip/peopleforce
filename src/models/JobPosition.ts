import mongoose from "mongoose";

const JobPositionSchema = new mongoose.Schema(
  {
    job_position: { type: String, required: true },
    department_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true,
    },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.JobPosition ||
  mongoose.model("JobPosition", JobPositionSchema);

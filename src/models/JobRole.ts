import mongoose from "mongoose";

const JobRoleSchema = new mongoose.Schema(
  {
    job_position_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "JobPosition",
      required: true,
    },
    job_role: { type: String, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

JobRoleSchema.index({ job_position_id: 1, job_role: 1 }, { unique: true });

export default mongoose.models.JobRole || mongoose.model("JobRole", JobRoleSchema);

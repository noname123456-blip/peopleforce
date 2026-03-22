import mongoose from "mongoose";

const DepartmentSchema = new mongoose.Schema(
  {
    department: { type: String, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.Department ||
  mongoose.model("Department", DepartmentSchema);

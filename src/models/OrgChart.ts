import mongoose from "mongoose";

const OrgChartSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
      unique: true,
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OrgChart",
      default: null,
    },
    position_title: { type: String, default: "" },
    department: { type: String, default: "" },
    order: { type: Number, default: 0 },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

OrgChartSchema.index({ parent_id: 1 });

export default mongoose.models.OrgChart ||
  mongoose.model("OrgChart", OrgChartSchema);

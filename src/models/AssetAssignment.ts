import mongoose from "mongoose";

const RETURN_STATUS = ["Healthy", "Minor damage", "Major damage"];
const ASSIGNMENT_STATUS = ["assigned", "returned", "in_use"];

const AssetAssignmentSchema = new mongoose.Schema(
  {
    asset_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    assigned_to_employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    assigned_by_employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    assigned_date: { type: Date, default: Date.now },
    return_date: { type: Date, default: null },
    return_status: { type: String, enum: RETURN_STATUS, default: null },
    return_condition: { type: String, default: null },
    status: { type: String, enum: ASSIGNMENT_STATUS, default: "assigned" },
    assign_images: [{ type: String }],
    return_images: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.AssetAssignment ||
  mongoose.model("AssetAssignment", AssetAssignmentSchema);

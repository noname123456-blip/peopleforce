import mongoose from "mongoose";

const REQUEST_STATUS = ["requested", "approved", "rejected", "cancelled"];

const AssetRequestSchema = new mongoose.Schema(
  {
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    asset_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
    },
    description: { type: String, maxlength: 255, default: null },
    status: { type: String, enum: REQUEST_STATUS, default: "requested" },
    approved_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.AssetRequest ||
  mongoose.model("AssetRequest", AssetRequestSchema);

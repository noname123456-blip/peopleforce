import mongoose from "mongoose";

const ASSET_STATUS = ["In use", "Available", "Not-Available"];

const AssetSchema = new mongoose.Schema(
  {
    asset_name: { type: String, required: true, maxlength: 255 },
    asset_description: { type: String, maxlength: 255, default: null },
    asset_tracking_id: { type: String, unique: true, sparse: true },
    asset_purchase_date: { type: Date, default: null },
    asset_purchase_cost: { type: Number, default: 0 },
    asset_category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssetCategory",
      required: true,
    },
    asset_status: { type: String, enum: ASSET_STATUS, default: "Available" },
    lot_number: { type: String, default: null },
    expiry_date: { type: Date, default: null },
    notify_before: { type: Number, default: 1 },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Asset ||
  mongoose.model("Asset", AssetSchema);

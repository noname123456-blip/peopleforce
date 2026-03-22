import mongoose from "mongoose";

const AssetCategorySchema = new mongoose.Schema(
  {
    asset_category_name: { type: String, required: true, unique: true, maxlength: 255 },
    asset_category_description: { type: String, maxlength: 255 },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.AssetCategory ||
  mongoose.model("AssetCategory", AssetCategorySchema);

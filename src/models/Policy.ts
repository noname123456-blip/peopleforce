import mongoose from "mongoose";

const CATEGORIES = ["work", "leave", "conduct", "it", "general", "finance", "hr"];
const STATUSES = ["active", "draft", "under_review", "archived"];

const PolicySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String, default: "" },
    category: { type: String, enum: CATEGORIES, default: "general" },
    content: { type: String, default: "" },
    status: { type: String, enum: STATUSES, default: "active" },
    version: { type: Number, default: 1 },
    last_updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      default: null,
    },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
    attachment_url: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Policy ||
  mongoose.model("Policy", PolicySchema);

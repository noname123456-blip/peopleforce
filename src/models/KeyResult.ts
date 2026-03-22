import mongoose from "mongoose";

const PROGRESS_CHOICES = ["%", "#", "$", "₹", "€"];

const KeyResultSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 150 },
    progress_type: { type: String, enum: PROGRESS_CHOICES, default: "%" },
    target_value: { type: Number, default: 100 },
    start_value: { type: Number, default: 0 },
    description: { type: String, default: null },
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.KeyResult ||
  mongoose.model("KeyResult", KeyResultSchema);

import mongoose from "mongoose";

const PMSFeedbackSchema = new mongoose.Schema(
  {
    manager_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    period_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Period",
      default: null,
    },
    review: { type: String, default: null },
    rating: { type: Number, default: null, min: 1, max: 5 },
    key_result_feedback: { type: mongoose.Schema.Types.Mixed, default: {} },
    status: {
      type: String,
      enum: ["draft", "submitted", "acknowledged"],
      default: "draft",
    },
  },
  { timestamps: true }
);

export default mongoose.models.PMSFeedback ||
  mongoose.model("PMSFeedback", PMSFeedbackSchema);

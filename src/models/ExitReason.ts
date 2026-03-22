import mongoose from "mongoose";

const ExitReasonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 50 },
    description: { type: String, maxlength: 255 },
    offboarding_employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingEmployee",
      required: true,
    },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.ExitReason ||
  mongoose.model("ExitReason", ExitReasonSchema);

import mongoose from "mongoose";

const OffboardingTaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "OffboardingStage",
      default: null,
    },
  },
  { timestamps: true }
);

OffboardingTaskSchema.index({ title: 1, stage_id: 1 }, { unique: true });

export default mongoose.models.OffboardingTask ||
  mongoose.model("OffboardingTask", OffboardingTaskSchema);

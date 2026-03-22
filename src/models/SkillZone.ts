import mongoose from "mongoose";

const SkillZoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    requiredSkills: [{ type: String }],
    level: { type: String, enum: ["Junior", "Mid", "Senior", "Lead"], default: "Junior" },
    candidates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Candidate" }],
  },
  { timestamps: true }
);

export default mongoose.models.SkillZone || mongoose.model("SkillZone", SkillZoneSchema);

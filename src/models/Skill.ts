import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema(
  { title: { type: String, required: true } },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

import mongoose from "mongoose";

const SurveyTemplateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    description: { type: String },
    is_general_template: { type: Boolean, default: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    questions: [
      {
        text: { type: String, required: true },
        type: { type: String, enum: ["text", "multiple_choice", "rating", "yes_no"], default: "text" }
      }
    ],
  },
  { timestamps: true }
);

export default mongoose.models.SurveyTemplate ||
  mongoose.model("SurveyTemplate", SurveyTemplateSchema);

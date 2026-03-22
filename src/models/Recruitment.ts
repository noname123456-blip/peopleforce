import mongoose from "mongoose";

const RecruitmentSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: { type: String, required: true },
    is_event_based: { type: Boolean, default: false },
    closed: { type: Boolean, default: false },
    is_published: { type: Boolean, default: true },
    open_positions: [{ type: mongoose.Schema.Types.ObjectId, ref: "JobPosition" }],
    job_position_id: { type: String, default: "" },
    vacancy: { type: Number, default: 0 },
    recruitment_managers: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    survey_templates: [{ type: mongoose.Schema.Types.ObjectId, ref: "SurveyTemplate" }],
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    start_date: { type: Date, default: Date.now },
    end_date: { type: Date, default: null },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    optional_profile_image: { type: Boolean, default: false },
    optional_resume: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Recruitment ||
  mongoose.model("Recruitment", RecruitmentSchema);

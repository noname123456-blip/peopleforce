import mongoose from "mongoose";

const GENDER = ["male", "female", "other"];
const SOURCE = ["application", "software", "other"];
const OFFER_STATUS = ["not_sent", "sent", "accepted", "rejected", "joined"];

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String },
    profile: { type: String, default: null },
    portfolio: { type: String, default: null },
    recruitment_id: { type: mongoose.Schema.Types.ObjectId, ref: "Recruitment" },
    job_position_id: { type: mongoose.Schema.Types.ObjectId, ref: "JobPosition" },
    stage_id: { type: mongoose.Schema.Types.ObjectId, ref: "Stage" },
    converted_employee_id: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    schedule_date: { type: Date, default: null },
    email: { type: String, required: true },
    mobile: { type: String, default: "" },
    resume: { type: String, default: null },
    referral: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    zip: { type: String, default: null },
    dob: { type: Date, default: null },
    gender: { type: String, enum: GENDER, default: "male" },
    source: { type: String, enum: SOURCE, default: null },
    start_onboard: { type: Boolean, default: false },
    hired: { type: Boolean, default: false },
    canceled: { type: Boolean, default: false },
    converted: { type: Boolean, default: false },
    joining_date: { type: Date, default: null },
    sequence: { type: Number, default: 0 },
    offer_letter_status: {
      type: String,
      enum: OFFER_STATUS,
      default: "not_sent",
    },
    hired_date: { type: Date, default: null },
  },
  { timestamps: true }
);

CandidateSchema.index({ email: 1, recruitment_id: 1 }, { unique: true });

export default mongoose.models.Candidate ||
  mongoose.model("Candidate", CandidateSchema);

import mongoose from "mongoose";

const WEEKS = ["", "0", "1", "2", "3", "4"];
const WEEK_DAYS = ["0", "1", "2", "3", "4", "5", "6"];

const CompanyLeaveSchema = new mongoose.Schema(
  {
    based_on_week: { type: String, enum: WEEKS, default: null },
    based_on_week_day: { type: String, enum: WEEK_DAYS, required: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

CompanyLeaveSchema.index(
  { based_on_week: 1, based_on_week_day: 1 },
  { unique: true }
);

export default mongoose.models.CompanyLeave ||
  mongoose.model("CompanyLeave", CompanyLeaveSchema);

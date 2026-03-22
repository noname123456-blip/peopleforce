import mongoose from "mongoose";

const PeriodSchema = new mongoose.Schema(
  {
    period_name: { type: String, required: true, unique: true, maxlength: 150 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    company_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Company" }],
  },
  { timestamps: true }
);

export default mongoose.models.Period ||
  mongoose.model("Period", PeriodSchema);

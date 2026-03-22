import mongoose from "mongoose";

const HolidaySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 30 },
    start_date: { type: Date, required: true },
    end_date: { type: Date, default: null },
    recurring: { type: Boolean, default: false },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Holiday ||
  mongoose.model("Holiday", HolidaySchema);

import mongoose from "mongoose";

const CompanySchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    hq: { type: Boolean, default: false },
    address: { type: String, default: "" },
    country: { type: String, default: "" },
    state: { type: String, default: "" },
    city: { type: String, default: "" },
    zip: { type: String, default: "" },
    icon: { type: String, default: null },
    date_format: { type: String, default: "MMM. D, YYYY" },
    time_format: { type: String, default: null },
  },
  { timestamps: true }
);

export default mongoose.models.Company || mongoose.model("Company", CompanySchema);

import mongoose from "mongoose";

const EmployeeTagSchema = new mongoose.Schema(
  {
    title: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.EmployeeTag ||
  mongoose.model("EmployeeTag", EmployeeTagSchema);

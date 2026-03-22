import mongoose from "mongoose";

const GENDER = ["male", "female", "other"];
const MARITAL = ["single", "married", "divorced"];

const EmployeeSchema = new mongoose.Schema(
  {
    badge_id: { type: String, sparse: true, unique: true },
    employee_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    employee_first_name: { type: String, required: true },
    employee_last_name: { type: String, default: "" },
    employee_profile: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    phone: { type: String, default: "" },
    address: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    zip: { type: String, default: null },
    dob: { type: Date, default: null },
    gender: { type: String, enum: GENDER, default: "male" },
    qualification: { type: String, default: null },
    experience: { type: Number, default: null },
    marital_status: { type: String, enum: MARITAL, default: "single" },
    children: { type: Number, default: null },
    emergency_contact: { type: String, default: null },
    emergency_contact_name: { type: String, default: null },
    emergency_contact_relation: { type: String, default: null },
    is_active: { type: Boolean, default: true },
    additional_info: { type: mongoose.Schema.Types.Mixed, default: null },
    is_from_onboarding: { type: Boolean, default: false },
    is_directly_converted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

EmployeeSchema.virtual("employee_work_info", {
  ref: "EmployeeWorkInformation",
  localField: "_id",
  foreignField: "employee_id",
  justOne: true,
});

EmployeeSchema.set("toObject", { virtuals: true });
EmployeeSchema.set("toJSON", { virtuals: true });

EmployeeSchema.index(
  { employee_first_name: 1, employee_last_name: 1, email: 1 },
  { unique: true }
);

export default mongoose.models.Employee ||
  mongoose.model("Employee", EmployeeSchema);

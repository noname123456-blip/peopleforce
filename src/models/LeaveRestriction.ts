import mongoose from "mongoose";

const LeaveRestrictionSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        leave_type_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "LeaveType",
            default: null, // null means "All"
        },
        start_date: { type: Date, required: true },
        end_date: { type: Date, required: true },
        department_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            default: null, // null means "All"
        },
        reason: { type: String, default: "" },
        company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
    },
    { timestamps: true }
);

export default mongoose.models.LeaveRestriction ||
    mongoose.model("LeaveRestriction", LeaveRestrictionSchema);

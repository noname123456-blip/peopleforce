import mongoose from "mongoose";

const InterviewScheduleSchema = new mongoose.Schema(
  {
    candidate_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Candidate",
      required: true,
    },
    employee_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],
    interview_date: { type: Date, required: true },
    interview_time: { type: String, required: true },
    description: { type: String, default: "" },
    completed: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.InterviewSchedule ||
  mongoose.model("InterviewSchedule", InterviewScheduleSchema);

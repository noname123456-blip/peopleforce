import mongoose from "mongoose";

const PRIORITY = ["low", "medium", "high", "critical"];
const TICKET_STATUS = ["new", "in_progress", "on_hold", "resolved", "canceled"];

const TicketSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, maxlength: 50 },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
    ticket_type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TicketType",
      default: null,
    },
    priority: { type: String, enum: PRIORITY, default: "low" },
    status: { type: String, enum: TICKET_STATUS, default: "new" },
    description: { type: String, default: null },
    tags: [{ type: String }],
    assigning_department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      default: null,
    },
    raised_on: { type: String, default: null },
    raised_on_id: { type: mongoose.Schema.Types.ObjectId, default: null },
    deadline: { type: Date, default: null },
    is_active: { type: Boolean, default: true },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.Ticket ||
  mongoose.model("Ticket", TicketSchema);

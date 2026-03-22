import mongoose from "mongoose";

const TicketCommentSchema = new mongoose.Schema(
  {
    comment: { type: String },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },
    employee_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.TicketComment ||
  mongoose.model("TicketComment", TicketCommentSchema);

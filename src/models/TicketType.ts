import mongoose from "mongoose";

const TICKET_TYPES_ENUM = ["general", "leave", "attendance", "others"];

const TicketTypeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true, maxlength: 100 },
    type: { type: String, enum: TICKET_TYPES_ENUM, default: "general" },
    prefix: { type: String, required: true, unique: true, maxlength: 3 },
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  },
  { timestamps: true }
);

export default mongoose.models.TicketType ||
  mongoose.model("TicketType", TicketTypeSchema);

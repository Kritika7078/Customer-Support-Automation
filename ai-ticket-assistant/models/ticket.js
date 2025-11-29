import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: { type: String, default: "TODO" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  // priority: String,
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  ticketsAssignedCount: { type: Number, default: 0 }, // <-- ADD THIS FIELD
  deadline: Date,
  helpfulNotes: String,
  relatedSkills: [String],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Ticket", ticketSchema);

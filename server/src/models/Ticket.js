import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema(
  {
    code: { type: String, index: true },
    title: { type: String, required: true },
    org: String,
    priority: { type: String, default: 'P3' },
    status: { type: String, default: 'Open' },
    age: Number,
    owner: { type: String, default: 'Unassigned' },
    sla: { type: String, default: 'On Track' },
    category: String,
    channel: String,
  },
  { timestamps: true }
);

export default mongoose.model('Ticket', TicketSchema);

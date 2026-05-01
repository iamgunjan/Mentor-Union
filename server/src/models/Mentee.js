import mongoose from 'mongoose';

const MenteeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    org: String,
    sessionsBooked: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 },
    creditsRemaining: { type: Number, default: 0 },
    feedback: String,
    progress: Number,
    lastActive: String,
    cohort: String,
  },
  { timestamps: true }
);

export default mongoose.model('Mentee', MenteeSchema);

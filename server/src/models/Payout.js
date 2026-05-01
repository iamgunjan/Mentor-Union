import mongoose from 'mongoose';

const PayoutSchema = new mongoose.Schema(
  {
    code: { type: String, index: true },
    mentor: String,
    amount: Number,
    status: { type: String, default: 'Pending Approval' },
    cycle: String,
    method: String,
  },
  { timestamps: true }
);

export default mongoose.model('Payout', PayoutSchema);

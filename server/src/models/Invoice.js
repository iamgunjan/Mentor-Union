import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema(
  {
    code: { type: String, index: true },
    org: String,
    amount: Number,
    status: { type: String, default: 'Draft' },
    issued: String,
    due: String,
  },
  { timestamps: true }
);

export default mongoose.model('Invoice', InvoiceSchema);

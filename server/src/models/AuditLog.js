import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema(
  {
    who: String,
    action: { type: String, required: true },
    object: String,
    when: String,
    ip: String,
    result: { type: String, default: 'Success' },
    payload: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

export default mongoose.model('AuditLog', AuditLogSchema);

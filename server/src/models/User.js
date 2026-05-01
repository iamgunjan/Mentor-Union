import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    role: { type: String, default: 'Mentee' },
    org: String,
    status: { type: String, default: 'Invited' },
    mfa: { type: String, default: 'Disabled' },
    lastActive: String,
    joined: String,
  },
  { timestamps: true }
);

export default mongoose.model('User', UserSchema);

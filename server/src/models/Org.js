import mongoose from 'mongoose';

const OrgSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    tier: String,
    status: { type: String, default: 'Active', index: true },
    plan: String,
    mentees: { type: Number, default: 0 },
    mentors: { type: Number, default: 0 },
    creditsUsed: { type: Number, default: 0 },
    creditsRemaining: { type: Number, default: 100 },
    mrr: { type: Number, default: 0 },
    renewalDays: Number,
    renewalRisk: String,
    admin: String,
    country: String,
    ticketsOpen: { type: Number, default: 0 },
    slaBreach: { type: Boolean, default: false },
    sessions30d: { type: Number, default: 0 },
    completion: Number,
    lastActive: String,
    domain: String,
    onboardingStage: { type: String, default: 'Onboarding' },
    contractEnd: String,
  },
  { timestamps: true }
);

export default mongoose.model('Org', OrgSchema);

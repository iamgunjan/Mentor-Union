import mongoose from 'mongoose';

const MentorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    mis: Number,
    tier: String,
    sessions: { type: Number, default: 0 },
    noShow: { type: Number, default: 0 },
    kyc: { type: String, default: 'Pending' },
    earning: { type: Number, default: 0 },
    availability: Number,
    rating: String,
    domains: [String],
    orgs: Number,
    visibility: { type: String, default: 'Public' },
    docs: String,
    country: String,
    pricePerSession: Number,
    lastSession: String,
    responseHrs: Number,
    responsiveness: String,
  },
  { timestamps: true }
);

export default mongoose.model('Mentor', MentorSchema);

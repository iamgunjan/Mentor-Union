import 'dotenv/config';
import mongoose from 'mongoose';

import Org from './models/Org.js';
import Mentor from './models/Mentor.js';
import Mentee from './models/Mentee.js';
import User from './models/User.js';
import Ticket from './models/Ticket.js';
import Invoice from './models/Invoice.js';
import Payout from './models/Payout.js';
import AuditLog from './models/AuditLog.js';

// Same deterministic RNG as the original JSX so the seed data matches the design.
const seedRandom = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
const rng = seedRandom(7);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const range = (n) => Array.from({ length: n }, (_, i) => i);

const ORG_NAMES = [
  'IIM Bengaluru','London Business School','IIT Mumbai','DBS Singapore','Stanford GSB',
  'INSEAD France','HEC Paris','IIM Ahmedabad','Wharton','MIT Sloan','XLRI Jamshedpur',
  'NUS Business','ISB Hyderabad','Kellogg','Columbia Business','Cambridge Judge',
  'Oxford Said','HKUST','UC Berkeley Haas','Tuck Dartmouth','Ross Michigan','Yale SOM',
  'Tata Consultancy','Infosys Mentorship','Wipro Learn','Accenture Academy','HDFC Bank L&D',
  'Reliance Foundation','Aditya Birla Edu','Mahindra University'
];
const MENTOR_NAMES = [
  'Pratika Shah','Arvind Menon','Sneha Iyer','Rohit Kapoor','Anjali Verma','Vikram Reddy',
  'Sanjana Pillai','Karan Bhatia','Meera Krishnan','Tushar Joshi','Nikhil Rao','Divya Pathak',
  'Akash Singh','Lavanya Murthy','Gaurav Sinha','Ritika Bansal','Manoj Pillai','Aarti Khanna',
  'Devesh Jain','Pooja Mehta','Suresh Babu','Anushka Roy','Harsh Vardhan','Neha Gupta',
  'Eyan Smith','Liam Carter','Sophia Tan','Marcus Chen','Olivia Brooks','Daniel Wright'
];
const MENTEE_FIRST = ['Aarav','Diya','Vihaan','Anaya','Arjun','Saanvi','Reyansh','Myra','Ayaan','Ira','Kabir','Kiara','Aditya','Aanya','Vivaan'];
const COUNTRIES = ['IN','SG','GB','US','FR','HK','AE','CA','AU','DE'];
const DOMAINS = ['Product','UX','Strategy','Finance','Marketing','Engineering','Data','Operations','Sales','HR'];

function buildOrgs() {
  return ORG_NAMES.map((name) => {
    const tier = pick(['Enterprise','Growth','Starter','Enterprise','Growth']);
    const status = pick(['Active','Active','Active','At Risk','Paused','Active']);
    const renewalDays = Math.floor(rng() * 90) + 1;
    return {
      name, tier, status, plan: tier,
      mentees: Math.floor(rng() * 800) + 40,
      mentors: Math.floor(rng() * 80) + 8,
      creditsUsed: Math.floor(rng() * 95) + 5,
      creditsRemaining: 100 - (Math.floor(rng() * 95) + 5),
      mrr: Math.floor(rng() * 45000) + 4000,
      renewalDays,
      renewalRisk: renewalDays < 14 ? 'High' : renewalDays < 30 ? 'Medium' : 'Low',
      admin: pick(MENTOR_NAMES),
      country: pick(COUNTRIES),
      ticketsOpen: Math.floor(rng() * 8),
      slaBreach: rng() > 0.78,
      sessions30d: Math.floor(rng() * 1200) + 50,
      completion: 60 + Math.floor(rng() * 38),
      lastActive: pick(['2h ago','15m ago','1d ago','4h ago','40m ago','3d ago']),
      domain: pick(['Education','BFSI','Tech','Consulting','Manufacturing']),
      onboardingStage: pick(['Live','Live','Live','Onboarding','Setup','Live']),
      contractEnd: '2026-' + String(Math.floor(rng()*12)+1).padStart(2,'0') + '-' + String(Math.floor(rng()*28)+1).padStart(2,'0'),
    };
  });
}

function buildMentors() {
  return MENTOR_NAMES.map((name) => {
    const mis = 50 + Math.floor(rng() * 50);
    const responseHrs = pick([1, 2, 4, 8, 12, 24, 48]);
    return {
      name, mis,
      tier: mis >= 85 ? 'Excellent' : mis >= 70 ? 'Good' : 'Basic',
      sessions: Math.floor(rng() * 300) + 5,
      noShow: Math.floor(rng() * 6),
      kyc: pick(['Verified','Verified','Verified','Pending','Rejected']),
      earning: Math.floor(rng() * 240000) + 10000,
      availability: Math.floor(rng() * 100),
      rating: (3.5 + rng() * 1.5).toFixed(1),
      domains: [pick(DOMAINS), pick(DOMAINS)].filter((v,i,a) => a.indexOf(v) === i),
      orgs: Math.floor(rng() * 8) + 1,
      visibility: pick(['Public','Public','Org-only','Hidden']),
      docs: pick(['Complete','Complete','Pending','Expired']),
      country: pick(COUNTRIES),
      pricePerSession: Math.floor(rng() * 4000) + 800,
      lastSession: pick(['1h ago','3d ago','12h ago','2w ago','5d ago','30m ago']),
      responseHrs,
      responsiveness: responseHrs <= 2 ? 'Fast' : responseHrs <= 12 ? 'Steady' : responseHrs <= 24 ? 'Within 1d' : 'Slow',
    };
  });
}

function buildMentees(orgs) {
  return range(40).map(() => {
    const f = pick(MENTEE_FIRST);
    return {
      name: f + ' ' + pick(['Sharma','Patel','Reddy','Gupta','Khan','Kumar','Das','Iyer']),
      org: pick(orgs).name,
      sessionsBooked: Math.floor(rng() * 24) + 1,
      sessionsCompleted: Math.floor(rng() * 20),
      creditsRemaining: Math.floor(rng() * 30),
      feedback: (3.5 + rng() * 1.5).toFixed(1),
      progress: Math.floor(rng() * 100),
      lastActive: pick(['1h ago','today','2d ago','1w ago']),
      cohort: 'Cohort ' + pick(['Alpha','Beta','Gamma','Delta','Sigma']),
    };
  });
}

function buildTickets() {
  return range(28).map((i) => ({
    code: 'TKT-' + (1200 + i),
    title: pick([
      'Mentor session not started','Refund request — duplicate booking','Video URL invalid for cohort',
      'Bulk credits not reflecting','LOE document re-trigger','Org admin access locked',
      'Webhook payload malformed','Renewal invoice not generated','Mentee unable to book',
      'Mentor profile missing tax docs','Custom domain not resolving'
    ]),
    org: pick(ORG_NAMES),
    priority: pick(['P1','P2','P3','P2','P3','P4']),
    status: pick(['Open','In Progress','Open','Waiting','In Progress','Resolved']),
    age: Math.floor(rng() * 120) + 1,
    owner: pick(['Unassigned','Rakesh K','Anita S','Vivek P','Sarah M']),
    sla: rng() > 0.72 ? 'Breached' : 'On Track',
    category: pick(['Billing','Access','Mentor','Platform','Content']),
    channel: pick(['Email','Chat','In-app','Phone']),
  }));
}

function buildUsers() {
  return range(36).map((i) => ({
    name: pick(MENTOR_NAMES),
    email: 'user' + i + '@mentorunion.io',
    role: pick(['Super Admin','Platform Admin','Org Admin','Sub-admin','Mentor','Mentee','Support']),
    org: pick(ORG_NAMES),
    status: pick(['Active','Active','Active','Suspended','Invited']),
    mfa: rng() > 0.3 ? 'Enabled' : 'Disabled',
    lastActive: pick(['just now','1h ago','3d ago','2w ago']),
    joined: '2025-' + String(Math.floor(rng()*12)+1).padStart(2,'0') + '-' + String(Math.floor(rng()*28)+1).padStart(2,'0'),
  }));
}

function buildInvoices() {
  return range(14).map((i) => ({
    code: 'INV-' + (4400 + i),
    org: pick(ORG_NAMES),
    amount: Math.floor(rng() * 240000) + 8000,
    status: pick(['Paid','Paid','Pending','Overdue','Draft']),
    issued: pick(['Mar 12','Mar 18','Apr 02','Apr 14','Apr 20']),
    due: pick(['Apr 12','Apr 18','May 02','May 14','May 20']),
  }));
}

function buildPayouts() {
  return range(12).map((i) => ({
    code: 'PAY-' + (8800 + i),
    mentor: pick(MENTOR_NAMES),
    amount: Math.floor(rng() * 84000) + 2000,
    status: pick(['Scheduled','Sent','Pending Approval','Failed']),
    cycle: pick(['Apr W1','Apr W2','Apr W3','Apr W4']),
    method: pick(['Bank ACH','UPI','Wire','PayPal']),
  }));
}

function buildAuditLog(users) {
  return range(20).map(() => ({
    who: pick(users).name,
    action: pick(['Updated policy','Created org','Suspended user','Reset MFA','Exported data','Approved exception','Changed credit cap','Published role','Disabled webhook']),
    object: pick(['Policy/Refund-v3.2','Org/IIM-B','User/u_24','Org/Stanford','Role/OrgAdmin']),
    when: pick(['2m ago','17m ago','1h ago','3h ago','1d ago','3d ago']),
    ip: '10.' + Math.floor(rng()*255) + '.' + Math.floor(rng()*255) + '.' + Math.floor(rng()*255),
    result: pick(['Success','Success','Success','Failed']),
  }));
}

async function run() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/mentorunion';
  console.log('[seed] connecting to', uri.replace(/:[^:@/]+@/, ':***@'));
  await mongoose.connect(uri);

  const tasks = [
    [Org, buildOrgs()],
    [Mentor, buildMentors()],
    [Ticket, buildTickets()],
    [User, buildUsers()],
    [Invoice, buildInvoices()],
    [Payout, buildPayouts()],
  ];

  for (const [Model, data] of tasks) {
    await Model.deleteMany({});
    await Model.insertMany(data);
    console.log(`[seed] ${Model.modelName}: ${data.length}`);
  }

  // Mentees + AuditLog need cross-references resolved from inserted docs.
  await Mentee.deleteMany({});
  const orgs = await Org.find({}, 'name').lean();
  const mentees = buildMentees(orgs);
  await Mentee.insertMany(mentees);
  console.log('[seed] Mentee:', mentees.length);

  await AuditLog.deleteMany({});
  const users = await User.find({}, 'name').lean();
  const log = buildAuditLog(users);
  await AuditLog.insertMany(log);
  console.log('[seed] AuditLog:', log.length);

  await mongoose.disconnect();
  console.log('[seed] done');
}

run().catch((e) => {
  console.error('[seed] failed:', e);
  process.exit(1);
});

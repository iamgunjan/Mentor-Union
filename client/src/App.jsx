import React, { useState, useMemo, useEffect, useRef } from 'react';
import { api } from './api.js';
import {
  LayoutDashboard, Building2, Users, GraduationCap, Wallet, FileBarChart, ShieldAlert, Settings,
  Search, Bell, Mail, ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
  Plus, Download, Filter, Bookmark, MoreHorizontal, X, Check, AlertTriangle, AlertCircle,
  TrendingUp, TrendingDown, Activity, Zap, Eye, EyeOff, Clock, Calendar, RefreshCw,
  Edit3, Trash2, Copy, Send, Phone, Mail as MailIcon, Globe, Lock, Unlock, Power,
  ArrowUpRight, ArrowDownRight, ArrowRight, ExternalLink, Sparkles, Sun, Moon,
  Grid3x3, List, ChevronsUpDown, CircleCheck, CircleX, CircleDashed, CirclePause, CircleAlert,
  PlayCircle, PauseCircle, FileText, FileSpreadsheet, FilePlus, FolderOpen, Tag,
  Shield, Flag, MessageSquare, Webhook, Key, Cpu, Layers, Workflow, Boxes, Receipt,
  Banknote, CreditCard, RotateCcw, UserPlus, UserCheck, UserX, UserCog, Megaphone,
  Briefcase, GitBranch, History, Scale, Radio, Inbox, ClipboardList, BadgeCheck, BadgeX,
  CheckCircle2, XCircle, MinusCircle, Circle, AlertOctagon, Sliders, ToggleLeft, ToggleRight, Info
} from 'lucide-react';

/* ============================================================================
   THEME TOKENS — dark default, light alt. Matches the reference mockup
   ============================================================================ */
/* ----------------------------------------------------------------------------
   BRAND COLOR SYSTEM — derived from the official brand guidelines.
   - Primary: forest green scale (7 stops, "Main" is stop 4)
   - Secondary: cream / off-white scale (7 stops, "Main" is stop 4)
   - Gradients: 4 brand gradients (primary, purple, blue, orange)
   - Grayscale: 20-step neutral ramp (Gray 0 white → Gray 19 near-black)
   - Semantic: Success / Error / Info / Warning, each 7 stops (50/100/300/500/600/700/900)
   These tokens are referenced via t.brand.* / t.gray.* / t.success.* etc.
   The legacy short tokens (t.accent, t.purple, t.red, t.green, t.yellow, t.blue, t.orange)
   still resolve and now point at the appropriate brand-aligned values so existing
   components inherit the new palette automatically.
   ---------------------------------------------------------------------------- */

const BRAND_PRIMARY = {
  s1: '#E8F4EE', // lightest mint
  s2: '#BFD9CB',
  s3: '#84B09A',
  main: '#3F6852', // brand main — deep forest green
  s5: '#2D5040',
  s6: '#173225', // darkest
};
const BRAND_SECONDARY = {
  s1: '#FAF6EE', // lightest cream
  s2: '#F4ECDB',
  s3: '#EDE0C5',
  main: '#E5D4AC', // brand main — warm cream
  s5: '#C5B58E',
  s6: '#A89B79',
};
const BRAND_GRADIENT = {
  primary: { from: '#46685A', to: '#0B1811' },
  purple:  { from: '#73637E', to: '#271C25' },
  blue:    { from: '#319AD0', to: '#072C3E' },
  orange:  { from: '#BB6E26', to: '#8C4612' },
};
const GRAY = [
  '#FFFFFF','#F5F5F5','#EAEAEA','#D4D4D4','#BDBDBD','#A8A8A8','#959595','#828282',
  '#727272','#646464','#5A5A5A','#525252','#494949','#3F3F3F','#363636','#2C2C2C',
  '#232323','#1A1A1A','#121212','#080808',
];
const SUCCESS = { s50: '#E8F5EC', s100: '#C6E5CE', s300: '#7DC58E', s500: '#1F8A4A', s600: '#176C39', s700: '#0F5028', s900: '#073117' };
const ERROR   = { s50: '#FBEDED', s100: '#F8C8C8', s300: '#F08F8F', s500: '#C8161D', s600: '#9F1217', s700: '#760D11', s900: '#410708' };
const INFO    = { s50: '#EAF1FE', s100: '#C6D8FB', s300: '#85ABF6', s500: '#2C5BD8', s600: '#1E45B0', s700: '#143488', s900: '#091B4B' };
const WARNING = { s50: '#FCF5E4', s100: '#F7E1AE', s300: '#F0C667', s500: '#E0A521', s600: '#B8801A', s700: '#8A5F12', s900: '#4D3508' };

const THEME = {
  dark: {
    bg: '#0B1811',           // brand primary gradient end — true dark forest
    bgPanel: '#0F2018',
    bgCard: '#142B22',
    bgCardElev: '#1A372D',
    bgInput: '#0F2018',
    border: '#274D3D',
    borderSoft: '#1F3F32',
    text: BRAND_SECONDARY.s1,    // cream text on dark green
    textMuted: '#94A89C',
    textDim: '#6C8278',

    // Primary brand accent (the forest green) — replaces old teal accent
    accent: BRAND_PRIMARY.s3,    // light enough to read on dark; deep brand green for fills
    accentSoft: BRAND_PRIMARY.s5,

    // Semantic shorthands — all brand-aligned now
    yellow: WARNING.s500,
    yellowSoft: WARNING.s700,
    blue: INFO.s500,
    blueSoft: INFO.s700,
    purple: BRAND_GRADIENT.purple.from,
    purpleSoft: BRAND_GRADIENT.purple.to,
    red: ERROR.s500,
    redSoft: ERROR.s700,
    green: SUCCESS.s500,
    greenSoft: SUCCESS.s700,
    orange: BRAND_GRADIENT.orange.from,

    // Cream surfaces (used for ActionCenter sidebar etc.)
    cream: BRAND_SECONDARY.s2,
    creamText: BRAND_PRIMARY.s6,

    sidebarActive: 'rgba(132,176,154,0.12)',  // BRAND_PRIMARY.s3 at 12%
    sidebarHover: 'rgba(255,255,255,0.04)',

    // Full brand scales accessible via t.brand.primary.s1 etc.
    brand: { primary: BRAND_PRIMARY, secondary: BRAND_SECONDARY, gradient: BRAND_GRADIENT },
    gray: GRAY,
    success: SUCCESS, error: ERROR, info: INFO, warning: WARNING,
  },
  light: {
    bg: BRAND_SECONDARY.s1,           // cream background
    bgPanel: '#FFFFFF',
    bgCard: '#FFFFFF',
    bgCardElev: BRAND_SECONDARY.s2,
    bgInput: '#FFFFFF',
    border: BRAND_SECONDARY.s3,
    borderSoft: BRAND_SECONDARY.s2,
    text: BRAND_PRIMARY.s6,           // dark forest green text on cream
    textMuted: '#5A6A60',
    textDim: '#8A9A92',

    accent: BRAND_PRIMARY.main,       // forest green accent
    accentSoft: BRAND_PRIMARY.s2,

    yellow: WARNING.s600,
    yellowSoft: WARNING.s100,
    blue: INFO.s600,
    blueSoft: INFO.s100,
    purple: BRAND_GRADIENT.purple.from,
    purpleSoft: '#DCCFEE',
    red: ERROR.s600,
    redSoft: ERROR.s100,
    green: SUCCESS.s600,
    greenSoft: SUCCESS.s100,
    orange: BRAND_GRADIENT.orange.from,

    cream: BRAND_PRIMARY.s6,          // dark surface for accent panel in light theme
    creamText: BRAND_SECONDARY.s1,

    sidebarActive: 'rgba(63,104,82,0.10)',   // BRAND_PRIMARY.main at 10%
    sidebarHover: 'rgba(0,0,0,0.04)',

    brand: { primary: BRAND_PRIMARY, secondary: BRAND_SECONDARY, gradient: BRAND_GRADIENT },
    gray: GRAY,
    success: SUCCESS, error: ERROR, info: INFO, warning: WARNING,
  }
};

const FONT_DISPLAY = '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const FONT_BODY = '"DM Sans", -apple-system, BlinkMacSystemFont, sans-serif';
const FONT_MONO = '"DM Mono", "JetBrains Mono", "SF Mono", Menlo, monospace';

/* ============================================================================
   MOCK DATA — realistic, varied
   ============================================================================ */
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

const seedRandom = (s) => { let x = s; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
const rng = seedRandom(7);
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const range = (n) => Array.from({ length: n }, (_, i) => i);

let ORGS = ORG_NAMES.map((name, i) => {
  const tier = pick(['Enterprise','Growth','Starter','Enterprise','Growth']);
  const status = pick(['Active','Active','Active','At Risk','Paused','Active']);
  const renewalDays = Math.floor(rng() * 90) + 1;
  return {
    id: 'org_' + (i + 1),
    name,
    tier,
    status,
    plan: tier,
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

let MENTORS = MENTOR_NAMES.map((name, i) => {
  const mis = 50 + Math.floor(rng() * 50);
  return {
    id: 'm_' + (i + 1),
    name,
    mis,
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
    responseHrs: pick([1, 2, 4, 8, 12, 24, 48]),
    responsiveness: null, // computed below
  };
});
// compute responsiveness label so the badge is auto-calculated, not manually claimed
MENTORS.forEach((m) => {
  m.responsiveness = m.responseHrs <= 2 ? 'Fast' : m.responseHrs <= 12 ? 'Steady' : m.responseHrs <= 24 ? 'Within 1d' : 'Slow';
});

let MENTEES = range(40).map((i) => {
  const f = pick(MENTEE_FIRST);
  return {
    id: 'me_' + (i + 1),
    name: f + ' ' + pick(['Sharma','Patel','Reddy','Gupta','Khan','Kumar','Das','Iyer']),
    org: pick(ORGS).name,
    sessionsBooked: Math.floor(rng() * 24) + 1,
    sessionsCompleted: Math.floor(rng() * 20),
    creditsRemaining: Math.floor(rng() * 30),
    feedback: (3.5 + rng() * 1.5).toFixed(1),
    progress: Math.floor(rng() * 100),
    lastActive: pick(['1h ago','today','2d ago','1w ago']),
    cohort: 'Cohort ' + pick(['Alpha','Beta','Gamma','Delta','Sigma']),
  };
});

let TICKETS = range(28).map((i) => ({
  id: 'TKT-' + (1200 + i),
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

const ESCALATIONS = [
  { org: 'IIM Bengaluru', renewalDays: 7, status: 'High', priority: 'P1', detail: 'Renewal at risk — invoice unpaid', value: '₹24,800' },
  { org: 'London Business School', renewalDays: 4, status: 'High', priority: 'P1', detail: 'Burn rate 3× usual', value: '₹52,400' },
  { org: 'IIT Mumbai', renewalDays: 23, status: 'Medium', priority: 'P2', detail: 'Mentor supply low for Q3', value: '₹18,200' },
  { org: 'DBS Singapore', renewalDays: 0, status: 'High', priority: 'P1', detail: 'Renewal due today, no PO', value: '₹84,200' },
  { org: 'Stanford GSB', renewalDays: 14, status: 'Medium', priority: 'P2', detail: 'Approval pending from finance', value: '₹110,000' },
];

const ANOMALIES = [
  { id: 'an_1', icon: 'flame', org: 'Mumbai LBS', title: 'Mumbai credits burn 3× usual rate', subtitle: 'London Business School • 45 mins ago', severity: 'high' },
  { id: 'an_2', icon: 'refund', who: 'Eyan Smith (Direct Mentee)', title: 'Refund request pending PT limit', subtitle: 'Waiting 14 minutes ago', severity: 'medium' },
  { id: 'an_3', icon: 'video', title: '36 mentees report invalid video URLs', subtitle: 'Across 4 cohorts', severity: 'medium' },
];

const RENEWALS = [
  { id: 'r_1', name: 'Prateek (TerX UX Team)', detail: 'Reports billing error on • 91 min', meta: '43 mentor ago' },
  { id: 'r_2', name: 'IIT Chennai: Allia A.', detail: 'Reports mentee absence • 14 hint', meta: '12 minutes ago' },
  { id: 'r_3', name: 'DBS Mumbai', detail: 'Renew due skip days • 50 Days', meta: '21 minute ago' },
];

const POLICIES = [
  {
    id: 'p_refund', name: 'Refund Policy', status: 'Active', version: '3.2', updated: '12d ago', author: 'Rakesh K',
    rule: 'Who gets credits or cash back and when',
    owner: 'Super Admin', visibleTo: 'Everyone sees policy summary; only SA acts',
    canRequestChange: 'Yes, via ticket',
    defaultRec: 'Credits auto-refund within allowed window; cash refunds reviewed',
    designNotes: 'Show policy summary inside cancel flow before final confirmation',
  },
  {
    id: 'p_noshow', name: 'No-show Policy', status: 'Active', version: '2.0', updated: '34d ago', author: 'Rakesh K',
    rule: 'Mentor no-show vs mentee no-show',
    owner: 'Super Admin', visibleTo: 'Everyone sees consequences',
    canRequestChange: 'No direct change; request only',
    defaultRec: 'Distinct handling for mentee and mentor no-shows',
    designNotes: 'Explain exactly what happens to credits and ratings',
  },
  {
    id: 'p_cancel', name: 'Cancellation Policy', status: 'Active', version: '1.4', updated: '8d ago', author: 'Anita S',
    rule: 'Allowed window, partial or no refund, late cancel flag',
    owner: 'Super Admin', visibleTo: 'Everyone sees summary',
    canRequestChange: 'OA may request org-level exception',
    defaultRec: 'Simple thresholds, not dense legal text',
    designNotes: 'Plain-English checklist in cancel modal',
  },
  {
    id: 'p_sla', name: 'Response SLA', status: 'Active', version: '1.1', updated: '20d ago', author: 'Vivek P',
    rule: 'How fast tickets / mentor replies should move',
    owner: 'Super Admin', visibleTo: 'Role-specific display',
    canRequestChange: 'OA can request stricter org SLAs',
    defaultRec: 'Mentor profile can show "usually responds in X hours / days"',
    designNotes: 'Badge should be auto-calculated, not manually claimed',
  },
  {
    id: 'p_premium', name: 'Premium Mentor Access', status: 'Active', version: '1.0', updated: '40d ago', author: 'Sarah M',
    rule: 'Which plans / orgs see premium pool',
    owner: 'Super Admin', visibleTo: 'Relevant admins + users',
    canRequestChange: 'OA may request upgrade',
    defaultRec: 'Treat premium access as clear add-on',
    designNotes: 'Show locked state + upgrade / request path',
  },
  {
    id: 'p_credreq', name: 'Credit Request Chain', status: 'Active', version: '2.1', updated: '6d ago', author: 'Rakesh K',
    rule: 'Mentee → Org Admin → Super Admin if pool insufficient',
    owner: 'Org Admin / Super Admin', visibleTo: 'Requester sees status only',
    canRequestChange: 'Yes',
    defaultRec: 'Formal queue with status and reasoning',
    designNotes: 'Status chips: Pending / Approved / Rejected / Escalated',
  },
];

const CREDIT_LAYERS = [
  {
    layer: 'Credit object', desc: 'Credit = abstract value unit consumed by mentor tier / session type',
    owner: 'Super Admin', visibleTo: 'All roles see only relevant views',
    canRequestChange: 'OA yes, mentor / mentee no',
    defaultRec: 'Keep 1 credit = simplest base unit; burn varies by mentor tier or session type',
    designNotes: 'Always show remaining balance + validity in plain language',
  },
  {
    layer: 'Org wallet', desc: 'Master balance for an org',
    owner: 'Super Admin / Org Admin', visibleTo: 'SA, OA, scoped OS if delegated',
    canRequestChange: 'Yes — OA to SA for top-up / exception',
    defaultRec: 'One org wallet with programme sub-ledgers where needed',
    designNotes: 'Keep org balance and expiry on OA home',
  },
  {
    layer: 'Programme ledger', desc: 'Programme-specific budget / burn',
    owner: 'Org Admin', visibleTo: 'OA, scoped OS',
    canRequestChange: 'Yes',
    defaultRec: 'Use where cohorts / programmes need ring-fenced budgets',
    designNotes: 'Do not expose unless the org actually uses programme budgets',
  },
  {
    layer: 'Mentee wallet', desc: 'Bookable balance for an end user',
    owner: 'OA or system', visibleTo: 'Mentee, OA, scoped OS',
    canRequestChange: 'Yes — mentee can request more credits',
    defaultRec: 'Show credits, expiry, pending refunds, and booked-but-not-yet-consumed credits',
    designNotes: 'Use a simple progress bar',
  },
  {
    layer: 'External purchase packs', desc: 'Self-serve B2C packs',
    owner: 'Super Admin', visibleTo: 'External mentees',
    canRequestChange: 'No — can only purchase allowed packs',
    defaultRec: 'Starter / Growth / Accelerator style packs',
    designNotes: 'Keep pricing explanation simple; avoid finance jargon',
  },
];

// Canonical 11-row commercial-logic sheet — the single source of truth for
// design / product / finance / tech alignment per the spec header.
// This array preserves the exact order, language, and column structure of the sheet.
const COMMERCIAL_LOGIC = [
  // Credit layers (5)
  { kind: 'credit', layer: 'Credit object',           rule: 'Credit = abstract value unit consumed by mentor tier / session type', owner: 'Super Admin',              visibleTo: 'All roles see only relevant views',          canRequestChange: 'OA yes, mentor / mentee no',          defaultRec: 'Keep 1 credit = simplest base unit; burn varies by mentor tier or session type',                  designNotes: 'Always show remaining balance + validity in plain language' },
  { kind: 'credit', layer: 'Org wallet',              rule: 'Master balance for an org',                                            owner: 'Super Admin / Org Admin',  visibleTo: 'SA, OA, scoped OS if delegated',             canRequestChange: 'Yes — OA to SA for top-up / exception', defaultRec: 'One org wallet with programme sub-ledgers where needed',                                          designNotes: 'Keep org balance and expiry on OA home' },
  { kind: 'credit', layer: 'Programme ledger',        rule: 'Programme-specific budget / burn',                                     owner: 'Org Admin',                visibleTo: 'OA, scoped OS',                              canRequestChange: 'Yes',                                  defaultRec: 'Use where cohorts / programmes need ring-fenced budgets',                                         designNotes: 'Do not expose unless the org actually uses programme budgets' },
  { kind: 'credit', layer: 'Mentee wallet',           rule: 'Bookable balance for an end user',                                     owner: 'OA or system',             visibleTo: 'Mentee, OA, scoped OS',                      canRequestChange: 'Yes — mentee can request more credits', defaultRec: 'Show credits, expiry, pending refunds, and booked-but-not-yet-consumed credits',                  designNotes: 'Use a simple progress bar' },
  { kind: 'credit', layer: 'External purchase packs', rule: 'Self-serve B2C packs',                                                 owner: 'Super Admin',              visibleTo: 'External mentees',                           canRequestChange: 'No — can only purchase allowed packs',  defaultRec: 'Starter / Growth / Accelerator style packs',                                                       designNotes: 'Keep pricing explanation simple; avoid finance jargon' },
  // Bridge — credit request chain (1)
  { kind: 'chain',  layer: 'Credit request chain',    rule: 'Mentee → Org Admin → Super Admin if pool insufficient',                owner: 'Org Admin / Super Admin',  visibleTo: 'Requester sees status only',                 canRequestChange: 'Yes',                                  defaultRec: 'Formal queue with status and reasoning',                                                          designNotes: 'Status chips: Pending / Approved / Rejected / Escalated' },
  // Policies (5)
  { kind: 'policy', layer: 'Refund policy',           rule: 'Who gets credits or cash back and when',                               owner: 'Super Admin',              visibleTo: 'Everyone sees policy summary; only SA acts', canRequestChange: 'Yes, via ticket',                      defaultRec: 'Credits auto-refund within allowed window; cash refunds reviewed',                                designNotes: 'Show policy summary inside cancel flow before final confirmation' },
  { kind: 'policy', layer: 'No-show policy',          rule: 'Mentor no-show vs mentee no-show',                                     owner: 'Super Admin',              visibleTo: 'Everyone sees consequences',                 canRequestChange: 'No direct change; request only',       defaultRec: 'Distinct handling for mentee and mentor no-shows',                                                designNotes: 'Explain exactly what happens to credits and ratings' },
  { kind: 'policy', layer: 'Cancellation policy',     rule: 'Allowed window, partial or no refund, late cancel flag',               owner: 'Super Admin',              visibleTo: 'Everyone sees summary',                      canRequestChange: 'OA may request org-level exception',   defaultRec: 'Simple thresholds, not dense legal text',                                                         designNotes: 'Plain-English checklist in cancel modal' },
  { kind: 'policy', layer: 'Response SLA',            rule: 'How fast tickets / mentor replies should move',                        owner: 'Super Admin',              visibleTo: 'Role-specific display',                      canRequestChange: 'OA can request stricter org SLAs',     defaultRec: 'Mentor profile can show "usually responds in X hours / days"',                                    designNotes: 'Badge should be auto-calculated, not manually claimed' },
  { kind: 'policy', layer: 'Premium mentor access',   rule: 'Which plans / orgs see premium pool',                                  owner: 'Super Admin',              visibleTo: 'Relevant admins + users',                    canRequestChange: 'OA may request upgrade',               defaultRec: 'Treat premium access as clear add-on',                                                            designNotes: 'Show locked state + upgrade / request path' },
];

let USERS_ALL = range(36).map((i) => ({
  id: 'u_' + (i + 1),
  name: pick(MENTOR_NAMES),
  email: 'user' + i + '@mentorunion.io',
  role: pick(['Super Admin','Platform Admin','Org Admin','Sub-admin','Mentor','Mentee','Support']),
  org: pick(ORG_NAMES),
  status: pick(['Active','Active','Active','Suspended','Invited']),
  mfa: rng() > 0.3 ? 'Enabled' : 'Disabled',
  lastActive: pick(['just now','1h ago','3d ago','2w ago']),
  joined: '2025-' + String(Math.floor(rng()*12)+1).padStart(2,'0') + '-' + String(Math.floor(rng()*28)+1).padStart(2,'0'),
}));

const ACCESS_REQUESTS = range(8).map((i) => ({
  id: 'ar_' + (i + 1),
  user: pick(USERS_ALL).name,
  fromRole: 'Sub-admin',
  toRole: pick(['Org Admin','Platform Admin']),
  reason: pick(['Cohort onboarding','Mentor approval load','Billing reconciliation','Audit need']),
  requestedBy: pick(USERS_ALL).name,
  status: pick(['Pending','Pending','Approved','Denied']),
  age: Math.floor(rng() * 72) + 1,
  expiry: pick(['7 days','30 days','Permanent','90 days']),
}));

let AUDIT_LOG = range(20).map((i) => ({
  id: 'al_' + (i + 1),
  who: pick(USERS_ALL).name,
  action: pick(['Updated policy','Created org','Suspended user','Reset MFA','Exported data','Approved exception','Changed credit cap','Published role','Disabled webhook']),
  object: pick(['Policy/Refund-v3.2','Org/IIM-B','User/u_24','Org/Stanford','Role/OrgAdmin']),
  when: pick(['2m ago','17m ago','1h ago','3h ago','1d ago','3d ago']),
  ip: '10.' + Math.floor(rng()*255) + '.' + Math.floor(rng()*255) + '.' + Math.floor(rng()*255),
  result: pick(['Success','Success','Success','Failed']),
}));

let INVOICES = range(14).map((i) => ({
  id: 'INV-' + (4400 + i),
  org: pick(ORG_NAMES),
  amount: Math.floor(rng() * 240000) + 8000,
  status: pick(['Paid','Paid','Pending','Overdue','Draft']),
  issued: pick(['Mar 12','Mar 18','Apr 02','Apr 14','Apr 20']),
  due: pick(['Apr 12','Apr 18','May 02','May 14','May 20']),
}));

let PAYOUTS = range(12).map((i) => ({
  id: 'PAY-' + (8800 + i),
  mentor: pick(MENTOR_NAMES),
  amount: Math.floor(rng() * 84000) + 2000,
  status: pick(['Scheduled','Sent','Pending Approval','Failed']),
  cycle: pick(['Apr W1','Apr W2','Apr W3','Apr W4']),
  method: pick(['Bank ACH','UPI','Wire','PayPal']),
}));

const REFUNDS = range(10).map((i) => ({
  id: 'RF-' + (300 + i),
  mentee: pick(MENTEES).name,
  amount: Math.floor(rng() * 8000) + 400,
  reason: pick(['Duplicate booking','Mentor no-show','Wrong slot','Tech issue','Cancelled by org']),
  status: pick(['Pending','Approved','Denied','Pending']),
  age: Math.floor(rng() * 96) + 1,
}));

const PROGRAMMES = range(12).map((i) => ({
  id: 'pr_' + (i + 1),
  name: pick(['Leadership Sprint','Product Bootcamp','UX Foundations','Data for PMs','Founder Pulse','Strategy Masters','Career Switch','Sales Excellence']),
  org: pick(ORG_NAMES),
  cohorts: Math.floor(rng() * 6) + 1,
  mentees: Math.floor(rng() * 240) + 12,
  completion: 40 + Math.floor(rng() * 58),
  status: pick(['Active','Active','Paused','Draft']),
  startDate: '2026-' + String(Math.floor(rng()*12)+1).padStart(2,'0') + '-' + String(Math.floor(rng()*28)+1).padStart(2,'0'),
}));

const WEBSITES = range(8).map((i) => ({
  id: 'w_' + (i + 1),
  org: pick(ORG_NAMES),
  domain: 'learn.' + pick(ORG_NAMES).toLowerCase().replace(/\s+/g,'') + '.com',
  brandStatus: pick(['Live','Pending Review','Live','Draft']),
  lastChange: pick(['2h ago','1d ago','5d ago','12h ago']),
  changesPending: Math.floor(rng() * 4),
}));

const ABUSE_CASES = range(8).map((i) => ({
  id: 'ab_' + (i + 1),
  who: pick(MENTOR_NAMES),
  category: pick(['Harassment','Off-platform contact','Payment fraud','Identity misrepresent','Inappropriate content']),
  evidence: pick(['Strong','Strong','Pending','Weak']),
  status: pick(['Investigating','New','Frozen','Resolved']),
  age: Math.floor(rng() * 240) + 1,
  reporter: pick(MENTEE_FIRST) + ' ' + pick(['Patel','Khan','Iyer']),
}));

const RISK_SIGNALS = range(10).map((i) => ({
  id: 'rs_' + (i + 1),
  signal: pick(['Repeat no-show','Velocity anomaly','Login from new geo','Bulk credits redeemed','Failed payment retries','Off-hours bulk export']),
  entity: pick(MENTOR_NAMES) + ' / ' + pick(ORG_NAMES),
  confidence: Math.floor(rng() * 40) + 60,
  status: pick(['Open','Acknowledged','Closed','Open']),
  detected: pick(['12m ago','3h ago','1d ago','2d ago']),
}));

const CHATBOT_HANDOFFS = range(10).map((i) => ({
  id: 'cb_' + (i + 1),
  user: pick(MENTEES).name,
  topic: pick(['Refund query','Credit balance','Mentor mismatch','Booking issue','Login failed']),
  reason: pick(['Confidence < 60%','User frustrated','3+ retries','Sensitive topic']),
  waitTime: Math.floor(rng() * 18),
  status: pick(['In Queue','Handled','Escalated']),
}));

const TEMPLATES = [
  { id: 't_1', name: 'Welcome — New Mentee', channel: 'Email', status: 'Active', vars: 8, lastEdit: '4d ago' },
  { id: 't_2', name: 'Session Reminder', channel: 'WhatsApp', status: 'Active', vars: 5, lastEdit: '1d ago' },
  { id: 't_3', name: 'Payment Failed', channel: 'Email + SMS', status: 'Active', vars: 6, lastEdit: '12d ago' },
  { id: 't_4', name: 'Mentor LOE Re-trigger', channel: 'Email', status: 'Draft', vars: 12, lastEdit: '2d ago' },
  { id: 't_5', name: 'Renewal Reminder', channel: 'Email', status: 'Active', vars: 9, lastEdit: '8d ago' },
  { id: 't_6', name: 'Org Admin Invite', channel: 'Email', status: 'Active', vars: 7, lastEdit: '20d ago' },
  { id: 't_7', name: 'Refund Approved', channel: 'Email', status: 'Active', vars: 6, lastEdit: '6d ago' },
  { id: 't_8', name: 'Mentor Quality Nudge', channel: 'In-app', status: 'Paused', vars: 4, lastEdit: '40d ago' },
];

const INTEGRATIONS = [
  { id: 'in_1', name: 'Stripe', kind: 'Payments', status: 'Healthy', lastEvent: '4s ago', latency: '120ms' },
  { id: 'in_2', name: 'Razorpay', kind: 'Payments', status: 'Healthy', lastEvent: '12s ago', latency: '94ms' },
  { id: 'in_3', name: 'SendGrid', kind: 'Email', status: 'Degraded', lastEvent: '2m ago', latency: '840ms' },
  { id: 'in_4', name: 'Twilio WhatsApp', kind: 'Messaging', status: 'Healthy', lastEvent: '8s ago', latency: '210ms' },
  { id: 'in_5', name: 'Salesforce', kind: 'CRM', status: 'Healthy', lastEvent: '1m ago', latency: '450ms' },
  { id: 'in_6', name: 'Zoom', kind: 'Video', status: 'Healthy', lastEvent: '20s ago', latency: '180ms' },
  { id: 'in_7', name: 'GA4', kind: 'Analytics', status: 'Healthy', lastEvent: '34s ago', latency: '110ms' },
  { id: 'in_8', name: 'Slack', kind: 'Internal', status: 'Healthy', lastEvent: '5s ago', latency: '60ms' },
];

const FEATURE_FLAGS = [
  { id: 'f_1', name: 'mentor_visibility_v2', env: 'production', state: 'on', rollout: 100, owner: 'Platform' },
  { id: 'f_2', name: 'auto_refund_threshold', env: 'production', state: 'on', rollout: 60, owner: 'Billing' },
  { id: 'f_3', name: 'chatbot_first_response', env: 'staging', state: 'off', rollout: 0, owner: 'Support' },
  { id: 'f_4', name: 'bulk_credit_allocation', env: 'production', state: 'on', rollout: 100, owner: 'Billing' },
  { id: 'f_5', name: 'sla_breach_auto_escalate', env: 'production', state: 'on', rollout: 80, owner: 'Support' },
  { id: 'f_6', name: 'mis_v3', env: 'production', state: 'on', rollout: 25, owner: 'Quality' },
];

// 14 core logic controllers from the control-plane spec
const LOGIC_CONTROLLERS = [
  { id: 'lc_role', domain: 'roles', name: 'Role Creator', governs: 'Creates new role templates and access bundles', owner: 'Super Admin', editor: 'Super Admin only', scope: 'Platform-wide', defaultBehaviour: 'New roles inherit no access until explicitly granted', overridePath: 'Copy existing role → edit → simulate → publish', audit: 'Who created role, what changed, who approved, version rollback', uiLocation: 'Users & Access › Roles & Permissions', status: 'Running', lastFired: '2d ago', firesPerMin: 0.01, recentEvents: [
    { when: '2d ago', actor: 'sa@mu', what: 'Published v3 of "Cohort Lead" role · 1 capability added' },
    { when: '5d ago', actor: 'sa@mu', what: 'Cloned "Sub-Admin" template → "Sub-Admin (read-only)"' },
    { when: '12d ago', actor: 'sa@mu', what: 'Rolled back "Org Admin" role to v2 (audit-triggered)' },
  ] },
  { id: 'lc_perm', domain: 'roles', name: 'Permission Engine', governs: 'Maps actions to roles and scopes', owner: 'Super Admin', editor: 'SA; OA only for delegated org roles', scope: 'Platform / Org', defaultBehaviour: 'Every action checked before render and before submit', overridePath: 'Time-boxed access request', audit: 'Decision + expiry + actor log', uiLocation: 'Users & Access › Access Requests', status: 'Running', lastFired: '12m ago', firesPerMin: 84, recentEvents: [
    { when: '12m ago', actor: 'system', what: '14,820 permission checks · 3 denials in last hour' },
    { when: '1h ago', actor: 'oa@iimb', what: 'Granted "Approve credit refund" to Sub-Admin (expires in 7d)' },
    { when: '4h ago', actor: 'system', what: 'Denied "Edit programme content" → Sub-Admin (escalated to OA)' },
  ] },
  { id: 'lc_policy', domain: 'policies', name: 'Policy Creator', governs: 'Cancellation, reschedule, no-show, refund, support SLA, reminder, premium access', owner: 'Super Admin', editor: 'SA; scoped fields by Org Admin', scope: 'Platform / Org', defaultBehaviour: 'Human-readable rules with effective dates', overridePath: 'Draft → simulation → publish', audit: 'Before/after values + impacted entities', uiLocation: 'Settings › Policy Creator', status: 'Running', lastFired: '6h ago', firesPerMin: 0.2, recentEvents: [
    { when: '6h ago', actor: 'sa@mu', what: 'Published No-show Policy v4 (mentee strike threshold 3 → 2)' },
    { when: '2d ago', actor: 'oa@iimb', what: 'Edited Cancellation Policy scoped fields (24h window held)' },
    { when: '8d ago', actor: 'sa@mu', what: 'Simulated Refund Policy v3 against last 1,000 sessions · 4 false positives' },
  ] },
  { id: 'lc_credit', domain: 'credits', name: 'Credit Engine', governs: 'Credit object, burn rate, tier logic, validity, expiry', owner: 'Super Admin', editor: 'Super Admin', scope: 'Platform-wide with org-level allocations', defaultBehaviour: '1 session burns credits by mentor tier / session type', overridePath: 'Manual adjustment with confirmation', audit: 'Every transaction + reason + owner', uiLocation: 'Credits & Billing › Credit Engine', status: 'Running', lastFired: '4m ago', firesPerMin: 12, recentEvents: [
    { when: '4m ago', actor: 'system', what: 'Burned 2 credits — mentee A.S. booked Good-tier session' },
    { when: '18m ago', actor: 'system', what: 'Burned 3 credits — Excellent-tier mentor booked' },
    { when: '1h ago', actor: 'sa@mu', what: 'Manual adjustment: +5 credits to D.P. (reason: mentor no-show)' },
  ] },
  { id: 'lc_alloc', domain: 'credits', name: 'Allocation Engine', governs: 'Moves credits from org → programme → mentee', owner: 'Org Admin', editor: 'Org Admin; Sub-admin if delegated', scope: 'Org / Programme', defaultBehaviour: 'Checks caps, balance, expiry, permissions before move', overridePath: 'Reverse / top-up with logged reason', audit: 'Bulk upload log, approval log', uiLocation: 'Credits › Allocations', status: 'Running', lastFired: '14m ago', firesPerMin: 1.4, recentEvents: [
    { when: '14m ago', actor: 'oa@iimb', what: 'Allocated 1,200 credits → Cohort Alpha programme ledger' },
    { when: '3h ago', actor: 'os@mukesh', what: 'Bulk allocation: 240 credits across 12 mentees (CSV upload)' },
    { when: '1d ago', actor: 'oa@iimb', what: 'Reversed 60 credits from Programme X (reason: cohort cancelled)' },
  ] },
  { id: 'lc_booking', domain: 'approvals', name: 'Booking Lock Controller', governs: 'Prevents slot race conditions', owner: 'System Services', editor: 'No manual edit; thresholds configurable by Super Admin', scope: 'Booking flow', defaultBehaviour: 'First valid confirm wins lock; second user gets alternates', overridePath: 'No manual override during active lock', audit: 'Lock time, actor, affected slot', uiLocation: 'Settings › Logic Controllers', status: 'Running', lastFired: '38s ago', firesPerMin: 38, recentEvents: [
    { when: '38s ago', actor: 'system', what: 'Lock acquired · slot 4pm/Tue → mentee A.S. (alternate offered to D.P.)' },
    { when: '2m ago', actor: 'system', what: 'Lock TTL expired without confirm → slot released' },
    { when: '6m ago', actor: 'sa@mu', what: 'Tuned timeout 60s → 45s (effective immediately)' },
  ] },
  { id: 'lc_approval', domain: 'approvals', name: 'Approval Mode Controller', governs: 'Auto-accept vs manual approval for mentors / programmes', owner: 'Super Admin / Org Admin', editor: 'SA; OA within scope', scope: 'Org / Programme / Mentor', defaultBehaviour: 'Booking follows configured approval path', overridePath: 'Temporary override for incident management', audit: 'Who changed approval mode and why', uiLocation: 'Mentor Pool / Programmes / Settings', status: 'Running', lastFired: '1h ago', firesPerMin: 4, recentEvents: [
    { when: '1h ago', actor: 'system', what: 'Routed booking through Manual approval (mentor: P. Iyer)' },
    { when: '4h ago', actor: 'mentor@piyer', what: 'Switched own profile from Auto-accept → Manual' },
    { when: '2d ago', actor: 'sa@mu', what: 'Temporary override: 24h Auto-accept on Cohort Sigma (incident: backlog)' },
  ] },
  { id: 'lc_avail', domain: 'automation', name: 'Availability & Buffer Logic', governs: 'Lead time, buffer, slot cap/floor, extra slots', owner: 'Super Admin / Mentor', editor: 'SA defaults; Mentor for own; OA local floor/cap', scope: 'Platform / Org / Mentor', defaultBehaviour: 'Protects capacity and quality', overridePath: 'Per-mentor or per-org override', audit: 'Change log + resulting impact on bookings', uiLocation: 'Mentor Availability + Settings', status: 'Running', lastFired: '12m ago', firesPerMin: 6, recentEvents: [
    { when: '12m ago', actor: 'mentor@nsharma', what: 'Lead time 24h → 12h · estimated +3 bookable slots / week' },
    { when: '2h ago', actor: 'oa@iimb', what: 'Set local floor: every mentor in org needs ≥ 4 slots / week' },
    { when: '1d ago', actor: 'sa@mu', what: 'Updated platform default buffer 10m → 15m' },
  ] },
  { id: 'lc_mis', domain: 'automation', name: 'MIS Scoring Engine', governs: 'Calculates Mentor Impact Score', owner: 'Super Admin', editor: 'Super Admin', scope: 'Platform-wide', defaultBehaviour: 'Reads activity, ratings, profile completion, demand, booking quality', overridePath: 'Visibility override only, not score rewrite', audit: 'Versioned formula + recalculation log', uiLocation: 'Mentor Pool › Quality & MIS', status: 'Running', lastFired: '4h ago', firesPerMin: 0.05, recentEvents: [
    { when: '4h ago', actor: 'system', what: 'Recomputed MIS for 34 mentors (weekly batch) · avg shift +0.4' },
    { when: '3d ago', actor: 'sa@mu', what: 'Hid mentor X from marketplace (visibility override) — score retained' },
    { when: '14d ago', actor: 'sa@mu', what: 'Published formula v6 — added "repeat booking %" weight 0.15' },
  ] },
  { id: 'lc_comm', domain: 'automation', name: 'Communication Engine', governs: 'Email, WhatsApp, in-app sends and reminders', owner: 'Super Admin / Org Admin', editor: 'SA; OA in allowed zones', scope: 'Platform / Org', defaultBehaviour: 'Uses templates, frequency caps, audience rules', overridePath: 'Manual blast or automated trigger', audit: 'Who sent what to whom and why', uiLocation: 'Settings › Templates / Support / Communications', status: 'Running', lastFired: '20s ago', firesPerMin: 280, recentEvents: [
    { when: '20s ago', actor: 'system', what: 'Sent 142 reminders (Email · session in 24h template)' },
    { when: '12m ago', actor: 'os@mukesh', what: 'Triggered manual reminder to 12 low-attendance mentees' },
    { when: '4h ago', actor: 'oa@iimb', what: 'Edited template "Cohort start" within allowed zone' },
  ] },
  { id: 'lc_refund', domain: 'risk', name: 'Refund & Exception Engine', governs: 'Refunds, chargebacks, failed payments, disputes', owner: 'Super Admin', editor: 'SA; OA may request only', scope: 'Platform / Org', defaultBehaviour: 'Checks payment source, policy, approval route', overridePath: 'Exception request with evidence', audit: 'Approval chain + financial record', uiLocation: 'Credits & Billing › Refunds & Exceptions', status: 'Running', lastFired: '2h ago', firesPerMin: 0.3, recentEvents: [
    { when: '2h ago', actor: 'sa@mu', what: 'Approved refund request — mentor no-show (1 credit + 50% session fee)' },
    { when: '1d ago', actor: 'system', what: 'Auto-flagged 2 chargebacks · routed to SA queue' },
    { when: '3d ago', actor: 'sa@mu', what: 'Denied OA exception request (evidence insufficient)' },
  ] },
  { id: 'lc_invoice', domain: 'risk', name: 'Invoicing & Payout Engine', governs: 'Org invoices and mentor payouts', owner: 'Super Admin', editor: 'SA; mentors view only; OA view by org', scope: 'Platform / Org / Mentor', defaultBehaviour: 'Draft → review → paid / archive', overridePath: 'Dispute / manual adjustment', audit: 'Line-item trail + payer proof', uiLocation: 'Credits & Billing › Invoices & Payouts', status: 'Running', lastFired: '3h ago', firesPerMin: 0.1, recentEvents: [
    { when: '3h ago', actor: 'system', what: 'Generated 34 mentor payout drafts for Apr cycle (₹4.18L total)' },
    { when: '1d ago', actor: 'sa@mu', what: 'Manual adjustment on INV-2391 (line-item dispute resolved)' },
    { when: '6d ago', actor: 'system', what: 'Paid 28 mentor payouts via Razorpay payouts API (Mar cycle)' },
  ] },
  { id: 'lc_chatbot', domain: 'ai-helpers', name: 'Chatbot Router', governs: 'Support triage and FAQ routing', owner: 'System Services', editor: 'SA configures intents; content owners update knowledge', scope: 'Platform / Org', defaultBehaviour: 'Resolves common intents first, escalates with context when confidence is low', overridePath: 'Human takeover', audit: 'Transcript + intent confidence + outcome', uiLocation: 'Global help widget / Support pages', status: 'Running', lastFired: '8s ago', firesPerMin: 92, recentEvents: [
    { when: '8s ago', actor: 'system', what: 'Resolved "How do I book a session?" (confidence 0.94)' },
    { when: '2m ago', actor: 'system', what: 'Escalated "Refund question" to human (confidence 0.38)' },
    { when: '12m ago', actor: 'sa@mu', what: 'Updated FAQ knowledge for "Mentor no-show" intent' },
  ] },
  { id: 'lc_aimile', domain: 'ai-helpers', name: 'AI Milestone Assistant', governs: 'Suggests career breakthrough reflections and summaries', owner: 'System Services', editor: 'Product owner configures prompts', scope: 'Mentor / Mentee own data only', defaultBehaviour: 'Drafts milestone suggestions from session feedback and journals', overridePath: 'User confirms or edits before saving', audit: 'What AI suggested vs what user saved', uiLocation: 'Mentor Impact / Mentee Progress', status: 'Running', lastFired: '40m ago', firesPerMin: 0.4, recentEvents: [
    { when: '40m ago', actor: 'system', what: 'Drafted "Job offer" milestone for mentee A.S. — pending confirmation' },
    { when: '4h ago', actor: 'mentee@diya', what: 'Confirmed AI-drafted "Promotion" milestone (edited 1 sentence)' },
    { when: '2d ago', actor: 'system', what: 'Drafted 3 milestones from last week’s feedback batch' },
  ] },
];

// Domain definitions per the spec header: "roles, credits, policies, approvals, automation, risk, and AI helpers"
const CONTROLLER_DOMAINS = [
  { key: 'roles',       label: 'Roles & access',     icon: Shield,    color: '#4ec3a9', summary: 'Who can do what' },
  { key: 'credits',     label: 'Credits & money',    icon: Wallet,    color: '#3a8db8', summary: 'Credit lifecycle and movement' },
  { key: 'policies',    label: 'Policies',           icon: FileText,  color: '#9b6dff', summary: 'Cancellation, refund, SLA, premium access' },
  { key: 'approvals',   label: 'Approvals & locks',  icon: BadgeCheck,color: '#e89456', summary: 'Race conditions and routing' },
  { key: 'automation',  label: 'Automation',         icon: Zap,       color: '#f3c969', summary: 'Comms, scoring, capacity defaults' },
  { key: 'risk',        label: 'Risk & finance',     icon: ShieldAlert,color: '#e25c5c', summary: 'Refunds, payouts, exceptions' },
  { key: 'ai-helpers',  label: 'AI helpers',         icon: Sparkles,  color: '#9b6dff', summary: 'Where AI drafts, never decides alone' },
];

// Permissions matrix from the simplified RBAC sheet
const PERMISSIONS_MATRIX = [
  { cap: 'Create / edit organisations', sa: 'Full', oa: 'Scoped', os: 'None', m: 'None', me: 'None' },
  { cap: 'Create / edit org programmes & cohorts', sa: 'Full', oa: 'Full', os: 'Scoped', m: 'None', me: 'None' },
  { cap: 'Create / edit org sub-admins', sa: 'Full', oa: 'Full', os: 'Scoped (only if delegated)', m: 'None', me: 'None' },
  { cap: 'Create custom roles', sa: 'Full', oa: 'None', os: 'None', m: 'None', me: 'None' },
  { cap: 'Assign permissions', sa: 'Full', oa: 'Scoped', os: 'None', m: 'None', me: 'None' },
  { cap: 'View all users across platform', sa: 'Full', oa: 'None', os: 'None', m: 'None', me: 'None' },
  { cap: 'View users inside own org / scope', sa: 'Full', oa: 'Full', os: 'Scoped', m: 'None', me: 'Own only where relevant' },
  { cap: 'Mentor onboarding / compliance approval', sa: 'Full', oa: 'Request / View', os: 'None', m: 'Own only', me: 'None' },
  { cap: 'Map mentors to orgs / programmes', sa: 'Full', oa: 'Full', os: 'Scoped', m: 'None', me: 'None' },
  { cap: 'Set mentor slot caps / floors', sa: 'Full', oa: 'Request / Scoped', os: 'None', m: 'Own availability only', me: 'None' },
  { cap: 'Edit mentor visibility', sa: 'Full', oa: 'Full', os: 'Scoped (curation only)', m: 'Own marketplace visibility only', me: 'None' },
  { cap: 'Allocate credits to orgs', sa: 'Full', oa: 'None', os: 'None', m: 'None', me: 'None' },
  { cap: 'Allocate credits to mentees', sa: 'Full', oa: 'Full', os: 'Scoped if delegated', m: 'None', me: 'None' },
  { cap: 'Purchase credits directly', sa: 'None', oa: 'None', os: 'None', m: 'None', me: 'Own (external only)' },
  { cap: 'Edit credit validity / expiry', sa: 'Full', oa: 'Request / View', os: 'None', m: 'None', me: 'None' },
  { cap: 'Refund / failed payment approval', sa: 'Full', oa: 'Request / View', os: 'Escalate only', m: 'View own payout impact', me: 'Raise ticket only' },
  { cap: 'Create / edit platform policies', sa: 'Full', oa: 'None', os: 'None', m: 'None', me: 'None' },
  { cap: 'Edit scoped org policies', sa: 'Full', oa: 'Scoped', os: 'None', m: 'None', me: 'None' },
  { cap: 'Send bulk communications', sa: 'Full', oa: 'Scoped', os: 'Scoped if delegated', m: 'None', me: 'None' },
  { cap: 'Raise support ticket', sa: 'Full', oa: 'Full', os: 'Full', m: 'Full', me: 'Full' },
  { cap: 'Resolve first-line tickets', sa: 'Full', oa: 'Full', os: 'Scoped', m: 'None', me: 'None' },
  { cap: 'Escalate tickets upward', sa: 'Full', oa: 'Full', os: 'Full', m: 'None', me: 'None' },
  { cap: 'View audit logs', sa: 'Full', oa: 'Scoped', os: 'Scoped', m: 'Own only', me: 'Own only' },
  { cap: 'Use chatbot + FAQ', sa: 'Full', oa: 'Full', os: 'Full', m: 'Full', me: 'Full' },
  { cap: 'View full reports', sa: 'Full', oa: 'Scoped', os: 'Scoped', m: 'Own only', me: 'Own only' },
  { cap: 'Export reports', sa: 'Full', oa: 'Scoped', os: 'Scoped', m: 'Own only', me: 'Own only' },
  { cap: 'Impersonate / read-only inspect user experience', sa: 'Full', oa: 'None', os: 'None', m: 'None', me: 'None' },
];

// Canonical user flows — the minimum flows product, design, and tech must get right first
// "controllers" lists which Logic Controllers fire during this flow (cross-reference to LOGIC_CONTROLLERS)
const CANONICAL_FLOWS = [
  { id: 'cf_org_onb',     name: 'Organisation onboarding',          actors: 'Super Admin → Org Admin',         trigger: 'New institution or corporate client signed', happy: 'Org is created, plan + credits assigned, branding and admins configured',                edges: 'Domain conflict, invite expiry, staged activation',           owner: 'Super Admin',                       controllers: ['lc_role','lc_perm','lc_alloc','lc_comm'] },
  { id: 'cf_mentor_onb',  name: 'Mentor onboarding',                actors: 'Super Admin → Mentor',            trigger: 'New mentor invited to platform pool',         happy: 'Mentor signs LOE, uploads docs, sets pricing + availability, gets verified and goes live', edges: 'Docs rejected, LOE re-trigger, compliance hold',              owner: 'Super Admin',                       controllers: ['lc_role','lc_perm','lc_avail','lc_comm'] },
  { id: 'cf_mentee_org',  name: 'Org mentee onboarding',            actors: 'Org Admin / Org Sub-Admin → Mentee', trigger: 'Institution invites user',                 happy: 'Mentee sets profile, sees credits + assigned programme, lands on dashboard',              edges: 'Bulk CSV errors, invite expiry, no credits assigned yet',     owner: 'Org Admin',                         controllers: ['lc_perm','lc_alloc','lc_comm'] },
  { id: 'cf_mentee_b2c',  name: 'External mentee self-serve',       actors: 'Mentee',                          trigger: 'User comes from website or social media',     happy: 'Signs up, claims free or paid entry path, books mentor',                                  edges: 'Needs credits before second session, purchase failure',       owner: 'Super Admin',                       controllers: ['lc_perm','lc_credit','lc_comm'] },
  { id: 'cf_book_std',    name: 'Standard booking',                 actors: 'Mentee → Mentor',                 trigger: 'Mentee selects visible slot and confirms',    happy: 'Credit deducted, session created, Zoom + chat unlocked, reminders scheduled',             edges: 'Race condition, insufficient credits, manual approval required', owner: 'Policy Creator + Credit Engine', controllers: ['lc_booking','lc_credit','lc_avail','lc_approval','lc_comm'] },
  { id: 'cf_book_req',    name: 'Request-a-slot booking',           actors: 'Mentee → Mentor',                 trigger: 'No open slot or mentor uses approval mode',   happy: 'Mentor accepts / suggests / declines and booking completes if both agree',                edges: 'Request expires, no response, suggest alternatives',          owner: 'Mentor / system controller',        controllers: ['lc_approval','lc_booking','lc_comm'] },
  { id: 'cf_session_day', name: 'Session day lifecycle',            actors: 'Mentor + Mentee',                 trigger: 'Confirmed session reaches time',              happy: 'Join, session runs, feedback requested, journal and earnings updated',                    edges: 'Late join, recording rules, post-session nudge',              owner: 'System Services + Policies',        controllers: ['lc_comm','lc_mis','lc_invoice','lc_aimile'] },
  { id: 'cf_cancel',      name: 'Cancellation / reschedule',        actors: 'Mentor or Mentee',                trigger: 'Someone cannot attend',                       happy: 'Policy applied, credits handled correctly, alternative suggestions shown',                edges: 'Late cancel, mentor cancel, repeat offender flags',           owner: 'Policy Creator',                    controllers: ['lc_policy','lc_credit','lc_comm'] },
  { id: 'cf_noshow',      name: 'No-show handling',                 actors: 'Mentor / Mentee / Org Admin',     trigger: 'Join threshold missed',                       happy: 'Correct no-show owner marked; credits, earnings, and flags updated',                      edges: 'Dispute / manual review, repeated no-shows',                  owner: 'Policy Creator + Risk rules',       controllers: ['lc_policy','lc_credit','lc_mis','lc_comm','lc_refund'] },
  { id: 'cf_credits',     name: 'Credit request / purchase / refund', actors: 'Mentee / OA / SA',              trigger: 'User needs more credits or asks for refund',  happy: 'Credits approved, purchased, refunded, or rejected with reason',                          edges: 'Pool insufficient, payment failure, disputed refund',         owner: 'Credit Engine + Finance controls',  controllers: ['lc_credit','lc_alloc','lc_refund','lc_invoice','lc_comm'] },
  { id: 'cf_ticket',      name: 'Ticket lifecycle + escalation',    actors: 'All roles',                       trigger: 'Support or abuse issue raised',               happy: 'Resolved at correct level or escalated with full context',                                edges: 'SLA breach, bot handoff, compliance investigation',           owner: 'Support & Risk',                    controllers: ['lc_chatbot','lc_perm','lc_comm'] },
  { id: 'cf_breakthrough',name: 'Career breakthrough logging',      actors: 'Mentor / Mentee + AI assistant',  trigger: 'User wants to record impact',                 happy: 'AI drafts milestone, user confirms, entry becomes part of impact history',                edges: 'No evidence, duplicate entries, user edits AI text',          owner: 'System Services + Product',         controllers: ['lc_aimile'] },
];

// Canonical visual & widget library — the design-system contract.
// Principle: use visuals only where they make decisions faster; tables remain the default action surface.
// Each row maps a role/page to its recommended visual primitive, its purpose, and the fallback when the
// visual is overkill. 16 rows total covering all 5 personas + a universal table fallback.
const VISUAL_LIBRARY = [
  { id: 'vl_sa_overview',  rolePage: 'Super Admin / Overview',         visual: 'KPI strip',                     useFor: 'Daily pulse',                                                why: 'Fast executive scan',                  placement: 'Top row',              fallback: 'Simple scorecards only',           kind: 'kpi',     persona: 'super_admin' },
  { id: 'vl_sa_ops',       rolePage: 'Super Admin / Operations Pulse', visual: 'Line chart',                    useFor: 'Sessions / completion / no-show trend',                      why: 'Shows movement, not just totals',      placement: 'Row 2 left',           fallback: 'Sparkline in KPI card',            kind: 'line',    persona: 'super_admin' },
  { id: 'vl_sa_credits',   rolePage: 'Super Admin / Credits',          visual: 'Waterfall chart',               useFor: 'Budget → burn → refund → exposure',                          why: 'Commercial reasoning made visible',    placement: 'Row 2 right',          fallback: 'Variance table',                   kind: 'water',   persona: 'super_admin' },
  { id: 'vl_sa_support',   rolePage: 'Super Admin / Support',          visual: 'Stacked bar by SLA status',     useFor: 'Ticket aging + breach risk',                                 why: 'Shows queue health quickly',           placement: 'Row 3',                fallback: 'Priority table',                   kind: 'stack',   persona: 'super_admin' },
  { id: 'vl_sa_risk',      rolePage: 'Super Admin / Risk',             visual: 'Heatmap',                       useFor: 'No-show windows, risky cohorts, risky domains',              why: 'Patterns are easier to spot than tables', placement: 'Row 3 right',       fallback: 'Conditional-format table',         kind: 'heat',    persona: 'super_admin' },
  { id: 'vl_oa_prog',      rolePage: 'Org Admin / Programme',          visual: 'Stacked column',                useFor: 'Programme completion by cohort',                             why: 'Shows healthy vs weak cohorts',        placement: 'Mid-page',             fallback: 'Table with status pills',          kind: 'stack',   persona: 'org_admin' },
  { id: 'vl_oa_capacity',  rolePage: 'Org Admin / Mentor Capacity',    visual: 'Bar chart',                     useFor: 'Domain supply vs demand',                                    why: 'Easy resourcing conversation',         placement: 'Mid-page',             fallback: 'Sorted table',                     kind: 'bar',     persona: 'org_admin' },
  { id: 'vl_oa_renew',     rolePage: 'Org Admin / Renewals',           visual: 'Timeline / calendar',           useFor: 'Upcoming plan / invoice events',                             why: 'Prevents surprise renewals',           placement: 'Side panel',           fallback: 'Date table',                       kind: 'time',    persona: 'org_admin' },
  { id: 'vl_m_home',       rolePage: 'Mentor / Home',                  visual: 'Badge set',                     useFor: 'Quick responder, top mentor, active last week, next available', why: 'Borrows marketplace trust signals', placement: 'Top KPI strip',     fallback: 'Single text line',                 kind: 'badge',   persona: 'mentor' },
  { id: 'vl_m_avail',      rolePage: 'Mentor / Availability',          visual: 'Calendar + heatmap',            useFor: 'Open slots + busy windows',                                  why: 'Mentor instantly sees booking capacity', placement: 'Main body',         fallback: 'Table of open slots',              kind: 'cal',     persona: 'mentor' },
  { id: 'vl_m_impact',     rolePage: 'Mentor / Impact',                visual: 'Trend line + timeline',         useFor: 'Ratings and breakthroughs over time',                        why: 'Makes impact tangible',                placement: 'Below earnings',       fallback: 'Simple list of milestones',        kind: 'line',    persona: 'mentor' },
  { id: 'vl_m_earn',       rolePage: 'Mentor / Earnings',              visual: 'Line / bar + table',            useFor: 'Monthly total + filtered org payout table',                  why: 'Total first, detail second',           placement: 'Mid-page',             fallback: 'Table only',                       kind: 'line',    persona: 'mentor' },
  { id: 'vl_me_explore',   rolePage: 'Mentee / Explorer',              visual: 'Cards with badges',             useFor: 'Next available, response speed, rating, plan cue',           why: 'Makes mentor selection easier',        placement: 'Explore page',         fallback: 'List rows',                        kind: 'cards',   persona: 'mentee' },
  { id: 'vl_me_progress',  rolePage: 'Mentee / Progress',              visual: 'Timeline',                      useFor: 'Clarity gains, job wins, confidence changes',                why: 'Simple ROI memory',                    placement: 'Home lower section',   fallback: 'Journal list',                     kind: 'time',    persona: 'mentee' },
  { id: 'vl_me_credits',   rolePage: 'Mentee / Credits',               visual: 'Gauge / progress bar',          useFor: 'Balance and expiry',                                         why: 'Easy to read, avoids finance confusion', placement: 'Home mid-right',     fallback: 'Plain text balance',               kind: 'gauge',   persona: 'mentee' },
  { id: 'vl_any_tables',   rolePage: 'Any role / tables',              visual: 'Conditional-format tables',     useFor: 'Actionable queues with severity',                            why: 'People act from tables faster than from charts', placement: 'Wherever work lists exist', fallback: 'Plain table with status pill', kind: 'table', persona: 'all' },
];

// Canonical marketplace cues to borrow — proven trust / friction-reducing patterns from
// established mentor marketplaces (MentorCruise, ADPList, Superpath, etc.) adapted to MentorUnion.
// Spec principle: borrow only the cues that reduce friction — responsiveness, availability,
// trust badges, social proof, similar mentors. 9 rows total.
const MARKETPLACE_CUES = [
  { id: 'mc_quick',     cue: 'Quick responder badge',                whereToUse: 'Mentor cards + mentor profile + mentor home', whyMatters: 'Creates trust before booking',           implNote: 'Auto-calc from median first-response time over last 30 days', kind: 'badge',     surfaces: ['discover_card','profile_preview','mentor_home'] },
  { id: 'mc_top',       cue: 'Top mentor badge',                     whereToUse: 'Mentor cards + profile',                       whyMatters: 'Marketplace social proof',               implNote: 'Use rules, not manual assignment',                            kind: 'badge',     surfaces: ['discover_card','profile_preview'] },
  { id: 'mc_responds',  cue: 'Usually responds in X hours / days',   whereToUse: 'Mentor profile + cards',                       whyMatters: 'Reduces uncertainty for mentees',        implNote: 'Plain language, not raw timestamp data',                      kind: 'text',      surfaces: ['discover_card','profile_preview'] },
  { id: 'mc_nextslot',  cue: 'Next available slot',                  whereToUse: 'Mentor cards + profile side panel',            whyMatters: 'Improves conversion',                    implNote: 'Show in viewer’s timezone',                                   kind: 'time',      surfaces: ['discover_card','profile_preview'] },
  { id: 'mc_active',    cue: 'Active last week / recently active',   whereToUse: 'Mentor profile',                               whyMatters: 'Signals live engagement',                implNote: 'Hide if stale for too long or show "less active"',            kind: 'badge',     surfaces: ['profile_preview'] },
  { id: 'mc_reviews',   cue: 'Review count + visible rating',        whereToUse: 'Mentor cards + profile',                       whyMatters: 'Social proof',                           implNote: 'Show aggregate, never expose raw review moderation data',     kind: 'rating',    surfaces: ['discover_card','profile_preview'] },
  { id: 'mc_similar',   cue: 'Similar mentors section',              whereToUse: 'Mentor profile',                               whyMatters: 'Keeps discovery flowing',                implNote: 'Based on domain, tier, availability, rating, org eligibility',kind: 'cards',     surfaces: ['profile_preview'] },
  { id: 'mc_plancard',  cue: 'Plan card / session card on profile',  whereToUse: 'Mentor profile right panel',                   whyMatters: 'Clarifies what user gets',               implNote: 'Keep plan descriptions short, with call count + response expectation', kind: 'card', surfaces: ['profile_preview'] },
  { id: 'mc_saved',     cue: 'Saved mentors',                        whereToUse: 'Mentee dashboard + explorer',                  whyMatters: 'Encourages return visits',               implNote: 'Allow notify-on-slot-open',                                   kind: 'list',      surfaces: ['discover_card','mentee_home','saved'] },
];

// Canonical sample data for the visuals — illustrative only, replace with live platform data later.
// Formulas are included for derived percentages. These 5 datasets correspond 1:1 to the visuals
// specified in VISUAL_LIBRARY for SA Operations Pulse, SA Credits, SA Support, OA Mentor Capacity,
// and Mentee Progress (reflective outcome distribution).

// 1) Weekly Operations Pulse — drives SA Operations Pulse line chart
const WEEKLY_OPS_PULSE = [
  { week: 'W1', scheduled: 420, completed: 362, noShows: 26, cancelled: 32 },
  { week: 'W2', scheduled: 455, completed: 392, noShows: 24, cancelled: 39 },
  { week: 'W3', scheduled: 470, completed: 401, noShows: 31, cancelled: 38 },
  { week: 'W4', scheduled: 510, completed: 441, noShows: 28, cancelled: 41 },
  { week: 'W5', scheduled: 525, completed: 454, noShows: 30, cancelled: 41 },
  { week: 'W6', scheduled: 548, completed: 476, noShows: 27, cancelled: 45 },
].map((r) => Object.assign({}, r, { completionRate: Math.round((r.completed / r.scheduled) * 1000) / 10 })); // formula: completed / scheduled

// 2) Credit Allocation Snapshot — drives SA Credits org-level bar / waterfall
const CREDIT_ALLOC_SNAPSHOT = [
  { org: "Masters' Union",   allocated: 1200, consumed: 860, remaining: 340 },
  { org: 'Tetr',             allocated: 900,  consumed: 640, remaining: 260 },
  { org: 'Corporate Alpha',  allocated: 650,  consumed: 510, remaining: 140 },
  { org: 'Institution Beta', allocated: 500,  consumed: 290, remaining: 210 },
  { org: 'External B2C',     allocated: 300,  consumed: 180, remaining: 120 },
];

// 3) Ticket SLA Snapshot — drives SA Support stacked bar header (platform-level totals)
const TICKET_SLA_SNAPSHOT = [
  { status: 'Resolved in SLA', count: 84, tone: 'good' },
  { status: 'At Risk',         count: 19, tone: 'warn' },
  { status: 'Breached',        count: 7,  tone: 'bad'  },
]; // total 110

// 4) Mentor Supply by Domain — drives OA Mentor Capacity bar chart
const MENTOR_SUPPLY_BY_DOMAIN = [
  { domain: 'Software / Product',     activeMentors: 45, openSlots: 188, bookedSessions: 152 },
  { domain: 'Finance / Consulting',   activeMentors: 31, openSlots: 121, bookedSessions: 103 },
  { domain: 'Leadership / Management',activeMentors: 22, openSlots: 88,  bookedSessions: 69  },
  { domain: 'Admissions / Career',    activeMentors: 28, openSlots: 95,  bookedSessions: 90  },
  { domain: 'Design / UI UX',         activeMentors: 17, openSlots: 64,  bookedSessions: 49  },
];

// 5) Reflective Outcome Log Mix — drives Mentee progress timeline / breakthrough distribution
const REFLECTIVE_OUTCOME_MIX = [
  { type: 'Internship / Job achieved',   count: 26, color: '#9b6dff' },
  { type: 'Clarity gain logged',         count: 71, color: '#4ec3a9' },
  { type: 'Skill confidence increase',   count: 54, color: '#3a8db8' },
]; // total 151

// 6) No-show heatmap (6 time windows × Mon-Sat) — drives SA Risk page heatmap.
// Canonical sample data per "Sample Dashboard Visuals" sheet. Each row is a time window,
// each column is a day. Pattern: no-shows concentrate at end-of-day on Fri / Sat.
const NO_SHOW_HEATMAP_ROWS = ['9am','11am','1pm','3pm','5pm','7pm'];
const NO_SHOW_HEATMAP_COLS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const NO_SHOW_HEATMAP_DATA = [
  //Mon Tue Wed Thu Fri Sat
  [ 3,  2,  2,  4,  6,  5 ], // 9am
  [ 2,  1,  2,  3,  5,  4 ], // 11am
  [ 1,  2,  1,  3,  4,  4 ], // 1pm
  [ 2,  2,  3,  4,  5,  6 ], // 3pm
  [ 4,  4,  5,  6,  8,  9 ], // 5pm
  [ 3,  3,  4,  5,  7,  8 ], // 7pm
];

const EXPORTS_HISTORY = range(8).map((i) => ({
  id: 'EXP-' + (700 + i),
  name: pick(['Org performance Q1','Mentor earnings Apr','Mentee feedback raw','Refund log','Audit dump']),
  format: pick(['CSV','XLSX','PDF']),
  size: (rng() * 18 + 0.4).toFixed(1) + ' MB',
  status: pick(['Ready','Processing','Failed','Ready']),
  requestedBy: pick(USERS_ALL).name,
  when: pick(['12m ago','1h ago','3h ago','1d ago']),
}));

const CREDIT_TIERS = [
  { tier: 'Basic', credits: 1, eligibility: 'MIS < 70', mentors: 64, color: 'green' },
  { tier: 'Good', credits: 2, eligibility: 'MIS 70–84', mentors: 142, color: 'yellow' },
  { tier: 'Excellent', credits: 3, eligibility: 'MIS 85+', mentors: 38, color: 'purple' },
];

const ROLES = [
  { id: 'r_1', name: 'Super Admin', users: 4, scope: 'Platform-wide', updated: '90d ago', version: '4.1', publishedBy: 'Rakesh K' },
  { id: 'r_2', name: 'Platform Admin', users: 12, scope: 'Platform-wide (read-write)', updated: '40d ago', version: '3.2', publishedBy: 'Rakesh K' },
  { id: 'r_3', name: 'Org Admin', users: 28, scope: 'Org', updated: '12d ago', version: '5.0', publishedBy: 'Anita S' },
  { id: 'r_4', name: 'Sub-admin (Org)', users: 84, scope: 'Org (limited)', updated: '8d ago', version: '2.4', publishedBy: 'Anita S' },
  { id: 'r_5', name: 'Support L1', users: 6, scope: 'Tickets read + assign', updated: '60d ago', version: '1.3', publishedBy: 'Vivek P' },
  { id: 'r_6', name: 'Support L2', users: 3, scope: 'Tickets full + escalate', updated: '60d ago', version: '1.3', publishedBy: 'Vivek P' },
  { id: 'r_7', name: 'Auditor (Read-only)', users: 2, scope: 'Read-only platform', updated: '120d ago', version: '1.0', publishedBy: 'Rakesh K' },
];

// Five human-facing roles + one invisible system layer — the operating model to design around
const ROLE_ARCHITECTURE = [
  { key: 'super_admin', role: 'Super Admin', coreJob: 'Runs the platform control centre', scope: 'Platform-wide, all orgs, all rules', whoGrants: 'Tech team + founder/director-authorised superusers', canRequest: 'N/A', approvesExceptions: 'Yes — final approver', homeFocus: 'Pulse of platform + controls + risk', nonNeg: 'RBAC, policy creator, billing controls, reporting, audit trail, logic controllers' },
  { key: 'org_admin', role: 'Org Admin', coreJob: 'Runs one organisation end-to-end', scope: 'Own organisation only', whoGrants: 'Super Admin', canRequest: 'Yes — to Super Admin', approvesExceptions: 'Yes — within org limits', homeFocus: 'Org health + programmes + credits + support', nonNeg: 'Can run ops without touching global settings' },
  { key: 'sub_admin', role: 'Org Sub-Admin', coreJob: 'Runs delegated programmes / cohorts / users', scope: 'Scoped to assigned programmes, cohorts, users', whoGrants: 'Org Admin', canRequest: 'Yes — to Org Admin', approvesExceptions: 'Only if explicitly delegated', homeFocus: 'Assigned queue + users + sessions', nonNeg: 'Never sees controls outside assigned scope' },
  { key: 'mentor', role: 'Mentor', coreJob: 'Delivers mentorship, manages schedule, handles requests', scope: 'Own profile + own sessions + own availability', whoGrants: 'Onboarded by Super Admin / Org mapping', canRequest: 'Limited — support / request only', approvesExceptions: 'No', homeFocus: 'Upcoming work + response speed + earnings + impact', nonNeg: 'Quick responder cues, next available, total earnings, easy accept / propose / decline' },
  { key: 'mentee', role: 'Mentee', coreJob: 'Finds mentors, books sessions, tracks progress', scope: 'Own sessions + own credits + own learning journey', whoGrants: 'Org onboarding or self-serve signup', canRequest: 'Limited — support / request only', approvesExceptions: 'No', homeFocus: 'Next session + credits + mentor discovery + learning ROI', nonNeg: 'Simple booking, clear credits, reflective progress log, chatbot assistance' },
  { key: 'system', role: 'System Services (non-human)', coreJob: 'Automates logic and reduces manual ops', scope: 'Invisible service layer', whoGrants: 'Configured by Super Admin', canRequest: 'N/A', approvesExceptions: 'Applies rules, never owns policy', homeFocus: 'Background automations', nonNeg: 'Credit engine, policy engine, MIS engine, reminders, chatbot router, audit logger' },
];

/* ============================================================================
   ACTION REGISTRY — canonical catalog of every actionable button in the product.
   Each action knows: who can do it, what it does, what fields it needs,
   what entity / op it mutates, and whether it has a bespoke flow.
   This is the single source of truth for button wiring across all 5 personas.
   ============================================================================ */
const ACTION_REGISTRY = {
  // ---- ORGANISATIONS ----
  'org.create': {
    label: 'Onboard organisation', icon: 'Building2', category: 'Organisations',
    desc: 'Onboard a new institution or corporate client end-to-end: profile · billing & legal · plan & credits · branding & domain · defaults & policies · first admin & go-live.',
    allowedPersonas: ['super_admin'],
    bespoke: true,
    summary: 'Full org onboarding flow. Org appears in Organisations list, credits move from platform to org wallet, admin invite fires, welcome email sequence triggers, audit log records the actor.',
  },
  'org.suspend': {
    label: 'Suspend organisation', icon: 'PauseCircle', category: 'Organisations',
    desc: 'Pause an organisation. All sessions, bookings, and credit movements freeze.',
    allowedPersonas: ['super_admin'], destructive: true,
    fields: [
      { key: 'reason', label: 'Reason', type: 'select', options: ['Payment overdue','Compliance hold','Customer request','Suspected abuse'], required: true },
      { key: 'note', label: 'Internal note', type: 'textarea' },
    ],
    mutates: { entity: 'orgs', op: 'patch', findBy: 'id', set: { status: 'Suspended' } },
  },
  'org.reactivate': {
    label: 'Reactivate organisation', icon: 'PlayCircle', category: 'Organisations',
    desc: 'Restore an organisation to active status.',
    allowedPersonas: ['super_admin'],
    fields: [{ key: 'note', label: 'Internal note', type: 'textarea' }],
    mutates: { entity: 'orgs', op: 'patch', findBy: 'id', set: { status: 'Active' } },
  },
  'org.inspect': {
    label: 'Inspect organisation', icon: 'Eye', category: 'Organisations',
    desc: 'Open a read-only deep-dive of an organisation: members, credits, programmes, recent activity.',
    allowedPersonas: ['super_admin'],
    bespoke: true,
  },
  'org.assign_admin': {
    label: 'Assign admin', icon: 'UserPlus', category: 'Organisations',
    desc: 'Assign an Org Admin to a specific organisation — promote an existing user or invite a new one. Choose role (Org Admin or Sub-Admin) and scope.',
    allowedPersonas: ['super_admin','org_admin'],
    bespoke: true,
  },
  // ---- PROGRAMMES & COHORTS ---- (per matrix: 'Create / edit org programmes & cohorts' SA Full, OA Full, OS Scoped)
  'programme.create': {
    label: 'Create programme', icon: 'GitBranch', category: 'Organisations',
    desc: 'Create a new programme or cohort within an organisation. Sub-admin scope is restricted to programmes they manage.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    fields: [
      { key: 'name', label: 'Programme name', type: 'text', required: true },
      { key: 'cohortType', label: 'Type', type: 'select', options: ['Cohort (time-bound)','Open programme (rolling)','Sprint (short-form)'], required: true },
      { key: 'startDate', label: 'Start date', type: 'date' },
      { key: 'capacity', label: 'Mentee capacity', type: 'number' },
      { key: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  'programme.edit': {
    label: 'Edit programme', icon: 'Sliders', category: 'Organisations',
    desc: 'Edit programme metadata, capacity, or schedule.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    fields: [
      { key: 'name', label: 'Programme name', type: 'text' },
      { key: 'capacity', label: 'New mentee capacity', type: 'number' },
      { key: 'note', label: 'Reason for change', type: 'textarea' },
    ],
  },
  // ---- CREDITS ----
  'credits.add': {
    label: 'Add credits', icon: 'Wallet', category: 'Credits & billing',
    desc: 'Review pending credit requests OR proactively allocate credits to an org, programme, or specific users (single or bulk).',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    bespoke: true,
  },
  'credits.allocate': {
    label: 'Allocate credits', icon: 'GitBranch', category: 'Credits & billing',
    desc: 'Move credits from org wallet → programme ledger → mentee wallet.',
    allowedPersonas: ['org_admin','sub_admin'],
    bespoke: true,
  },
  'credits.approve_request': {
    label: 'Approve credit request', icon: 'Check', category: 'Credits & billing',
    desc: 'Approve a pending credit request from an org. Credits move from platform wallet to org wallet on approval.',
    allowedPersonas: ['super_admin'],
    fields: [
      { key: 'note', label: 'Approval note (optional)', type: 'textarea' },
    ],
  },
  'credits.deny_request': {
    label: 'Deny credit request', icon: 'X', category: 'Credits & billing', destructive: true,
    desc: 'Deny a pending credit request. Org Admin is notified with the reason.',
    allowedPersonas: ['super_admin'],
    fields: [
      { key: 'reason', label: 'Reason for denial', type: 'textarea', required: true },
    ],
  },
  'credits.refund_approve': {
    label: 'Approve refund', icon: 'RotateCcw', category: 'Credits & billing',
    desc: 'Approve a credit refund per Refund Policy. Logs financial record.',
    allowedPersonas: ['super_admin'],
    fields: [
      { key: 'amount', label: 'Credits to refund', type: 'number', required: true },
      { key: 'reason', label: 'Reason', type: 'select', options: ['Mentor no-show','Cancelled within window','Quality issue','Goodwill'], required: true },
      { key: 'note', label: 'Approval note', type: 'textarea', required: true },
    ],
  },
  'credits.refund_request': {
    label: 'Request refund', icon: 'RotateCcw', category: 'Credits & billing',
    desc: 'Submit a refund request to Super Admin for review.',
    allowedPersonas: ['org_admin'],
    fields: [
      { key: 'amount', label: 'Credits requested', type: 'number', required: true },
      { key: 'reason', label: 'Why', type: 'textarea', required: true },
    ],
  },
  'credits.invoice_raise': {
    label: 'Raise invoice', icon: 'Receipt', category: 'Credits & billing',
    desc: 'Generate a draft invoice for an org or external mentee.',
    allowedPersonas: ['super_admin'],
    fields: [
      { key: 'amount', label: 'Amount (₹)', type: 'number', required: true },
      { key: 'period', label: 'Billing period', type: 'text', required: true },
    ],
  },
  // ---- USERS ----
  'user.invite': {
    label: 'Invite user', icon: 'UserPlus', category: 'Users & access',
    desc: 'Send a sign-up invite to a mentor, mentee, or admin. Honors role + scope.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    bespoke: true,
  },
  'user.suspend': {
    label: 'Suspend user', icon: 'UserX', category: 'Users & access', destructive: true,
    desc: 'Disable a user. They cannot log in, book sessions, or be booked.',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [
      { key: 'reason', label: 'Reason', type: 'select', options: ['Policy breach','Inactive','User request','Investigation'], required: true },
    ],
  },
  'user.reactivate': {
    label: 'Reactivate user', icon: 'UserCheck', category: 'Users & access',
    allowedPersonas: ['super_admin','org_admin'],
    desc: 'Restore a user to active status.',
  },
  'user.impersonate': {
    label: 'Impersonate (read-only)', icon: 'Eye', category: 'Users & access',
    desc: 'View the product as this user. No actions can be taken in their name. Logged with reason.',
    allowedPersonas: ['super_admin'],
    fields: [{ key: 'reason', label: 'Reason for impersonation', type: 'textarea', required: true }],
  },
  'user.reset_access': {
    label: 'Reset access', icon: 'Key', category: 'Users & access',
    allowedPersonas: ['super_admin','org_admin'],
    desc: 'Revoke active sessions and force re-auth on next login.',
  },
  // ---- MENTORS ----
  'mentor.add': {
    label: 'Add mentor', icon: 'UserPlus', category: 'Mentors',
    desc: 'Onboard a new mentor end-to-end: identity · credibility · expertise · pricing · availability · org mapping · compliance & payout. Triggers LOE, doc upload, and verification.',
    allowedPersonas: ['super_admin'],
    bespoke: true,
    summary: 'Mentor created with status Pending verification. Marketplace listing happens after compliance approval.',
  },
  'mentor.approve_onboarding': {
    label: 'Approve onboarding', icon: 'BadgeCheck', category: 'Mentors',
    desc: 'Approve a mentor application after compliance review. Mentor goes live in marketplace.',
    allowedPersonas: ['super_admin'],
    fields: [{ key: 'note', label: 'Compliance note', type: 'textarea' }],
  },
  'mentor.reject_onboarding': {
    label: 'Reject onboarding', icon: 'BadgeX', category: 'Mentors', destructive: true,
    desc: 'Reject a mentor application. Mentor is notified with reason.',
    allowedPersonas: ['super_admin'],
    fields: [{ key: 'reason', label: 'Reason for rejection', type: 'textarea', required: true }],
  },
  'mentor.map_to_org': {
    label: 'Map mentor to org', icon: 'GitBranch', category: 'Mentors',
    desc: 'Make a mentor available to a specific organisation or programme. Sub-admin scope is restricted to programmes they manage.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    bespoke: true,
  },
  'mentor.set_visibility': {
    label: 'Set marketplace visibility', icon: 'Eye', category: 'Mentors',
    allowedPersonas: ['super_admin','mentor'],
    desc: 'Show or hide a mentor in the public marketplace. Score retained.',
    fields: [{ key: 'visible', label: 'Visible?', type: 'select', options: ['Visible','Hidden'], required: true }],
  },
  'mentor.set_caps': {
    label: 'Set slot caps', icon: 'Sliders', category: 'Mentors',
    allowedPersonas: ['super_admin','org_admin','mentor'],
    desc: 'Set max sessions / week and floor for a mentor or org.',
    fields: [
      { key: 'cap', label: 'Max sessions / week', type: 'number', required: true },
      { key: 'floor', label: 'Min sessions / week', type: 'number' },
    ],
  },
  // ---- BOOKINGS / SESSIONS ----
  'session.book': {
    label: 'Book a session', icon: 'Calendar', category: 'Sessions',
    desc: 'Pick a slot, add agenda, confirm. Burns credits per Credit Engine.',
    allowedPersonas: ['mentee'],
    bespoke: true,
  },
  'session.cancel': {
    label: 'Cancel session', icon: 'X', category: 'Sessions', destructive: true,
    desc: 'Cancel a confirmed session. Refund honors Cancellation Policy.',
    allowedPersonas: ['mentee','mentor','org_admin'],
    fields: [{ key: 'reason', label: 'Reason for cancellation', type: 'textarea', required: true }],
  },
  'session.reschedule': {
    label: 'Reschedule', icon: 'Calendar', category: 'Sessions',
    allowedPersonas: ['mentee','mentor'],
    desc: 'Move a confirmed session to a new slot. Both parties must agree.',
    fields: [{ key: 'newSlot', label: 'Suggested new slot', type: 'text', required: true }],
  },
  'session.accept_request': {
    label: 'Accept request', icon: 'Check', category: 'Sessions',
    allowedPersonas: ['mentor'],
    desc: 'Accept a mentee\u2019s booking request. Mentee is notified, slot is locked.',
  },
  'session.suggest_alternative': {
    label: 'Suggest alternative', icon: 'Calendar', category: 'Sessions',
    allowedPersonas: ['mentor'],
    desc: 'Propose a different slot to the mentee.',
    fields: [{ key: 'newSlot', label: 'Alternative slot', type: 'text', required: true }],
  },
  'session.decline_request': {
    label: 'Decline request', icon: 'X', category: 'Sessions', destructive: true,
    allowedPersonas: ['mentor'],
    desc: 'Decline a booking request with reason.',
    fields: [{ key: 'reason', label: 'Reason', type: 'textarea', required: true }],
  },
  'session.block_slot': {
    label: 'Block slot', icon: 'PauseCircle', category: 'Sessions',
    allowedPersonas: ['mentor'],
    desc: 'Mark a slot as unavailable. Mentees cannot book this slot until you unblock.',
    fields: [
      { key: 'slot', label: 'Slot to block', type: 'text', required: true, placeholder: 'e.g. Tue 4pm IST' },
      { key: 'reason', label: 'Reason (internal)', type: 'select', options: ['Personal','Travel','Conflict','Burnout day'] },
    ],
  },
  'session.join': {
    label: 'Join session', icon: 'PlayCircle', category: 'Sessions',
    allowedPersonas: ['mentor','mentee'],
    desc: 'Join the live video session. Opens Zoom / Meet link in a new tab.',
  },
  // ---- TICKETS ----
  'ticket.raise': {
    label: 'Raise ticket', icon: 'AlertCircle', category: 'Support',
    desc: 'Raise a support ticket. Routed by Chatbot Router based on intent. Per the matrix, all personas can raise tickets.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
    fields: [
      { key: 'subject', label: 'Subject', type: 'text', required: true },
      { key: 'priority', label: 'Priority', type: 'select', options: ['Low','Medium','High','Urgent'], required: true },
      { key: 'detail', label: 'Detail', type: 'textarea', required: true },
    ],
  },
  'ticket.resolve': {
    label: 'Resolve ticket', icon: 'CheckCircle2', category: 'Support',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    desc: 'Mark a ticket as resolved. Triggers CSAT request.',
    fields: [{ key: 'resolution', label: 'Resolution summary', type: 'textarea', required: true }],
  },
  'ticket.escalate': {
    label: 'Escalate ticket', icon: 'AlertOctagon', category: 'Support',
    allowedPersonas: ['org_admin','sub_admin'],
    desc: 'Escalate a ticket to the next tier with full context. Super Admin is the apex tier and cannot escalate further — they review escalations instead.',
    fields: [{ key: 'note', label: 'Why escalating', type: 'textarea', required: true }],
  },
  'ticket.assign': {
    label: 'Assign ticket', icon: 'UserCheck', category: 'Support',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [{ key: 'assignee', label: 'Assignee', type: 'text', required: true }],
    desc: 'Assign a ticket to a specific support owner.',
  },
  'escalation.review': {
    label: 'Review escalations', icon: 'AlertOctagon', category: 'Support',
    desc: 'Open the escalation queue. Triage, reassign, resolve, or close.',
    allowedPersonas: ['super_admin','org_admin'],
    bespoke: true,
  },
  // ---- POLICIES & CONTROLLERS ----
  'policy.publish': {
    label: 'Publish policy', icon: 'Send', category: 'Policies',
    allowedPersonas: ['super_admin'],
    desc: 'Publish a draft policy. Goes live with effective date.',
    fields: [{ key: 'effectiveDate', label: 'Effective date', type: 'date', required: true }],
  },
  'policy.simulate': {
    label: 'Simulate policy', icon: 'Cpu', category: 'Policies',
    allowedPersonas: ['super_admin'],
    desc: 'Dry-run a draft policy against the last 1,000 sessions to surface false positives.',
  },
  'policy.rollback': {
    label: 'Rollback', icon: 'History', category: 'Policies',
    allowedPersonas: ['super_admin'], destructive: true,
    desc: 'Revert a policy to a previous version.',
    fields: [{ key: 'version', label: 'Target version', type: 'text', required: true }],
  },
  'policy.request_change': {
    label: 'Request policy change', icon: 'AlertCircle', category: 'Policies',
    allowedPersonas: ['org_admin'],
    desc: 'Submit a request to Super Admin to change a scoped policy.',
    fields: [
      { key: 'policy', label: 'Which policy', type: 'text', required: true },
      { key: 'change', label: 'What change you need', type: 'textarea', required: true },
    ],
  },
  'controller.pause': {
    label: 'Pause controller', icon: 'PauseCircle', category: 'Logic Controllers',
    allowedPersonas: ['super_admin'], destructive: true,
    desc: 'Temporarily disable a logic controller.',
    fields: [{ key: 'reason', label: 'Reason', type: 'textarea', required: true }],
  },
  'controller.resume': {
    label: 'Resume controller', icon: 'PlayCircle', category: 'Logic Controllers',
    allowedPersonas: ['super_admin'],
    desc: 'Resume a paused controller.',
  },
  // ---- ROLES ----
  'role.create': {
    label: 'Create role', icon: 'Shield', category: 'Roles',
    allowedPersonas: ['super_admin'],
    desc: 'Create a new role. Inherits no permissions until explicitly granted.',
    fields: [
      { key: 'name', label: 'Role name', type: 'text', required: true },
      { key: 'cloneFrom', label: 'Clone from (optional)', type: 'text' },
    ],
  },
  'role.copy': {
    label: 'Copy role', icon: 'Copy', category: 'Roles',
    allowedPersonas: ['super_admin'],
    fields: [{ key: 'newName', label: 'New role name', type: 'text', required: true }],
    desc: 'Copy an existing role as a starting point.',
  },
  'role.publish': {
    label: 'Publish role version', icon: 'Send', category: 'Roles',
    allowedPersonas: ['super_admin'],
    desc: 'Publish a role version. All assigned users receive the new permissions.',
  },
  'access.request': {
    label: 'Request access', icon: 'Key', category: 'Roles',
    allowedPersonas: ['org_admin','sub_admin','mentor','mentee'],
    desc: 'Request a time-boxed permission you do not currently have.',
    fields: [
      { key: 'capability', label: 'Capability you need', type: 'text', required: true },
      { key: 'duration', label: 'Duration', type: 'select', options: ['1 day','3 days','7 days','30 days'], required: true },
      { key: 'reason', label: 'Why', type: 'textarea', required: true },
    ],
  },
  'access.approve': {
    label: 'Approve access request', icon: 'Check', category: 'Roles',
    allowedPersonas: ['super_admin','org_admin'],
    desc: 'Grant a time-boxed access request.',
  },
  'access.deny': {
    label: 'Deny access request', icon: 'X', category: 'Roles', destructive: true,
    allowedPersonas: ['super_admin','org_admin'],
    fields: [{ key: 'reason', label: 'Reason', type: 'textarea', required: true }],
  },
  // ---- REPORTS ----
  'report.open': {
    label: 'Open report', icon: 'FileBarChart', category: 'Reports',
    desc: 'Open a saved report.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
    bespoke: true,
  },
  'report.open_filtered': {
    label: 'Open filtered tables', icon: 'Filter', category: 'Reports',
    desc: 'Drill from a chart-heavy overview into a focused data table. Pick which exception class to investigate, jump to the matching table with filters pre-applied.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
    bespoke: true,
  },
  'report.export': {
    label: 'Export report', icon: 'Download', category: 'Reports',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    fields: [{ key: 'format', label: 'Format', type: 'select', options: ['CSV','XLSX','PDF'], required: true }],
    desc: 'Export the current report to a file.',
  },
  'report.schedule': {
    label: 'Schedule report', icon: 'Calendar', category: 'Reports',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [
      { key: 'frequency', label: 'Frequency', type: 'select', options: ['Daily','Weekly','Monthly'], required: true },
      { key: 'recipients', label: 'Send to (emails, comma-separated)', type: 'text', required: true },
    ],
    desc: 'Schedule recurring delivery of this report.',
  },
  // ---- COMMS ----
  'comm.send_bulk': {
    label: 'Send bulk message', icon: 'Megaphone', category: 'Communications',
    allowedPersonas: ['super_admin','org_admin'],
    bespoke: true,
    desc: 'Send an Email / WhatsApp / in-app blast through the Communication Engine. Audience can combine user types, orgs, cohorts, attributes, and named users.',
  },
  'comm.nudge': {
    label: 'Nudge user', icon: 'Bell', category: 'Communications',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    desc: 'Send a one-off reminder nudge to specific users, a cohort, or a saved segment.',
    bespoke: true,
  },
  // ---- MENTEE ACTIONS ----
  'mentee.save_mentor': {
    label: 'Save mentor', icon: 'Bookmark', category: 'Marketplace',
    allowedPersonas: ['mentee'],
    desc: 'Save mentor to your shortlist. Get notified when new slots open.',
  },
  'mentee.add_milestone': {
    label: 'Add milestone', icon: 'Sparkles', category: 'Progress',
    allowedPersonas: ['mentee','mentor'],
    fields: [
      { key: 'type', label: 'Type', type: 'select', options: ['Internship / Job achieved','Clarity gain logged','Skill confidence increase'], required: true },
      { key: 'detail', label: 'Detail', type: 'textarea', required: true },
    ],
    desc: 'Log a personal breakthrough. AI Milestone Assistant may auto-draft these from session feedback.',
  },
  'mentee.confirm_ai_milestone': {
    label: 'Confirm AI milestone', icon: 'Sparkles', category: 'Progress',
    allowedPersonas: ['mentee','mentor'],
    desc: 'Confirm an AI-drafted milestone after editing if needed.',
  },
  // ---- UNIVERSAL ---- (per matrix: 'Use chatbot + FAQ' is Full for all 5 personas)
  'chatbot.open': {
    label: 'Open chatbot help', icon: 'MessageSquare', category: 'Support',
    desc: 'Open the support chatbot. Routed by intent — escalates to human ticket if needed.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  // ---- GENERIC VERB ACTIONS ---- (catch-alls for rail buttons that share a verb across many nouns)
  'generic.open': {
    label: 'Open', icon: 'Eye', category: 'Reports',
    desc: 'Open the underlying entity in a focused view (programme, cohort, profile, drill-down, etc.).',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'generic.edit': {
    label: 'Edit', icon: 'Edit3', category: 'Users & access',
    desc: 'Edit the current entity. Changes are tracked in the audit log.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'generic.clone': {
    label: 'Clone', icon: 'Copy', category: 'Organisations',
    desc: 'Duplicate the current entity (programme, cohort, report, template, role) as a new draft.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
    fields: [{ key: 'newName', label: 'Name for the clone', type: 'text', required: true, placeholder: 'e.g. Cohort Alpha (copy)' }],
  },
  'generic.compare': {
    label: 'Compare', icon: 'GitBranch', category: 'Reports',
    desc: 'Open a side-by-side comparison view (mentors, versions, cohorts).',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'generic.acknowledge': {
    label: 'Acknowledge', icon: 'Check', category: 'Support',
    desc: 'Acknowledge an alert or notification. Removes from your inbox; remains in audit log.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'generic.notify': {
    label: 'Notify', icon: 'Bell', category: 'Communications',
    desc: 'Send an immediate one-time notification to the relevant owner.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor'],
    fields: [{ key: 'note', label: 'Note (optional)', type: 'textarea' }],
  },
  'generic.feature': {
    label: 'Feature / Pin', icon: 'Sparkles', category: 'Mentors',
    desc: 'Pin or feature an entity to the top of its list (mentor, post, programme).',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
  },
  'generic.override': {
    label: 'Override', icon: 'Shield', category: 'Policies',
    desc: 'Override the default rule for a specific case. Requires reason · always logged.',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [{ key: 'reason', label: 'Reason for override', type: 'textarea', required: true }],
  },
  'generic.send_reminder': {
    label: 'Send reminder', icon: 'Send', category: 'Communications',
    desc: 'Send a reminder via the user\u2019s preferred notification channel.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor'],
  },
  'generic.retry': {
    label: 'Retry', icon: 'RotateCcw', category: 'Support',
    desc: 'Retry the failed operation (job, payment, webhook, LOE).',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'generic.preview': {
    label: 'Preview', icon: 'Eye', category: 'Reports',
    desc: 'Preview the rendered output before publishing.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor'],
  },
  'generic.flag': {
    label: 'Flag', icon: 'AlertCircle', category: 'Support',
    desc: 'Flag the entity for review. Adds it to the relevant inbox.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
    fields: [{ key: 'note', label: 'Why flagging', type: 'textarea' }],
  },
  'generic.archive': {
    label: 'Archive', icon: 'X', category: 'Organisations',
    desc: 'Archive the entity. It moves out of active lists but is preserved.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
  },
  'generic.duplicate': {
    label: 'Duplicate', icon: 'Copy', category: 'Organisations',
    desc: 'Create an exact copy of the entity.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
  },
  'generic.publish': {
    label: 'Publish', icon: 'Send', category: 'Policies',
    desc: 'Publish the draft. Becomes effective immediately on publish.',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'generic.takeover': {
    label: 'Take over', icon: 'UserCheck', category: 'Support',
    desc: 'Assume ownership of this case from the previous owner.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
  },
  'generic.reverse': {
    label: 'Reverse', icon: 'RotateCcw', category: 'Credits & billing',
    desc: 'Reverse the most recent transaction. Requires reason.',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [{ key: 'reason', label: 'Reason for reversal', type: 'textarea', required: true }],
  },
  'generic.test': {
    label: 'Send test', icon: 'Send', category: 'Communications',
    desc: 'Send a test message to your own email to preview formatting.',
    allowedPersonas: ['super_admin','org_admin','sub_admin'],
  },
  // ---- SETTINGS / PROFILE SAVE ACTIONS ---- (lightweight immediate-effect)
  'profile.save': {
    label: 'Save profile', icon: 'Check', category: 'Users & access',
    desc: 'Save changes to your profile. Visible to other users on next refresh.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'profile.upload_photo': {
    label: 'Upload photo', icon: 'UserPlus', category: 'Users & access',
    desc: 'Upload a profile photo (JPG / PNG, square 400×400 recommended).',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'preferences.save': {
    label: 'Save preferences', icon: 'Sliders', category: 'Users & access',
    desc: 'Save your notification and matching preferences.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'org.save_profile': {
    label: 'Save org profile', icon: 'Check', category: 'Organisations',
    desc: 'Save changes to organisation profile (legal entity, billing, contacts).',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'org.save_branding': {
    label: 'Save branding', icon: 'Check', category: 'Organisations',
    desc: 'Save brand colors, logo, and subdomain settings. Marketplace updates within minutes.',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'org.save_policies': {
    label: 'Save policies', icon: 'Check', category: 'Policies',
    desc: 'Save org-scoped policy settings. Effective immediately on save.',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'org.save_guardrails': {
    label: 'Save guardrails', icon: 'Shield', category: 'Credits & billing',
    desc: 'Save spend guardrails (caps, floors, alerts).',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'pipeline.approve': {
    label: 'Approve mentor pipeline item', icon: 'Check', category: 'Mentors',
    desc: 'Approve a mentor onboarding pipeline item to advance to next stage.',
    allowedPersonas: ['super_admin','org_admin'],
  },
  'pipeline.reject': {
    label: 'Reject pipeline item', icon: 'X', category: 'Mentors', destructive: true,
    desc: 'Reject a mentor onboarding pipeline item with reason.',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [{ key: 'reason', label: 'Reason', type: 'textarea', required: true }],
  },
  'mentee.top_up': {
    label: 'Top up credits', icon: 'Wallet', category: 'Credits & billing',
    desc: 'Purchase additional credits. Charged to your saved payment method.',
    allowedPersonas: ['mentee'],
    bespoke: true,
  },
  'mentee.confirm_booking': {
    label: 'Confirm booking', icon: 'Check', category: 'Sessions',
    desc: 'Confirm the slot, agenda, and credit deduction. Mentor is notified instantly.',
    allowedPersonas: ['mentee'],
    bespoke: true,
  },
  'report.share': {
    label: 'Share report', icon: 'Send', category: 'Reports',
    desc: 'Share this report via email or generate a private shareable link.',
    allowedPersonas: ['super_admin','org_admin'],
    fields: [
      { key: 'method', label: 'Share via', type: 'select', options: ['Email recipients','Shareable link (7-day expiry)','Slack channel'], required: true },
      { key: 'recipients', label: 'Recipients (comma-separated emails)', type: 'text' },
    ],
  },
  // ---- SAVED SEARCHES ----
  'search.save_new': {
    label: 'Save search', icon: 'Bookmark', category: 'Marketplace',
    desc: 'Save the current filter combination so you can recall it instantly later.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'search.update_existing': {
    label: 'Update saved search', icon: 'Bookmark', category: 'Marketplace',
    desc: 'Replace an existing saved search with the current filter combination.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'search.delete': {
    label: 'Delete saved search', icon: 'X', category: 'Marketplace', destructive: true,
    desc: 'Remove a saved search.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
  'search.apply': {
    label: 'Apply saved search', icon: 'Bookmark', category: 'Marketplace',
    desc: 'Load a saved search into the current view.',
    allowedPersonas: ['super_admin','org_admin','sub_admin','mentor','mentee'],
  },
};

const ACTION_CATEGORIES = ['Organisations','Credits & billing','Users & access','Mentors','Sessions','Support','Policies','Logic Controllers','Roles','Reports','Communications','Marketplace','Progress'];

// Permission gate — Strict mode: action is hidden from the UI if persona not in allowedPersonas
function canDo(actionId, persona) {
  const a = ACTION_REGISTRY[actionId];
  if (!a) return false;
  return a.allowedPersonas.indexOf(persona) >= 0;
}

// Access language: 6 states with exact color cues + design behaviour
const ACCESS_LEGEND = [
  { label: 'Full',    meaning: 'Can act without scope restriction',                         behaviour: 'Show action buttons + edit controls',  color: '#1a2a33', text: '#f4ead7' },
  { label: 'Scoped',  meaning: 'Can act only inside assigned org / programme / user scope', behaviour: 'Always show scope chips',               color: '#4ec3a9', text: '#0a1f28' },
  { label: 'View',    meaning: 'Read-only access',                                          behaviour: 'No destructive actions',                color: '#94a3a8', text: '#0a1f28' },
  { label: 'Own',     meaning: 'Only on own profile / own data',                            behaviour: 'Keep wording personal: My / Mine',      color: '#3a8db8', text: '#f4ead7' },
  { label: 'Request', meaning: 'Cannot do directly; can request approval',                  behaviour: 'Show request CTA instead of dead button', color: '#e89456', text: '#0a1f28' },
  { label: 'None',    meaning: 'Not visible at all',                                        behaviour: 'Hide feature from nav',                 color: '#cccccc', text: '#0a1f28' },
];

/* ============================================================================
   IA CONFIG — full information architecture from the spreadsheet
   Each tab has: archetype + config (kpis, cols, rail, drawerHints)
   ============================================================================ */
const IA = [
  {
    key: 'overview', label: 'Overview', icon: LayoutDashboard,
    tabs: [
      { key: 'executive', label: 'Executive Summary', archetype: 'executive', config: {} },
      { key: 'ops_pulse', label: 'Operations Pulse', archetype: 'charts', config: {
        kpis: [
          { label: 'Sessions Today', value: '1,284', delta: '+12%', tone: 'good' },
          { label: 'Completion %', value: '87.4%', delta: '+1.2', tone: 'good' },
          { label: 'No-show %', value: '6.1%', delta: '+0.8', tone: 'bad' },
          { label: 'Mentor response', value: '14m', delta: '-3m', tone: 'good' },
        ],
        charts: ['sessions_trend','completion_bars','noshow_heatmap','top_exception'],
        rail: ['Filter table','Nudge org admin','Export'],
      }},
      { key: 'revenue_credits', label: 'Revenue & Credits', archetype: 'charts', config: {
        kpis: [
          { label: 'Revenue MTD', value: '₹187,500', delta: '+8.4%', tone: 'good' },
          { label: 'Credit burn', value: '74.2k', delta: '+12%', tone: 'warn' },
          { label: 'Renewals at risk', value: '8', delta: '+2', tone: 'bad' },
          { label: 'Failed payments', value: '14', delta: '-3', tone: 'good' },
        ],
        charts: ['burn_line','wallet_alloc','renewals_list','waterfall'],
        rail: ['Adjust credits','Open invoice','Pause org'],
      }},
      { key: 'risk_health', label: 'Risk & Support', archetype: 'charts', config: {
        kpis: [
          { label: 'Open tickets', value: '47', delta: '+6', tone: 'warn' },
          { label: 'SLA breaches', value: '11', delta: '+3', tone: 'bad' },
          { label: 'Abuse flags', value: '3', delta: '0', tone: 'neutral' },
          { label: 'Anomaly alerts', value: '6', delta: '+2', tone: 'warn' },
        ],
        charts: ['ticket_aging','abuse_queue','anomaly_evidence','sla_band'],
        rail: ['Assign owner','Escalate','Export evidence'],
      }},
      { key: 'automations', label: 'Automations & Health', archetype: 'system_status', config: {
        rail: ['Retry job','Disable rule','Open settings'],
      }},
    ]
  },
  {
    key: 'organisations', label: 'Organisations', icon: Building2,
    tabs: [
      { key: 'all_orgs', label: 'All Organisations', archetype: 'table', config: {
        dataKey: 'orgs',
        kpis: [
          { label: 'Total orgs', value: '30', tone: 'neutral' },
          { label: 'Active', value: '24', tone: 'good' },
          { label: 'At Risk', value: '4', tone: 'bad' },
          { label: 'New 30d', value: '3', tone: 'good' },
        ],
        cols: [
          { key: 'name', label: 'Organisation', kind: 'avatar' },
          { key: 'tier', label: 'Plan', kind: 'pill' },
          { key: 'mentees', label: 'Mentees', kind: 'num' },
          { key: 'mentors', label: 'Mentors', kind: 'num' },
          { key: 'creditsUsed', label: 'Credits %', kind: 'progress' },
          { key: 'mrr', label: 'MRR', kind: 'currency' },
          { key: 'renewalRisk', label: 'Renewal', kind: 'risk' },
          { key: 'status', label: 'Status', kind: 'status' },
        ],
        rail: ['Create org','Suspend / Reactivate','Assign admin'],
        filters: ['Status','Tier','Country','Domain','Renewal Risk'],
      }},
      { key: 'onboarding', label: 'Onboarding Queue', archetype: 'pipeline', config: {
        rail: ['Approve setup','Resend invite','Open checklist'],
      }},
      { key: 'programmes', label: 'Programmes & Cohorts', archetype: 'table', config: {
        dataKey: 'programmes',
        kpis: [
          { label: 'Active programmes', value: '38', tone: 'neutral' },
          { label: 'Avg completion', value: '72%', tone: 'good' },
          { label: 'Cohorts running', value: '94', tone: 'neutral' },
          { label: 'Drafts', value: '12', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'Programme', kind: 'text' },
          { key: 'org', label: 'Organisation', kind: 'text' },
          { key: 'cohorts', label: 'Cohorts', kind: 'num' },
          { key: 'mentees', label: 'Mentees', kind: 'num' },
          { key: 'completion', label: 'Completion', kind: 'progress' },
          { key: 'status', label: 'Status', kind: 'status' },
        ],
        rail: ['Create programme','Clone template','Open drill-down'],
        filters: ['Status','Organisation','Cohort size'],
      }},
      { key: 'websites', label: 'Websites & Branding', archetype: 'table', config: {
        dataKey: 'websites',
        kpis: [
          { label: 'White-label sites', value: '24', tone: 'neutral' },
          { label: 'Pending approvals', value: '6', tone: 'warn' },
          { label: 'Custom domains', value: '18', tone: 'neutral' },
          { label: 'Failures (24h)', value: '1', tone: 'bad' },
        ],
        cols: [
          { key: 'org', label: 'Organisation', kind: 'text' },
          { key: 'domain', label: 'Domain', kind: 'mono' },
          { key: 'brandStatus', label: 'Status', kind: 'status' },
          { key: 'changesPending', label: 'Pending', kind: 'num' },
          { key: 'lastChange', label: 'Last change', kind: 'text' },
        ],
        rail: ['Publish','Rollback','Preview'],
        filters: ['Status','Custom domain','Pending'],
      }},
      { key: 'subs', label: 'Subscriptions & Renewals', archetype: 'table', config: {
        dataKey: 'orgs',
        kpis: [
          { label: 'Renewals < 14d', value: '8', tone: 'bad' },
          { label: 'Renewals < 30d', value: '14', tone: 'warn' },
          { label: 'Auto-renew on', value: '22', tone: 'good' },
          { label: 'Exposure ₹', value: '₹4.8M', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'Organisation', kind: 'avatar' },
          { key: 'tier', label: 'Plan', kind: 'pill' },
          { key: 'renewalDays', label: 'Renewal in', kind: 'days' },
          { key: 'renewalRisk', label: 'Risk', kind: 'risk' },
          { key: 'mrr', label: 'MRR', kind: 'currency' },
          { key: 'contractEnd', label: 'Contract ends', kind: 'date' },
        ],
        rail: ['Renew','Upgrade','Apply exception'],
        filters: ['Risk','Plan','Days to renew'],
      }},
    ]
  },
  {
    key: 'users', label: 'Users & Access', icon: Users,
    tabs: [
      { key: 'directory', label: 'Users Directory', archetype: 'table', config: {
        dataKey: 'users',
        kpis: [
          { label: 'Active users', value: '420', tone: 'neutral' },
          { label: 'MFA enabled', value: '78%', tone: 'good' },
          { label: 'Suspended', value: '14', tone: 'warn' },
          { label: 'Invited (pending)', value: '6', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'User', kind: 'avatar' },
          { key: 'email', label: 'Email', kind: 'mono' },
          { key: 'role', label: 'Role', kind: 'pill' },
          { key: 'org', label: 'Organisation', kind: 'text' },
          { key: 'mfa', label: 'MFA', kind: 'status' },
          { key: 'status', label: 'Status', kind: 'status' },
          { key: 'lastActive', label: 'Last active', kind: 'text' },
        ],
        rail: ['Invite user','Suspend','Impersonate (read-only)'],
        filters: ['Role','Status','MFA','Organisation'],
      }},
      { key: 'roles', label: 'Roles & Permissions', archetype: 'permissions', config: {
        rail: ['Create role','Copy role','Publish version'],
      }},
      { key: 'access', label: 'Access Requests', archetype: 'pipeline', config: {
        rail: ['Approve','Deny','Time-box access'],
      }},
      { key: 'account_actions', label: 'Account Actions', archetype: 'table', config: {
        dataKey: 'users',
        kpis: [
          { label: 'Disabled (30d)', value: '8', tone: 'neutral' },
          { label: 'Reset MFA (7d)', value: '12', tone: 'neutral' },
          { label: 'Time-boxed access', value: '4', tone: 'warn' },
          { label: 'Bulk ops (24h)', value: '2', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'User', kind: 'avatar' },
          { key: 'role', label: 'Role', kind: 'pill' },
          { key: 'status', label: 'Status', kind: 'status' },
          { key: 'lastActive', label: 'Last active', kind: 'text' },
        ],
        rail: ['Suspend','Reactivate','Reset access'],
        filters: ['Status','Role'],
      }},
      { key: 'audit', label: 'Audit Log', archetype: 'audit', config: {
        rail: ['Export evidence','Filter window','Compare versions'],
      }},
    ]
  },
  {
    key: 'mentors', label: 'Mentor Pool', icon: GraduationCap,
    tabs: [
      { key: 'directory', label: 'Mentor Directory', archetype: 'table', config: {
        dataKey: 'mentors',
        kpis: [
          { label: 'Total mentors', value: '720', tone: 'neutral' },
          { label: 'Excellent tier', value: '38', tone: 'good' },
          { label: 'Pending KYC', value: '24', tone: 'warn' },
          { label: 'Hidden', value: '6', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'Mentor', kind: 'avatar' },
          { key: 'tier', label: 'Tier', kind: 'pill' },
          { key: 'mis', label: 'MIS', kind: 'mis' },
          { key: 'responsiveness', label: 'Responds', kind: 'response' },
          { key: 'sessions', label: 'Sessions', kind: 'num' },
          { key: 'rating', label: 'Rating', kind: 'rating' },
          { key: 'kyc', label: 'KYC', kind: 'status' },
          { key: 'visibility', label: 'Visibility', kind: 'pill' },
        ],
        rail: ['Add mentor','Map to org','Hide / Show'],
        filters: ['Tier','KYC','Visibility','Domain','Country'],
      }},
      { key: 'compliance', label: 'Onboarding & Compliance', archetype: 'pipeline', config: {
        rail: ['Approve','Reject','Re-trigger LOE'],
      }},
      { key: 'capacity', label: 'Availability & Capacity', archetype: 'capacity', config: {
        rail: ['Adjust cap','Set floor','Create alert'],
      }},
      { key: 'mis', label: 'Quality & MIS', archetype: 'mis_heatmap', config: {
        rail: ['Override visibility','Nudge mentor','Export MIS'],
      }},
      { key: 'visibility', label: 'Visibility & Mapping', archetype: 'table', config: {
        dataKey: 'mentors',
        kpis: [
          { label: 'Public', value: '512', tone: 'neutral' },
          { label: 'Org-only', value: '186', tone: 'neutral' },
          { label: 'Hidden', value: '22', tone: 'warn' },
          { label: 'Featured', value: '14', tone: 'good' },
        ],
        cols: [
          { key: 'name', label: 'Mentor', kind: 'avatar' },
          { key: 'visibility', label: 'Visibility', kind: 'pill' },
          { key: 'orgs', label: 'Mapped orgs', kind: 'num' },
          { key: 'tier', label: 'Tier', kind: 'pill' },
          { key: 'mis', label: 'MIS', kind: 'mis' },
        ],
        rail: ['Map / unmap','Pin featured','Open rules'],
        filters: ['Visibility','Tier','Mapped count'],
      }},
    ]
  },
  {
    key: 'credits', label: 'Credits & Billing', icon: Wallet,
    tabs: [
      { key: 'engine', label: 'Credit Engine', archetype: 'rule_builder', config: {
        rail: ['Edit logic','Publish version','Simulate'],
      }},
      { key: 'wallets', label: 'Wallets & Allocations', archetype: 'table', config: {
        dataKey: 'orgs',
        kpis: [
          { label: 'Total credits in flight', value: '482k', tone: 'neutral' },
          { label: 'Low balance orgs', value: '7', tone: 'warn' },
          { label: 'Expiring 30d', value: '14k', tone: 'warn' },
          { label: 'Frozen', value: '2', tone: 'bad' },
        ],
        cols: [
          { key: 'name', label: 'Organisation', kind: 'avatar' },
          { key: 'creditsUsed', label: 'Used %', kind: 'progress' },
          { key: 'creditsRemaining', label: 'Remaining', kind: 'num' },
          { key: 'mentees', label: 'Mentees', kind: 'num' },
          { key: 'tier', label: 'Plan', kind: 'pill' },
        ],
        rail: ['Allocate','Top-up','Reverse / Freeze'],
        filters: ['Plan','Used %','Remaining'],
      }},
      { key: 'pricing', label: 'Pricing & Policies', archetype: 'pricing', config: {
        rail: ['Create plan','Edit rate','Add add-on'],
      }},
      { key: 'invoices', label: 'Invoices & Payouts', archetype: 'invoices', config: {
        rail: ['Raise invoice','Mark paid','Export'],
      }},
      { key: 'refunds', label: 'Refunds & Exceptions', archetype: 'pipeline', config: {
        rail: ['Approve refund','Deny','Retry payment'],
      }},
    ]
  },
  {
    key: 'reports', label: 'Reports', icon: FileBarChart,
    tabs: [
      { key: 'exec', label: 'Executive Reports', archetype: 'reports_grid', config: {
        rail: ['Schedule email','Clone report','Export'],
      }},
      { key: 'org_prog', label: 'Org & Programme Reports', archetype: 'table', config: {
        dataKey: 'programmes',
        kpis: [
          { label: 'Reports available', value: '24', tone: 'neutral' },
          { label: 'Scheduled', value: '8', tone: 'neutral' },
          { label: 'Run today', value: '36', tone: 'neutral' },
          { label: 'Cohorts tracked', value: '94', tone: 'neutral' },
        ],
        cols: [
          { key: 'name', label: 'Programme', kind: 'text' },
          { key: 'org', label: 'Org', kind: 'text' },
          { key: 'cohorts', label: 'Cohorts', kind: 'num' },
          { key: 'mentees', label: 'Mentees', kind: 'num' },
          { key: 'completion', label: 'Completion', kind: 'progress' },
        ],
        rail: ['Open drill-down','Export','Schedule'],
        filters: ['Org','Status'],
      }},
      { key: 'mentor_rep', label: 'Mentor Reports', archetype: 'table', config: {
        dataKey: 'mentors',
        kpis: [
          { label: 'Mentors reported', value: '720', tone: 'neutral' },
          { label: 'Top quartile MIS', value: '180', tone: 'good' },
          { label: 'Earnings YTD', value: '₹6.4Cr', tone: 'neutral' },
          { label: 'Repeat bookings', value: '4,240', tone: 'good' },
        ],
        cols: [
          { key: 'name', label: 'Mentor', kind: 'avatar' },
          { key: 'mis', label: 'MIS', kind: 'mis' },
          { key: 'sessions', label: 'Sessions', kind: 'num' },
          { key: 'earning', label: 'Earnings', kind: 'currency' },
          { key: 'rating', label: 'Rating', kind: 'rating' },
        ],
        rail: ['Export','Schedule','Open profile'],
        filters: ['Tier','Domain','Country'],
      }},
      { key: 'mentee_roi', label: 'Mentee / ROI Reports', archetype: 'table', config: {
        dataKey: 'mentees',
        kpis: [
          { label: 'Active mentees', value: '2,319', tone: 'neutral' },
          { label: 'Completion %', value: '74%', tone: 'good' },
          { label: 'Repeat bookings', value: '38%', tone: 'good' },
          { label: 'NPS', value: '+42', tone: 'good' },
        ],
        cols: [
          { key: 'name', label: 'Mentee', kind: 'avatar' },
          { key: 'org', label: 'Org', kind: 'text' },
          { key: 'cohort', label: 'Cohort', kind: 'pill' },
          { key: 'sessionsCompleted', label: 'Sessions', kind: 'num' },
          { key: 'progress', label: 'Progress', kind: 'progress' },
          { key: 'feedback', label: 'Feedback', kind: 'rating' },
        ],
        rail: ['Export cohort','Open journey','Schedule'],
        filters: ['Org','Cohort','Progress'],
      }},
      { key: 'export_centre', label: 'Export Centre', archetype: 'exports', config: {
        rail: ['Run export','Schedule export','Re-run'],
      }},
    ]
  },
  {
    key: 'support', label: 'Support & Risk', icon: ShieldAlert,
    tabs: [
      { key: 'tickets', label: 'Ticket Command Center', archetype: 'tickets', config: {
        rail: ['Assign','Escalate','Resolve'],
      }},
      { key: 'abuse', label: 'Abuse / Compliance', archetype: 'pipeline', config: {
        rail: ['Start investigation','Freeze account','Close case'],
      }},
      { key: 'risk', label: 'Risk Signals', archetype: 'table', config: {
        dataKey: 'risk_signals',
        kpis: [
          { label: 'Open signals', value: '14', tone: 'warn' },
          { label: 'High confidence', value: '5', tone: 'bad' },
          { label: 'Closed (7d)', value: '22', tone: 'neutral' },
          { label: 'Avg confidence', value: '78%', tone: 'neutral' },
        ],
        cols: [
          { key: 'signal', label: 'Signal', kind: 'text' },
          { key: 'entity', label: 'Entity', kind: 'text' },
          { key: 'confidence', label: 'Confidence', kind: 'progress' },
          { key: 'detected', label: 'Detected', kind: 'text' },
          { key: 'status', label: 'Status', kind: 'status' },
        ],
        rail: ['Open case','Notify owner','Acknowledge'],
        filters: ['Confidence','Status','Signal type'],
      }},
      { key: 'chatbot', label: 'Chatbot Escalations', archetype: 'table', config: {
        dataKey: 'chatbot',
        kpis: [
          { label: 'In queue', value: '8', tone: 'warn' },
          { label: 'Avg wait', value: '4m', tone: 'good' },
          { label: 'Handled today', value: '142', tone: 'neutral' },
          { label: 'Auto-resolved %', value: '78%', tone: 'good' },
        ],
        cols: [
          { key: 'user', label: 'User', kind: 'avatar' },
          { key: 'topic', label: 'Topic', kind: 'text' },
          { key: 'reason', label: 'Reason', kind: 'pill' },
          { key: 'waitTime', label: 'Wait (min)', kind: 'num' },
          { key: 'status', label: 'Status', kind: 'status' },
        ],
        rail: ['Reassign owner','Change SLA','Close'],
        filters: ['Status','Topic','Reason'],
      }},
      { key: 'sla', label: 'SLA Monitor', archetype: 'sla', config: {
        rail: ['Reassign','Change SLA','Notify'],
      }},
    ]
  },
  {
    key: 'settings', label: 'Settings', icon: Settings,
    tabs: [
      { key: 'platform', label: 'Platform Settings', archetype: 'flags', config: {
        rail: ['Toggle','Test','Publish'],
      }},
      { key: 'policy', label: 'Policy Creator', archetype: 'rule_builder', config: {
        rail: ['Create','Edit','Publish policy'],
      }},
      { key: 'logic', label: 'Logic Controllers', archetype: 'controllers', config: {
        rail: ['Pause','Resume','Override'],
      }},
      { key: 'comms', label: 'Communication Templates', archetype: 'templates', config: {
        rail: ['Edit','Approve','Send test'],
      }},
      { key: 'integrations', label: 'Integrations & API / Webhooks', archetype: 'integrations', config: {
        rail: ['Rotate key','Retry webhook','Open logs'],
      }},
    ]
  },
];

// Canonical tab spec — what lives here, default rail actions, and drill-drawer hint per tab.
// Source: Super Admin Information Architecture sheet (8 modules × 5 tabs = 40 tabs).
const TAB_SPEC = {
  // Overview
  'overview:executive':       { what: 'CEO view of the whole platform', widgets: 'KPI strip, weekly trend, top risks, revenue + credits snapshot', rail: ['Export pulse','Create org','Open incident'], drawerHint: 'Metric explanation, raw drivers, linked report' },
  'overview:ops_pulse':       { what: 'Sessions, completion, no-show, mentor supply, response speed', widgets: 'Trend lines, stacked bars, heatmap, top exception table', rail: ['Open filtered tables','Nudge ops owner','Export'], drawerHint: 'Filtered table + affected entities' },
  'overview:revenue_credits': { what: 'Credit burn, wallet health, renewals, failed payments', widgets: 'Burn line, allocation table, renewals list, waterfall', rail: ['Adjust credits','Open invoice','Pause org'], drawerHint: 'Org wallet drawer, transaction drill-down' },
  'overview:risk_health':     { what: 'Tickets, abuse flags, SLA breaches, anomaly alerts', widgets: 'Ticket aging chart, abuse queue, failed automations', rail: ['Assign owner','Escalate','Export evidence'], drawerHint: 'Full thread + audit history' },
  'overview:automations':     { what: 'System jobs, API health, chatbot handoffs, notification failures', widgets: 'System status cards, error log table, delivery rates', rail: ['Retry job','Disable rule','Open settings'], drawerHint: 'Payload, before/after state, change log' },

  // Organisations
  'organisations:all_orgs':   { what: 'Master list of orgs / institutions / corporate clients', widgets: 'Org directory table, status chips, contract summary', rail: ['Create org','Suspend / Reactivate','Assign admin'], drawerHint: 'Org profile, credits, programmes, tickets, renewals' },
  'organisations:onboarding': { what: 'New org setup workflow', widgets: 'Checklist table, pending approvals, setup blockers', rail: ['Approve setup','Resend invite','Mark blocker'], drawerHint: 'Step-by-step onboarding state' },
  'organisations:programmes': { what: 'Cross-org programme layer', widgets: 'Programme table, cohort volume, progress heatmap', rail: ['Create programme','Clone template','Pause cohort'], drawerHint: 'Programme config drawer' },
  'organisations:websites':   { what: 'White-label and CMS controls', widgets: 'Branding table, pending changes, domains', rail: ['Publish branding','Rollback','Approve domain'], drawerHint: 'Version history, preview, approvals' },
  'organisations:subs':       { what: 'Plan, seats, credits, validity, renewal risk', widgets: 'Renewal calendar, exposure table, org plan table', rail: ['Renew','Upgrade','Add exception'], drawerHint: 'Full contract + usage history' },

  // Users & Access
  'users:directory':       { what: 'All admins, mentors, mentees, support users', widgets: 'Search table, status filters, last activity', rail: ['Invite','Suspend','Impersonate read-only'], drawerHint: 'Profile + access + history' },
  'users:roles':           { what: 'Role creator + permission templates', widgets: 'Role table, permissions matrix summary', rail: ['Create role','Copy role','Publish role version'], drawerHint: 'Role detail, scopes, change log' },
  'users:access':          { what: 'Formal queue for more access', widgets: 'Approval queue, pending expiries', rail: ['Approve','Deny','Time-box access'], drawerHint: 'Why requested, who requested, expiry' },
  'users:account_actions': { what: 'Bulk and one-off account governance', widgets: 'Disabled users, command-only history, recent actions', rail: ['Suspend','Reactivate','Reset access'], drawerHint: 'Command history' },
  'users:audit':           { what: 'Who changed what, when, why', widgets: 'Searchable immutable log', rail: ['Export evidence','Filter','Pin entry'], drawerHint: 'Payload, related object, comparison view' },

  // Mentor Pool
  'mentors:directory':  { what: 'Global mentor inventory', widgets: 'Filter table, quality band, availability, tier', rail: ['Add mentor','Map mentor','Hide / Show'], drawerHint: 'Full mentor profile + mappings' },
  'mentors:compliance': { what: 'LOE, KYC / docs, bank / tax, approvals', widgets: 'Pipeline table, pending docs, verification SLA', rail: ['Approve','Reject','Re-trigger LOE'], drawerHint: 'Document timeline' },
  'mentors:capacity':   { what: 'Slot supply control', widgets: 'Capacity table, domain supply-demand, slot cap status', rail: ['Adjust cap','Set floor','Create alert'], drawerHint: 'Mentor capacity drawer' },
  'mentors:mis':        { what: 'Mentor impact score engine', widgets: 'MIS leaderboard, no-show heatmap, rating trend', rail: ['Override visibility','Nudge','Export MIS'], drawerHint: 'Parameter breakdown + history' },
  'mentors:visibility': { what: 'Where mentors are visible', widgets: 'Mapping table, org exposure, premium pool flags', rail: ['Map','Unmap','Pin featured mentor'], drawerHint: 'Visibility rules drawer' },

  // Credits & Billing
  'credits:engine':   { what: 'Platform-wide credit logic', widgets: 'Tier rules, validity rules, burn rules', rail: ['Edit logic','Publish version','Simulate'], drawerHint: 'Before / after logic diff' },
  'credits:wallets':  { what: 'Org, programme, mentee balances', widgets: 'Allocation queue, low balance list, expiry alerts', rail: ['Allocate','Top-up','Reverse / Freeze'], drawerHint: 'Transaction history' },
  'credits:pricing':  { what: 'Rate cards + commercial rules', widgets: 'Mentor tier pricing, org plans, B2C packs', rail: ['Create plan','Edit rate','Add add-on'], drawerHint: 'Plan detail + dependencies' },
  'credits:invoices': { what: 'Org invoicing + mentor payouts', widgets: 'Invoice table, payout schedule, pending approvals', rail: ['Raise invoice','Mark paid','Export'], drawerHint: 'Invoice line items' },
  'credits:refunds':  { what: 'Refund logic, failed payments, disputes', widgets: 'Refund queue, failed payment table, exception log', rail: ['Approve','Reject refund','Retry payment'], drawerHint: 'Evidence + approval trail' },

  // Reports
  'reports:exec':          { what: 'Top-level standard reports', widgets: 'QuickSight-style report tiles, saved exports', rail: ['Export','Schedule email','Clone report'], drawerHint: 'Report filters + definitions' },
  'reports:org_prog':      { what: 'Health by org / programme / cohort', widgets: 'Programme scorecards, completion tables', rail: ['Open org drill-down','Filter','Export'], drawerHint: 'Filtered report drawer' },
  'reports:mentor_rep':    { what: 'Quality, earnings, supply, response', widgets: 'Leaderboards, cohort splits, payout filters', rail: ['Export mentor set','Schedule','Compare'], drawerHint: 'Mentor report detail' },
  'reports:mentee_roi':    { what: 'Learning outcomes and usage', widgets: 'Completion, repeat booking, feedback, breakthroughs', rail: ['Export cohort view','Filter','Tag highlight'], drawerHint: 'Mentee journey detail' },
  'reports:export_centre': { what: 'All exports and schedules', widgets: 'Export history, pending jobs, recipients', rail: ['Run export','Schedule export','Pause job'], drawerHint: 'File details + filters used' },

  // Support & Risk
  'support:tickets': { what: 'Everything support-related', widgets: 'Kanban / table, SLA timers, owner', rail: ['Assign','Escalate','Resolve'], drawerHint: 'Full ticket thread' },
  'support:abuse':   { what: 'Serious misconduct and evidence', widgets: 'Investigation queue, abuse categories, evidence status', rail: ['Start investigation','Freeze account','Close case'], drawerHint: 'Evidence bundle' },
  'support:risk':    { what: 'System-generated risk layer', widgets: 'Anomaly table, repeat no-show flags, fraud heuristics', rail: ['Open case','Notify owner','Mark false positive'], drawerHint: 'Linked entities, confidence score' },
  'support:chatbot': { what: 'Bot handoffs needing human attention', widgets: 'Escalation queue, unresolved bot intents', rail: ['Take over','Train intent','Close'], drawerHint: 'Conversation transcript' },
  'support:sla':     { what: 'Response and resolution compliance', widgets: 'Breach list, weekly trend, queue heatmap', rail: ['Reassign owner','Change SLA','Notify lead'], drawerHint: 'Underlying thread data' },

  // Settings
  'settings:platform':     { what: 'Global switches and defaults', widgets: 'Feature flags, environment cards', rail: ['Toggle','Test','Publish'], drawerHint: 'Change impact panel' },
  'settings:policy':       { what: 'Human-readable rule builder', widgets: 'Policy table, version list, simulation pane', rail: ['Create','Edit','Publish policy'], drawerHint: 'Before / after and affected roles' },
  'settings:logic':        { what: 'Low-code system controllers', widgets: 'Controller list, status, thresholds', rail: ['Pause / Resume','Override','Test'], drawerHint: 'Inputs, outputs, owner, logs' },
  'settings:comms':        { what: 'Email / WA / in-app template system', widgets: 'Template library, variables, approval states', rail: ['Edit','Approve','Send test'], drawerHint: 'Rendered preview + versions' },
  'settings:integrations': { what: 'Connected systems', widgets: 'Status table, API keys, webhook events', rail: ['Rotate key','Retry webhook','Open logs'], drawerHint: 'Payload + response history' },
};

const getTabSpec = (moduleKey, tabKey) => TAB_SPEC[moduleKey + ':' + tabKey] || null;

/* ============================================================================
   ORG ADMIN IA — designed for institution-side daily operations, reporting,
   and requests without exposing global platform controls.
   Source: Org Admin Information Architecture sheet.
   ============================================================================ */

// 8 modules · 30 tabs total: 4+4+3+4+4+4+3+4
const ORG_ADMIN_IA = [
  {
    key: 'overview', label: 'Overview', icon: LayoutDashboard,
    tabs: [
      { key: 'health', label: 'Institution Health', archetype: 'oa_overview', config: {} },
      { key: 'programme_pulse', label: 'Programme Pulse', archetype: 'oa_charts', config: {} },
      { key: 'mentor_capacity', label: 'Mentor Capacity', archetype: 'oa_capacity', config: {} },
      { key: 'revenue_renewals', label: 'Revenue & Renewals', archetype: 'oa_revenue', config: {} },
    ],
  },
  {
    key: 'programmes', label: 'Programmes', icon: Layers,
    tabs: [
      { key: 'all', label: 'All Programmes', archetype: 'oa_table', config: { dataKey: 'programmes' } },
      { key: 'cohorts', label: 'Cohorts', archetype: 'oa_table', config: { dataKey: 'cohorts' } },
      { key: 'agendas', label: 'Agendas', archetype: 'oa_table', config: { dataKey: 'agendas' } },
      { key: 'session_pricing', label: 'Session Pricing', archetype: 'oa_table', config: { dataKey: 'session_pricing' } },
    ],
  },
  {
    key: 'users', label: 'Users', icon: Users,
    tabs: [
      { key: 'mentees', label: 'Mentees', archetype: 'oa_table', config: { dataKey: 'mentees' } },
      { key: 'sub_admins', label: 'Org Sub-Admins', archetype: 'oa_table', config: { dataKey: 'sub_admins' } },
      { key: 'access', label: 'Access Control', archetype: 'oa_table', config: { dataKey: 'access' } },
    ],
  },
  {
    key: 'mentors', label: 'Mentors', icon: GraduationCap,
    tabs: [
      { key: 'assigned', label: 'Assigned Mentors', archetype: 'oa_table', config: { dataKey: 'assigned_mentors' } },
      { key: 'requests', label: 'Mentor Requests', archetype: 'oa_pipeline', config: { dataKey: 'mentor_requests' } },
      { key: 'performance', label: 'Performance', archetype: 'oa_table', config: { dataKey: 'mentor_performance' } },
      { key: 'availability', label: 'Availability', archetype: 'oa_table', config: { dataKey: 'mentor_availability' } },
    ],
  },
  {
    key: 'credits', label: 'Credits', icon: Wallet,
    tabs: [
      { key: 'wallet', label: 'Wallet', archetype: 'oa_wallet', config: {} },
      { key: 'allocations', label: 'Allocations', archetype: 'oa_table', config: { dataKey: 'allocations' } },
      { key: 'renewals', label: 'Renewals', archetype: 'oa_table', config: { dataKey: 'renewals' } },
      { key: 'guardrails', label: 'Spend Guardrails', archetype: 'oa_guardrails', config: {} },
    ],
  },
  {
    key: 'reports', label: 'Reports', icon: FileBarChart,
    tabs: [
      { key: 'executive', label: 'Executive', archetype: 'oa_reports', config: {} },
      { key: 'programme', label: 'Programme', archetype: 'oa_table', config: { dataKey: 'programme_reports' } },
      { key: 'mentor', label: 'Mentor', archetype: 'oa_table', config: { dataKey: 'mentor_reports' } },
      { key: 'mentee', label: 'Mentee & Outcomes', archetype: 'oa_table', config: { dataKey: 'mentee_reports' } },
    ],
  },
  {
    key: 'support', label: 'Support', icon: ShieldAlert,
    tabs: [
      { key: 'queue', label: 'Ticket Queue', archetype: 'oa_table', config: { dataKey: 'tickets' } },
      { key: 'escalations', label: 'Escalations', archetype: 'oa_table', config: { dataKey: 'escalations' } },
      { key: 'faq', label: 'FAQ / Chatbot', archetype: 'oa_table', config: { dataKey: 'chatbot_intents' } },
    ],
  },
  {
    key: 'settings', label: 'Settings', icon: Settings,
    tabs: [
      { key: 'profile', label: 'Org Profile', archetype: 'oa_profile', config: {} },
      { key: 'branding', label: 'Branding', archetype: 'oa_branding', config: {} },
      { key: 'policies', label: 'Policies in Allowed Scope', archetype: 'oa_policies', config: {} },
      { key: 'notifications', label: 'Notifications', archetype: 'oa_table', config: { dataKey: 'notifications' } },
    ],
  },
];

// Org Admin tab spec — what lives here, default widgets, action rail, drill-drawer hint per tab
const ORG_ADMIN_TAB_SPEC = {
  // Overview
  'overview:health':           { what: 'Org-level pulse', widgets: 'Completion %, credits left, active mentees, open tickets, mentor response rate', rail: ['Export org summary','Send reminder'], drawerHint: 'Metric + contributing cohorts' },
  'overview:programme_pulse':  { what: 'All programmes and cohorts', widgets: 'Programme health cards, cohort progress table', rail: ['Open programme','Clone cohort'], drawerHint: 'Programme timeline' },
  'overview:mentor_capacity':  { what: 'Assigned mentors and availability', widgets: 'Supply-demand, next available, response speed', rail: ['Request mentor','Nudge mentor'], drawerHint: 'Mentor detail drawer' },
  'overview:revenue_renewals': { what: 'Plan usage and expiry', widgets: 'Wallet burn, renewal date, add-on exposure', rail: ['Raise renewal request'], drawerHint: 'Commercial detail' },

  // Programmes
  'programmes:all':             { what: 'Create / manage programmes', widgets: 'Programme list, status, pricing', rail: ['Create','Archive','Duplicate'], drawerHint: 'Programme setup' },
  'programmes:cohorts':         { what: 'Cohort structure and learners', widgets: 'Cohort list, learner counts, progress', rail: ['Create cohort','Bulk move users'], drawerHint: 'Cohort detail' },
  'programmes:agendas':         { what: 'Agenda templates', widgets: 'Agenda library, assignment table', rail: ['Create template'], drawerHint: 'Agenda detail' },
  'programmes:session_pricing': { what: 'Per-programme pricing within allowed limits', widgets: 'Rate table, caps', rail: ['Request change / edit within scope'], drawerHint: 'Pricing detail' },

  // Users
  'users:mentees':     { what: 'Invite, search, segment, monitor', widgets: 'Mentee table, inactive users, low-credit list', rail: ['Invite','Assign credit','Suspend'], drawerHint: 'Full user drawer' },
  'users:sub_admins':  { what: 'Create and manage sub-admins', widgets: 'Sub-admin table, assigned scope', rail: ['Invite','Edit access'], drawerHint: 'Scope drawer' },
  'users:access':      { what: 'Org-level role assignments', widgets: 'Permission table, request queue', rail: ['Approve','Revoke'], drawerHint: 'Change log' },

  // Mentors
  'mentors:assigned':     { what: 'Mentor list for org', widgets: 'Availability, quality band, response speed, last active', rail: ['Map mentor','Feature mentor'], drawerHint: 'Mentor drawer' },
  'mentors:requests':     { what: 'Request more mentors or premium pool', widgets: 'Request queue, approvals', rail: ['Raise request'], drawerHint: 'Decision trail' },
  'mentors:performance':  { what: 'Mentor quality inside org', widgets: 'Completion, feedback, no-show, repeat booking', rail: ['Nudge','Flag issue'], drawerHint: 'MIS-lite detail' },
  'mentors:availability': { what: 'Slot coverage for programmes', widgets: 'Coverage table, at-risk windows', rail: ['Request more slots'], drawerHint: 'Capacity detail' },

  // Credits
  'credits:wallet':      { what: 'Org credit pool and expiry', widgets: 'Balance, expiry, burn trend', rail: ['Allocate','Request more','Export'], drawerHint: 'Transaction drawer' },
  'credits:allocations': { what: 'Credits by programme / mentee', widgets: 'Allocation table, bulk upload status', rail: ['Bulk assign','Reverse'], drawerHint: 'Allocation history' },
  'credits:renewals':    { what: 'Plan and add-on logic', widgets: 'Renewal checklist, invoice status', rail: ['Raise renewal / top-up'], drawerHint: 'Commercial drawer' },
  'credits:guardrails':  { what: 'Local caps and warnings', widgets: 'Spend thresholds, overuse alerts', rail: ['Adjust threshold within scope'], drawerHint: 'Policy detail' },

  // Reports
  'reports:executive': { what: 'Board-ready org reports', widgets: 'Saved report tiles, export list', rail: ['Export PDF / CSV'], drawerHint: 'Filter definition' },
  'reports:programme': { what: 'Programme / cycle reporting', widgets: 'Programme table + trend', rail: ['Open cohort drill-down'], drawerHint: 'Report drawer' },
  'reports:mentor':    { what: 'Mentor performance inside org', widgets: 'Leaderboards, response time, satisfaction', rail: ['Export mentor report'], drawerHint: 'Mentor segment detail' },
  'reports:mentee':    { what: 'Usage and outcome signals', widgets: 'Completion, breakthrough log, inactivity', rail: ['Export cohort report'], drawerHint: 'Mentee detail' },

  // Support
  'support:queue':       { what: 'All org-routed tickets', widgets: 'Kanban / table with SLA', rail: ['Reply','Escalate','Resolve'], drawerHint: 'Thread drawer' },
  'support:escalations': { what: 'Issues needing Super Admin', widgets: 'Escalated ticket list, abuse flags', rail: ['Escalate up'], drawerHint: 'Escalation history' },
  'support:faq':         { what: 'Self-serve support layer', widgets: 'Intent table, top unresolved', rail: ['Review bot handoffs'], drawerHint: 'Conversation detail' },

  // Settings
  'settings:profile':       { what: 'Name, logo, public data', widgets: 'Profile card', rail: ['Edit profile'], drawerHint: 'Version history' },
  'settings:branding':      { what: 'Website / theme / partner pages', widgets: 'Theme table, pending edits', rail: ['Publish / Save draft'], drawerHint: 'Preview drawer' },
  'settings:policies':      { what: 'Only scoped policy edits', widgets: 'Policy list with lock badges', rail: ['Request change / Edit allowed field'], drawerHint: 'Policy comparison' },
  'settings:notifications': { what: 'Who receives what', widgets: 'Preference table', rail: ['Update routing'], drawerHint: 'Preview + test' },
};

const getOrgAdminTabSpec = (moduleKey, tabKey) => ORG_ADMIN_TAB_SPEC[moduleKey + ':' + tabKey] || null;

/* ============================================================================
   ORG SUB-ADMIN IA — strictly scoped workbench. Programme managers, department
   owners, or key account operators with limited access. Everything they see
   is filtered to their assigned programmes / cohorts / users.
   Source: Org Sub-Admin Information Architecture sheet.
   ============================================================================ */

// 7 modules · 13 tabs total: 2+2+2+2+2+2+1
const SUB_ADMIN_IA = [
  {
    key: 'overview', label: 'Overview', icon: LayoutDashboard,
    tabs: [
      { key: 'pulse', label: 'My Scope Pulse', archetype: 'sa_pulse', config: {} },
      { key: 'priority', label: 'Priority Queue', archetype: 'sa_priority', config: {} },
    ],
  },
  {
    key: 'work', label: 'Assigned Work', icon: Briefcase,
    tabs: [
      { key: 'programmes', label: 'Programmes & Cohorts', archetype: 'sa_table', config: { dataKey: 'programmes' } },
      { key: 'users', label: 'Users', archetype: 'sa_table', config: { dataKey: 'users' } },
    ],
  },
  {
    key: 'sessions', label: 'Sessions', icon: Calendar,
    tabs: [
      { key: 'upcoming', label: 'Upcoming', archetype: 'sa_table', config: { dataKey: 'upcoming' } },
      { key: 'issues', label: 'Issues', archetype: 'sa_table', config: { dataKey: 'issues' } },
    ],
  },
  {
    key: 'credits', label: 'Credits', icon: Wallet,
    tabs: [
      { key: 'assign', label: 'View & Assign', archetype: 'sa_credits', config: {} },
      { key: 'requests', label: 'Requests', archetype: 'sa_table', config: { dataKey: 'credit_requests' } },
    ],
  },
  {
    key: 'comms', label: 'Communications', icon: MessageSquare,
    tabs: [
      { key: 'reminders', label: 'Reminders', archetype: 'sa_table', config: { dataKey: 'reminders' } },
      { key: 'announcements', label: 'Announcements', archetype: 'sa_table', config: { dataKey: 'announcements' } },
    ],
  },
  {
    key: 'support', label: 'Support', icon: ShieldAlert,
    tabs: [
      { key: 'tickets', label: 'Tickets', archetype: 'sa_table', config: { dataKey: 'tickets' } },
      { key: 'chatbot', label: 'Chatbot Handoffs', archetype: 'sa_table', config: { dataKey: 'chatbot' } },
    ],
  },
  {
    key: 'settings', label: 'Settings', icon: Settings,
    tabs: [
      { key: 'access', label: 'My Access', archetype: 'sa_my_access', config: {} },
    ],
  },
];

// Sub-Admin tab spec — what lives here, default widgets, action rail, drill-drawer hint per tab
const SUB_ADMIN_TAB_SPEC = {
  'overview:pulse':         { what: 'Assigned programmes / users only', widgets: 'Sessions today, unresolved tickets, invites pending, low-credit users', rail: ['Open user','Send reminder'], drawerHint: 'Scoped metric detail' },
  'overview:priority':      { what: 'What needs action first', widgets: 'Pending approvals, no-shows, reminder failures', rail: ['Take action','Escalate'], drawerHint: 'Item detail' },
  'work:programmes':        { what: 'Only assigned ones', widgets: 'Programme / cohort table', rail: ['Open cohort'], drawerHint: 'Cohort detail' },
  'work:users':             { what: 'Assigned mentees / mentors', widgets: 'User table with scoped filters', rail: ['Invite','Suspend if allowed'], drawerHint: 'Profile drawer' },
  'sessions:upcoming':      { what: 'Sessions under this scope', widgets: 'Upcoming table, reschedules', rail: ['Open session','Send reminder'], drawerHint: 'Session detail' },
  'sessions:issues':        { what: 'No-shows, cancellations, late joins', widgets: 'Issue queue, repeat offender list', rail: ['Flag','Escalate'], drawerHint: 'Issue history' },
  'credits:assign':         { what: 'Only if delegated', widgets: 'Scoped balance, assignment table', rail: ['Assign','Request more'], drawerHint: 'Transaction detail' },
  'credits:requests':       { what: 'Requests moving upward', widgets: 'Pending credit requests, approvals', rail: ['Escalate to OA'], drawerHint: 'Request history' },
  'comms:reminders':        { what: 'Allowed reminder sends', widgets: 'Template list, send log', rail: ['Send reminder'], drawerHint: 'Rendered message' },
  'comms:announcements':    { what: 'Scoped announcements', widgets: 'Delivery table', rail: ['Create draft','Send if allowed'], drawerHint: 'Audience detail' },
  'support:tickets':        { what: 'First-line support within scope', widgets: 'Ticket list', rail: ['Reply','Resolve','Escalate'], drawerHint: 'Full thread' },
  'support:chatbot':        { what: 'Bot escalations for assigned users', widgets: 'Escalation list', rail: ['Take over'], drawerHint: 'Conversation detail' },
  'settings:access':        { what: 'What I can and cannot do', widgets: 'Permission summary', rail: ['Request more access'], drawerHint: 'Approval trail' },
};

const getSubAdminTabSpec = (moduleKey, tabKey) => SUB_ADMIN_TAB_SPEC[moduleKey + ':' + tabKey] || null;

/* ============================================================================
   MENTOR IA — marketplace-style trust signals + idiot-proof operating flow.
   Mentors see total earnings first; org-wise breakdown stays inside filtered
   tables. Source: Mentor Dashboard Information Architecture sheet.
   ============================================================================ */

// 7 modules · 17 tabs total: 2+3+2+2+2+2+4
const MENTOR_IA = [
  {
    key: 'home', label: 'Home', icon: LayoutDashboard,
    tabs: [
      { key: 'today', label: 'Today', archetype: 'm_today', config: {} },
      { key: 'snapshot', label: 'Performance Snapshot', archetype: 'm_snapshot', config: {} },
    ],
  },
  {
    key: 'sessions', label: 'Sessions', icon: Calendar,
    tabs: [
      { key: 'upcoming', label: 'Upcoming & Active', archetype: 'm_table', config: { dataKey: 'upcoming' } },
      { key: 'requests', label: 'Requests', archetype: 'm_requests', config: {} },
      { key: 'history', label: 'History', archetype: 'm_table', config: { dataKey: 'history' } },
    ],
  },
  {
    key: 'availability', label: 'Availability', icon: Clock,
    tabs: [
      { key: 'calendar', label: 'Calendar', archetype: 'm_calendar', config: {} },
      { key: 'preferences', label: 'Preferences', archetype: 'm_preferences', config: {} },
    ],
  },
  {
    key: 'requests_chat', label: 'Requests & Chat', icon: MessageSquare,
    tabs: [
      { key: 'inbox', label: 'Inquiry Inbox', archetype: 'm_inbox', config: {} },
      { key: 'resources', label: 'Resources', archetype: 'm_resources', config: {} },
    ],
  },
  {
    key: 'earnings', label: 'Earnings', icon: Wallet,
    tabs: [
      { key: 'overview', label: 'Overview', archetype: 'm_earnings', config: {} },
      { key: 'payouts', label: 'Payout Table', archetype: 'm_table', config: { dataKey: 'payouts' } },
    ],
  },
  {
    key: 'impact', label: 'Impact', icon: Sparkles,
    tabs: [
      { key: 'trends', label: 'Performance Trends', archetype: 'm_trends', config: {} },
      { key: 'breakthroughs', label: 'Career Breakthrough Reflections', archetype: 'm_breakthroughs', config: {} },
    ],
  },
  {
    key: 'profile', label: 'Profile & Settings', icon: UserCog,
    tabs: [
      { key: 'public', label: 'Public Profile', archetype: 'm_public', config: {} },
      { key: 'signals', label: 'Availability Signals', archetype: 'm_signals', config: {} },
      { key: 'compliance', label: 'Compliance & Payment', archetype: 'm_compliance', config: {} },
      { key: 'notifications', label: 'Notifications', archetype: 'm_table', config: { dataKey: 'notifications' } },
    ],
  },
];

// Mentor tab spec — what lives here, default widgets, action rail, drill-drawer hint per tab
const MENTOR_TAB_SPEC = {
  'home:today':              { what: 'Immediate work', widgets: 'Upcoming sessions, pending approvals, next available slot, response speed badge, total earnings MTD', rail: ['Join','Accept','Suggest time','Block slot'], drawerHint: 'Session / request drawer' },
  'home:snapshot':           { what: 'Personal quality + impact', widgets: 'Completion %, repeat bookings, avg rating, no-show %, breakthrough reflections', rail: ['Open detailed trends'], drawerHint: 'Trend explanation' },
  'sessions:upcoming':       { what: 'Confirmed work', widgets: 'Session list, countdown, agenda preview', rail: ['Join','Reschedule','Cancel'], drawerHint: 'Session detail + notes' },
  'sessions:requests':       { what: 'Manual approval queue', widgets: 'Request cards with agenda context', rail: ['Accept','Suggest time','Decline'], drawerHint: 'Booking detail' },
  'sessions:history':        { what: 'Past sessions', widgets: 'History table, filters, feedback summaries', rail: ['Export profile'], drawerHint: 'Past session detail' },
  'availability:calendar':   { what: 'Weekly / monthly open slots', widgets: 'Calendar, buffer, blocked times', rail: ['Add slot','Block time','Set preference'], drawerHint: 'Slot detail' },
  'availability:preferences':{ what: 'Lead time, buffer, visibility', widgets: 'Settings table', rail: ['Save changes'], drawerHint: 'Impact note' },
  'requests_chat:inbox':     { what: 'Pre-session conversations', widgets: 'Booking-scoped chat list, unread badge', rail: ['Reply','Share resource'], drawerHint: 'Chat drawer' },
  'requests_chat:resources': { what: 'Files sent / received', widgets: 'Resource library', rail: ['Upload file'], drawerHint: 'File preview' },
  'earnings:overview':       { what: 'Total money picture', widgets: 'Total earnings, paid, pending, next payout', rail: ['Download invoice','Open payout table'], drawerHint: 'Payout detail' },
  'earnings:payouts':        { what: 'Org-wise only when filtered', widgets: 'Table by org / month / status', rail: ['Filter','Export'], drawerHint: 'Invoice line items' },
  'impact:trends':           { what: 'Mentor-quality view', widgets: 'Ratings line, response speed, completion trend', rail: ['Open MIS-lite tips'], drawerHint: 'Metric definition' },
  'impact:breakthroughs':    { what: 'Outcome evidence from mentees', widgets: 'Timeline of job / internship wins, clarity gains, skill confidence increases', rail: ['Add reflection','Confirm AI summary'], drawerHint: 'Linked sessions + evidence' },
  'profile:public':          { what: 'Marketplace-facing profile', widgets: 'Preview, skills, badges, reviews, next available', rail: ['Edit profile'], drawerHint: 'Rendered public view' },
  'profile:signals':         { what: 'MentorCruise-style cues', widgets: 'Usually responds in X hours, active last week, quick responder, top mentor, next available', rail: ['Toggle if applicable'], drawerHint: 'How badge is calculated' },
  'profile:compliance':      { what: 'LOE, tax, bank, payout info', widgets: 'Compliance checklist', rail: ['Update details'], drawerHint: 'Verification history' },
  'profile:notifications':   { what: 'Personal routing', widgets: 'Notification matrix', rail: ['Save preferences'], drawerHint: 'Preview' },
};

const getMentorTabSpec = (moduleKey, tabKey) => MENTOR_TAB_SPEC[moduleKey + ':' + tabKey] || null;

/* ============================================================================
   MENTEE IA — simple learning journey: discover, book, attend, reflect, and
   measure progress without platform confusion. Source: Mentee Dashboard
   Information Architecture sheet.
   ============================================================================ */

// 7 modules · 14 tabs total: 2+2+3+2+2+2+1
const MENTEE_IA = [
  {
    key: 'home', label: 'Home', icon: LayoutDashboard,
    tabs: [
      { key: 'next', label: 'My Next Actions', archetype: 'me_next', config: {} },
      { key: 'pulse', label: 'Learning Pulse', archetype: 'me_pulse', config: {} },
    ],
  },
  {
    key: 'explorer', label: 'Mentor Explorer', icon: Search,
    tabs: [
      { key: 'discover', label: 'Discover', archetype: 'me_discover', config: {} },
      { key: 'saved', label: 'Saved Mentors', archetype: 'me_saved', config: {} },
    ],
  },
  {
    key: 'sessions', label: 'Sessions', icon: Calendar,
    tabs: [
      { key: 'booking', label: 'Booking Flow', archetype: 'me_booking', config: {} },
      { key: 'upcoming', label: 'Upcoming', archetype: 'me_upcoming', config: {} },
      { key: 'history', label: 'History & Feedback', archetype: 'me_history', config: {} },
    ],
  },
  {
    key: 'credits', label: 'Credits', icon: Wallet,
    tabs: [
      { key: 'balance', label: 'Balance', archetype: 'me_balance', config: {} },
      { key: 'usage', label: 'Usage History', archetype: 'me_usage', config: {} },
    ],
  },
  {
    key: 'progress', label: 'Progress', icon: Sparkles,
    tabs: [
      { key: 'breakthroughs', label: 'Breakthrough Log', archetype: 'me_breakthroughs', config: {} },
      { key: 'growth', label: 'Session-to-Session Growth', archetype: 'me_growth', config: {} },
    ],
  },
  {
    key: 'profile', label: 'Profile & Settings', icon: UserCog,
    tabs: [
      { key: 'profile', label: 'Profile', archetype: 'me_profile', config: {} },
      { key: 'preferences', label: 'Preferences', archetype: 'me_preferences', config: {} },
    ],
  },
  {
    key: 'support', label: 'Support', icon: ShieldAlert,
    tabs: [
      { key: 'help', label: 'Chatbot + Help', archetype: 'me_help', config: {} },
    ],
  },
];

// Mentee tab spec — what lives here, default widgets, action rail, drill-drawer hint per tab
const MENTEE_TAB_SPEC = {
  'home:next':              { what: 'What to do right now', widgets: 'Upcoming session, credits left, next mentor reply, saved mentors’ opening slots', rail: ['Join','Rebook','Buy / request credits'], drawerHint: 'Next-action drawer' },
  'home:pulse':             { what: 'Simple ROI view', widgets: 'Sessions completed, learning streak, skill confidence pulse, clarity gain trend', rail: ['Open full progress'], drawerHint: 'Pulse explanation' },
  'explorer:discover':      { what: 'Find mentors fast', widgets: 'Search, filters, quick responder / top mentor badges, next availability, social proof', rail: ['Save mentor','Compare mentors'], drawerHint: 'Mentor card drawer' },
  'explorer:saved':         { what: 'Shortlist', widgets: 'Saved mentor cards, notify-on-slot', rail: ['Open profile'], drawerHint: 'Mentor summary' },
  'sessions:booking':       { what: 'Book simply', widgets: 'Slot picker, agenda form, request-a-slot path', rail: ['Confirm booking'], drawerHint: 'Booking summary drawer' },
  'sessions:upcoming':      { what: 'Confirmed sessions', widgets: 'Session list, countdown, Zoom join, reschedule / cancel', rail: ['Join','Reschedule','Cancel'], drawerHint: 'Session detail' },
  'sessions:history':       { what: 'Past sessions and ratings', widgets: 'History table, mentor feedback, your notes', rail: ['Rebook','Export note'], drawerHint: 'Past session drawer' },
  'credits:balance':        { what: 'Credits and validity', widgets: 'Balance bar, expiry, low-credit alert', rail: ['Buy credits','Request credits'], drawerHint: 'Transaction drawer · Razorpay integration' },
  'credits:usage':          { what: 'Where credits went', widgets: 'Credit history table', rail: ['Export','Open linked session'], drawerHint: 'Session detail' },
  'progress:breakthroughs': { what: 'Reflective milestones', widgets: 'Internship / job achieved, clarity gain, skill confidence increase, AI-drafted summary', rail: ['Confirm','Edit milestone'], drawerHint: 'Evidence + related sessions' },
  'progress:growth':        { what: 'Simple trend view', widgets: 'Confidence trend, mentor variety, repeat learning themes', rail: ['Open history'], drawerHint: 'Trend explanation' },
  'profile:profile':        { what: 'Your basic details and timezone', widgets: 'Profile card', rail: ['Edit profile'], drawerHint: 'Preview' },
  'profile:preferences':    { what: 'Notifications, chatbot, privacy', widgets: 'Settings table', rail: ['Save'], drawerHint: 'Preview' },
  'support:help':           { what: 'Fast help', widgets: 'Chatbot widget, FAQ shortcuts, ticket create button', rail: ['Start chat','Raise ticket'], drawerHint: 'Conversation / ticket drawer' },
};

const getMenteeTabSpec = (moduleKey, tabKey) => MENTEE_TAB_SPEC[moduleKey + ':' + tabKey] || null;


/* ============================================================================
   PRIMITIVE COMPONENTS
   ============================================================================ */

// CSS-in-component helpers
const cx = (...parts) => parts.filter(Boolean).join(' ');

function FontStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Mono:wght@400;500&display=swap');
      .mu-app * { box-sizing: border-box; }
      .mu-app { font-family: ${FONT_BODY}; -webkit-font-smoothing: antialiased; }
      .mu-display { font-family: ${FONT_DISPLAY}; font-weight: 500; letter-spacing: -0.025em; font-style: normal; }
      .mu-mono { font-family: ${FONT_MONO}; font-feature-settings: 'tnum'; }
      .mu-scroll::-webkit-scrollbar { width: 8px; height: 8px; }
      .mu-scroll::-webkit-scrollbar-track { background: transparent; }
      .mu-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
      .mu-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.16); }
      @keyframes mu-fade-in { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes mu-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }
      @keyframes mu-slide-in-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      .mu-fade-in { animation: mu-fade-in 240ms ease-out both; }
      .mu-pulse { animation: mu-pulse 1.6s ease-in-out infinite; }
      .mu-row:hover { background: rgba(255,255,255,0.025); }
    `}</style>
  );
}

function StatusPill({ children, tone, t, soft }) {
  const map = {
    good: { bg: t.greenSoft, fg: t.green, dot: t.green },
    bad: { bg: t.redSoft, fg: t.red, dot: t.red },
    warn: { bg: t.yellowSoft, fg: t.yellow, dot: t.yellow },
    info: { bg: t.blueSoft, fg: t.blue, dot: t.blue },
    neutral: { bg: t.borderSoft, fg: t.textMuted, dot: t.textMuted },
    accent: { bg: t.accentSoft, fg: t.accent, dot: t.accent },
    purple: { bg: t.purpleSoft, fg: t.purple, dot: t.purple },
  };
  const s = map[tone] || map.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '3px 10px', borderRadius: 999,
      background: soft ? 'transparent' : s.bg,
      border: soft ? '1px solid ' + s.fg + '33' : 'none',
      color: s.fg, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 999, background: s.dot }} />
      {children}
    </span>
  );
}

function Sparkline({ data, color, height, width }) {
  const w = width || 80;
  const h = height || 22;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(max - min, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * h;
    return x + ',' + y;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block' }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProgressBar({ value, color, t, h }) {
  const height = h || 6;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height, background: t.borderSoft, borderRadius: 999, overflow: 'hidden' }}>
        <div style={{ width: Math.max(0, Math.min(100, value)) + '%', height: '100%', background: color || t.accent, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, minWidth: 32, textAlign: 'right' }}>{value}%</span>
    </div>
  );
}

function BarChart({ data, t, height }) {
  const h = height || 180;
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: h, padding: '8px 0' }}>
      {data.map((d, i) => {
        const pct = (d.value / max) * 100;
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <div style={{
              width: '100%', height: pct + '%', minHeight: 4,
              background: 'linear-gradient(180deg, ' + (d.color || t.accent) + ' 0%, ' + (d.color || t.accent) + '99 100%)',
              borderRadius: '4px 4px 0 0',
              transition: 'height 400ms ease-out',
            }} />
            <span style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================================
   Reusable chart blocks — full pie chart for outcome mix.
   GroupedBarChart for the Sample Dashboard Visuals spec is provided by the
   existing ClusteredBar component (3-series, axis labels, grid, hover titles).
   ============================================================================ */
function PieChartWithLegend({ slices, t, size, showLegend }) {
  // slices: [{ label, value, color }, ...]
  const sz = size || 200;
  const cx = sz / 2;
  const cy = sz / 2;
  const r = sz / 2 - 4;
  const total = slices.reduce((a, s) => a + s.value, 0);
  let acc = 0;
  const arcs = slices.map((s) => {
    const startAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    acc += s.value;
    const endAngle = (acc / total) * Math.PI * 2 - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;
    const path = ['M', cx, cy, 'L', x1, y1, 'A', r, r, 0, largeArc, 1, x2, y2, 'Z'].join(' ');
    const midAngle = (startAngle + endAngle) / 2;
    const labelX = cx + (r * 0.6) * Math.cos(midAngle);
    const labelY = cy + (r * 0.6) * Math.sin(midAngle);
    return { path, color: s.color, label: s.label, value: s.value, labelX, labelY, pct: Math.round((s.value / total) * 100) };
  });
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18, justifyContent: 'center' }}>
      <svg width={sz} height={sz} viewBox={'0 0 ' + sz + ' ' + sz}>
        {arcs.map((a) => (
          <g key={a.label}>
            <path d={a.path} fill={a.color} stroke={t.bgPanel} strokeWidth="1.5">
              <title>{a.label + ': ' + a.value + ' (' + a.pct + '%)'}</title>
            </path>
            {a.pct >= 8 && <text x={a.labelX} y={a.labelY + 3} fontSize="11" fill="#0a1f28" textAnchor="middle" fontFamily={FONT_MONO} fontWeight="700">{a.pct}%</text>}
          </g>
        ))}
      </svg>
      {showLegend !== false && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, minWidth: 140 }}>
          {arcs.map((a) => (
            <div key={a.label} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 36px', gap: 6, alignItems: 'center', fontSize: 11 }}>
              <span style={{ width: 10, height: 10, background: a.color, borderRadius: 999 }} />
              <span style={{ color: t.text }}>{a.label}</span>
              <span style={{ color: t.textMuted, fontFamily: FONT_MONO, textAlign: 'right' }}>{a.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function LineChart({ series, labels, t, height, summary, seriesNames }) {
  const [hoverIdx, setHoverIdx] = useState(null);
  const h = height || 180;
  const w = 600;
  const pad = { top: 16, right: 16, bottom: 24, left: 36 };
  const allVals = series.flatMap((s) => s.data);
  const max = Math.max(...allVals);
  const min = Math.min(...allVals, 0);
  const range = Math.max(max - min, 1);
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const x = (i, len) => pad.left + (i / (len - 1)) * innerW;
  const y = (v) => pad.top + innerH - ((v - min) / range) * innerH;
  const len = series[0] ? series[0].data.length : 0;
  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * w;
    const idx = Math.max(0, Math.min(len - 1, Math.round(((px - pad.left) / innerW) * (len - 1))));
    setHoverIdx(idx);
  };
  const handleLeave = () => setHoverIdx(null);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(min + range * (1 - p)));
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} style={{ overflow: 'visible', display: 'block' }}
        onMouseMove={handleMove} onMouseLeave={handleLeave}>
        {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
          <g key={i}>
            <line x1={pad.left} x2={w - pad.right}
              y1={pad.top + innerH * p} y2={pad.top + innerH * p}
              stroke={t.borderSoft} strokeDasharray="2,4" />
            <text x={pad.left - 8} y={pad.top + innerH * p + 3} textAnchor="end"
              fill={t.textDim} fontSize="9" fontFamily={FONT_MONO}>{yTicks[i].toLocaleString()}</text>
          </g>
        ))}
        {series.map((s, si) => {
          const path = s.data.map((v, i) => (i === 0 ? 'M' : 'L') + x(i, s.data.length) + ',' + y(v)).join(' ');
          const fillPath = path + ' L' + x(s.data.length - 1, s.data.length) + ',' + (h - pad.bottom) + ' L' + pad.left + ',' + (h - pad.bottom) + ' Z';
          return (
            <g key={si}>
              <defs>
                <linearGradient id={'lg' + si} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity="0.25" />
                  <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={fillPath} fill={'url(#lg' + si + ')'} />
              <path d={path} fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {s.data.map((v, i) => (
                <circle key={i} cx={x(i, s.data.length)} cy={y(v)} r={hoverIdx === i ? 4 : 2.5} fill={s.color} stroke={hoverIdx === i ? t.bgCard : 'none'} strokeWidth={hoverIdx === i ? 2 : 0} />
              ))}
            </g>
          );
        })}
        {hoverIdx !== null && (
          <line x1={x(hoverIdx, len)} x2={x(hoverIdx, len)} y1={pad.top} y2={h - pad.bottom} stroke={t.text} strokeOpacity="0.2" strokeDasharray="3,3" />
        )}
        {labels && labels.map((l, i) => (
          <text key={i} x={x(i, labels.length)} y={h - 6} textAnchor="middle"
            fill={t.textMuted} fontSize="10" fontFamily={FONT_MONO}>{l}</text>
        ))}
      </svg>
      {hoverIdx !== null && labels && labels[hoverIdx] && (
        <div style={{
          position: 'absolute',
          left: 'calc(' + ((x(hoverIdx, len) / w) * 100) + '% - 60px)',
          top: 8, pointerEvents: 'none',
          background: t.bgCardElev, border: '1px solid ' + t.border,
          borderRadius: 8, padding: '8px 10px', minWidth: 120,
          boxShadow: '0 6px 20px rgba(0,0,0,0.35)',
        }}>
          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO, marginBottom: 6 }}>{labels[hoverIdx]}</div>
          {series.map((s, si) => (
            <div key={si} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11, color: t.text, gap: 12 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: s.color }} />
                {seriesNames && seriesNames[si] ? seriesNames[si] : 'Series ' + (si + 1)}
              </span>
              <span style={{ fontFamily: FONT_MONO, fontWeight: 600 }}>{s.data[hoverIdx].toLocaleString()}</span>
            </div>
          ))}
        </div>
      )}
      {/* Summary metrics row + legend dots, like the dark-theme reference */}
      {(seriesNames || summary) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 12, paddingTop: 10, borderTop: '1px solid ' + t.borderSoft, fontSize: 11, color: t.textMuted, flexWrap: 'wrap' }}>
          {seriesNames && series.map((s, si) => (
            <span key={si} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 9, height: 9, borderRadius: 999, background: s.color, border: '2px solid ' + t.bgCard, boxShadow: '0 0 0 1px ' + s.color }} />
              {seriesNames[si]}
            </span>
          ))}
          <div style={{ flex: 1 }} />
          {summary && summary.map((m, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <span style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>{m.label}</span>
              <span style={{ fontFamily: FONT_MONO, fontSize: 14, color: t.text, fontWeight: 600 }}>{m.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DonutChart({ slices, total, totalLabel, t, size }) {
  const sz = size || 180;
  const r = sz / 2 - 14;
  const cx = sz / 2;
  const cy = sz / 2;
  const sum = slices.reduce((a, s) => a + s.value, 0);
  let angle = -Math.PI / 2;
  const arcs = slices.map((s) => {
    const a = (s.value / sum) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;
    const a2 = angle + a;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    const large = a > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    angle = a2;
    return { path, color: s.color };
  });
  return (
    <div style={{ position: 'relative', width: sz, height: sz }}>
      <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={t.borderSoft} strokeWidth="14" />
        {arcs.map((a, i) => (
          <path key={i} d={a.path} fill="none" stroke={a.color} strokeWidth="14" strokeLinecap="butt" />
        ))}
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="mu-display" style={{ fontSize: 22, color: t.text }}>{total}</div>
        <div style={{ fontSize: 10, color: t.textMuted, letterSpacing: 1, textTransform: 'uppercase' }}>{totalLabel}</div>
      </div>
    </div>
  );
}

// PieChart — true filled pie (no donut hole) for distribution visuals like Reflective Outcome Mix.
// Reusable per "Use them as reusable components, not as final live numbers" spec note.
function PieChart({ slices, t, size }) {
  const sz = size || 200;
  const r = sz / 2 - 4;
  const cx = sz / 2;
  const cy = sz / 2;
  const sum = slices.reduce((a, s) => a + s.value, 0);
  if (sum === 0) return null;
  let angle = -Math.PI / 2;
  const wedges = slices.map((s) => {
    const a = (s.value / sum) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * r;
    const y1 = cy + Math.sin(angle) * r;
    const a2 = angle + a;
    const x2 = cx + Math.cos(a2) * r;
    const y2 = cy + Math.sin(a2) * r;
    const large = a > Math.PI ? 1 : 0;
    // Single full-circle slice case (all-in-one): draw a circle instead of an arc
    const path = slices.length === 1
      ? `M ${cx - r} ${cy} A ${r} ${r} 0 1 0 ${cx + r} ${cy} A ${r} ${r} 0 1 0 ${cx - r} ${cy} Z`
      : `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2} Z`;
    angle = a2;
    return { path, color: s.color, value: s.value, label: s.label };
  });
  return (
    <svg width={sz} height={sz} viewBox={`0 0 ${sz} ${sz}`}>
      {wedges.map((w, i) => (
        <path key={i} d={w.path} fill={w.color} stroke={t.bgCard} strokeWidth="2">
          <title>{w.label + ': ' + w.value + ' (' + Math.round((w.value / sum) * 100) + '%)'}</title>
        </path>
      ))}
    </svg>
  );
}

// ClusteredBar — n-series clustered bar chart for "supply vs demand"-style comparisons.
// Used by Credit Allocation (allocated/consumed/remaining) and Mentor Supply (active/open/booked).
// Reusable component per spec note "Illustrative chart blocks for Figma — use as reusable components".
function ClusteredBar({ data, series, t, height, yLabel, xLabel }) {
  const h = height || 240;
  const w = 600;
  const pad = { top: 16, right: 16, bottom: 50, left: 44 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const allVals = data.flatMap((d) => series.map((s) => d[s.key] || 0));
  const max = Math.max(...allVals, 1);
  // Round max up to nice number for axis
  const niceMax = Math.ceil(max / 50) * 50;
  const groupW = innerW / data.length;
  const barW = (groupW * 0.7) / series.length;
  const groupGap = groupW * 0.3;
  // Y-axis ticks (5 lines)
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((p) => Math.round(niceMax * p));
  return (
    <div style={{ width: '100%', overflow: 'visible' }}>
      <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid meet">
        {/* Y-axis grid lines + labels */}
        {ticks.map((tv, i) => {
          const yp = pad.top + innerH - (tv / niceMax) * innerH;
          return (
            <g key={i}>
              <line x1={pad.left} y1={yp} x2={pad.left + innerW} y2={yp} stroke={t.borderSoft} strokeWidth="1" strokeDasharray={i === 0 ? '0' : '2,3'} />
              <text x={pad.left - 6} y={yp + 3} fontSize="9" fill={t.textDim} textAnchor="end" fontFamily={FONT_MONO}>{tv}</text>
            </g>
          );
        })}
        {yLabel && <text x={10} y={h / 2} fontSize="10" fill={t.textMuted} textAnchor="middle" transform={`rotate(-90 10 ${h / 2})`}>{yLabel}</text>}
        {xLabel && <text x={w / 2} y={h - 4} fontSize="10" fill={t.textMuted} textAnchor="middle">{xLabel}</text>}
        {/* Clustered bars */}
        {data.map((d, di) => {
          const groupX = pad.left + di * groupW + groupGap / 2;
          return (
            <g key={di}>
              {series.map((s, si) => {
                const v = d[s.key] || 0;
                const bh = (v / niceMax) * innerH;
                const bx = groupX + si * barW;
                const by = pad.top + innerH - bh;
                return (
                  <g key={si}>
                    <rect x={bx} y={by} width={barW - 2} height={bh} fill={s.color} rx={2}>
                      <title>{d.label + ' · ' + s.label + ': ' + v}</title>
                    </rect>
                    {bh > 18 && (
                      <text x={bx + (barW - 2) / 2} y={by - 3} fontSize="8" fill={t.textMuted} textAnchor="middle" fontFamily={FONT_MONO}>{v}</text>
                    )}
                  </g>
                );
              })}
              {/* X-axis label — rotated if tight */}
              <text
                x={groupX + (groupW - groupGap) / 2}
                y={pad.top + innerH + 14}
                fontSize="9.5"
                fill={t.textMuted}
                textAnchor={data.length > 5 ? 'end' : 'middle'}
                transform={data.length > 5 ? `rotate(-22 ${groupX + (groupW - groupGap) / 2} ${pad.top + innerH + 14})` : undefined}
              >{d.label.length > 18 ? d.label.slice(0, 16) + '…' : d.label}</text>
            </g>
          );
        })}
      </svg>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 4, fontSize: 10, color: t.textMuted, flexWrap: 'wrap' }}>
        {series.map((s) => (
          <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <span style={{ width: 10, height: 10, background: s.color, borderRadius: 2 }} /> {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

function Waterfall({ steps, t, height }) {
  const h = height || 200;
  const w = 600;
  const pad = { top: 16, right: 16, bottom: 28, left: 50 };
  // Compute running totals
  let running = 0;
  const computed = steps.map((s, i) => {
    const start = s.kind === 'total' ? 0 : running;
    const end = s.kind === 'total' ? s.value : running + s.value;
    if (s.kind !== 'total') running = end;
    else running = s.value;
    return { ...s, start, end };
  });
  const allVals = computed.flatMap((c) => [c.start, c.end]).concat([0]);
  const maxV = Math.max(...allVals);
  const minV = Math.min(...allVals, 0);
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const barW = (innerW / computed.length) * 0.6;
  const gap = (innerW / computed.length) * 0.4;
  const yScale = (v) => pad.top + innerH * (1 - (v - minV) / Math.max(maxV - minV, 1));
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h}>
      {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
        <line key={i} x1={pad.left} x2={w - pad.right}
          y1={pad.top + innerH * p} y2={pad.top + innerH * p}
          stroke={t.borderSoft} strokeDasharray="2,4" />
      ))}
      {computed.map((c, i) => {
        const x = pad.left + i * (barW + gap) + gap / 2;
        const y1 = yScale(Math.max(c.start, c.end));
        const y2 = yScale(Math.min(c.start, c.end));
        const barH = Math.max(2, y2 - y1);
        const color = c.kind === 'total' ? t.blue : c.value >= 0 ? t.green : t.red;
        return (
          <g key={i}>
            <rect x={x} y={y1} width={barW} height={barH} fill={color} opacity="0.85" rx="3" />
            {i < computed.length - 1 && (
              <line x1={x + barW} x2={x + barW + gap} y1={yScale(c.end)} y2={yScale(c.end)} stroke={t.textDim} strokeDasharray="2,3" />
            )}
            <text x={x + barW / 2} y={y1 - 6} textAnchor="middle" fontSize="10" fill={t.text} fontFamily={FONT_MONO}>
              {c.value >= 0 && c.kind !== 'total' ? '+' : ''}{c.value.toLocaleString()}
            </text>
            <text x={x + barW / 2} y={h - 8} textAnchor="middle" fontSize="10" fill={t.textMuted}>{c.label}</text>
          </g>
        );
      })}
    </svg>
  );
}

function StackedBar({ rows, t, height }) {
  // rows: [{ label, segments: [{ value, color, key }] }]
  const h = height || 220;
  const max = Math.max(...rows.map((r) => r.segments.reduce((s, x) => s + x.value, 0)));
  const rowH = 28;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {rows.map((r) => {
        const total = r.segments.reduce((s, x) => s + x.value, 0);
        return (
          <div key={r.label}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: t.textMuted }}>{r.label}</span>
              <span style={{ fontSize: 11, color: t.text, fontFamily: FONT_MONO }}>{total}</span>
            </div>
            <div style={{ display: 'flex', height: 14, background: t.bgInput, borderRadius: 4, overflow: 'hidden' }}>
              {r.segments.map((s, i) => (
                <div key={i} title={s.key + ': ' + s.value} style={{ width: (s.value / Math.max(max, 1)) * 100 + '%', background: s.color, transition: 'width 250ms ease' }} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Timeline({ events, t }) {
  return (
    <div style={{ position: 'relative', paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ position: 'absolute', left: 5, top: 4, bottom: 4, width: 2, background: t.borderSoft, borderRadius: 2 }} />
      {events.map((e, i) => (
        <div key={i} style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: -16, top: 4, width: 10, height: 10, borderRadius: 999, background: e.color || t.accent, border: '2px solid ' + t.bgCard }} />
          <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>{e.date}</div>
          <div style={{ fontSize: 13, color: t.text, fontWeight: 500, marginTop: 2 }}>{e.title}</div>
          {e.detail && <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{e.detail}</div>}
        </div>
      ))}
    </div>
  );
}

function Heatmap({ rows, cols, data, t, colorScale }) {
  const cellW = 32;
  const cellH = 24;
  const max = Math.max(...data.flat());
  const scale = colorScale || ((v) => {
    const p = v / Math.max(max, 1);
    if (p < 0.15) return t.borderSoft;
    if (p < 0.35) return t.blueSoft;
    if (p < 0.6) return t.blue;
    if (p < 0.8) return t.orange;
    return t.red;
  });
  return (
    <div style={{ overflowX: 'auto' }} className="mu-scroll">
      <table style={{ borderCollapse: 'separate', borderSpacing: 3 }}>
        <thead>
          <tr>
            <th></th>
            {cols.map((c, i) => (
              <th key={i} style={{ fontSize: 10, color: t.textMuted, fontWeight: 500, padding: '4px 0', minWidth: cellW }}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              <td style={{ fontSize: 11, color: t.textMuted, paddingRight: 8, textAlign: 'right' }}>{r}</td>
              {data[ri].map((v, ci) => (
                <td key={ci} style={{
                  width: cellW, height: cellH, background: scale(v),
                  borderRadius: 4, textAlign: 'center', verticalAlign: 'middle',
                  color: t.text, fontSize: 10, fontFamily: FONT_MONO,
                  border: '1px solid ' + t.borderSoft,
                }}>{v > 0 ? v : ''}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function KPICard({ kpi, t, big }) {
  const toneMap = {
    good: { fg: t.green, icon: TrendingUp },
    bad: { fg: t.red, icon: TrendingDown },
    warn: { fg: t.yellow, icon: AlertTriangle },
    neutral: { fg: t.textMuted, icon: Activity },
  };
  const tn = toneMap[kpi.tone] || toneMap.neutral;
  const Icon = tn.icon;
  return (
    <div style={{
      background: t.bgCard, border: '1px solid ' + t.border,
      borderRadius: 14, padding: big ? 18 : 14,
      display: 'flex', flexDirection: 'column', gap: 6,
      minHeight: big ? 110 : 88,
    }}>
      <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.6 }}>{kpi.label}</div>
      <div className="mu-display" style={{ fontSize: big ? 32 : 24, color: t.text, lineHeight: 1.1 }}>{kpi.value}</div>
      {kpi.delta && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: tn.fg }}>
          <Icon size={12} />
          <span style={{ fontFamily: FONT_MONO }}>{kpi.delta}</span>
          <span style={{ color: t.textDim }}>vs last 7d</span>
        </div>
      )}
    </div>
  );
}

function Avatar({ name, size, t }) {
  const initials = name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  const colors = [t.blue, t.purple, t.green, t.orange, t.accent, t.yellow];
  const c = colors[name.charCodeAt(0) % colors.length];
  const s = size || 28;
  return (
    <div style={{
      width: s, height: s, borderRadius: 999, background: c + '22', color: c,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: s * 0.36, fontWeight: 600, flexShrink: 0,
    }}>{initials}</div>
  );
}

function MIScore({ score, t }) {
  const color = score >= 85 ? t.green : score >= 70 ? t.yellow : t.red;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: 'conic-gradient(' + color + ' ' + (score * 3.6) + 'deg, ' + t.borderSoft + ' 0deg)',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', inset: 4, background: t.bgCard, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, fontWeight: 700, color: t.text, fontFamily: FONT_MONO,
        }}>{score}</div>
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, onClick, t, label, primary, soft, danger, sz, suffixArrow }) {
  // Pill button per brand spec — fully rounded, filled or outlined,
  // optional right-arrow suffix on labelled CTAs.
  const size = sz || 36;
  const isIconOnly = !label;
  // Tone resolution
  let bg = 'transparent', fg = t.textMuted, br = '1px solid ' + t.border, weight = 600;
  if (primary) { bg = t.accent; fg = '#0a1f28'; br = '1px solid ' + t.accent; weight = 700; }
  else if (soft) { bg = t.bgCard; fg = t.text; br = '1px solid ' + t.border; weight = 600; }
  else if (danger) { bg = 'transparent'; fg = t.red; br = '1px solid ' + t.red + '88'; weight = 600; }
  // Show the right-arrow ONLY on primary CTAs (or when explicitly opted-in).
  // Utility/secondary buttons like Filters, Export, Cancel, Edit don't get the arrow —
  // they're immediate actions, not navigation.
  const showArrow = !isIconOnly && (suffixArrow === true || (primary && suffixArrow !== false));
  return (
    <button onClick={onClick} title={label} style={{
      height: size,
      width: isIconOnly ? size : 'auto',
      padding: isIconOnly ? 0 : '0 16px',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      background: bg, color: fg, border: br,
      borderRadius: 999, cursor: 'pointer',
      fontFamily: FONT_BODY, fontSize: size <= 28 ? 11 : 13, fontWeight: weight,
      whiteSpace: 'nowrap', lineHeight: 1, transition: 'all 120ms ease',
    }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}>
      {Icon && <Icon size={size <= 28 ? 12 : 14} />}
      {label}
      {showArrow && <ArrowRight size={size <= 28 ? 11 : 13} style={{ marginLeft: 2 }} />}
    </button>
  );
}

// TogglePill — 2-state (or N-state) segmented pill control.
// Active value renders white-on-bg-pill, inactive renders muted text on transparent.
// Use for Cards/Table view toggles, List/Grid, Day/Week, etc.
function TogglePill({ t, options, value, onChange, sz }) {
  const size = sz || 28;
  return (
    <div style={{
      display: 'inline-flex', padding: 3,
      background: t.bgCard, border: '1px solid ' + t.border,
      borderRadius: 999, gap: 0,
    }}>
      {options.map((opt) => {
        const v = typeof opt === 'string' ? opt : opt.v;
        const l = typeof opt === 'string' ? opt : opt.l;
        const isActive = value === v;
        return (
          <button key={v} onClick={() => onChange(v)} style={{
            height: size - 6, padding: '0 14px',
            background: isActive ? t.text : 'transparent',
            color: isActive ? t.bgCard : t.textMuted,
            border: 'none', borderRadius: 999,
            fontFamily: FONT_BODY, fontSize: 11, fontWeight: 700,
            cursor: 'pointer', transition: 'all 120ms ease',
            display: 'inline-flex', alignItems: 'center', gap: 4,
          }}>{l}</button>
        );
      })}
    </div>
  );
}

/* ============================================================================
   TABLE SYSTEM — list/grid, sort, filters, save search, bulk actions, drill
   ============================================================================ */

function FilterPanel({ open, onClose, t, filters, values, onChange, onApply, onReset }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: 380, zIndex: 60,
      background: t.bgPanel, borderLeft: '1px solid ' + t.border,
      display: 'flex', flexDirection: 'column',
      animation: 'mu-fade-in 200ms ease',
      boxShadow: '-12px 0 36px rgba(0,0,0,0.32)',
    }}>
      <div style={{ padding: '18px 20px', borderBottom: '1px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="mu-display" style={{ fontSize: 22, color: t.text }}>Filters</div>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={18} /></button>
      </div>
      <div className="mu-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {filters.map((f) => (
          <div key={f}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>{f}</div>
            <select
              value={values[f] || ''}
              onChange={(e) => onChange(f, e.target.value)}
              style={{
                width: '100%', padding: '10px 12px', background: t.bgInput,
                color: t.text, border: '1px solid ' + t.border, borderRadius: 8,
                fontFamily: FONT_BODY, fontSize: 13,
              }}>
              <option value="">All</option>
              <option value="opt1">Option 1</option>
              <option value="opt2">Option 2</option>
              <option value="opt3">Option 3</option>
            </select>
          </div>
        ))}
      </div>
      <div style={{ padding: 16, borderTop: '1px solid ' + t.border, display: 'flex', gap: 8 }}>
        <IconButton onClick={onReset} t={t} label="Reset" />
        <div style={{ flex: 1 }} />
        <IconButton onClick={onApply} t={t} primary label="Apply Filters" />
      </div>
    </div>
  );
}

function SavedSearchesPicker({ t, scope, onApply }) {
  const ctx = React.useContext(ActionContext);
  const [open, setOpen] = useState(false);
  const ref = React.useRef(null);
  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  if (!ctx) return null;
  const allSaved = ctx.stores.savedSearches || [];
  const scopedSaved = scope ? allSaved.filter((s) => s.scope === scope || s.scope === 'current') : allSaved;
  if (scopedSaved.length === 0) return null;
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} title="Apply saved search" style={{
        padding: '6px 10px', background: open ? t.accent + '22' : 'transparent',
        color: open ? t.accent : t.text, border: '1px solid ' + (open ? t.accent : t.border),
        borderRadius: 8, fontSize: 11, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 500,
      }}>
        <Bookmark size={11} /> Saved <span style={{ padding: '1px 5px', background: t.borderSoft, color: t.textDim, borderRadius: 999, fontSize: 9, fontFamily: FONT_MONO }}>{scopedSaved.length}</span>
        <ChevronDown size={10} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 60, width: 280, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 10, padding: 8, boxShadow: '0 8px 24px rgba(0,0,0,0.4)', animation: 'mu-fade-in 150ms ease' }}>
          <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, padding: '4px 8px 6px' }}>Saved searches</div>
          <div style={{ maxHeight: 280, overflowY: 'auto' }} className="mu-scroll">
            {scopedSaved.map((s) => {
              const ageDays = Math.floor((Date.now() - s.ts) / 86400000);
              return (
                <button key={s.id} onClick={() => { onApply(s); setOpen(false); }} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '8px 8px', background: 'transparent', border: 'none', borderRadius: 6,
                  cursor: 'pointer', textAlign: 'left', color: t.text,
                }} onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  <Bookmark size={11} color={t.accent} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, marginTop: 1 }}>{s.visibility === 'private' ? '🔒 Private' : '👥 Team'} · {ageDays === 0 ? 'today' : ageDays + 'd ago'}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}


function SaveSearchModal({ open, onClose, t, scope, currentFilters }) {
  const ctx = React.useContext(ActionContext);
  const [tab, setTab] = useState('new'); // 'new' | 'existing'
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [selectedExistingId, setSelectedExistingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  // Reset when opened
  useEffect(() => {
    if (open) {
      setTab('new');
      setName('');
      setIsPrivate(true);
      setSelectedExistingId(null);
      setConfirmDelete(null);
    }
  }, [open]);
  if (!open || !ctx) return null;
  const allSaved = ctx.stores.savedSearches || [];
  // Filter to current scope if scope provided, else show all
  const scopedSaved = scope ? allSaved.filter((s) => s.scope === scope || s.scope === 'current') : allSaved;
  const existingNames = new Set(scopedSaved.map((s) => s.name.toLowerCase()));
  const nameClash = tab === 'new' && name.trim() && existingNames.has(name.trim().toLowerCase());
  const selectedExisting = scopedSaved.find((s) => s.id === selectedExistingId);

  const handleSaveNew = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      ctx.showToast('Name is required', 'bad');
      return;
    }
    if (nameClash) {
      ctx.showToast('A saved search with that name already exists. Switch to "Update Existing Search" tab.', 'warn');
      return;
    }
    ctx.saveSearch(trimmed, isPrivate ? 'private' : 'team', scope || 'current', currentFilters || {});
    ctx.appendLog({ actionId: 'search.save_new', label: 'Save search', target: trimmed, payload: { visibility: isPrivate ? 'private' : 'team', scope: scope || 'current' }, result: 'Completed', destructive: false });
    ctx.showToast('Saved search · ' + trimmed);
    onClose();
  };
  const handleUpdateExisting = () => {
    if (!selectedExisting) {
      ctx.showToast('Pick a saved search to update', 'bad');
      return;
    }
    ctx.updateSearch(selectedExisting.id, selectedExisting.name, isPrivate ? 'private' : 'team', currentFilters || selectedExisting.filters);
    ctx.appendLog({ actionId: 'search.update_existing', label: 'Update saved search', target: selectedExisting.name, payload: { visibility: isPrivate ? 'private' : 'team' }, result: 'Completed', destructive: false });
    ctx.showToast('Updated · ' + selectedExisting.name);
    onClose();
  };
  const handleDelete = (s) => {
    ctx.deleteSearch(s.id);
    ctx.appendLog({ actionId: 'search.delete', label: 'Delete saved search', target: s.name, payload: null, result: 'Completed', destructive: true });
    ctx.showToast('Deleted · ' + s.name, 'warn');
    setConfirmDelete(null);
    if (selectedExistingId === s.id) setSelectedExistingId(null);
  };

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 70,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 480, background: t.bgPanel, border: '1px solid ' + t.border,
        borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease',
        position: 'relative',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div className="mu-display" style={{ fontSize: 22, color: t.text }}>{tab === 'new' ? 'Save a new search' : 'Update saved search'}</div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={18} /></button>
        </div>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 20, borderBottom: '1px solid ' + t.border, marginBottom: 18 }}>
          <button onClick={() => setTab('new')} style={{
            paddingBottom: 8, color: tab === 'new' ? t.accent : t.textMuted,
            borderBottom: tab === 'new' ? '2px solid ' + t.accent : '2px solid transparent',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: tab === 'new' ? 600 : 500, marginBottom: -1,
          }}>Save as New Search</button>
          <button onClick={() => setTab('existing')} style={{
            paddingBottom: 8, color: tab === 'existing' ? t.accent : t.textMuted,
            borderBottom: tab === 'existing' ? '2px solid ' + t.accent : '2px solid transparent',
            background: 'transparent', border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: tab === 'existing' ? 600 : 500, marginBottom: -1,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            Update Existing Search
            {scopedSaved.length > 0 && (
              <span style={{ padding: '1px 6px', background: tab === 'existing' ? t.accent + '22' : t.borderSoft, color: tab === 'existing' ? t.accent : t.textDim, borderRadius: 999, fontSize: 10, fontFamily: FONT_MONO }}>{scopedSaved.length}</span>
            )}
          </button>
        </div>

        {tab === 'new' ? (
          <>
            {/* Name input */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.5 }}>Name</div>
              <input value={name} onChange={(e) => setName(e.target.value)} autoFocus placeholder="e.g. High-MIS mentors in Bangalore" style={{
                width: '100%', padding: '10px 12px', background: t.bgInput, color: t.text,
                border: '1px solid ' + (nameClash ? t.red : t.border), borderRadius: 8, fontFamily: FONT_BODY, fontSize: 13,
              }} />
              {nameClash && (
                <div style={{ fontSize: 11, color: t.red, marginTop: 6, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <AlertCircle size={11} /> A saved search named "{name.trim()}" already exists. Use the Update tab to overwrite.
                </div>
              )}
            </div>
            {/* Filter summary so user knows what gets saved */}
            {currentFilters && Object.keys(currentFilters).length > 0 && (
              <div style={{ marginBottom: 14, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Filters being saved</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {Object.keys(currentFilters).map((k) => (
                    <span key={k} style={{ padding: '3px 8px', background: t.accent + '22', color: t.accent, fontSize: 10, borderRadius: 4, fontFamily: FONT_MONO }}>{k}: {String(currentFilters[k]).slice(0, 24)}</span>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Existing search picker */}
            {scopedSaved.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 10, color: t.textDim, marginBottom: 14 }}>
                <Bookmark size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
                <div style={{ fontSize: 12 }}>No saved searches yet for this view.</div>
                <button onClick={() => setTab('new')} style={{ marginTop: 10, padding: '6px 12px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Create your first one</button>
              </div>
            ) : (
              <div style={{ marginBottom: 14, maxHeight: 220, overflowY: 'auto' }} className="mu-scroll">
                {scopedSaved.map((s) => {
                  const isSelected = selectedExistingId === s.id;
                  const ageDays = Math.floor((Date.now() - s.ts) / 86400000);
                  return (
                    <div key={s.id} onClick={() => { setSelectedExistingId(s.id); setIsPrivate(s.visibility === 'private'); }} style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: 10, marginBottom: 6,
                      background: isSelected ? t.accent + '22' : t.bgCardElev,
                      border: '1px solid ' + (isSelected ? t.accent : t.borderSoft),
                      borderRadius: 8, cursor: 'pointer',
                    }}>
                      <Bookmark size={14} color={isSelected ? t.accent : t.textMuted} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 2 }}>
                          <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{s.visibility === 'private' ? '🔒 Private' : '👥 Team'} · {ageDays === 0 ? 'today' : ageDays + 'd ago'}</span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setConfirmDelete(s); }} title="Delete" style={{ background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', padding: 4, borderRadius: 4 }} onMouseEnter={(e) => { e.currentTarget.style.color = t.red; }} onMouseLeave={(e) => { e.currentTarget.style.color = t.textDim; }}>
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {selectedExisting && currentFilters && Object.keys(currentFilters).length > 0 && (
              <div style={{ marginBottom: 14, padding: 10, background: t.yellow + '11', border: '1px dashed ' + t.yellow + '88', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.5 }}>
                <strong style={{ color: t.yellow }}>Heads up:</strong> the filters currently set in this view will replace what "{selectedExisting.name}" had saved before.
              </div>
            )}
          </>
        )}

        {/* Visibility toggle — applies to both tabs */}
        {((tab === 'new') || (tab === 'existing' && selectedExisting)) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, marginBottom: 18 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                {isPrivate ? '🔒 Visibility · Private' : '👥 Visibility · Team'}
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{isPrivate ? 'Only you can see this saved search.' : 'Everyone in your team can use this saved search.'}</div>
            </div>
            <button onClick={() => setIsPrivate(!isPrivate)} style={{
              width: 38, height: 22, borderRadius: 999,
              background: isPrivate ? t.accent : t.borderSoft, border: 'none',
              position: 'relative', cursor: 'pointer', transition: 'background 150ms',
            }}>
              <div style={{
                position: 'absolute', top: 2, left: isPrivate ? 18 : 2, width: 18, height: 18,
                background: '#fff', borderRadius: '50%', transition: 'left 150ms ease',
              }} />
            </button>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={onClose} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid ' + t.border, color: t.textMuted, borderRadius: 8, cursor: 'pointer', fontSize: 12 }}>Cancel</button>
          {tab === 'new' ? (
            <button onClick={handleSaveNew} disabled={!name.trim() || nameClash} style={{
              padding: '8px 18px', background: (!name.trim() || nameClash) ? t.borderSoft : t.accent,
              color: (!name.trim() || nameClash) ? t.textDim : '#0a1f28',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: (!name.trim() || nameClash) ? 'not-allowed' : 'pointer',
            }}>Save Search</button>
          ) : (
            <button onClick={handleUpdateExisting} disabled={!selectedExisting} style={{
              padding: '8px 18px', background: !selectedExisting ? t.borderSoft : t.accent,
              color: !selectedExisting ? t.textDim : '#0a1f28',
              border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700,
              cursor: !selectedExisting ? 'not-allowed' : 'pointer',
            }}>Update Search</button>
          )}
        </div>

        {/* Inline delete-confirm prompt */}
        {confirmDelete && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <div style={{ background: t.bgPanel, border: '1px solid ' + t.red + '88', borderRadius: 12, padding: 18, maxWidth: 360 }}>
              <div style={{ fontSize: 14, color: t.text, fontWeight: 600, marginBottom: 8 }}>Delete "{confirmDelete.name}"?</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 14, lineHeight: 1.5 }}>This removes the saved search for {confirmDelete.visibility === 'team' ? 'everyone in your team' : 'you'}. Cannot be undone.</div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 6 }}>
                <button onClick={() => setConfirmDelete(null)} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid ' + t.border, color: t.textMuted, borderRadius: 6, cursor: 'pointer', fontSize: 11 }}>Keep it</button>
                <button onClick={() => handleDelete(confirmDelete)} style={{ padding: '6px 12px', background: t.red, color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CellRender({ col, row, t }) {
  const v = row[col.key];
  if (col.kind === 'avatar') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Avatar name={v} t={t} />
        <div>
          <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{v}</div>
          {row.email && <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>{row.email}</div>}
        </div>
      </div>
    );
  }
  if (col.kind === 'pill') {
    const toneMap = { Active: 'good', Paused: 'warn', Suspended: 'bad', 'At Risk': 'bad', Invited: 'info', Excellent: 'purple', Good: 'good', Basic: 'neutral', Enterprise: 'purple', Growth: 'info', Starter: 'neutral', Public: 'good', 'Org-only': 'info', Hidden: 'neutral', Verified: 'good', Pending: 'warn', Rejected: 'bad', 'Super Admin': 'purple', 'Platform Admin': 'info', 'Org Admin': 'good', 'Sub-admin': 'neutral', Mentor: 'accent', Mentee: 'info', Support: 'neutral' };
    return <StatusPill t={t} tone={toneMap[v] || 'neutral'}>{v}</StatusPill>;
  }
  if (col.kind === 'status') {
    const toneMap = { Active: 'good', 'At Risk': 'bad', Paused: 'warn', Suspended: 'bad', Live: 'good', Onboarding: 'info', Setup: 'warn', Healthy: 'good', Degraded: 'warn', Down: 'bad', Enabled: 'good', Disabled: 'neutral', 'On Track': 'good', Breached: 'bad', Open: 'warn', 'In Progress': 'info', Resolved: 'good', Waiting: 'neutral', Investigating: 'warn', New: 'info', Frozen: 'bad', Acknowledged: 'good', Closed: 'neutral', 'In Queue': 'warn', Handled: 'good', Escalated: 'bad', Sold: 'good', Verified: 'good', Pending: 'warn', Rejected: 'bad', Draft: 'neutral', Approved: 'good', Denied: 'bad', 'Pending Approval': 'warn', Sent: 'good', Failed: 'bad', Scheduled: 'info', Ready: 'good', Processing: 'info', Running: 'good' };
    return <StatusPill t={t} tone={toneMap[v] || 'neutral'}>{v}</StatusPill>;
  }
  if (col.kind === 'risk') {
    const toneMap = { High: 'bad', Medium: 'warn', Low: 'good' };
    return <StatusPill t={t} tone={toneMap[v] || 'neutral'}>{v}</StatusPill>;
  }
  if (col.kind === 'progress') {
    const color = v > 80 ? t.red : v > 60 ? t.yellow : v > 30 ? t.accent : t.green;
    return <div style={{ minWidth: 120 }}><ProgressBar value={v} color={color} t={t} /></div>;
  }
  if (col.kind === 'mis') {
    return <MIScore score={v} t={t} />;
  }
  if (col.kind === 'rating') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <span style={{ color: t.yellow }}>★</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{v}</span>
      </div>
    );
  }
  if (col.kind === 'response') {
    const tone = v === 'Fast' ? 'good' : v === 'Steady' ? 'info' : v === 'Within 1d' ? 'warn' : 'bad';
    const hrs = row.responseHrs;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <StatusPill t={t} tone={tone}>{v}</StatusPill>
        {hrs !== undefined && <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>~{hrs}h</span>}
      </div>
    );
  }
  if (col.kind === 'currency') {
    return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>₹{Number(v).toLocaleString()}</span>;
  }
  if (col.kind === 'num') {
    return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{Number(v).toLocaleString()}</span>;
  }
  if (col.kind === 'days') {
    const tone = v < 14 ? 'bad' : v < 30 ? 'warn' : 'good';
    return <StatusPill t={t} tone={tone}>{v}d</StatusPill>;
  }
  if (col.kind === 'date') {
    return <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{v}</span>;
  }
  if (col.kind === 'mono') {
    return <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{v}</span>;
  }
  return <span style={{ fontSize: 13, color: t.text }}>{v}</span>;
}

function DataTable({ rows, cols, t, onRowClick, dataKey }) {
  const [view, setView] = useState('list');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('Default');
  const [sortOpen, setSortOpen] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    if (!search) return rows;
    const s = search.toLowerCase();
    return rows.filter((r) => Object.values(r).some((v) => String(v).toLowerCase().includes(s)));
  }, [rows, search]);

  const sorted = useMemo(() => {
    const arr = filtered.slice();
    if (sortBy === 'Last Added') arr.reverse();
    if (sortBy === 'Oldest to Newest') return arr;
    return arr;
  }, [filtered, sortBy]);

  const paged = sorted.slice((page - 1) * pageSize, page * pageSize);
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map((r) => r.id)));
  };
  const toggleOne = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const allSelected = paged.length > 0 && selected.size === paged.length;

  return (
    <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 14, borderBottom: '1px solid ' + t.borderSoft }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search"
            style={{ width: '100%', padding: '10px 12px 10px 36px', background: t.bgInput, color: t.text, border: '1px solid ' + t.border, borderRadius: 8, fontSize: 13, fontFamily: FONT_BODY }} />
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 3, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8 }}>
          <button onClick={() => setView('list')} style={{ padding: '6px 10px', background: view === 'list' ? t.bgCardElev : 'transparent', color: view === 'list' ? t.text : t.textMuted, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <List size={14} /> List
          </button>
          <button onClick={() => setView('grid')} style={{ padding: '6px 10px', background: view === 'grid' ? t.bgCardElev : 'transparent', color: view === 'grid' ? t.text : t.textMuted, border: 'none', borderRadius: 6, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
            <Grid3x3 size={14} /> Grid
          </button>
        </div>
        <div style={{ position: 'relative' }}>
          <button onClick={() => setSortOpen(!sortOpen)} style={{ padding: '8px 12px', background: t.bgInput, color: t.text, border: '1px solid ' + t.border, borderRadius: 8, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
            Sort: {sortBy} <ChevronsUpDown size={12} />
          </button>
          {sortOpen && (
            <div style={{ position: 'absolute', top: '100%', left: 0, marginTop: 4, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 8, minWidth: 180, zIndex: 30, padding: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}>
              {['Default','Last Added','Recent Added','Last Action','Oldest to Newest'].map((s) => (
                <div key={s} onClick={() => { setSortBy(s); setSortOpen(false); }} style={{ padding: '8px 12px', fontSize: 13, color: t.text, cursor: 'pointer', borderRadius: 6 }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                  {s}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ flex: 1 }} />
        {selected.size > 0 ? (
          <>
            <span style={{ fontSize: 12, color: t.textMuted }}>{selected.size} selected</span>
            <SmartButton label="Delete" t={t} danger icon={Trash2} />
            <SmartButton label="Bulk Actions" t={t} soft icon={Zap} />
          </>
        ) : (
          <>
            <span style={{ fontSize: 12, color: t.textMuted }}>Showing <span style={{ fontFamily: FONT_MONO, color: t.text }}>{paged.length}</span> of {sorted.length} results</span>
          </>
        )}
        <button style={{ padding: 8, background: 'transparent', border: '1px solid ' + t.border, borderRadius: 8, cursor: 'pointer', color: t.textMuted }}><RefreshCw size={14} /></button>
      </div>

      {/* List view */}
      {view === 'list' && (
        <div style={{ overflowX: 'auto' }} className="mu-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: t.bgCardElev }}>
                <th style={{ padding: '10px 14px', textAlign: 'left', width: 36 }}>
                  <input type="checkbox" checked={allSelected} onChange={toggleAll} style={{ accentColor: t.accent }} />
                </th>
                {cols.map((c) => (
                  <th key={c.key} style={{ padding: '10px 14px', textAlign: 'left', fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      {c.label} <ChevronsUpDown size={11} />
                    </div>
                  </th>
                ))}
                <th style={{ padding: '10px 14px', textAlign: 'right', fontSize: 11, color: t.textMuted, fontWeight: 600, textTransform: 'uppercase' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={row.id || i} className="mu-row" style={{ borderTop: '1px solid ' + t.borderSoft, cursor: 'pointer' }} onClick={() => onRowClick && onRowClick(row)}>
                  <td style={{ padding: '12px 14px' }} onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" checked={selected.has(row.id)} onChange={() => toggleOne(row.id)} style={{ accentColor: t.accent }} />
                  </td>
                  {cols.map((c) => (
                    <td key={c.key} style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                      <CellRender col={c} row={row} t={t} />
                    </td>
                  ))}
                  <td style={{ padding: '12px 14px', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <button style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 6 }}><MoreHorizontal size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Grid view */}
      {view === 'grid' && (
        <div style={{ padding: 14, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
          {paged.map((row, i) => (
            <div key={row.id || i} onClick={() => onRowClick && onRowClick(row)} style={{
              background: t.bgCardElev, border: '1px solid ' + t.border, borderRadius: 12, padding: 14, cursor: 'pointer',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                {row.name && <Avatar name={row.name} t={t} size={36} />}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.name || row.id}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{row.org || row.role || row.tier || ''}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {cols.slice(1, 5).map((c) => (
                  <div key={c.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 12 }}>
                    <span style={{ color: t.textMuted }}>{c.label}</span>
                    <CellRender col={c} row={row} t={t} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 14, borderTop: '1px solid ' + t.borderSoft }}>
        <div style={{ fontSize: 11, color: t.textMuted }}>Page {page} of {totalPages}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} style={{ padding: '6px 10px', background: t.bgInput, color: t.text, border: '1px solid ' + t.border, borderRadius: 6, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1 }}><ChevronLeft size={14} /></button>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} style={{ padding: '6px 10px', background: t.bgInput, color: t.text, border: '1px solid ' + t.border, borderRadius: 6, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1 }}><ChevronRight size={14} /></button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   DRILL-DOWN DRAWER + MODAL + ACTION RAIL + ACTION CENTER
   ============================================================================ */

function DrillDrawer({ row, onClose, t, kind, drawerHint }) {
  if (!row) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.5)' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        position: 'absolute', top: 0, right: 0, bottom: 0, width: 560,
        background: t.bgPanel, borderLeft: '1px solid ' + t.border,
        display: 'flex', flexDirection: 'column',
        animation: 'mu-fade-in 220ms ease',
        boxShadow: '-12px 0 36px rgba(0,0,0,0.4)',
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid ' + t.border, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
            <Avatar name={row.name || row.id} t={t} size={48} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mu-display" style={{ fontSize: 24, color: t.text, lineHeight: 1.1 }}>{row.name || row.id}</div>
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>{row.email || row.org || row.role || row.tier || kind}</div>
              {drawerHint && (
                <div style={{ marginTop: 6, fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, padding: '3px 8px', background: t.bgInput, border: '1px solid ' + t.borderSoft, borderRadius: 4, display: 'inline-block' }}>
                  {drawerHint}
                </div>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={18} /></button>
        </div>
        <div style={{ display: 'flex', gap: 16, padding: '12px 20px', borderBottom: '1px solid ' + t.borderSoft }}>
          {['Overview','Activity','Audit','Linked'].map((tab, i) => (
            <div key={tab} style={{ paddingBottom: 6, fontSize: 12, fontWeight: 600,
              color: i === 0 ? t.accent : t.textMuted,
              borderBottom: i === 0 ? '2px solid ' + t.accent : '2px solid transparent',
              cursor: 'pointer',
            }}>{tab}</div>
          ))}
        </div>
        <div className="mu-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Quick facts</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {Object.entries(row).slice(0, 8).map(([k, v]) => (
                <div key={k} style={{ background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>{k}</div>
                  <div style={{ fontSize: 13, color: t.text, marginTop: 2, fontFamily: typeof v === 'number' ? FONT_MONO : FONT_BODY, wordBreak: 'break-all' }}>{String(v)}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Recent activity</div>
            <div style={{ background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              {[
                { time: '12m ago', msg: 'Status updated to Active' },
                { time: '2h ago', msg: 'Plan changed to Enterprise' },
                { time: '1d ago', msg: 'Admin added: ' + (row.admin || 'Rakesh K') },
                { time: '4d ago', msg: 'Credits topped up: 5,000' },
              ].map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '6px 0', borderBottom: i < 3 ? '1px solid ' + t.borderSoft : 'none' }}>
                  <div style={{ width: 7, height: 7, borderRadius: 999, background: t.accent, marginTop: 6 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: t.text }}>{a.msg}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>{a.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 0.5 }}>Linked records</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <StatusPill t={t} tone="info" soft>3 invoices</StatusPill>
              <StatusPill t={t} tone="warn" soft>2 tickets open</StatusPill>
              <StatusPill t={t} tone="purple" soft>4 programmes</StatusPill>
              <StatusPill t={t} tone="good" soft>14 mentors</StatusPill>
              <StatusPill t={t} tone="accent" soft>1 active renewal</StatusPill>
            </div>
          </div>
        </div>
        <div style={{ padding: 14, borderTop: '1px solid ' + t.border, display: 'flex', gap: 8 }}>
          <SmartButton label="Edit" t={t} soft icon={Edit3} />
          <SmartButton label="Open full" t={t} soft icon={ExternalLink} />
          <div style={{ flex: 1 }} />
          <SmartButton label="Suspend" t={t} danger icon={Power} />
          <SmartButton label="Approve" t={t} primary icon={Check} />
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ open, title, body, onClose, onConfirm, t, danger }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 70, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{ width: 420, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease' }}>
        <div className="mu-display" style={{ fontSize: 22, color: t.text, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: t.textMuted, marginBottom: 20, lineHeight: 1.5 }}>{body}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <IconButton onClick={onClose} t={t} soft label="Cancel" />
          <IconButton onClick={onConfirm} t={t} primary={!danger} danger={danger} label={danger ? 'Yes, do it' : 'Confirm'} />
        </div>
      </div>
    </div>
  );
}

function ActionRail({ items, t, onAction }) {
  return (
    <div style={{
      position: 'sticky', top: 0, display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
      background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, marginBottom: 14,
      flexWrap: 'wrap',
    }}>
      <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, marginRight: 4 }}>Action rail</span>
      {items.map((label, i) => (
        <IconButton key={i} t={t} soft label={label} icon={i === 0 ? Plus : i === 1 ? Edit3 : Send} onClick={() => onAction && onAction(label)} />
      ))}
      <div style={{ flex: 1 }} />
      <SmartButton label="Save Search" t={t} soft icon={Bookmark} />
      <SmartButton label="Filters" t={t} soft icon={Filter} />
      <SmartButton label="Export" t={t} soft icon={Download} />
    </div>
  );
}

/* ============================================================================
   EXECUTIVE SUMMARY — the hero page (matches reference mockup)
   ============================================================================ */

function ExecutiveSummary({ t, onCreateOrg, onAction, openDrillFor }) {
  const ctx = React.useContext(ActionContext);
  const handleCreateOrg = () => {
    if (ctx && ctx.canDo('org.create')) {
      ctx.setActiveAction({ actionId: 'org.create' });
    } else if (onCreateOrg) {
      onCreateOrg();
    }
  };
  const burnData = [
    { label: 'Jan', value: 38, color: t.yellow },
    { label: 'Feb', value: 52, color: t.yellow },
    { label: 'Mar', value: 41, color: t.yellow },
    { label: 'Apr', value: 67, color: t.green },
    { label: 'May', value: 74, color: t.green },
    { label: 'Jun', value: 89, color: t.green },
    { label: 'Jul', value: 96, color: t.green },
    { label: 'Aug', value: 78, color: t.yellow },
    { label: 'Sep', value: 88, color: t.green },
  ];
  const burnTrend = burnData.map((d) => d.value);
  const headlineKpis = [
    { label: 'Active Organizations', value: '13', color: t.yellow, icon: Building2 },
    { label: 'Active Mentees', value: '2,319', color: t.blue, icon: Users },
    { label: 'Active Mentors', value: '720', color: t.purple, icon: GraduationCap },
    { label: 'Escalated Issues', value: '15', color: t.red, icon: AlertTriangle },
  ];

  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textMuted, marginBottom: 8 }}>
            <span>Super Admin</span>
            <ChevronRight size={12} />
            <span style={{ color: t.text }}>Overview</span>
          </div>
          <h1 className="mu-display" style={{ fontSize: 44, color: t.text, margin: 0, lineHeight: 1.05 }}>
            Super Admin Control Suite
          </h1>
          <div style={{ fontSize: 13, color: t.textMuted, marginTop: 6, maxWidth: 580 }}>
            Manage all organizations, users, mentors, billing, credits, and risk from a central command center.
          </div>
        </div>
        <button onClick={handleCreateOrg} style={{
          padding: '12px 22px', background: t.accent, color: '#06181f', border: 'none',
          borderRadius: 999, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 8,
          boxShadow: '0 4px 18px ' + t.accent + '44',
        }}>
          <Plus size={16} /> Onboard Organization
        </button>
      </div>

      {/* Hero KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {headlineKpis.map((k) => (
          <div key={k.label} style={{
            background: 'linear-gradient(135deg, ' + k.color + '24 0%, ' + k.color + '0a 100%)',
            border: '1px solid ' + k.color + '44',
            borderRadius: 16, padding: 18,
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: 14, left: 14, width: 36, height: 36,
              borderRadius: 10, background: k.color + '33',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}><k.icon size={18} color={k.color} /></div>
            <div style={{ paddingLeft: 50 }}>
              <div className="mu-display" style={{ fontSize: 38, color: t.text, lineHeight: 1, fontWeight: 400 }}>{k.value}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        {/* Credits Issued vs Consumed */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <div>
              <div className="mu-display" style={{ fontSize: 20, color: t.text }}>Credits Issued vs. Consumed</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11, color: t.textMuted, marginTop: 4 }}>
                <span>3.98k Issued</span>
                <span style={{ color: t.text }}>3.56k Consumed</span>
                <span style={{ color: t.orange }}>↗ Burn Rate × trend</span>
              </div>
            </div>
            <button style={{ padding: '6px 10px', background: t.bgInput, color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 8, fontSize: 11, cursor: 'pointer' }}>This year ▾</button>
          </div>
          <div style={{ position: 'relative' }}>
            <BarChart data={burnData} t={t} height={200} />
            <svg width="100%" height="200" viewBox="0 0 600 200" style={{ position: 'absolute', top: 8, left: 0, pointerEvents: 'none' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={t.orange} stopOpacity="0.4" />
                  <stop offset="100%" stopColor={t.orange} stopOpacity="0.9" />
                </linearGradient>
              </defs>
              <path d={burnTrend.map((v, i) => (i === 0 ? 'M' : 'L') + (33 + i * 64) + ',' + (192 - v * 1.7)).join(' ')}
                fill="none" stroke="url(#trendGrad)" strokeWidth="2.5" strokeDasharray="4,3" />
            </svg>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>
            <span>Total</span>
            <span>Peaks: Issued</span>
            <span>Engagement +6 climbing</span>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 16, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 20, color: t.text, marginBottom: 4 }}>Revenue Breakdown</div>
          <div className="mu-mono" style={{ fontSize: 28, color: t.text, fontWeight: 600 }}>$187,500</div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 6 }}>
            <DonutChart t={t} size={170} total="MTD" totalLabel="$187.5k" slices={[
              { value: 46, color: t.blue },
              { value: 37, color: t.accent },
              { value: 19, color: t.purple },
            ]} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: t.blue }} />
              <span style={{ color: t.textMuted }}>46% Renewal</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: t.accent }} />
              <span style={{ color: t.textMuted }}>37% Invoices Raised</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
              <span style={{ width: 10, height: 10, borderRadius: 999, background: t.purple }} />
              <span style={{ color: t.textMuted }}>19% Credits Used (Burn)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Open Escalations + Critical Anomalies */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Megaphone size={16} color={t.orange} />
            <div className="mu-display" style={{ fontSize: 20, color: t.text }}>Open Escalations</div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, textTransform: 'uppercase', padding: '8px 0', letterSpacing: 0.5 }}>Organizations</th>
                <th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, textTransform: 'uppercase', padding: '8px 0' }}>Renewal days</th>
                <th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, textTransform: 'uppercase', padding: '8px 0' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {ESCALATIONS.map((e) => (
                <tr key={e.org} className="mu-row" style={{ cursor: 'pointer' }} onClick={() => openDrillFor && openDrillFor(e)}>
                  <td style={{ padding: '12px 0', borderTop: '1px solid ' + t.borderSoft }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 26, height: 26, borderRadius: 7, background: t.bgInput, color: t.text, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600, border: '1px solid ' + t.border }}>{e.org.split(' ').slice(-1)[0].slice(0, 2)}</span>
                      <span style={{ fontSize: 13, color: t.text }}>{e.org}</span>
                    </div>
                  </td>
                  <td style={{ padding: '12px 0', borderTop: '1px solid ' + t.borderSoft }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 6,
                      padding: '4px 10px', borderRadius: 999, fontSize: 11,
                      background: t.bgInput, color: t.text, fontFamily: FONT_MONO,
                    }}>
                      {e.renewalDays === 0 ? 'Today' : 'May ' + (10 + e.renewalDays % 12)}
                    </span>
                  </td>
                  <td style={{ padding: '12px 0', borderTop: '1px solid ' + t.borderSoft }}>
                    <StatusPill t={t} tone={e.status === 'High' ? 'bad' : 'warn'}>{e.renewalDays === 0 ? '0 Day' : e.renewalDays + ' Days'}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 16, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <AlertOctagon size={16} color={t.red} />
            <div className="mu-display" style={{ fontSize: 20, color: t.text }}>Critical Anomalies</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, padding: 12, background: t.redSoft + '44', border: '1px solid ' + t.red + '44', borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.red + '33', color: t.red, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Flag size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Mumbai credits burn 3× usual rate</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>London Business School • 45 mins ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: 12, background: t.yellowSoft + '44', border: '1px solid ' + t.yellow + '44', borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.yellow + '33', color: t.yellow, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><RefreshCw size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Eyan Smith (Direct Mentee)</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>Refund request pending PT limit</div>
                <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Waiting 14 minutes ago</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, padding: 12, background: t.bgInput, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: t.blueSoft, color: t.blue, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><AlertCircle size={16} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>36 mentees report invalid video URLs</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Across 4 cohorts</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ARCHETYPE: charts dashboard (Operations Pulse, Revenue & Credits, Risk & Support)
   ============================================================================ */

function ChartsDashboard({ tab, t, kpis, charts, onAction }) {
  // Wire to canonical sample datasets per the "Illustrative Data for Sample Visuals" sheet
  const opsScheduled = WEEKLY_OPS_PULSE.map((w) => w.scheduled);
  const opsCompleted = WEEKLY_OPS_PULSE.map((w) => w.completed);
  const opsNoShows = WEEKLY_OPS_PULSE.map((w) => w.noShows);
  const opsLabels = WEEKLY_OPS_PULSE.map((w) => w.week);
  const totalScheduled = WEEKLY_OPS_PULSE.reduce((a, w) => a + w.scheduled, 0);
  const totalCompleted = WEEKLY_OPS_PULSE.reduce((a, w) => a + w.completed, 0);
  const totalNoShows = WEEKLY_OPS_PULSE.reduce((a, w) => a + w.noShows, 0);
  const overallCompletion = Math.round((totalCompleted / totalScheduled) * 1000) / 10;
  const latestRate = WEEKLY_OPS_PULSE[WEEKLY_OPS_PULSE.length - 1].completionRate;
  const firstRate = WEEKLY_OPS_PULSE[0].completionRate;
  const exceptionRows = ORGS.slice(0, 6).map((o) => ({ org: o.name, type: ['Mentor no-show','Booking failed','Credit underflow'][o.id.charCodeAt(o.id.length - 1) % 3], count: o.ticketsOpen + 1, status: o.slaBreach ? 'Breached' : 'On Track' }));

  const isRevenue = tab.key === 'revenue_credits';
  const isRisk = tab.key === 'risk_health';

  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {kpis.map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      {isRevenue && (
        <>
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Budget → burn → refund → exposure</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Commercial reasoning made visible — waterfall view</div>
              </div>
              <StatusPill t={t} tone="warn">Net at risk: ₹2.4L</StatusPill>
            </div>
            <Waterfall t={t} steps={[
              { label: 'Q1 budget', value: 2400, kind: 'total' },
              { label: 'Org renewals', value: 380 },
              { label: 'Allocations', value: -1480 },
              { label: 'Burn (sessions)', value: -640 },
              { label: 'Refunds', value: -84 },
              { label: 'Top-ups', value: 220 },
              { label: 'Net exposure', value: 796, kind: 'total' },
            ]} height={240} />
          </div>
          {/* Credit Allocation Snapshot — clustered bar chart per spec (allocated/consumed/remaining × 5 orgs) */}
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Credit allocation by org</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Allocated · consumed · remaining — illustrative sample, {CREDIT_ALLOC_SNAPSHOT.length} orgs</div>
              </div>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>units = credits</span>
            </div>
            <ClusteredBar
              t={t}
              height={280}
              data={CREDIT_ALLOC_SNAPSHOT.map((o) => ({ label: o.org, allocated: o.allocated, consumed: o.consumed, remaining: o.remaining }))}
              series={[
                { key: 'allocated', label: 'Allocated credits', color: t.blue },
                { key: 'consumed',  label: 'Consumed credits',  color: t.red },
                { key: 'remaining', label: 'Remaining credits', color: t.green },
              ]}
              yLabel="Credits"
              xLabel="Organisation"
            />
          </div>
        </>
      )}
      {isRisk && (
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 14 }}>
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Ticket SLA status</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Support command centre · platform total: <strong style={{ color: t.text }}>{TICKET_SLA_SNAPSHOT.reduce((a, s) => a + s.count, 0)} open tickets</strong></div>
            </div>
          </div>
          {/* Donut visual per spec image */}
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'center' }}>
            <DonutChart
              t={t} size={200}
              total={TICKET_SLA_SNAPSHOT.reduce((a, s) => a + s.count, 0)}
              totalLabel="Open"
              slices={TICKET_SLA_SNAPSHOT.map((s) => ({
                value: s.count,
                color: s.tone === 'good' ? t.green : s.tone === 'warn' ? t.yellow : t.red,
              }))}
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {TICKET_SLA_SNAPSHOT.map((s) => {
                const total = TICKET_SLA_SNAPSHOT.reduce((a, x) => a + x.count, 0);
                const pct = Math.round((s.count / total) * 100);
                const color = s.tone === 'good' ? t.green : s.tone === 'warn' ? t.yellow : t.red;
                return (
                  <div key={s.status} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 50px 50px', gap: 10, alignItems: 'center', padding: '8px 12px', background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                    <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{s.status}</span>
                    <span style={{ fontSize: 14, color: color, fontFamily: FONT_MONO, fontWeight: 700, textAlign: 'right' }}>{s.count}</span>
                    <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, textAlign: 'right' }}>{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Weekly operations pulse</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Sessions / completion / no-show trend · {opsLabels[0]}–{opsLabels[opsLabels.length - 1]}</div>
            </div>
            <StatusPill t={t} tone={latestRate > firstRate ? 'good' : 'warn'}>{latestRate > firstRate ? '↑' : '↓'} {Math.abs(latestRate - firstRate).toFixed(1)}pp</StatusPill>
          </div>
          <LineChart
            series={[
              { data: opsScheduled, color: t.blue },
              { data: opsCompleted, color: t.accent },
              { data: opsNoShows,   color: t.red },
            ]}
            seriesNames={['Scheduled', 'Completed', 'No-shows']}
            summary={[
              { label: 'Total scheduled', value: totalScheduled.toLocaleString() },
              { label: 'Total completed', value: totalCompleted.toLocaleString() },
              { label: 'Completion rate', value: overallCompletion + '%' },
              { label: 'No-shows (6w)',  value: totalNoShows.toString() },
            ]}
            labels={opsLabels} t={t} height={220}
          />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Distribution</div>
          <DonutChart t={t} size={180} total="100%" totalLabel="Mix" slices={[
            { value: 52, color: t.accent },
            { value: 28, color: t.blue },
            { value: 14, color: t.yellow },
            { value: 6, color: t.red },
          ]} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: t.textMuted }}>Completed</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>52%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: t.textMuted }}>Rescheduled</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>28%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: t.textMuted }}>No-show</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>14%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: t.textMuted }}>Cancelled</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>6%</span>
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>No-show heatmap</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Mon–Sat × time windows · pattern: end-of-day Fri/Sat hot spots</div>
            </div>
          </div>
          <Heatmap rows={NO_SHOW_HEATMAP_ROWS} cols={NO_SHOW_HEATMAP_COLS} data={NO_SHOW_HEATMAP_DATA} t={t} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, fontSize: 11, color: t.textMuted }}>
            <span>Less</span>
            <div style={{ display: 'flex', gap: 3 }}>
              {[t.borderSoft, t.blueSoft, t.blue, t.orange, t.red].map((c, i) => (
                <span key={i} style={{ width: 16, height: 8, background: c, borderRadius: 2 }} />
              ))}
            </div>
            <span>More</span>
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Top exception orgs</div>
            <button style={{ background: 'transparent', border: 'none', color: t.accent, fontSize: 11, cursor: 'pointer' }}>View all →</button>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Organisation</th>
                <th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Type</th>
                <th style={{ textAlign: 'right', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Count</th>
                <th style={{ textAlign: 'right', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>SLA</th>
              </tr>
            </thead>
            <tbody>
              {exceptionRows.map((r, i) => (
                <tr key={i} className="mu-row" style={{ cursor: 'pointer' }}>
                  <td style={{ padding: '10px 0', borderTop: '1px solid ' + t.borderSoft, fontSize: 13, color: t.text }}>{r.org}</td>
                  <td style={{ padding: '10px 0', borderTop: '1px solid ' + t.borderSoft, fontSize: 12, color: t.textMuted }}>{r.type}</td>
                  <td style={{ padding: '10px 0', borderTop: '1px solid ' + t.borderSoft, textAlign: 'right', fontSize: 12, color: t.text, fontFamily: FONT_MONO }}>{r.count}</td>
                  <td style={{ padding: '10px 0', borderTop: '1px solid ' + t.borderSoft, textAlign: 'right' }}>
                    <StatusPill t={t} tone={r.status === 'Breached' ? 'bad' : 'good'}>{r.status}</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   SPECIALIZED ARCHETYPES
   ============================================================================ */

function PipelinePage({ t, kind, onAction }) {
  const colsByKind = {
    onboarding: ['Invited','KYC pending','Setup','Approval','Live'],
    access: ['Pending','Under review','Approved','Denied'],
    refunds: ['Open','Approved','Denied','Retried'],
    abuse: ['New','Investigating','Frozen','Closed'],
    compliance: ['LOE pending','Docs pending','Tax pending','Approved','Rejected'],
  };
  const cols = colsByKind[kind] || colsByKind.onboarding;
  const dataset = kind === 'access' ? ACCESS_REQUESTS :
                  kind === 'refunds' ? REFUNDS :
                  kind === 'abuse' ? ABUSE_CASES :
                  kind === 'compliance' ? MENTORS.slice(0, 18) :
                  ORGS.slice(0, 18);
  const distribute = (col, i) => dataset.filter((_, di) => di % cols.length === i);
  return (
    <div className="mu-fade-in" style={{ display: 'grid', gridTemplateColumns: 'repeat(' + cols.length + ', 1fr)', gap: 12 }}>
      {cols.map((col, i) => {
        const items = distribute(col, i);
        return (
          <div key={col} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 12, display: 'flex', flexDirection: 'column', gap: 8, minHeight: 480 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{col}</div>
              <span style={{ fontSize: 10, color: t.textMuted, padding: '2px 8px', background: t.bgInput, borderRadius: 999, fontFamily: FONT_MONO }}>{items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {items.slice(0, 5).map((it, idx) => (
                <div key={idx} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 10, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <Avatar name={it.name || it.user || it.who || it.mentee || it.signal || 'X'} t={t} size={22} />
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600, flex: 1, minWidth: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {it.name || it.user || it.who || it.mentee || it.signal}
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 8 }}>
                    {it.org || it.fromRole || it.category || it.reason || ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center', justifyContent: 'space-between' }}>
                    <StatusPill t={t} tone={i === 0 ? 'warn' : i === cols.length - 1 ? 'good' : 'info'}>{col}</StatusPill>
                    <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{it.age ? it.age + 'h' : it.lastEdit || it.detected || ''}</span>
                  </div>
                </div>
              ))}
              {items.length > 5 && (
                <button style={{ padding: '6px 8px', background: 'transparent', border: '1px dashed ' + t.borderSoft, borderRadius: 8, color: t.textMuted, fontSize: 11, cursor: 'pointer' }}>+{items.length - 5} more</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MISHeatmapPage({ t }) {
  const tiers = ['Excellent','Good','Basic'];
  const domains = ['Product','UX','Strategy','Finance','Marketing','Engineering','Data','Sales'];
  const data = tiers.map(() => domains.map(() => Math.floor(Math.random() * 20)));
  const leaders = MENTORS.slice().sort((a, b) => b.mis - a.mis).slice(0, 6);
  const aiSuggestions = [
    { mentor: 'Pratika Shah', mentee: 'Aarav Sharma', text: '“Switched into a Senior PM role at a Series B, attributed mock interviews and OKR coaching.”', confidence: 86, status: 'Pending review' },
    { mentor: 'Arvind Menon', mentee: 'Diya Patel', text: '“Cleared design portfolio review at FAANG; mentor’s structured feedback on case study cited.”', confidence: 92, status: 'Confirmed' },
    { mentor: 'Sneha Iyer', mentee: 'Vihaan Reddy', text: '“Promoted to staff engineer; system design sessions called out by mentee in feedback.”', confidence: 71, status: 'Pending review' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Avg MIS', value: '76.4', tone: 'good' },
          { label: 'Mentors @ Excellent', value: '38', tone: 'good' },
          { label: 'Mentors @ Basic', value: '64', tone: 'warn' },
          { label: 'No-show last 30d', value: '4.2%', tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>MIS by tier × domain</div>
          <Heatmap rows={tiers} cols={domains} data={data} t={t} />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Top mentors by MIS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {leaders.map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', borderRadius: 8, background: t.bgCardElev, border: '1px solid ' + t.borderSoft }}>
                <span style={{ width: 24, fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>#{i + 1}</span>
                <Avatar name={m.name} t={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                    {m.tier} · {m.sessions} sessions
                    <StatusPill t={t} tone={m.responsiveness === 'Fast' ? 'good' : m.responsiveness === 'Steady' ? 'info' : 'warn'}>{m.responsiveness}</StatusPill>
                  </div>
                </div>
                <MIScore score={m.mis} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Milestone Assistant — career breakthrough drafts awaiting confirmation */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: t.purple + '22', color: t.purple, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Sparkles size={16} /></div>
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>AI Milestone Assistant — career breakthrough drafts</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Drafts impact statements from session feedback and journals. Users always confirm or edit before saving.</div>
            </div>
          </div>
          <SmartButton label="Audit AI vs saved" t={t} soft icon={History} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
          {aiSuggestions.map((s, i) => (
            <div key={i} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>{s.mentor} → {s.mentee}</div>
                <StatusPill t={t} tone={s.status === 'Confirmed' ? 'good' : 'warn'}>{s.status}</StatusPill>
              </div>
              <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>{s.text}</div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, color: t.textMuted }}>
                  <Sparkles size={10} color={t.purple} />
                  AI confidence
                  <span style={{ fontFamily: FONT_MONO, color: s.confidence >= 80 ? t.green : t.yellow }}>{s.confidence}%</span>
                </div>
                {s.status === 'Pending review' && (
                  <div style={{ display: 'flex', gap: 4 }}>
                    <button style={{ padding: '4px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 10, cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                    <button style={{ padding: '4px 10px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 10, cursor: 'pointer' }}>Edit</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CapacityPage({ t }) {
  // Wired to canonical MENTOR_SUPPLY_BY_DOMAIN per spec "Use on mentor pool / org capacity pages"
  const totalActive = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.activeMentors, 0);
  const totalOpen = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.openSlots, 0);
  const totalBooked = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.bookedSessions, 0);
  const fillRate = Math.round((totalBooked / (totalBooked + totalOpen)) * 100);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Active mentors', value: String(totalActive), tone: 'good' },
          { label: 'Open slots', value: totalOpen.toLocaleString(), tone: 'neutral' },
          { label: 'Booked sessions', value: totalBooked.toLocaleString(), tone: 'good' },
          { label: 'Slot fill rate', value: fillRate + '%', tone: fillRate > 50 ? 'good' : 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Mentor supply vs demand by domain</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Active mentors · open slots · booked sessions — illustrative sample</div>
          </div>
          <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{MENTOR_SUPPLY_BY_DOMAIN.length} domains</span>
        </div>
        <ClusteredBar
          t={t}
          height={280}
          data={MENTOR_SUPPLY_BY_DOMAIN.map((d) => ({ label: d.domain, active: d.activeMentors, open: d.openSlots, booked: d.bookedSessions }))}
          series={[
            { key: 'active', label: 'Active Mentors',  color: t.blue },
            { key: 'open',   label: 'Open Slots',      color: t.red },
            { key: 'booked', label: 'Booked Sessions', color: t.green },
          ]}
          yLabel="Count"
          xLabel="Domain"
        />
      </div>
    </div>
  );
}

function RuleBuilderPage({ t, kind }) {
  const [activePolicyId, setActivePolicyId] = useState(POLICIES[0].id);
  const [logicSheetOpen, setLogicSheetOpen] = useState(false);
  const activePolicy = POLICIES.find((p) => p.id === activePolicyId) || POLICIES[0];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: kind === 'engine' ? 'Active credit layers' : 'Active policies', value: kind === 'engine' ? '5' : '6', tone: 'neutral' },
          { label: 'Drafts', value: kind === 'engine' ? '1' : '0', tone: 'neutral' },
          { label: 'Last published', value: '4d ago', tone: 'neutral' },
          { label: 'Affected entities', value: kind === 'engine' ? '2,400 mentees' : '720 mentors + 30 orgs', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      {/* Canonical sheet access — same modal from both Credit Engine and Policy Creator pages */}
      <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px dashed ' + t.purple + '55', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Layers size={14} color={t.purple} />
        <span style={{ flex: 1, fontSize: 12, color: t.text }}>
          The plain-language sheet that keeps <strong>design, product, finance, and tech</strong> aligned on credits and policies — 11 rows × 7 columns, single source of truth.
        </span>
        <IconButton t={t} icon={FileText} primary label="View commercial logic" onClick={() => setLogicSheetOpen(true)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>{kind === 'engine' ? 'Credit object hierarchy' : 'Policy library'}</div>
            <IconButton t={t} icon={Plus} primary label={kind === 'engine' ? 'Add layer' : 'New policy'} />
          </div>
          {kind === 'engine' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {/* Credit object → org wallet → programme ledger → mentee wallet → external packs */}
              {CREDIT_LAYERS.map((c, i) => (
                <div key={c.layer} style={{ display: 'flex', gap: 12, padding: 14, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, position: 'relative' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontFamily: FONT_MONO, fontWeight: 700 }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 2 }}>{c.layer}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{c.desc}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '2px 10px', fontSize: 10, color: t.textDim }}>
                      <span>Owner</span><span style={{ color: t.textMuted }}>{c.owner}</span>
                      <span>Visible</span><span style={{ color: t.textMuted }}>{c.visibleTo}</span>
                      <span>Can request change</span><span style={{ color: /no/i.test(c.canRequestChange) && !/yes/i.test(c.canRequestChange) ? t.red : t.green }}>{c.canRequestChange}</span>
                      <span>Default</span><span style={{ color: t.textMuted }}>{c.defaultRec}</span>
                      <span>Design note</span><span style={{ color: t.purple }}>{c.designNotes}</span>
                    </div>
                  </div>
                </div>
              ))}
              <div style={{ padding: 12, background: t.purpleSoft + '33', border: '1px dashed ' + t.purple, borderRadius: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
                <GitBranch size={14} color={t.purple} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 11, color: t.purple, fontWeight: 600, marginBottom: 2 }}>Credit request chain</div>
                  <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>Mentee → Org Admin → Super Admin (if pool insufficient)</div>
                </div>
                <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>Owned by Org Admin / Super Admin</span>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {POLICIES.map((p) => (
                <div key={p.id} onClick={() => setActivePolicyId(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: 12,
                  background: activePolicyId === p.id ? t.accentSoft + '44' : t.bgCardElev,
                  border: '1px solid ' + (activePolicyId === p.id ? t.accent : t.borderSoft),
                  borderRadius: 10, cursor: 'pointer',
                }}>
                  <Shield size={18} color={t.accent} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</span>
                      <StatusPill t={t} tone={p.status === 'Active' ? 'good' : p.status === 'Draft' ? 'warn' : 'neutral'}>{p.status}</StatusPill>
                      <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, padding: '2px 6px', background: t.bgInput, borderRadius: 4 }}>v{p.version}</span>
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{p.rule}</div>
                  </div>
                  <span style={{ fontSize: 11, color: t.textDim, fontFamily: FONT_MONO }}>{p.updated}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>{kind === 'engine' ? 'Tier simulator' : 'Policy detail'}</div>
            {kind === 'engine' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {['Mentor MIS','Sessions / month','Org tier','Validity (days)'].map((label, i) => (
                  <div key={label}>
                    <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{label}</div>
                    <input defaultValue={i === 0 ? '82' : i === 1 ? '12' : i === 2 ? 'Enterprise' : '90'} style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
                  </div>
                ))}
                <div style={{ marginTop: 6, padding: 14, background: t.accentSoft + '44', border: '1px dashed ' + t.accent, borderRadius: 10 }}>
                  <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Result</div>
                  <div className="mu-display" style={{ fontSize: 22, color: t.accent, marginTop: 4 }}>2 credits / session · Good tier</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Validity 90 days · No floor cap</div>
                </div>
                <SmartButton label="Run on full population" t={t} primary icon={Sparkles} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>{activePolicy.name}</span>
                  <StatusPill t={t} tone={activePolicy.status === 'Active' ? 'good' : 'warn'}>{activePolicy.status}</StatusPill>
                </div>
                {[
                  ['Rule', activePolicy.rule],
                  ['Owner', activePolicy.owner],
                  ['Visible to', activePolicy.visibleTo],
                  ['Can request change', activePolicy.canRequestChange],
                  ['Default recommendation', activePolicy.defaultRec],
                  ['Design / UX notes', activePolicy.designNotes],
                ].map(([k, v]) => (
                  <div key={k} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: '8px 10px' }}>
                    <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</div>
                    <div style={{ fontSize: 12, color: t.text, marginTop: 2 }}>{v}</div>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                  <SmartButton label="Simulate" t={t} primary icon={Sparkles} />
                  <SmartButton label="Edit draft" t={t} soft icon={Edit3} />
                  <SmartButton label="Versions" t={t} soft icon={History} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Canonical commercial-logic sheet — 11 rows × 7 columns, mirrors the spec exactly */}
      {logicSheetOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.66)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setLogicSheetOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 1240, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease' }} className="mu-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 26, color: t.text }}>Credits, Policy Creator, and Commercial Logic</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>The control layer in plain language. One canonical sheet so design, product, finance, and tech stay aligned.</div>
              </div>
              <button onClick={() => setLogicSheetOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 11 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.accent + '22', color: t.accent, borderRadius: 999, fontWeight: 600 }}><Wallet size={11} /> 5 credit layers</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.purple + '22', color: t.purple, borderRadius: 999, fontWeight: 600 }}><GitBranch size={11} /> 1 request chain</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.blue + '22', color: t.blue, borderRadius: 999, fontWeight: 600 }}><Shield size={11} /> 5 policies</span>
              <div style={{ flex: 1 }} />
              <SmartButton label="Export CSV" t={t} soft icon={Download} sz={28} />
            </div>
            <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: t.bgCardElev }}>
                    {['Layer','Rule / object','Who owns it','Visible to whom','Can request change?','Default recommendation','Notes for design / UX'].map((h, i) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 12px', fontSize: 10, color: t.textMuted,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                        borderBottom: '1px solid ' + t.border,
                        minWidth: i === 0 ? 150 : i === 6 ? 200 : 130,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMMERCIAL_LOGIC.map((row, i) => {
                    const kindColor = row.kind === 'credit' ? t.accent : row.kind === 'chain' ? t.purple : t.blue;
                    const canChangeIsNo = /^no/i.test(row.canRequestChange);
                    return (
                      <tr key={row.layer} style={{ borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: kindColor }} />
                            <span style={{ color: t.text, fontWeight: 600 }}>{row.layer}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5 }}>{row.rule}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.text, fontFamily: FONT_MONO, fontSize: 10 }}>{row.owner}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5 }}>{row.visibleTo}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top' }}>
                          <span style={{ color: canChangeIsNo ? t.red : t.green, fontWeight: 500 }}>{row.canRequestChange}</span>
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5 }}>{row.defaultRec}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.purple, lineHeight: 1.5 }}>{row.designNotes}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>How to read this sheet.</strong> The first 5 rows are <span style={{ color: t.accent, fontWeight: 600 }}>credit layers</span> (the data objects that hold value). The 6th row is the <span style={{ color: t.purple, fontWeight: 600 }}>credit request chain</span> (how value moves when a wallet runs short). The last 5 rows are the <span style={{ color: t.blue, fontWeight: 600 }}>commercial policies</span> (the rules around refunds, no-shows, cancellations, SLAs, and premium access). Together these are the entire commercial substrate of the platform.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AuditLogPage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Events (24h)', value: '2,840', tone: 'neutral' },
          { label: 'Failed actions', value: '14', tone: 'warn' },
          { label: 'Privileged actions', value: '38', tone: 'neutral' },
          { label: 'Unique actors', value: '52', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', gap: 10 }}>
          <input placeholder="Search audit log..." style={{ flex: 1, padding: '8px 12px', background: t.bgInput, border: '1px solid ' + t.border, color: t.text, borderRadius: 8, fontFamily: FONT_MONO, fontSize: 12 }} />
          <SmartButton label="Filter window" t={t} soft icon={Filter} />
          <SmartButton label="Export evidence" t={t} primary icon={Download} />
        </div>
        <div style={{ padding: 4 }}>
          {AUDIT_LOG.map((a) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '110px 1.4fr 1.6fr 1fr 110px 90px', gap: 10, padding: '10px 14px', borderBottom: '1px solid ' + t.borderSoft, fontSize: 12, alignItems: 'center' }}>
              <span style={{ color: t.textMuted, fontFamily: FONT_MONO, fontSize: 11 }}>{a.when}</span>
              <span style={{ color: t.text, fontWeight: 600 }}>{a.who}</span>
              <span style={{ color: t.textMuted }}>{a.action}</span>
              <span style={{ color: t.text, fontFamily: FONT_MONO, fontSize: 11 }}>{a.object}</span>
              <span style={{ color: t.textMuted, fontFamily: FONT_MONO, fontSize: 11 }}>{a.ip}</span>
              <StatusPill t={t} tone={a.result === 'Success' ? 'good' : 'bad'}>{a.result}</StatusPill>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TicketsPage({ t }) {
  const buckets = ['Open','In Progress','Waiting','Resolved'];
  const slaTotal = TICKET_SLA_SNAPSHOT.reduce((a, s) => a + s.count, 0);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Open tickets', value: '47', tone: 'warn' },
          { label: 'P1 / P2', value: '8 / 14', tone: 'bad' },
          { label: 'Avg resolution', value: '4.6h', tone: 'good' },
          { label: 'CSAT', value: '4.4', tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      {/* Ticket SLA donut — canonical sample chart per "Use on support command centre" spec */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Ticket SLA status</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Support command centre · platform total: <strong style={{ color: t.text }}>{slaTotal} open tickets</strong></div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'center' }}>
          <DonutChart
            t={t} size={200}
            total={slaTotal}
            totalLabel="Open"
            slices={TICKET_SLA_SNAPSHOT.map((s) => ({
              value: s.count,
              color: s.tone === 'good' ? t.green : s.tone === 'warn' ? t.yellow : t.red,
            }))}
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TICKET_SLA_SNAPSHOT.map((s) => {
              const pct = Math.round((s.count / slaTotal) * 100);
              const color = s.tone === 'good' ? t.green : s.tone === 'warn' ? t.yellow : t.red;
              return (
                <div key={s.status} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 50px 50px', gap: 10, alignItems: 'center', padding: '8px 12px', background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: color }} />
                  <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{s.status}</span>
                  <span style={{ fontSize: 14, color: color, fontFamily: FONT_MONO, fontWeight: 700, textAlign: 'right' }}>{s.count}</span>
                  <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, textAlign: 'right' }}>{pct}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + buckets.length + ', 1fr)', gap: 12 }}>
        {buckets.map((b) => {
          const items = TICKETS.filter((tk) => tk.status === b);
          return (
            <div key={b} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 12, minHeight: 380 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: t.text }}>{b}</div>
                <span style={{ fontSize: 10, color: t.textMuted, padding: '2px 8px', background: t.bgInput, borderRadius: 999, fontFamily: FONT_MONO }}>{items.length}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {items.slice(0, 5).map((it) => (
                  <div key={it.id} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 10, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>{it.id}</span>
                      <StatusPill t={t} tone={it.priority === 'P1' ? 'bad' : it.priority === 'P2' ? 'warn' : 'neutral'}>{it.priority}</StatusPill>
                    </div>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 500, marginBottom: 4 }}>{it.title}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 6 }}>{it.org}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 10, color: t.textDim }}>{it.owner}</span>
                      <StatusPill t={t} tone={it.sla === 'Breached' ? 'bad' : 'good'}>{it.age}h</StatusPill>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SLAPage({ t }) {
  const teams = ['L1 Support','L2 Support','Billing','Compliance','Platform'];
  const data = teams.map((team) => ({
    team,
    target: '4h',
    actual: (Math.random() * 6 + 1).toFixed(1) + 'h',
    breach: Math.floor(Math.random() * 8),
    inflight: Math.floor(Math.random() * 14) + 4,
  }));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'On-track', value: '88%', tone: 'good' },
          { label: 'Breached', value: '11', tone: 'bad' },
          { label: 'At-risk', value: '6', tone: 'warn' },
          { label: 'P1 within target', value: '94%', tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Team SLA performance</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Team','Target','Actual','In flight','Breached','Health'].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: 11, color: t.textMuted, padding: '8px 12px', textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr key={r.team} className="mu-row">
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft, fontSize: 13, color: t.text, fontWeight: 600 }}>{r.team}</td>
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft, fontFamily: FONT_MONO, fontSize: 12, color: t.textMuted }}>{r.target}</td>
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft, fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{r.actual}</td>
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft, fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{r.inflight}</td>
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft }}>
                  <StatusPill t={t} tone={r.breach > 4 ? 'bad' : r.breach > 1 ? 'warn' : 'good'}>{r.breach}</StatusPill>
                </td>
                <td style={{ padding: '12px', borderTop: '1px solid ' + t.borderSoft, minWidth: 160 }}>
                  <ProgressBar value={Math.max(40, 100 - r.breach * 8)} t={t} color={r.breach > 4 ? t.red : r.breach > 1 ? t.yellow : t.green} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemplatesPage({ t }) {
  const [selected, setSelected] = useState(TEMPLATES[0]);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Templates', value: '38', tone: 'neutral' },
          { label: 'Active', value: '32', tone: 'good' },
          { label: 'In review', value: '4', tone: 'warn' },
          { label: 'Sent (24h)', value: '4,200', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Template library</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {TEMPLATES.map((tp) => (
              <div key={tp.id} onClick={() => setSelected(tp)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: selected.id === tp.id ? t.accentSoft + '44' : t.bgCardElev, border: '1px solid ' + (selected.id === tp.id ? t.accent : t.borderSoft), borderRadius: 10, cursor: 'pointer' }}>
                <FileText size={18} color={t.accent} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{tp.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{tp.channel} • {tp.vars} variables • {tp.lastEdit}</div>
                </div>
                <StatusPill t={t} tone={tp.status === 'Active' ? 'good' : tp.status === 'Draft' ? 'warn' : 'neutral'}>{tp.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Preview</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <SmartButton label="Send test" t={t} soft icon={Send} />
              <SmartButton label="Edit" t={t} primary icon={Edit3} />
            </div>
          </div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 18 }}>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, marginBottom: 8 }}>To: {`{{recipient_email}}`}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, marginBottom: 16 }}>Subject: {selected.name}</div>
            <div style={{ fontSize: 13, color: t.text, lineHeight: 1.6 }}>
              <p>Hi {`{{first_name}}`},</p>
              <p>{selected.name} body text with rich variables like <span style={{ color: t.accent, fontFamily: FONT_MONO }}>{`{{org_name}}`}</span>, <span style={{ color: t.accent, fontFamily: FONT_MONO }}>{`{{credits_remaining}}`}</span>, and <span style={{ color: t.accent, fontFamily: FONT_MONO }}>{`{{next_session}}`}</span>.</p>
              <p>Best,<br/>The MentorUnion team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function IntegrationsPage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Integrations', value: '8', tone: 'neutral' },
          { label: 'Healthy', value: '7', tone: 'good' },
          { label: 'Degraded', value: '1', tone: 'warn' },
          { label: 'Webhooks (24h)', value: '12.4k', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {INTEGRATIONS.map((i) => (
          <div key={i.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: t.bgInput, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: t.accent }}><Webhook size={18} /></div>
                <div>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 600 }}>{i.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{i.kind}</div>
                </div>
              </div>
              <StatusPill t={t} tone={i.status === 'Healthy' ? 'good' : i.status === 'Degraded' ? 'warn' : 'bad'}>{i.status}</StatusPill>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 11, color: t.textMuted }}>
              <div>
                <div style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Last event</div>
                <div style={{ color: t.text, fontFamily: FONT_MONO, fontSize: 12 }}>{i.lastEvent}</div>
              </div>
              <div>
                <div style={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>Latency</div>
                <div style={{ color: t.text, fontFamily: FONT_MONO, fontSize: 12 }}>{i.latency}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <SmartButton label="Rotate key" t={t} soft icon={Key} sz={28} />
              <SmartButton label="Retry" t={t} soft icon={RefreshCw} sz={28} />
              <IconButton t={t} icon={ExternalLink} sz={28} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FlagsPage({ t }) {
  const [flags, setFlags] = useState(FEATURE_FLAGS);
  const toggle = (id) => setFlags(flags.map((f) => f.id === id ? { ...f, state: f.state === 'on' ? 'off' : 'on' } : f));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Total flags', value: String(flags.length), tone: 'neutral' },
          { label: 'On in production', value: String(flags.filter((f) => f.state === 'on' && f.env === 'production').length), tone: 'good' },
          { label: 'Partial rollout', value: String(flags.filter((f) => f.rollout > 0 && f.rollout < 100).length), tone: 'warn' },
          { label: 'In staging', value: String(flags.filter((f) => f.env === 'staging').length), tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Feature flags</div>
          <SmartButton label="New flag" t={t} primary icon={Plus} />
        </div>
        <div>
          {flags.map((f) => (
            <div key={f.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 110px 100px 1fr 90px 110px', gap: 12, padding: 14, borderBottom: '1px solid ' + t.borderSoft, alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{f.name}</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Owner: {f.owner}</div>
              </div>
              <StatusPill t={t} tone={f.env === 'production' ? 'info' : 'warn'}>{f.env}</StatusPill>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{f.rollout}%</span>
              <ProgressBar value={f.rollout} t={t} color={f.state === 'on' ? t.accent : t.borderSoft} />
              <button onClick={() => toggle(f.id)} style={{ width: 44, height: 24, borderRadius: 999, background: f.state === 'on' ? t.accent : t.borderSoft, border: 'none', cursor: 'pointer', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 2, left: f.state === 'on' ? 22 : 2, width: 20, height: 20, background: '#fff', borderRadius: '50%', transition: 'left 150ms ease' }} />
              </button>
              <IconButton t={t} icon={Edit3} soft sz={28} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ControllersPage({ t }) {
  const [activeId, setActiveId] = useState(LOGIC_CONTROLLERS[0].id);
  const [flowsOpen, setFlowsOpen] = useState(false);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryPersona, setLibraryPersona] = useState('all');
  const [cuesOpen, setCuesOpen] = useState(false);
  const [domainFilter, setDomainFilter] = useState('all');
  const active = LOGIC_CONTROLLERS.find((c) => c.id === activeId) || LOGIC_CONTROLLERS[0];
  const activeDomain = CONTROLLER_DOMAINS.find((d) => d.key === active.domain);
  const visibleControllers = domainFilter === 'all' ? LOGIC_CONTROLLERS : LOGIC_CONTROLLERS.filter((c) => c.domain === domainFilter);
  const totalFiresPerMin = LOGIC_CONTROLLERS.reduce((s, c) => s + c.firesPerMin, 0);
  const visibleVisuals = libraryPersona === 'all' ? VISUAL_LIBRARY : VISUAL_LIBRARY.filter((v) => v.persona === libraryPersona || v.persona === 'all');

  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Top KPI strip — operational state */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
        {[
          { label: 'Controllers', value: String(LOGIC_CONTROLLERS.length), tone: 'neutral' },
          { label: 'Running', value: String(LOGIC_CONTROLLERS.filter((c) => c.status === 'Running').length), tone: 'good' },
          { label: 'Paused', value: String(LOGIC_CONTROLLERS.filter((c) => c.status === 'Paused').length), tone: 'warn' },
          { label: 'Domains', value: String(CONTROLLER_DOMAINS.length), tone: 'neutral' },
          { label: 'Fires / min (combined)', value: Math.round(totalFiresPerMin).toLocaleString(), tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>

      {/* Spec-quote header to ground the page in the design principle */}
      <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px dashed ' + t.purple + '55', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Cpu size={14} color={t.purple} />
        <span style={{ flex: 1, fontSize: 12, color: t.text }}>
          Do not design only screens. Design the control engines behind the screens — <strong>roles, credits, policies, approvals, automation, risk, and AI helpers.</strong>
        </span>
        <IconButton t={t} icon={Sparkles} soft label="Marketplace cues" onClick={() => setCuesOpen(true)} />
        <IconButton t={t} icon={Grid3x3} soft label="View visual library" onClick={() => setLibraryOpen(true)} />
        <IconButton t={t} icon={Workflow} soft label="View canonical user flows" onClick={() => setFlowsOpen(true)} />
      </div>

      {/* Domain filter chips */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setDomainFilter('all')} style={{
          padding: '6px 12px', background: domainFilter === 'all' ? t.accent : 'transparent',
          color: domainFilter === 'all' ? '#0a1f28' : t.textMuted,
          border: '1px solid ' + (domainFilter === 'all' ? t.accent : t.border),
          borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: domainFilter === 'all' ? 600 : 500,
        }}>All ({LOGIC_CONTROLLERS.length})</button>
        {CONTROLLER_DOMAINS.map((d) => {
          const Ic = d.icon;
          const count = LOGIC_CONTROLLERS.filter((c) => c.domain === d.key).length;
          const active = domainFilter === d.key;
          return (
            <button key={d.key} onClick={() => setDomainFilter(d.key)} style={{
              padding: '6px 12px', background: active ? d.color : 'transparent',
              color: active ? '#0a1f28' : t.textMuted,
              border: '1px solid ' + (active ? d.color : t.border),
              borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: active ? 600 : 500,
              display: 'inline-flex', alignItems: 'center', gap: 6,
            }}><Ic size={11} /> {d.label} ({count})</button>
          );
        })}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 14 }}>
        {/* Cards grouped by domain */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {(domainFilter === 'all' ? CONTROLLER_DOMAINS : CONTROLLER_DOMAINS.filter((d) => d.key === domainFilter)).map((d) => {
            const Ic = d.icon;
            const ctrls = LOGIC_CONTROLLERS.filter((c) => c.domain === d.key);
            if (ctrls.length === 0) return null;
            return (
              <div key={d.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, background: d.color + '22', color: d.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={12} /></div>
                  <span style={{ fontSize: 11, color: t.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>{d.label}</span>
                  <span style={{ fontSize: 10, color: t.textDim }}>· {d.summary}</span>
                  <div style={{ flex: 1, height: 1, background: t.borderSoft, marginLeft: 6 }} />
                  <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{ctrls.length}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
                  {ctrls.map((c) => (
                    <div key={c.id} onClick={() => setActiveId(c.id)} style={{
                      background: activeId === c.id ? d.color + '22' : t.bgCard,
                      border: '1px solid ' + (activeId === c.id ? d.color : t.border),
                      borderRadius: 12, padding: 14, cursor: 'pointer',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ width: 26, height: 26, borderRadius: 7, background: d.color + '22', color: d.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Cpu size={12} /></div>
                          <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{c.name}</div>
                        </div>
                        <StatusPill t={t} tone={c.status === 'Running' ? 'good' : 'warn'}>{c.status}</StatusPill>
                      </div>
                      <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.4, minHeight: 30 }}>{c.governs}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                        <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{c.owner}</span>
                        <span style={{ fontSize: 10, color: c.firesPerMin > 50 ? t.green : c.firesPerMin > 1 ? t.accent : t.textDim, fontFamily: FONT_MONO, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Activity size={9} /> {c.firesPerMin >= 1 ? Math.round(c.firesPerMin) : c.firesPerMin}/min
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detail panel — all 9 spec fields plus telemetry */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18, position: 'sticky', top: 0, alignSelf: 'flex-start', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }} className="mu-scroll">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 4, gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                {activeDomain && <span style={{
                  fontSize: 9, padding: '2px 6px', borderRadius: 4, background: activeDomain.color + '22',
                  color: activeDomain.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6,
                }}>{activeDomain.label}</span>}
                <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>· last {active.lastFired}</span>
                <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, display: 'inline-flex', alignItems: 'center', gap: 3 }}>· <Activity size={9} /> {active.firesPerMin >= 1 ? Math.round(active.firesPerMin) : active.firesPerMin}/min</span>
              </div>
              <div className="mu-display" style={{ fontSize: 22, color: t.text, lineHeight: 1.1 }}>{active.name}</div>
            </div>
            <StatusPill t={t} tone={active.status === 'Running' ? 'good' : 'warn'}>{active.status}</StatusPill>
          </div>

          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['What it governs', active.governs],
              ['Primary owner', active.owner],
              ['Who may edit', active.editor],
              ['Scope', active.scope],
              ['Default behaviour', active.defaultBehaviour],
              ['Override path', active.overridePath],
              ['Audit must-have', active.audit],
              ['Recommended UI location', active.uiLocation],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, padding: '10px 0', borderBottom: '1px solid ' + t.borderSoft }}>
                <span style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</span>
                <span style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Used in flows — cross-reference to canonical user flows */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Workflow size={12} color={activeDomain ? activeDomain.color : t.accent} />
              <span style={{ fontSize: 11, color: t.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Used in flows</span>
              <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>· canonical flows that fire this engine</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CANONICAL_FLOWS.filter((f) => f.controllers.includes(active.id)).map((f) => (
                <span key={f.id} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  padding: '4px 8px', borderRadius: 6,
                  background: t.bgCardElev, border: '1px solid ' + t.borderSoft,
                  fontSize: 10, color: t.text, fontWeight: 500,
                }}>
                  <Workflow size={9} color={t.accent} /> {f.name}
                </span>
              ))}
              {CANONICAL_FLOWS.filter((f) => f.controllers.includes(active.id)).length === 0 && (
                <span style={{ fontSize: 11, color: t.textDim }}>Not currently mapped to any canonical flow.</span>
              )}
            </div>
          </div>

          {/* Recent firings — operational telemetry making "Running" feel alive */}
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <Activity size={12} color={t.accent} />
              <span style={{ fontSize: 11, color: t.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.6 }}>Recent firings</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {active.recentEvents.map((e, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '70px 90px 1fr', gap: 8, padding: 8, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{e.when}</span>
                  <span style={{ fontSize: 10, color: t.accent, fontFamily: FONT_MONO, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.actor}</span>
                  <span style={{ fontSize: 11, color: t.text, lineHeight: 1.4 }}>{e.what}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 6, marginTop: 14 }}>
            {active.status === 'Running'
              ? <SmartButton label="Pause" t={t} soft icon={PauseCircle} />
              : <SmartButton label="Resume" t={t} soft icon={PlayCircle} />}
            <SmartButton label="Tune thresholds" t={t} soft icon={Sliders} />
            <SmartButton label="Versions" t={t} soft icon={History} />
            <div style={{ flex: 1 }} />
            <SmartButton label="Open in UI" t={t} primary icon={ExternalLink} />
          </div>
        </div>
      </div>
      {flowsOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setFlowsOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 1180, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease' }} className="mu-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 26, color: t.text }}>Canonical user flows</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Distilled from the detailed user-flow prototype into the minimum flows that product, design, and tech must get right first.</div>
              </div>
              <button onClick={() => setFlowsOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 11 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.accent + '22', color: t.accent, borderRadius: 999, fontWeight: 600 }}><Workflow size={11} /> {CANONICAL_FLOWS.length} canonical flows</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.purple + '22', color: t.purple, borderRadius: 999, fontWeight: 600 }}><Cpu size={11} /> {LOGIC_CONTROLLERS.length} controllers wired</span>
              <div style={{ flex: 1 }} />
              <SmartButton label="Export sheet" t={t} soft icon={Download} sz={28} />
            </div>
            <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: t.bgCardElev }}>
                    {['Canonical flow','Primary actors','Trigger','Happy path outcome','Edge cases / notes','Main owner of policy','Controllers fired'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 12px', fontSize: 10, color: t.textMuted,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                        borderBottom: '1px solid ' + t.border,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {CANONICAL_FLOWS.map((f, i) => (
                    <tr key={f.id} style={{ borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
                      <td style={{ padding: '12px', verticalAlign: 'top', minWidth: 180 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 22, height: 22, borderRadius: 6, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, flexShrink: 0 }}>{i + 1}</span>
                          <span style={{ color: t.text, fontWeight: 600 }}>{f.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', color: t.text, fontFamily: FONT_MONO, fontSize: 10, minWidth: 140 }}>{f.actors}</td>
                      <td style={{ padding: '12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5, minWidth: 180 }}>
                        <span style={{ display: 'block', fontSize: 9, color: t.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Trigger</span>
                        {f.trigger}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5, minWidth: 220 }}>
                        <span style={{ display: 'block', fontSize: 9, color: t.green, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Happy</span>
                        {f.happy}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', color: t.red, lineHeight: 1.5, minWidth: 180 }}>
                        <span style={{ display: 'block', fontSize: 9, color: t.red, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2, fontStyle: 'normal', fontWeight: 700 }}>Edges</span>
                        {f.edges}
                      </td>
                      <td style={{ padding: '12px', verticalAlign: 'top', color: t.purple, fontFamily: FONT_MONO, fontSize: 10, minWidth: 130 }}>{f.owner}</td>
                      <td style={{ padding: '12px', verticalAlign: 'top', minWidth: 200 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                          {f.controllers.map((cid) => {
                            const c = LOGIC_CONTROLLERS.find((lc) => lc.id === cid);
                            if (!c) return null;
                            const dm = CONTROLLER_DOMAINS.find((d) => d.key === c.domain);
                            return (
                              <span key={cid} title={c.governs} style={{
                                display: 'inline-flex', alignItems: 'center', gap: 3,
                                padding: '2px 6px', borderRadius: 4,
                                background: (dm ? dm.color : t.accent) + '22',
                                color: dm ? dm.color : t.accent,
                                fontSize: 9, fontWeight: 600,
                              }}>
                                <Cpu size={8} /> {c.name.replace(' Engine','').replace(' Controller','').replace(' Logic','')}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 12, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>How to use this sheet.</strong> Each row is a flow that must work end-to-end before the platform is shippable. The <span style={{ color: t.green, fontWeight: 600 }}>happy path</span> defines the default behaviour. The <span style={{ color: t.red, fontWeight: 600 }}>edge cases</span> are the failure modes to design for explicitly. The <span style={{ color: t.purple, fontWeight: 600 }}>main owner of policy</span> is who decides the rules. The <span style={{ color: t.accent, fontWeight: 600 }}>controllers fired</span> column shows which engines from the Logic Controllers registry are on the hook to make this flow actually work.
            </div>
          </div>
        </div>
      )}

      {/* Canonical visual & widget library — 16 rows × 7 columns mirroring the design-system spec */}
      {libraryOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.66)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setLibraryOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 1240, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease' }} className="mu-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 26, color: t.text }}>Visual & widget library</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
                  Use visuals only where they make decisions faster. <strong style={{ color: t.text, fontStyle: 'normal' }}>Tables remain the default action surface.</strong>
                </div>
              </div>
              <button onClick={() => setLibraryOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {/* Persona filter chips */}
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { key: 'all',         label: 'All personas',  count: VISUAL_LIBRARY.length },
                { key: 'super_admin', label: 'Super Admin',   count: VISUAL_LIBRARY.filter((v) => v.persona === 'super_admin').length },
                { key: 'org_admin',   label: 'Org Admin',     count: VISUAL_LIBRARY.filter((v) => v.persona === 'org_admin').length },
                { key: 'mentor',      label: 'Mentor',        count: VISUAL_LIBRARY.filter((v) => v.persona === 'mentor').length },
                { key: 'mentee',      label: 'Mentee',        count: VISUAL_LIBRARY.filter((v) => v.persona === 'mentee').length },
              ].map((p) => {
                const isActive = libraryPersona === p.key;
                return (
                  <button key={p.key} onClick={() => setLibraryPersona(p.key)} style={{
                    padding: '6px 12px', background: isActive ? t.accent : 'transparent',
                    color: isActive ? '#0a1f28' : t.textMuted,
                    border: '1px solid ' + (isActive ? t.accent : t.border),
                    borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: isActive ? 600 : 500,
                  }}>{p.label} ({p.count})</button>
                );
              })}
              <div style={{ flex: 1 }} />
              <SmartButton label="Export sheet" t={t} soft icon={Download} sz={28} />
            </div>

            <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: t.bgCardElev }}>
                    {['Role / page','Visual','Use it for','Why it helps','Default placement','Fallback if visual is too much'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 12px', fontSize: 10, color: t.textMuted,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                        borderBottom: '1px solid ' + t.border,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {visibleVisuals.map((v, i) => {
                    // Color-code by persona for at-a-glance scanning
                    const personaColor = v.persona === 'super_admin' ? t.purple
                      : v.persona === 'org_admin' ? t.blue
                      : v.persona === 'mentor' ? t.accent
                      : v.persona === 'mentee' ? '#e89456'
                      : t.textMuted;
                    // Icon by visual kind
                    const kindIcon = v.kind === 'kpi' ? LayoutDashboard
                      : v.kind === 'line' ? TrendingUp
                      : v.kind === 'bar' ? Activity
                      : v.kind === 'stack' ? Layers
                      : v.kind === 'water' ? Activity
                      : v.kind === 'heat' ? Grid3x3
                      : v.kind === 'time' ? Clock
                      : v.kind === 'cal' ? Calendar
                      : v.kind === 'badge' ? BadgeCheck
                      : v.kind === 'cards' ? Boxes
                      : v.kind === 'gauge' ? Activity
                      : v.kind === 'table' ? List
                      : Boxes;
                    const KIc = kindIcon;
                    return (
                      <tr key={v.id} style={{ borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', minWidth: 180 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{ width: 6, height: 6, borderRadius: 999, background: personaColor }} />
                            <span style={{ color: t.text, fontWeight: 600 }}>{v.rolePage}</span>
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', minWidth: 160 }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 6,
                            padding: '3px 8px', borderRadius: 6,
                            background: personaColor + '22', color: personaColor,
                            fontWeight: 600, fontSize: 10,
                          }}>
                            <KIc size={11} /> {v.visual}
                          </span>
                        </td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5, minWidth: 200 }}>{v.useFor}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.purple, lineHeight: 1.5, minWidth: 180 }}>{v.why}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.text, fontFamily: FONT_MONO, fontSize: 10, minWidth: 130 }}>{v.placement}</td>
                        <td style={{ padding: '10px 12px', verticalAlign: 'top', color: t.textDim, lineHeight: 1.5, fontSize: 10, minWidth: 170 }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                            <ArrowRight size={9} /> {v.fallback}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>How to read this sheet.</strong> Each row tells you what visual to reach for on a given page, and crucially, the <span style={{ color: t.text, fontWeight: 600 }}>fallback</span> if the visual proves too heavy in real use. Charts justify their existence by helping someone <em>decide faster</em> — if a sparkline in a KPI card does the same job, downgrade. The last row is the universal default: <span style={{ color: t.accent, fontWeight: 600 }}>conditional-format tables</span> work everywhere because people act from tables faster than from charts.
            </div>
          </div>
        </div>
      )}

      {/* Canonical marketplace cues — proven trust patterns to borrow */}
      {cuesOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.66)', zIndex: 80, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setCuesOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ width: 1180, maxWidth: '100%', maxHeight: '90vh', overflow: 'auto', background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14, padding: 22, animation: 'mu-fade-in 220ms ease' }} className="mu-scroll">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14, gap: 16 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 26, color: t.text }}>Marketplace cues to borrow</div>
                <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>
                  Borrow only the cues that reduce friction: <strong style={{ color: t.text, fontStyle: 'normal' }}>responsiveness, availability, trust badges, social proof, and similar mentors.</strong>
                </div>
              </div>
              <button onClick={() => setCuesOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={20} /></button>
            </div>

            <div style={{ display: 'flex', gap: 10, marginBottom: 14, fontSize: 11 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.accent + '22', color: t.accent, borderRadius: 999, fontWeight: 600 }}><BadgeCheck size={11} /> {MARKETPLACE_CUES.length} cues</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: t.purple + '22', color: t.purple, borderRadius: 999, fontWeight: 600 }}><Users size={11} /> Reduces friction for mentees</span>
              <div style={{ flex: 1 }} />
              <SmartButton label="Export sheet" t={t} soft icon={Download} sz={28} />
            </div>

            <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11 }}>
                <thead>
                  <tr style={{ background: t.bgCardElev }}>
                    {['Cue to borrow','Where to use it','Why it matters','Implementation note'].map((h) => (
                      <th key={h} style={{
                        textAlign: 'left', padding: '10px 12px', fontSize: 10, color: t.textMuted,
                        fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5,
                        borderBottom: '1px solid ' + t.border,
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MARKETPLACE_CUES.map((c, i) => {
                    const KIc = c.kind === 'badge' ? BadgeCheck
                      : c.kind === 'text' ? MessageSquare
                      : c.kind === 'time' ? Clock
                      : c.kind === 'rating' ? CircleCheck
                      : c.kind === 'cards' ? Boxes
                      : c.kind === 'card' ? CreditCard
                      : c.kind === 'list' ? Bookmark
                      : Sparkles;
                    return (
                      <tr key={c.id} style={{ borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
                        <td style={{ padding: '12px', verticalAlign: 'top', minWidth: 240 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 22, height: 22, borderRadius: 6, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><KIc size={11} /></span>
                            <span style={{ color: t.text, fontWeight: 600 }}>{c.cue}</span>
                          </div>
                        </td>
                        <td style={{ padding: '12px', verticalAlign: 'top', color: t.text, fontFamily: FONT_MONO, fontSize: 10, lineHeight: 1.6, minWidth: 200 }}>{c.whereToUse}</td>
                        <td style={{ padding: '12px', verticalAlign: 'top', color: t.purple, lineHeight: 1.5, minWidth: 180 }}>{c.whyMatters}</td>
                        <td style={{ padding: '12px', verticalAlign: 'top', color: t.textMuted, lineHeight: 1.5, fontSize: 10, minWidth: 220 }}>{c.implNote}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 12, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted, lineHeight: 1.6 }}>
              <strong style={{ color: t.text }}>How to use this sheet.</strong> These nine cues are observed across leading mentor marketplaces — they exist because they remove friction at known decision points. Implement them only as specced: badges <span style={{ color: t.text, fontWeight: 600 }}>auto-calculated</span> not manually assigned, response times in <span style={{ color: t.text, fontWeight: 600 }}>plain language</span> not raw timestamps, slots in the <span style={{ color: t.text, fontWeight: 600 }}>viewer’s timezone</span>, ratings as <span style={{ color: t.text, fontWeight: 600 }}>aggregates</span> only. Anything beyond this list needs a separate design rationale.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function PricingPage({ t }) {
  const plans = [
    { name: 'Starter', price: '₹49,000', mentees: 'Up to 100', features: ['Standard mentors','Basic analytics','Email support'], color: t.blue },
    { name: 'Growth', price: '₹148,000', mentees: 'Up to 500', features: ['All mentor tiers','Advanced analytics','Priority support','White-label'], color: t.accent, recommended: true },
    { name: 'Enterprise', price: 'Custom', mentees: 'Unlimited', features: ['Custom mentor mapping','Dedicated CSM','SLA-backed','API access','SSO'], color: t.purple },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Active plans', value: '3', tone: 'neutral' },
          { label: 'Add-ons', value: '8', tone: 'neutral' },
          { label: 'Custom rates', value: '14', tone: 'warn' },
          { label: 'Avg session price', value: '₹2,140', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
        {plans.map((p) => (
          <div key={p.name} style={{ background: t.bgCard, border: '1px solid ' + (p.recommended ? p.color : t.border), borderRadius: 14, padding: 22, position: 'relative', boxShadow: p.recommended ? '0 0 0 2px ' + p.color + '33' : 'none' }}>
            {p.recommended && <div style={{ position: 'absolute', top: -10, right: 16, padding: '3px 10px', background: p.color, color: '#0a1f28', borderRadius: 999, fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>RECOMMENDED</div>}
            <div className="mu-display" style={{ fontSize: 24, color: t.text }}>{p.name}</div>
            <div className="mu-mono" style={{ fontSize: 32, color: p.color, marginTop: 8, fontWeight: 600 }}>{p.price}</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 16 }}>{p.mentees}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {p.features.map((f) => (
                <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.text }}>
                  <CircleCheck size={14} color={p.color} /> {f}
                </div>
              ))}
            </div>
            <IconButton t={t} primary label={'Edit ' + p.name} />
          </div>
        ))}
      </div>
    </div>
  );
}

function InvoicesPage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Invoiced MTD', value: '₹18.4L', tone: 'good' },
          { label: 'Outstanding', value: '₹2.8L', tone: 'warn' },
          { label: 'Overdue', value: '₹84k', tone: 'bad' },
          { label: 'Payouts pending', value: '₹6.2L', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
          <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Invoices (Org)</div>
            <SmartButton label="Raise invoice" t={t} primary icon={Plus} />
          </div>
          <div className="mu-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {INVOICES.map((inv) => (
              <div key={inv.id} style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 110px 90px 100px', gap: 10, padding: '12px 14px', borderBottom: '1px solid ' + t.borderSoft, alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontFamily: FONT_MONO, color: t.textMuted }}>{inv.id}</span>
                <span style={{ color: t.text }}>{inv.org}</span>
                <span style={{ fontFamily: FONT_MONO, color: t.text, textAlign: 'right' }}>₹{inv.amount.toLocaleString()}</span>
                <span style={{ fontFamily: FONT_MONO, color: t.textMuted }}>{inv.due}</span>
                <StatusPill t={t} tone={inv.status === 'Paid' ? 'good' : inv.status === 'Overdue' ? 'bad' : 'warn'}>{inv.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
          <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Payouts (Mentor)</div>
            <SmartButton label="Run cycle" t={t} soft icon={Banknote} />
          </div>
          <div className="mu-scroll" style={{ maxHeight: 400, overflowY: 'auto' }}>
            {PAYOUTS.map((p) => (
              <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '90px 1.4fr 100px 80px 110px', gap: 10, padding: '12px 14px', borderBottom: '1px solid ' + t.borderSoft, alignItems: 'center', fontSize: 12 }}>
                <span style={{ fontFamily: FONT_MONO, color: t.textMuted }}>{p.id}</span>
                <span style={{ color: t.text }}>{p.mentor}</span>
                <span style={{ fontFamily: FONT_MONO, color: t.text, textAlign: 'right' }}>₹{p.amount.toLocaleString()}</span>
                <span style={{ fontSize: 10, color: t.textMuted }}>{p.cycle}</span>
                <StatusPill t={t} tone={p.status === 'Sent' ? 'good' : p.status === 'Failed' ? 'bad' : 'warn'}>{p.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ExportsPage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Exports today', value: '24', tone: 'neutral' },
          { label: 'Scheduled', value: '8', tone: 'neutral' },
          { label: 'Processing', value: '2', tone: 'warn' },
          { label: 'Failed', value: '1', tone: 'bad' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Export history</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <SmartButton label="Schedule export" t={t} soft icon={Calendar} />
            <SmartButton label="Run export" t={t} primary icon={Plus} />
          </div>
        </div>
        {EXPORTS_HISTORY.map((e) => (
          <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '110px 1.6fr 80px 90px 1fr 100px 90px', gap: 12, padding: '12px 14px', borderBottom: '1px solid ' + t.borderSoft, alignItems: 'center', fontSize: 12 }}>
            <span style={{ fontFamily: FONT_MONO, color: t.textMuted }}>{e.id}</span>
            <div>
              <div style={{ color: t.text, fontWeight: 500 }}>{e.name}</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>by {e.requestedBy}</div>
            </div>
            <StatusPill t={t} tone="info">{e.format}</StatusPill>
            <span style={{ fontFamily: FONT_MONO, color: t.textMuted }}>{e.size}</span>
            <span style={{ color: t.textMuted, fontSize: 11 }}>{e.when}</span>
            <StatusPill t={t} tone={e.status === 'Ready' ? 'good' : e.status === 'Processing' ? 'info' : 'bad'}>{e.status}</StatusPill>
            <IconButton t={t} icon={Download} soft sz={28} />
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportsGridPage({ t }) {
  const reports = [
    { name: 'Platform Health Snapshot', author: 'Auto', schedule: 'Daily 8am', icon: Activity, color: t.accent },
    { name: 'Org Performance Quarterly', author: 'Anita S', schedule: 'Quarterly', icon: Building2, color: t.blue },
    { name: 'Mentor Earnings & Quality', author: 'Vivek P', schedule: 'Monthly', icon: GraduationCap, color: t.purple },
    { name: 'Mentee ROI Cohort View', author: 'Rakesh K', schedule: 'Weekly', icon: Users, color: t.green },
    { name: 'Credit Burn vs Allocation', author: 'Auto', schedule: 'Weekly', icon: Wallet, color: t.yellow },
    { name: 'SLA & Support Health', author: 'Sarah M', schedule: 'Daily', icon: ShieldAlert, color: t.red },
    { name: 'Renewal Risk Forecast', author: 'Auto', schedule: 'Bi-weekly', icon: Calendar, color: t.orange },
    { name: 'Audit Compliance Report', author: 'Auditor', schedule: 'Monthly', icon: Scale, color: t.purple },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Reports', value: '24', tone: 'neutral' },
          { label: 'Scheduled', value: '8', tone: 'neutral' },
          { label: 'Subscribers', value: '64', tone: 'neutral' },
          { label: 'Last refresh', value: '12m ago', tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {reports.map((r) => {
          const Ic = r.icon;
          return (
            <div key={r.name} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: r.color + '22', color: r.color, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Ic size={18} /></div>
              <div style={{ fontSize: 14, color: t.text, fontWeight: 600, marginBottom: 4 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 10 }}>By {r.author} • {r.schedule}</div>
              <div style={{ display: 'flex', gap: 6 }}>
                <IconButton t={t} icon={Eye} soft sz={28} />
                <IconButton t={t} icon={Send} soft sz={28} />
                <IconButton t={t} icon={Copy} soft sz={28} />
                <IconButton t={t} icon={Download} sz={28} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SystemStatusPage({ t }) {
  const services = [
    { name: 'API Gateway', status: 'Operational', uptime: '99.98%', latency: '64ms' },
    { name: 'Booking Service', status: 'Operational', uptime: '99.95%', latency: '120ms' },
    { name: 'Wallet Service', status: 'Operational', uptime: '99.99%', latency: '88ms' },
    { name: 'Notification Service', status: 'Degraded', uptime: '98.4%', latency: '840ms' },
    { name: 'Webhook Dispatcher', status: 'Operational', uptime: '99.92%', latency: '210ms' },
    { name: 'Search Index', status: 'Operational', uptime: '99.8%', latency: '46ms' },
  ];
  const recentJobs = [
    { name: 'Daily MIS recalculation', status: 'Success', dur: '4m 12s' },
    { name: 'Renewal alert blast', status: 'Success', dur: '38s' },
    { name: 'Wallet expiry sweep', status: 'Failed', dur: '2m 04s' },
    { name: 'Mentor LOE re-trigger', status: 'Success', dur: '1m 22s' },
    { name: 'Audit log archive', status: 'Success', dur: '12m 04s' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Uptime (30d)', value: '99.94%', tone: 'good' },
          { label: 'Incidents', value: '2', tone: 'warn' },
          { label: 'Auto-recovery rate', value: '92%', tone: 'good' },
          { label: 'Webhooks failed (24h)', value: '8', tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Service status</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {services.map((s) => (
              <div key={s.name} style={{ display: 'grid', gridTemplateColumns: '1.4fr 110px 90px 90px', gap: 10, alignItems: 'center', padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{s.name}</span>
                <StatusPill t={t} tone={s.status === 'Operational' ? 'good' : s.status === 'Degraded' ? 'warn' : 'bad'}>{s.status}</StatusPill>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{s.uptime}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{s.latency}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Recent background jobs</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentJobs.map((j) => (
              <div key={j.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
                <Workflow size={16} color={t.accent} />
                <span style={{ flex: 1, fontSize: 12, color: t.text }}>{j.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 10, color: t.textMuted }}>{j.dur}</span>
                <StatusPill t={t} tone={j.status === 'Success' ? 'good' : 'bad'}>{j.status}</StatusPill>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   GENERIC TABLE PAGE — used by archetype: 'table'
   ============================================================================ */

function PermissionsPage({ t }) {
  // Spec note: "Keep this easy enough for non-technical operators. Use Full / Scoped / View / Own / Request / None only"
  const [roleFilter, setRoleFilter] = useState('all');
  const [search, setSearch] = useState('');
  // Map every permission value to one of 6 legend categories
  const categorize = (v) => {
    if (!v) return 'None';
    if (v === 'None') return 'None';
    if (v === 'Full') return 'Full';
    if (v.includes('Scoped')) return 'Scoped';
    if (v.includes('Own')) return 'Own';
    if (v.includes('Request') || v.includes('Escalate') || v.includes('ticket')) return 'Request';
    if (v.includes('View')) return 'View';
    return 'None';
  };
  const styleFor = (cat) => {
    const entry = ACCESS_LEGEND.find((l) => l.label === cat);
    return entry ? { bg: entry.color, fg: entry.text } : { bg: t.bgInput, fg: t.textMuted };
  };
  const renderCell = (v) => {
    const cat = categorize(v);
    const s = styleFor(cat);
    return (
      <span title={v} style={{
        display: 'inline-block', padding: '4px 8px', borderRadius: 6,
        background: s.bg, color: s.fg, fontSize: 10, fontWeight: 600,
        whiteSpace: 'nowrap', textAlign: 'center', minWidth: 60,
        border: cat === 'Full' ? '1px solid ' + t.text + '22' : '1px solid transparent',
      }}>{v}</span>
    );
  };
  // Tally: how many capabilities each role has at each access level
  const roleKeys = [{ k: 'sa', l: 'Super Admin' },{ k: 'oa', l: 'Org Admin' },{ k: 'os', l: 'Org Sub-Admin' },{ k: 'm', l: 'Mentor' },{ k: 'me', l: 'Mentee' }];
  const filteredRows = PERMISSIONS_MATRIX.filter((r) => !search || r.cap.toLowerCase().includes(search.toLowerCase()));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Roles', value: String(ROLES.length), tone: 'neutral' },
          { label: 'Capabilities tracked', value: String(PERMISSIONS_MATRIX.length), tone: 'neutral' },
          { label: 'In review', value: '1', tone: 'warn' },
          { label: 'Last published', value: '8d ago', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>

      {/* Final role architecture — operating model */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 20, color: t.text }}>Final role architecture</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Five human-facing dashboards + one invisible system-services layer. This is the operating model to design around.</div>
          </div>
          <StatusPill t={t} tone="accent">Canonical</StatusPill>
        </div>
        <div style={{ overflowX: 'auto' }} className="mu-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
            <thead>
              <tr style={{ background: t.bgCardElev }}>
                {['Role','Core job','Scope','Who grants access','Approves exceptions?','Default home focus','Key non-negotiables'].map((h) => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: 'left', fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROLE_ARCHITECTURE.map((r) => (
                <tr key={r.key} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{r.role}</div>
                    {r.key === 'system' && <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>invisible service layer</div>}
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: t.textMuted, verticalAlign: 'top', maxWidth: 200 }}>{r.coreJob}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: t.textMuted, verticalAlign: 'top', maxWidth: 180 }}>{r.scope}</td>
                  <td style={{ padding: '12px', fontSize: 12, color: t.textMuted, verticalAlign: 'top', maxWidth: 180 }}>{r.whoGrants}</td>
                  <td style={{ padding: '12px', verticalAlign: 'top' }}>
                    <StatusPill t={t} tone={r.approvesExceptions === 'No' ? 'neutral' : r.approvesExceptions.startsWith('Yes') ? 'good' : 'warn'}>
                      {r.approvesExceptions.length > 24 ? r.approvesExceptions.slice(0, 22) + '…' : r.approvesExceptions}
                    </StatusPill>
                  </td>
                  <td style={{ padding: '12px', fontSize: 12, color: t.text, verticalAlign: 'top', maxWidth: 200 }}>{r.homeFocus}</td>
                  <td style={{ padding: '12px', fontSize: 11, color: t.textMuted, verticalAlign: 'top', maxWidth: 220 }}>{r.nonNeg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Roles list with version chips */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Role registry</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <SmartButton label="Copy role" t={t} soft icon={Copy} />
            <SmartButton label="Versions" t={t} soft icon={History} />
            <SmartButton label="Create role" t={t} primary icon={Plus} />
          </div>
        </div>
        <div>
          {ROLES.map((r) => (
            <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 80px 1fr 110px 130px 60px', gap: 12, padding: '12px 14px', borderBottom: '1px solid ' + t.borderSoft, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <Shield size={16} color={t.accent} />
                <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{r.name}</span>
              </div>
              <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{r.users}</span>
              <span style={{ fontSize: 12, color: t.textMuted }}>{r.scope}</span>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, padding: '3px 8px', background: t.bgInput, border: '1px solid ' + t.borderSoft, borderRadius: 4, textAlign: 'center' }}>v{r.version}</span>
              <div style={{ fontSize: 10, color: t.textDim, display: 'flex', flexDirection: 'column' }}>
                <span style={{ color: t.textMuted, fontFamily: FONT_MONO }}>{r.updated}</span>
                <span>by {r.publishedBy}</span>
              </div>
              <IconButton t={t} icon={Edit3} sz={28} />
            </div>
          ))}
        </div>
      </div>

      {/* Permissions matrix */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Simplified permissions matrix</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Easy enough for non-technical operators. Six states only — Full / Scoped / View / Own / Request / None.</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <SmartButton label="Export matrix" t={t} soft icon={Download} />
            <SmartButton label="Simulate role" t={t} primary icon={Sparkles} />
          </div>
        </div>

        {/* Per-role tally — at-a-glance counts of how many capabilities each role has at each access state */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 12 }}>
          {roleKeys.map((rk) => {
            const counts = ACCESS_LEGEND.reduce((acc, l) => {
              acc[l.label] = PERMISSIONS_MATRIX.filter((r) => categorize(r[rk.k]) === l.label).length;
              return acc;
            }, {});
            const isFiltered = roleFilter === rk.k;
            return (
              <button key={rk.k} onClick={() => setRoleFilter(isFiltered ? 'all' : rk.k)} style={{
                background: isFiltered ? t.bgCardElev : t.bgCard,
                border: '1px solid ' + (isFiltered ? t.accent : t.borderSoft),
                borderRadius: 10, padding: 10, cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: t.text, fontWeight: 600 }}>{rk.l}</span>
                  {isFiltered && <Eye size={11} color={t.accent} />}
                </div>
                <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  {ACCESS_LEGEND.map((l) => counts[l.label] > 0 && (
                    <span key={l.label} title={counts[l.label] + ' × ' + l.label} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      padding: '2px 5px', borderRadius: 4, background: l.color, color: l.text,
                      fontSize: 9, fontWeight: 700, fontFamily: FONT_MONO,
                    }}>{counts[l.label]}<span style={{ opacity: 0.7 }}>{l.label[0]}</span></span>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Search + filter row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8 }}>
            <Search size={12} color={t.textMuted} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search capability (e.g. 'credits', 'audit', 'reports')" style={{ flex: 1, background: 'transparent', border: 'none', color: t.text, fontSize: 12, outline: 'none', fontFamily: FONT_BODY }} />
          </div>
          {(roleFilter !== 'all' || search) && (
            <button onClick={() => { setRoleFilter('all'); setSearch(''); }} style={{ padding: '6px 10px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 8, fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <X size={11} /> Clear filters
            </button>
          )}
          <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{filteredRows.length} / {PERMISSIONS_MATRIX.length} capabilities</span>
        </div>

        <div style={{ overflowX: 'auto' }} className="mu-scroll">
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 720 }}>
            <thead>
              <tr style={{ background: t.bgCardElev }}>
                <th style={{ padding: '10px 12px', textAlign: 'left', fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, position: 'sticky', left: 0, background: t.bgCardElev }}>Capability</th>
                {roleKeys.filter((rk) => roleFilter === 'all' || rk.k === roleFilter).map((rk) => (
                  <th key={rk.k} style={{ padding: '10px 12px', textAlign: 'center', fontSize: 11, color: roleFilter === rk.k ? t.accent : t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap', fontWeight: roleFilter === rk.k ? 700 : 600 }}>{rk.l}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, i) => (
                <tr key={i} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                  <td style={{ padding: '10px 12px', fontSize: 12, color: t.text, position: 'sticky', left: 0, background: t.bgCard, fontWeight: 500 }}>{row.cap}</td>
                  {roleKeys.filter((rk) => roleFilter === 'all' || rk.k === roleFilter).map((rk) => (
                    <td key={rk.k} style={{ padding: '10px 12px', textAlign: 'center' }}>{renderCell(row[rk.k])}</td>
                  ))}
                </tr>
              ))}
              {filteredRows.length === 0 && (
                <tr><td colSpan={roleFilter === 'all' ? 6 : 2} style={{ padding: 20, textAlign: 'center', fontSize: 12, color: t.textDim }}>No capabilities match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Access language legend with full design behaviour */}
        <div style={{ marginTop: 18, padding: 14, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
          <div style={{ fontSize: 11, color: t.text, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Legend for access language</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
            {ACCESS_LEGEND.map((l) => (
              <div key={l.label} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{
                  display: 'inline-block', padding: '4px 10px', borderRadius: 6,
                  background: l.color, color: l.text, fontSize: 11, fontWeight: 700,
                  whiteSpace: 'nowrap', minWidth: 64, textAlign: 'center', flexShrink: 0,
                }}>{l.label}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{l.meaning}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>↳ {l.behaviour}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ROLE HOME DASHBOARDS (Image 4) — exact block order per role
   ============================================================================ */

function ScopeChip({ label, t }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '2px 8px', borderRadius: 4, fontSize: 10,
      background: t.accentSoft + '88', color: t.accent, border: '1px solid ' + t.accent + '44',
      fontFamily: FONT_MONO, fontWeight: 600,
    }}>
      <span style={{ width: 4, height: 4, background: t.accent, borderRadius: 999 }} />
      Scope: {label}
    </span>
  );
}

function RequestCTA({ label, t }) {
  return (
    <button style={{
      padding: '6px 12px', background: t.orange + '22', color: t.orange,
      border: '1px solid ' + t.orange, borderRadius: 8, fontSize: 11,
      cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
    }}>
      <Send size={11} /> Request: {label}
    </button>
  );
}

function PersonaBanner({ persona, onReturn, t }) {
  const conf = ROLE_ARCHITECTURE.find((r) => r.key === persona);
  if (!conf) return null;
  return (
    <div style={{
      padding: '10px 18px', background: 'linear-gradient(90deg, ' + t.purple + '33 0%, ' + t.accent + '22 100%)',
      borderBottom: '1px solid ' + t.border,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Eye size={14} color={t.accent} />
      <div style={{ flex: 1, fontSize: 12, color: t.text }}>
        <span style={{ fontWeight: 600 }}>Previewing: {conf.role} home.</span>
        <span style={{ color: t.textMuted, marginLeft: 8 }}>{conf.homeFocus}</span>
      </div>
      <button onClick={onReturn} style={{
        padding: '6px 14px', background: t.accent, color: '#0a1f28',
        border: 'none', borderRadius: 999, fontSize: 11, fontWeight: 600, cursor: 'pointer',
        display: 'inline-flex', alignItems: 'center', gap: 6,
      }}>
        <ChevronLeft size={12} /> Return to Super Admin
      </button>
    </div>
  );
}

function OrgAdminHome({ t }) {
  const orgName = 'IIM Bengaluru';
  const todayActions = [
    { label: 'Approvals due', count: 6, tone: 'warn', icon: BadgeCheck },
    { label: 'Low-credit alerts', count: 3, tone: 'bad', icon: Wallet },
    { label: 'Inactive cohorts', count: 2, tone: 'warn', icon: AlertCircle },
    { label: 'No-show flags', count: 4, tone: 'bad', icon: AlertTriangle },
  ];
  const orgProgrammes = PROGRAMMES.slice(0, 5);
  // Wired to canonical WEEKLY_OPS_PULSE per "Use on Super Admin / Org Admin overview" spec
  const opsScheduled = WEEKLY_OPS_PULSE.map((w) => w.scheduled);
  const opsCompleted = WEEKLY_OPS_PULSE.map((w) => w.completed);
  const opsLabels = WEEKLY_OPS_PULSE.map((w) => w.week);
  const overallCompletion = Math.round((WEEKLY_OPS_PULSE.reduce((a, w) => a + w.completed, 0) / WEEKLY_OPS_PULSE.reduce((a, w) => a + w.scheduled, 0)) * 1000) / 10;
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Top KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        {[
          { label: 'Session completion', value: overallCompletion + '%', tone: 'good' },
          { label: 'Credits left', value: '12.4k', tone: 'neutral' },
          { label: 'Active mentees', value: '320', tone: 'neutral' },
          { label: 'Mentor response', value: '14m', tone: 'good' },
          { label: 'Open tickets', value: '3', tone: 'warn' },
          { label: 'Renewal in', value: '47d', tone: 'good' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>

      {/* 2. Weekly sessions: scheduled vs completed — canonical sample chart per spec */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Weekly sessions: scheduled vs completed</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{opsLabels[0]}–{opsLabels[opsLabels.length - 1]} · {orgName} cohort sample</div>
          </div>
          <StatusPill t={t} tone="good">Completion {overallCompletion}%</StatusPill>
        </div>
        <LineChart
          series={[
            { data: opsScheduled, color: t.blue },
            { data: opsCompleted, color: t.accent },
          ]}
          seriesNames={['Scheduled Sessions', 'Completed Sessions']}
          summary={[
            { label: 'Total scheduled', value: WEEKLY_OPS_PULSE.reduce((a, w) => a + w.scheduled, 0).toLocaleString() },
            { label: 'Total completed', value: WEEKLY_OPS_PULSE.reduce((a, w) => a + w.completed, 0).toLocaleString() },
            { label: 'Last week', value: opsCompleted[opsCompleted.length - 1] + ' / ' + opsScheduled[opsScheduled.length - 1] },
          ]}
          labels={opsLabels} t={t} height={200}
        />
      </div>

      {/* 3. Today / this week actions — puts daily work first */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Today / this week</div>
          <span style={{ fontSize: 11, color: t.textMuted }}>Resolve these before anything else</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
          {todayActions.map((a) => {
            const Ic = a.icon;
            const tone = a.tone === 'bad' ? t.red : a.tone === 'warn' ? t.yellow : t.accent;
            return (
              <div key={a.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, background: t.bgCardElev, border: '1px solid ' + tone + '44', borderRadius: 10, cursor: 'pointer' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: tone + '22', color: tone, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={16} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{a.label}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Tap to action</div>
                </div>
                <span className="mu-display" style={{ fontSize: 24, color: tone }}>{a.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Programme pulse */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Programme pulse</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
          {orgProgrammes.map((p) => (
            <div key={p.id} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</div>
                <StatusPill t={t} tone={p.status === 'Active' ? 'good' : 'warn'}>{p.status}</StatusPill>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>{p.cohorts} cohorts · {p.mentees} mentees</div>
              <ProgressBar value={p.completion} t={t} color={p.completion > 75 ? t.green : p.completion > 50 ? t.yellow : t.red} />
            </div>
          ))}
        </div>
      </div>

      {/* 4. Credits + budget row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Wallet & consumption</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Org wallet balance</div>
              <div className="mu-display" style={{ fontSize: 28, color: t.text }}>12,420</div>
            </div>
            <div>
              <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Burned this month</div>
              <div className="mu-display" style={{ fontSize: 28, color: t.orange }}>3,820</div>
            </div>
          </div>
          <LineChart
            series={[{ data: opsScheduled, color: t.accent }]}
            seriesNames={['Credits burned']}
            summary={[
              { label: 'Avg / week', value: '780' },
              { label: 'Days remaining', value: '47' },
            ]}
            labels={opsLabels} t={t} height={140}
          />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Allocation queue</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {['Cohort Alpha · 240 mentees','Leadership Sprint · top-up','Mentee Ira P. · individual top-up','Cohort Sigma · backfill'].map((q, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                <Wallet size={14} color={t.accent} />
                <div style={{ flex: 1, fontSize: 12, color: t.text }}>{q}</div>
                <button style={{ padding: '4px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Allocate</button>
              </div>
            ))}
            <div style={{ marginTop: 6 }}>
              <RequestCTA label="Top-up from Super Admin" t={t} />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Support + comms row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Tickets in your scope</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr><th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>ID</th><th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Title</th><th style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Owner</th><th style={{ textAlign: 'right', fontSize: 10, color: t.textMuted, padding: '6px 0', textTransform: 'uppercase' }}>Status</th></tr>
            </thead>
            <tbody>
              {TICKETS.slice(0, 5).map((tk) => (
                <tr key={tk.id} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                  <td style={{ padding: '10px 0', fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{tk.id}</td>
                  <td style={{ padding: '10px 0', fontSize: 12, color: t.text }}>{tk.title}</td>
                  <td style={{ padding: '10px 0', fontSize: 11, color: t.textMuted }}>{tk.owner}</td>
                  <td style={{ padding: '10px 0', textAlign: 'right' }}><StatusPill t={t} tone={tk.sla === 'Breached' ? 'bad' : 'good'}>{tk.status}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Comms last 7d</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Reminder open rate', value: 78, color: t.green },
              { label: 'Renewal nudge clicks', value: 42, color: t.yellow },
              { label: 'Mentor low-availability ping', value: 56, color: t.accent },
              { label: 'Bot deflection rate', value: 84, color: t.blue },
            ].map((m) => (
              <div key={m.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                  <span>{m.label}</span><span style={{ fontFamily: FONT_MONO, color: t.text }}>{m.value}%</span>
                </div>
                <ProgressBar value={m.value} color={m.color} t={t} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ORG ADMIN — secondary pages and right-rail action panel.
   The Institution Health page (OrgAdminHome) already exists above; everything
   below covers the remaining 29 tabs in ORG_ADMIN_IA so nothing in the spec
   is missing.
   ============================================================================ */

function OrgAdminActionPanel({ t }) {
  // Right column: Action Center + Revenue & Renewals + Support Tickets + Access Controls (per mockup)
  const subAdmins = [
    { name: 'Mukesh Verma', role: 'Sub-admin', scope: 'Cohort Alpha' },
    { name: 'Rachida Sanghi', role: 'Accessor', scope: 'Read-only' },
    { name: 'Priya Nair', role: 'Sub-admin', scope: 'Leadership Sprint' },
  ];
  return (
    <div style={{ width: 300, flexShrink: 0, padding: '18px 18px 18px 0', display: 'flex', flexDirection: 'column', gap: 12, overflowY: 'auto' }} className="mu-scroll">
      {/* Action Center */}
      <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 14, padding: 16 }}>
        <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Action Center</div>
        {[
          { label: 'Invite Mentees', icon: UserPlus },
          { label: 'Assign Credits', icon: Wallet },
          { label: 'Create Program', icon: Plus },
          { label: 'Export Org Report', icon: Download },
        ].map((a, i) => {
          const Ic = a.icon;
          return (
            <button key={i} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px',
              background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 8,
              color: t.text, fontSize: 12, cursor: 'pointer', fontFamily: FONT_BODY, marginTop: i ? 6 : 0,
              fontWeight: 500,
            }}>
              <Ic size={13} color={t.accent} />
              <span>+ {a.label}</span>
            </button>
          );
        })}
      </div>

      {/* Revenue & Renewals */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Wallet size={14} color={t.accent} />
          <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Revenue & Renewals</span>
        </div>
        <div style={{ background: t.bgCardElev, padding: 10, borderRadius: 8, marginBottom: 8 }}>
          <div className="mu-display" style={{ fontSize: 22, color: t.text }}>345 <span style={{ fontSize: 11, color: t.textMuted, fontStyle: 'normal' }}>Remaining</span></div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 11 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: t.textMuted }}>Wallet Burn</span>
            <span style={{ color: t.text, fontFamily: FONT_MONO }}>1.2k / day</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: t.textMuted }}>IIM Bengaluru</span>
            <span style={{ color: t.green, fontFamily: FONT_MONO }}>Renewed in 25d</span>
          </div>
        </div>
      </div>

      {/* Support Tickets */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <ShieldAlert size={14} color={t.red} />
          <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Support Tickets</span>
          <div style={{ flex: 1 }} />
          <StatusPill t={t} tone="bad">Open · 2</StatusPill>
        </div>
        {[
          { who: 'Lavanya B', issue: 'Refund request', tag: 'Sla 16h', tone: 'warn' },
          { who: 'Aakash R', issue: 'Feedback flag', tag: 'Sla 81h', tone: 'good' },
        ].map((tk, i) => (
          <div key={i} style={{ background: t.bgCardElev, padding: 10, borderRadius: 8, marginTop: i ? 6 : 0 }}>
            <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{tk.who}</div>
            <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{tk.issue}</div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 4 }}>
              <span style={{ fontSize: 9, color: tk.tone === 'warn' ? t.yellow : t.green, fontFamily: FONT_MONO }}>{tk.tag}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Access Controls */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Users size={14} color={t.blue} />
          <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Access Controls</span>
        </div>
        {subAdmins.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
            <Avatar name={s.name} t={t} size={26} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{s.name}</div>
              <div style={{ fontSize: 9, color: t.textDim }}>{s.scope}</div>
            </div>
            <span style={{ fontSize: 10, color: t.accent, fontFamily: FONT_MONO }}>{s.role}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgAdminProgrammePulsePage({ t }) {
  const orgProgs = PROGRAMMES.slice(0, 6);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active programmes', value: '6', tone: 'good' },
          { label: 'Active cohorts', value: '14', tone: 'good' },
          { label: 'Avg completion', value: '78%', tone: 'good' },
          { label: 'At-risk cohorts', value: '2', tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Programme health</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 10 }}>
          {orgProgs.map((p) => (
            <div key={p.id} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</div>
                <StatusPill t={t} tone={p.status === 'Active' ? 'good' : 'warn'}>{p.status}</StatusPill>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>{p.cohorts} cohorts · {p.mentees} mentees</div>
              <ProgressBar value={p.completion} t={t} color={p.completion > 75 ? t.green : p.completion > 50 ? t.yellow : t.red} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>
                <span>{p.completion}% complete</span>
                <span>started {p.startDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Cohort progress</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Cohort','Programme','Mentees','Completion','Status'].map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '8px 0', textTransform: 'uppercase' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {orgProgs.map((p) => (
              <tr key={p.id} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '12px 0', fontSize: 12, color: t.text, fontWeight: 500 }}>Cohort {p.id.slice(-1).toUpperCase()}</td>
                <td style={{ padding: '12px 0', fontSize: 12, color: t.textMuted }}>{p.name}</td>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{p.mentees}</td>
                <td style={{ padding: '12px 0', minWidth: 160 }}><ProgressBar value={p.completion} t={t} color={p.completion > 75 ? t.green : t.yellow} /></td>
                <td style={{ padding: '12px 0' }}><StatusPill t={t} tone={p.status === 'Active' ? 'good' : 'warn'}>{p.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgAdminMentorCapacityPage({ t }) {
  // Wired to canonical MENTOR_SUPPLY_BY_DOMAIN sample dataset
  const orgMentors = MENTORS.slice(0, 8);
  const totalActive = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.activeMentors, 0);
  const totalOpen = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.openSlots, 0);
  const totalBooked = MENTOR_SUPPLY_BY_DOMAIN.reduce((a, d) => a + d.bookedSessions, 0);
  const overallFillRate = Math.round((totalBooked / (totalBooked + totalOpen)) * 100);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active mentors', value: String(totalActive), tone: 'good' },
          { label: 'Open slots', value: totalOpen.toLocaleString(), tone: 'neutral' },
          { label: 'Booked sessions', value: totalBooked.toLocaleString(), tone: 'good' },
          { label: 'Slot fill rate', value: overallFillRate + '%', tone: overallFillRate > 50 ? 'good' : 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        {/* Domain supply vs demand — clustered bar per Visual Library + Sample Visuals spec */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Mentor supply vs demand by domain</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Active mentors · open slots · booked sessions</div>
            </div>
          </div>
          <ClusteredBar
            t={t}
            height={280}
            data={MENTOR_SUPPLY_BY_DOMAIN.map((d) => ({ label: d.domain, active: d.activeMentors, open: d.openSlots, booked: d.bookedSessions }))}
            series={[
              { key: 'active', label: 'Active mentors',  color: t.blue },
              { key: 'open',   label: 'Open slots',      color: t.red  },
              { key: 'booked', label: 'Booked sessions', color: t.green },
            ]}
            yLabel="Count"
            xLabel="Domain"
          />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Response speed</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {orgMentors.slice(0, 6).map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                <Avatar name={m.name} t={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>Last active {m.lastSession}</div>
                </div>
                <StatusPill t={t} tone={m.responsiveness === 'Fast' ? 'good' : m.responsiveness === 'Steady' ? 'info' : 'warn'}>{m.responsiveness}</StatusPill>
                <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, minWidth: 30, textAlign: 'right' }}>~{m.responseHrs}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgAdminRevenueRenewalsPage({ t }) {
  const burnTrend = [42, 48, 55, 51, 64, 70, 68, 76, 82, 90, 88, 96];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Wallet balance', value: '12.4k', tone: 'good' },
          { label: 'Burn (30d)', value: '3.8k', tone: 'neutral' },
          { label: 'Renewal in', value: '47d', tone: 'good' },
          { label: 'Add-on exposure', value: '₹84k', tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Wallet burn trend</div>
        <LineChart series={[{ data: burnTrend, color: t.accent }]} seriesNames={['Credits burned']} summary={[{ label: 'Avg / week', value: '780' },{ label: 'Days remaining', value: '47' }]} labels={months} t={t} height={180} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Renewal calendar</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['Plan / Add-on','Effective','Expires','Auto-renew','Status'].map((h) => <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '8px 0', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              { plan: 'Enterprise plan', from: 'Jan 1, 2026', to: 'Dec 31, 2026', auto: true, status: 'Active' },
              { plan: 'Premium mentor pool', from: 'Mar 1, 2026', to: 'Aug 31, 2026', auto: false, status: 'Expiring' },
              { plan: 'Credit pack — 5k', from: 'Apr 14, 2026', to: 'Jul 14, 2026', auto: false, status: 'Active' },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '12px 0', fontSize: 13, color: t.text, fontWeight: 500 }}>{r.plan}</td>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{r.from}</td>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{r.to}</td>
                <td style={{ padding: '12px 0', fontSize: 11, color: r.auto ? t.green : t.textMuted }}>{r.auto ? '✓ On' : 'Off'}</td>
                <td style={{ padding: '12px 0' }}><StatusPill t={t} tone={r.status === 'Active' ? 'good' : 'warn'}>{r.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Generic table page for OA — picks data + columns based on dataKey
function OrgAdminTablePage({ t, dataKey, openDrillFor }) {
  const dataMap = {
    programmes: { rows: PROGRAMMES, kpis: [{ label: 'Programmes', value: String(PROGRAMMES.length), tone: 'good' },{ label: 'Active', value: String(PROGRAMMES.filter((p) => p.status === 'Active').length), tone: 'good' },{ label: 'Drafts', value: '2', tone: 'warn' },{ label: 'Avg completion', value: '78%', tone: 'good' }],
      cols: [{ k: 'name', l: 'Programme' },{ k: 'cohorts', l: 'Cohorts', mono: true },{ k: 'mentees', l: 'Mentees', mono: true },{ k: 'completion', l: 'Completion', kind: 'bar' },{ k: 'status', l: 'Status', kind: 'pill' }] },
    cohorts: { rows: PROGRAMMES.slice(0, 8).map((p, i) => ({ id: 'co_'+i, cohort: 'Cohort '+String.fromCharCode(65+i), programme: p.name, learners: 20+Math.floor(Math.random()*80), completion: p.completion, status: i%4===3?'Paused':'Active' })),
      kpis: [{ label: 'Active cohorts', value: '14', tone: 'good' },{ label: 'Avg learners', value: '52', tone: 'neutral' },{ label: 'At-risk', value: '2', tone: 'warn' },{ label: 'Avg completion', value: '78%', tone: 'good' }],
      cols: [{ k: 'cohort', l: 'Cohort' },{ k: 'programme', l: 'Programme' },{ k: 'learners', l: 'Learners', mono: true },{ k: 'completion', l: 'Completion', kind: 'bar' },{ k: 'status', l: 'Status', kind: 'pill' }] },
    agendas: { rows: PROGRAMMES.slice(0, 6).map((p, i) => ({ id: 'ag_'+i, name: p.name+' — Module '+(i+1), sessions: 4+Math.floor(Math.random()*8), assigned: 1+Math.floor(Math.random()*5), status: i%3?'Published':'Draft' })),
      kpis: [{ label: 'Templates', value: '12', tone: 'neutral' },{ label: 'Assigned', value: '34', tone: 'good' },{ label: 'Drafts', value: '4', tone: 'warn' },{ label: 'Avg sessions', value: '6', tone: 'neutral' }],
      cols: [{ k: 'name', l: 'Agenda template' },{ k: 'sessions', l: 'Sessions', mono: true },{ k: 'assigned', l: 'Assigned to', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    session_pricing: { rows: [{ id: 'sp1', tier: 'Basic', credits: 1, cap: 'No cap', mentees: 'All' },{ id: 'sp2', tier: 'Good', credits: 2, cap: '4 / mentee / mo', mentees: 'Cohort Alpha+' },{ id: 'sp3', tier: 'Excellent', credits: 3, cap: '2 / mentee / mo', mentees: 'Premium pool' }],
      kpis: [{ label: 'Tiers', value: '3', tone: 'neutral' },{ label: 'Avg credits / session', value: '2.0', tone: 'neutral' },{ label: 'Caps active', value: '2', tone: 'warn' },{ label: 'Last edit', value: '4d ago', tone: 'neutral' }],
      cols: [{ k: 'tier', l: 'Tier', kind: 'pill' },{ k: 'credits', l: 'Credits / session', mono: true },{ k: 'cap', l: 'Cap' },{ k: 'mentees', l: 'Eligible' }] },
    mentees: { rows: MENTEES.slice(0, 12), kpis: [{ label: 'Active mentees', value: '329', tone: 'good' },{ label: 'Inactive 30d', value: '24', tone: 'warn' },{ label: 'Low credit', value: '14', tone: 'warn' },{ label: 'New this month', value: '38', tone: 'good' }],
      cols: [{ k: 'name', l: 'Mentee' },{ k: 'org', l: 'Org' },{ k: 'sessionsCompleted', l: 'Completed', mono: true },{ k: 'creditsRemaining', l: 'Credits left', mono: true },{ k: 'feedback', l: 'Avg ★', mono: true }] },
    sub_admins: { rows: [{ id: 'sa1', name: 'Mukesh Verma', scope: 'Cohort Alpha', users: 84, lastActive: '2h ago' },{ id: 'sa2', name: 'Rachida Sanghi', scope: 'Read-only', users: 0, lastActive: '1d ago' },{ id: 'sa3', name: 'Priya Nair', scope: 'Leadership Sprint', users: 62, lastActive: '4h ago' },{ id: 'sa4', name: 'Vivek Patel', scope: 'Data Science', users: 45, lastActive: '12h ago' }],
      kpis: [{ label: 'Sub-admins', value: '4', tone: 'good' },{ label: 'Active', value: '4', tone: 'good' },{ label: 'Pending invites', value: '1', tone: 'warn' },{ label: 'Avg scope', value: '48 users', tone: 'neutral' }],
      cols: [{ k: 'name', l: 'Sub-admin' },{ k: 'scope', l: 'Scope' },{ k: 'users', l: 'Users in scope', mono: true },{ k: 'lastActive', l: 'Last active', mono: true }] },
    access: { rows: [{ id: 'ac1', who: 'Vivek Patel', requested: 'Allocate credits to mentees', status: 'Pending', when: '2h ago' },{ id: 'ac2', who: 'Priya Nair', requested: 'Edit programme pricing', status: 'Approved', when: '1d ago' },{ id: 'ac3', who: 'Mukesh Verma', requested: 'View payout impact', status: 'Pending', when: '3h ago' }],
      kpis: [{ label: 'Pending', value: '2', tone: 'warn' },{ label: 'Approved (30d)', value: '14', tone: 'good' },{ label: 'Revoked', value: '1', tone: 'neutral' },{ label: 'Avg decision', value: '4h', tone: 'good' }],
      cols: [{ k: 'who', l: 'Requester' },{ k: 'requested', l: 'Asked for' },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    assigned_mentors: { rows: MENTORS.slice(0, 12), kpis: [{ label: 'Mentors', value: '34', tone: 'good' },{ label: 'Active 7d', value: '28', tone: 'good' },{ label: 'Quick responders', value: '12', tone: 'good' },{ label: 'At risk', value: '3', tone: 'warn' }],
      cols: [{ k: 'name', l: 'Mentor' },{ k: 'tier', l: 'Quality band', kind: 'pill' },{ k: 'responsiveness', l: 'Responds', kind: 'response' },{ k: 'availability', l: 'Avail %', mono: true },{ k: 'lastSession', l: 'Last active', mono: true }] },
    mentor_performance: { rows: MENTORS.slice(0, 10), kpis: [{ label: 'Avg completion', value: '92%', tone: 'good' },{ label: 'Avg ★', value: '4.7', tone: 'good' },{ label: 'No-show rate', value: '4.2%', tone: 'good' },{ label: 'Repeat bookings', value: '48%', tone: 'good' }],
      cols: [{ k: 'name', l: 'Mentor' },{ k: 'sessions', l: 'Sessions', mono: true },{ k: 'rating', l: 'Rating', kind: 'rating' },{ k: 'noShow', l: 'No-shows', mono: true },{ k: 'mis', l: 'MIS', kind: 'mis' }] },
    mentor_availability: { rows: MENTORS.slice(0, 10).map((m) => ({ ...m, openSlots: Math.floor(Math.random()*12), nextSlot: ['Today 4pm','Tomorrow 10am','Wed 2pm','Fri 6pm'][Math.floor(Math.random()*4)], coverage: 60 + Math.floor(Math.random()*40) })),
      kpis: [{ label: 'Open slots / week', value: '64', tone: 'good' },{ label: 'Coverage avg', value: '82%', tone: 'good' },{ label: 'At-risk windows', value: '3', tone: 'warn' },{ label: 'Next 24h slots', value: '18', tone: 'good' }],
      cols: [{ k: 'name', l: 'Mentor' },{ k: 'openSlots', l: 'Open slots', mono: true },{ k: 'nextSlot', l: 'Next available', mono: true },{ k: 'coverage', l: 'Coverage', kind: 'bar' }] },
    allocations: { rows: [{ id: 'al1', target: 'Cohort Alpha', credits: 1200, by: 'Anita S', when: '2h ago', status: 'Done' },{ id: 'al2', target: 'Leadership Sprint', credits: 800, by: 'Anita S', when: '1d ago', status: 'Done' },{ id: 'al3', target: 'Mentee bulk upload', credits: 240, by: 'Mukesh V', when: '3h ago', status: 'Processing' },{ id: 'al4', target: 'Data Science Cohort', credits: 600, by: 'Anita S', when: '5d ago', status: 'Done' }],
      kpis: [{ label: 'This month', value: '12.4k', tone: 'good' },{ label: 'Bulk uploads', value: '3', tone: 'neutral' },{ label: 'Reverses', value: '1', tone: 'warn' },{ label: 'Pending', value: '1', tone: 'warn' }],
      cols: [{ k: 'target', l: 'Target' },{ k: 'credits', l: 'Credits', mono: true },{ k: 'by', l: 'By' },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    renewals: { rows: [{ id: 'rn1', item: 'Enterprise plan', step: 'Quote sent', invoice: 'INV-2401', due: '47d', status: 'In progress' },{ id: 'rn2', item: 'Premium mentor pool', step: 'Pending approval', invoice: 'INV-2402', due: '12d', status: 'Action needed' },{ id: 'rn3', item: 'Credit top-up', step: 'Paid', invoice: 'INV-2399', due: '—', status: 'Done' }],
      kpis: [{ label: 'Action needed', value: '1', tone: 'warn' },{ label: 'In progress', value: '1', tone: 'neutral' },{ label: 'Closed (qtr)', value: '4', tone: 'good' },{ label: 'Next renewal', value: '12d', tone: 'warn' }],
      cols: [{ k: 'item', l: 'Item' },{ k: 'step', l: 'Step' },{ k: 'invoice', l: 'Invoice', mono: true },{ k: 'due', l: 'Due', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    programme_reports: { rows: PROGRAMMES.slice(0, 8).map((p) => ({ id: p.id, name: p.name, complete: p.completion, mentees: p.mentees, sat: (4 + Math.random()).toFixed(1), trend: Math.random() > 0.5 ? '↑' : '↓' })),
      kpis: [{ label: 'Reports', value: '8', tone: 'neutral' },{ label: 'Saved', value: '5', tone: 'good' },{ label: 'Last export', value: '2d ago', tone: 'neutral' },{ label: 'Recipients', value: '12', tone: 'neutral' }],
      cols: [{ k: 'name', l: 'Programme' },{ k: 'complete', l: 'Completion', kind: 'bar' },{ k: 'mentees', l: 'Mentees', mono: true },{ k: 'sat', l: 'Satisfaction', mono: true },{ k: 'trend', l: 'Trend' }] },
    mentor_reports: { rows: MENTORS.slice(0, 10), kpis: [{ label: 'Mentors tracked', value: '34', tone: 'neutral' },{ label: 'Top quartile', value: '8', tone: 'good' },{ label: 'Bottom quartile', value: '6', tone: 'warn' },{ label: 'Avg ★', value: '4.7', tone: 'good' }],
      cols: [{ k: 'name', l: 'Mentor' },{ k: 'mis', l: 'MIS', kind: 'mis' },{ k: 'rating', l: 'Rating', kind: 'rating' },{ k: 'sessions', l: 'Sessions', mono: true },{ k: 'responsiveness', l: 'Responds', kind: 'response' }] },
    mentee_reports: { rows: MENTEES.slice(0, 12), kpis: [{ label: 'Mentees tracked', value: '329', tone: 'neutral' },{ label: 'Avg progress', value: '64%', tone: 'good' },{ label: 'Inactive 30d', value: '24', tone: 'warn' },{ label: 'Breakthroughs', value: '47', tone: 'good' }],
      cols: [{ k: 'name', l: 'Mentee' },{ k: 'sessionsCompleted', l: 'Sessions', mono: true },{ k: 'progress', l: 'Progress', kind: 'bar' },{ k: 'feedback', l: 'Avg ★', mono: true }] },
    tickets: { rows: TICKETS.slice(0, 10), kpis: [{ label: 'Open', value: '2', tone: 'warn' },{ label: 'On track', value: '5', tone: 'good' },{ label: 'At risk', value: '1', tone: 'warn' },{ label: 'Resolved 7d', value: '14', tone: 'good' }],
      cols: [{ k: 'id', l: 'ID', mono: true },{ k: 'title', l: 'Title' },{ k: 'owner', l: 'Owner' },{ k: 'priority', l: 'Priority', kind: 'pill' },{ k: 'status', l: 'Status', kind: 'pill' }] },
    escalations: { rows: TICKETS.slice(0, 4).map((tk) => ({ ...tk, escalatedTo: 'Super Admin', escalatedWhen: ['12m ago','2h ago','1d ago','3d ago'][Math.floor(Math.random()*4)] })),
      kpis: [{ label: 'Open escalations', value: '2', tone: 'warn' },{ label: 'Resolved (qtr)', value: '6', tone: 'good' },{ label: 'Avg time to resolve', value: '18h', tone: 'neutral' },{ label: 'Abuse flags', value: '0', tone: 'good' }],
      cols: [{ k: 'id', l: 'ID', mono: true },{ k: 'title', l: 'Issue' },{ k: 'escalatedTo', l: 'Escalated to' },{ k: 'escalatedWhen', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    chatbot_intents: { rows: [{ id: 'ci1', intent: 'How do I book a session?', count: 142, resolved: 138, unresolved: 4 },{ id: 'ci2', intent: 'Where are my credits?', count: 98, resolved: 96, unresolved: 2 },{ id: 'ci3', intent: 'Refund question', count: 24, resolved: 18, unresolved: 6 },{ id: 'ci4', intent: 'Mentor not responding', count: 12, resolved: 8, unresolved: 4 }],
      kpis: [{ label: 'Intents tracked', value: '24', tone: 'neutral' },{ label: 'Bot deflection', value: '84%', tone: 'good' },{ label: 'Unresolved', value: '16', tone: 'warn' },{ label: 'Top miss', value: 'Refund', tone: 'warn' }],
      cols: [{ k: 'intent', l: 'Intent' },{ k: 'count', l: 'Volume', mono: true },{ k: 'resolved', l: 'Resolved', mono: true },{ k: 'unresolved', l: 'Unresolved', mono: true }] },
    notifications: { rows: [{ id: 'n1', channel: 'Email', who: 'All admins', event: 'New refund request', enabled: true },{ id: 'n2', channel: 'WhatsApp', who: 'Sub-admins', event: 'Cohort no-show', enabled: true },{ id: 'n3', channel: 'In-app', who: 'Org Admin', event: 'Renewal due in 30d', enabled: true },{ id: 'n4', channel: 'Email', who: 'Org Admin', event: 'Mentor flag raised', enabled: false }],
      kpis: [{ label: 'Active rules', value: '14', tone: 'good' },{ label: 'Disabled', value: '3', tone: 'neutral' },{ label: 'Channels', value: '3', tone: 'neutral' },{ label: 'Last edit', value: '2d ago', tone: 'neutral' }],
      cols: [{ k: 'event', l: 'Event' },{ k: 'channel', l: 'Channel', kind: 'pill' },{ k: 'who', l: 'Recipients' },{ k: 'enabled', l: 'On / Off', kind: 'toggle' }] },
  };
  const conf = dataMap[dataKey];
  if (!conf) return <div style={{ color: t.textMuted }}>No data for {dataKey}</div>;

  const renderCell = (row, col) => {
    const v = row[col.k];
    if (col.kind === 'pill') {
      const tone = String(v).match(/Active|Done|Approved|Published|Resolved/i) ? 'good' : String(v).match(/Pending|Action needed|Processing|At risk|In progress|Draft|Expiring/i) ? 'warn' : String(v).match(/Excellent|Good|Basic/) ? (v === 'Excellent' ? 'purple' : v === 'Good' ? 'good' : 'neutral') : 'neutral';
      return <StatusPill t={t} tone={tone}>{v}</StatusPill>;
    }
    if (col.kind === 'bar') return <div style={{ minWidth: 140 }}><ProgressBar value={Number(v)} t={t} color={v > 75 ? t.green : v > 50 ? t.yellow : t.red} /></div>;
    if (col.kind === 'rating') return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}><span style={{ color: t.yellow }}>★</span> {v}</span>;
    if (col.kind === 'mis') return <MIScore score={v} t={t} />;
    if (col.kind === 'response') {
      const tone = v === 'Fast' ? 'good' : v === 'Steady' ? 'info' : v === 'Within 1d' ? 'warn' : 'bad';
      return <StatusPill t={t} tone={tone}>{v}</StatusPill>;
    }
    if (col.kind === 'toggle') return v ? <ToggleRight size={20} color={t.accent} /> : <ToggleLeft size={20} color={t.textDim} />;
    if (col.mono) return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{v}</span>;
    return <span style={{ fontSize: 12, color: t.text }}>{v}</span>;
  };

  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {conf.kpis.map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.bgCardElev }}>
              {conf.cols.map((c) => (
                <th key={c.k} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '12px 14px', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{c.l}</th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {conf.rows.map((row) => (
              <tr key={row.id} onClick={() => openDrillFor && openDrillFor(row)} style={{ borderTop: '1px solid ' + t.borderSoft, cursor: openDrillFor ? 'pointer' : 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                {conf.cols.map((c) => (
                  <td key={c.k} style={{ padding: '12px 14px' }}>{renderCell(row, c)}</td>
                ))}
                <td style={{ padding: '12px 14px', textAlign: 'right' }}><ChevronRight size={14} color={t.textDim} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OrgAdminPipelinePage({ t }) {
  // Mentor requests pipeline: Submitted → Under review → Approved / Rejected
  const stages = [
    { name: 'Submitted', tone: 'neutral', items: [{ who: 'Cohort Alpha', need: 'Senior PM mentor', when: '2h ago' },{ who: 'Cohort Sigma', need: 'System design expert', when: '1d ago' }] },
    { name: 'Under review', tone: 'warn', items: [{ who: 'Leadership Sprint', need: 'CXO mentor (premium pool)', when: '3d ago' }] },
    { name: 'Approved', tone: 'good', items: [{ who: 'Data Science Cohort', need: 'ML mentor mapped', when: '4d ago' }] },
    { name: 'Rejected', tone: 'bad', items: [] },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Open requests', value: '3', tone: 'warn' },
          { label: 'Approved (30d)', value: '8', tone: 'good' },
          { label: 'Avg time to map', value: '6d', tone: 'neutral' },
          { label: 'Rejected', value: '1', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {stages.map((s) => (
          <div key={s.name} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14, minHeight: 280 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{s.name}</span>
              <StatusPill t={t} tone={s.tone}>{s.items.length}</StatusPill>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {s.items.map((it, i) => (
                <div key={i} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{it.who}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{it.need}</div>
                  <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, marginTop: 6 }}>{it.when}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgAdminWalletPage({ t }) {
  const burnTrend = [42, 48, 55, 51, 64, 70, 68, 76, 82, 90, 88, 96];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Wallet balance', value: '12.4k', tone: 'good' },
          { label: 'Reserved', value: '1.8k', tone: 'neutral' },
          { label: 'Available', value: '10.6k', tone: 'good' },
          { label: 'Expires in', value: '47d', tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      {/* Credit allocation by org — canonical sample chart per "Use on SA credits / OA wallet pages" spec */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Credit allocation by org</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Allocated · consumed · remaining — peer benchmark across {CREDIT_ALLOC_SNAPSHOT.length} orgs</div>
          </div>
          <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>units = credits</span>
        </div>
        <ClusteredBar
          t={t}
          height={280}
          data={CREDIT_ALLOC_SNAPSHOT.map((o) => ({ label: o.org, allocated: o.allocated, consumed: o.consumed, remaining: o.remaining }))}
          series={[
            { key: 'allocated', label: 'Allocated credits', color: t.blue },
            { key: 'consumed',  label: 'Consumed credits',  color: t.red },
            { key: 'remaining', label: 'Remaining credits', color: t.green },
          ]}
          yLabel="Credits"
          xLabel="Organisation"
        />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Burn trend</div>
          <LineChart series={[{ data: burnTrend, color: t.accent }]} seriesNames={['Credits burned']} summary={[{ label: 'Avg / week', value: '780' },{ label: 'Days remaining', value: '47' }]} labels={months} t={t} height={200} />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Programme ledgers</div>
          {[
            { name: 'Cohort Alpha', balance: 4200, total: 6000, color: t.accent },
            { name: 'Leadership Sprint', balance: 2800, total: 4000, color: t.blue },
            { name: 'Data Science', balance: 1600, total: 3000, color: t.purple },
            { name: 'Unallocated', balance: 3800, total: null, color: t.green },
          ].map((p, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                <span>{p.name}</span>
                <span style={{ fontFamily: FONT_MONO, color: t.text }}>{p.balance.toLocaleString()}{p.total ? ' / ' + p.total.toLocaleString() : ''}</span>
              </div>
              <ProgressBar value={p.total ? (p.balance / p.total) * 100 : 100} color={p.color} t={t} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgAdminGuardrailsPage({ t }) {
  const [thresholds, setThresholds] = useState({ daily: 200, weekly: 1200, perMentee: 30 });
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Active guardrails', value: '5', tone: 'good' },
          { label: 'Triggered 30d', value: '12', tone: 'warn' },
          { label: 'Most-hit', value: 'Daily cap', tone: 'warn' },
          { label: 'Locked (global)', value: '3', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Spend thresholds (within scope)</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, padding: '3px 8px', background: t.bgInput, borderRadius: 4 }}>Editable in scope</span>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[
            { key: 'daily', label: 'Daily org cap', max: 500, unit: 'credits' },
            { key: 'weekly', label: 'Weekly org cap', max: 5000, unit: 'credits' },
            { key: 'perMentee', label: 'Per-mentee monthly cap', max: 100, unit: 'credits' },
          ].map((g) => (
            <div key={g.key} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>{g.label}</div>
              <div className="mu-display" style={{ fontSize: 28, color: t.text }}>{thresholds[g.key]}</div>
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>of {g.max} {g.unit} max allowed</div>
              <input type="range" min="0" max={g.max} value={thresholds[g.key]} onChange={(e) => setThresholds({ ...thresholds, [g.key]: Number(e.target.value) })}
                style={{ width: '100%', marginTop: 10, accentColor: t.accent }} />
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Recent overuse alerts</div>
        {[
          { who: 'Cohort Alpha', what: 'Daily cap breached', when: '2d ago', tone: 'warn' },
          { who: 'Leadership Sprint', what: 'Per-mentee cap warning', when: '5d ago', tone: 'warn' },
          { who: 'Data Science', what: 'Weekly cap on track', when: '1d ago', tone: 'good' },
        ].map((a, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
            <AlertCircle size={14} color={a.tone === 'warn' ? t.yellow : t.green} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{a.who}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{a.what}</div>
            </div>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{a.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgAdminReportsGridPage({ t }) {
  const reports = [
    { name: 'Quarterly board pack', last: '5d ago', exports: 4 },
    { name: 'Programme completion summary', last: '1d ago', exports: 12 },
    { name: 'Mentor performance leaderboard', last: '3d ago', exports: 8 },
    { name: 'Mentee outcome digest', last: '1w ago', exports: 6 },
    { name: 'Credits burn vs budget', last: '12h ago', exports: 14 },
    { name: 'Renewal forecast', last: '2d ago', exports: 3 },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Saved reports', value: String(reports.length), tone: 'good' },
          { label: 'Exports (30d)', value: '47', tone: 'good' },
          { label: 'Scheduled', value: '3', tone: 'neutral' },
          { label: 'Recipients', value: '12', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {reports.map((r, i) => (
          <div key={i} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 16, cursor: 'pointer' }}>
            <FileBarChart size={20} color={t.accent} />
            <div style={{ fontSize: 14, color: t.text, fontWeight: 600, marginTop: 10 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 4 }}>Last run {r.last} · {r.exports} exports</div>
            <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
              <button style={{ flex: 1, padding: '6px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Export</button>
              <button style={{ padding: '6px 10px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Schedule</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrgAdminProfilePage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Organisation profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'flex-start' }}>
          <div style={{ width: 100, height: 100, borderRadius: 16, background: 'linear-gradient(135deg, ' + t.accent + ' 0%, ' + t.blue + ' 100%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0a1f28', fontWeight: 700, fontSize: 36, fontFamily: FONT_DISPLAY }}>I</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Organisation name', 'IIM Bengaluru'],
              ['Public identifier', 'iim-bengaluru'],
              ['Industry', 'Education'],
              ['Country', 'India'],
              ['Time zone', 'Asia/Kolkata (IST)'],
              ['Primary contact', 'Anita Sharma · anita.s@iimb.ac.in'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</span>
                <input defaultValue={v} style={{ padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid ' + t.borderSoft, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <SmartButton label="Cancel" t={t} soft icon={X} />
          <SmartButton label="Save changes" t={t} primary icon={Check} />
        </div>
      </div>
    </div>
  );
}

function OrgAdminBrandingPage({ t }) {
  const [theme, setTh] = useState('teal');
  const swatches = [
    { key: 'teal', primary: '#4ec3a9', name: 'Teal (default)' },
    { key: 'blue', primary: '#3a8db8', name: 'Ocean blue' },
    { key: 'purple', primary: '#9b6dff', name: 'Lavender' },
    { key: 'amber', primary: '#e89456', name: 'Amber' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Theme & brand</div>
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Primary colour</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {swatches.map((s) => (
                <button key={s.key} onClick={() => setTh(s.key)} style={{
                  flex: 1, padding: 10, background: theme === s.key ? t.bgCardElev : t.bgCard,
                  border: '2px solid ' + (theme === s.key ? s.primary : t.borderSoft), borderRadius: 8, cursor: 'pointer',
                }}>
                  <div style={{ width: '100%', height: 24, background: s.primary, borderRadius: 4 }} />
                  <div style={{ fontSize: 10, color: t.text, marginTop: 6, fontFamily: FONT_MONO }}>{s.name}</div>
                </button>
              ))}
            </div>
          </div>
          {['Custom domain','Logo upload','Favicon','Email sender name','Footer text'].map((f) => (
            <div key={f} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{f}</div>
              <input style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} placeholder={f} />
            </div>
          ))}
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <SmartButton label="Save draft" t={t} soft icon={Edit3} />
            <SmartButton label="Publish branding" t={t} primary icon={Send} />
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Live preview</div>
            <StatusPill t={t} tone="info">Auto-updates</StatusPill>
          </div>
          <div style={{ background: '#0a1f28', borderRadius: 10, padding: 18, border: '1px solid ' + t.borderSoft }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: swatches.find((s) => s.key === theme).primary }} />
              <span style={{ color: '#f4ead7', fontFamily: FONT_DISPLAY, fontSize: 16 }}>IIM Bengaluru Mentorship</span>
            </div>
            <div style={{ background: '#163139', padding: 12, borderRadius: 8, marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: '#94a3a8', marginBottom: 4 }}>Welcome back, Aarav</div>
              <button style={{ padding: '6px 12px', background: swatches.find((s) => s.key === theme).primary, border: 'none', borderRadius: 6, color: '#0a1f28', fontWeight: 600, fontSize: 12 }}>Book a session</button>
            </div>
            <div style={{ fontSize: 9, color: '#94a3a8', textAlign: 'center', marginTop: 12 }}>Powered by MentorUnion · Custom theme</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgAdminPoliciesPage({ t }) {
  // Org Admin sees all platform policies but with lock badges on global ones
  const policies = [
    { id: 'p_refund', name: 'Refund Policy', scope: 'Global', editable: false, summary: 'Credits auto-refund within allowed window; cash refunds reviewed' },
    { id: 'p_noshow', name: 'No-show Policy', scope: 'Global', editable: false, summary: 'Distinct handling for mentee and mentor no-shows' },
    { id: 'p_cancel', name: 'Cancellation Policy', scope: 'Org-scoped', editable: true, summary: 'On-time window, partial or no-refund, late cancel flag' },
    { id: 'p_sla', name: 'Response SLA', scope: 'Global', editable: false, summary: 'Mentor profile shows usually responds in X hours/days' },
    { id: 'p_premium', name: 'Premium Mentor Access', scope: 'Global', editable: false, summary: 'Treat premium access as clear add-on' },
    { id: 'p_credreq', name: 'Credit Request Chain', scope: 'Org-scoped', editable: true, summary: 'Mentee → Org Admin → Super Admin' },
  ];
  const accessFor = (editable) => editable
    ? { label: 'Scoped', color: '#4ec3a9', text: '#0a1f28' }
    : { label: 'View', color: '#94a3a8', text: '#0a1f28' };
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.yellowSoft + '33', border: '1px dashed ' + t.yellow, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Info size={14} color={t.yellow} />
        <span style={{ fontSize: 12, color: t.text }}>Locked policies are owned by Super Admin. You can request changes but not edit them directly.</span>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        <div style={{ padding: 14, borderBottom: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Policies in your scope</div>
          <span style={{ fontSize: 11, color: t.textMuted }}>{policies.filter((p) => p.editable).length} editable · {policies.filter((p) => !p.editable).length} view-only</span>
        </div>
        {policies.map((p) => {
          const acc = accessFor(p.editable);
          return (
            <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '1.4fr 100px 1fr 90px 140px', gap: 12, padding: '14px 16px', borderTop: '1px solid ' + t.borderSoft, alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {p.editable ? <Shield size={16} color={t.accent} /> : <Lock size={16} color={t.textDim} />}
                <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</span>
              </div>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 6, textAlign: 'center',
                background: acc.color, color: acc.text,
              }}>{acc.label}</span>
              <span style={{ fontSize: 11, color: t.textMuted }}>{p.summary}</span>
              <span style={{ fontSize: 10, color: p.scope === 'Global' ? t.textDim : t.accent, fontFamily: FONT_MONO }}>{p.scope}</span>
              {p.editable
                ? <SmartButton label="Edit scoped fields" t={t} soft icon={Edit3} />
                : <button style={{ padding: '6px 12px', background: t.orange + '22', color: t.orange, border: '1px solid ' + t.orange, borderRadius: 8, fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600 }}><Send size={11} /> Request change</button>
              }
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================================
   ORG ADMIN — bespoke pages for previously-thin tabs
   ============================================================================ */

// OrgAdmin → Programmes → Cohorts: cohort cards with start/end, progress, mentor counts
function OrgAdminCohortsPage({ t }) {
  // Synthesize cohort data from PROGRAMMES seed
  const cohorts = PROGRAMMES.slice(0, 6).map((p, i) => ({
    id: 'coh_' + i,
    name: p.name,
    startDate: ['Jan 15','Feb 1','Feb 20','Mar 5','Mar 18','Apr 2'][i],
    endDate: ['Jun 15','Jul 1','Jul 20','Aug 5','Aug 18','Sep 2'][i],
    durationWeeks: [22,22,22,22,22,22][i],
    weekProgress: [18, 14, 11, 8, 5, 2][i],
    mentees: [42, 38, 28, 56, 24, 18][i],
    mentors: [8, 6, 5, 12, 4, 3][i],
    sessionsCompleted: [184, 142, 98, 220, 64, 24][i],
    status: ['Active','Active','Active','Active','Active','Onboarding'][i],
    health: ['good','good','warn','good','good','neutral'][i],
  }));
  const totalActive = cohorts.filter((c) => c.status === 'Active').length;
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'Active cohorts', value: String(totalActive), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Total mentees', value: String(cohorts.reduce((a, c) => a + c.mentees, 0)), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Total mentors', value: String(cohorts.reduce((a, c) => a + c.mentors, 0)), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Sessions this month', value: cohorts.reduce((a, c) => a + c.sessionsCompleted, 0).toLocaleString(), tone: 'good' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmartButton label="Create cohort" t={t} primary icon={Plus} />
        <SmartButton label="Edit programme" t={t} soft icon={Edit3} />
        <SmartButton label="Bulk move users" t={t} soft icon={Users} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: t.textMuted }}>{cohorts.length} cohorts shown · sorted by start date</span>
      </div>
      {/* Cohort cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 12 }}>
        {cohorts.map((c) => {
          const pct = Math.round((c.weekProgress / c.durationWeeks) * 100);
          const healthColor = c.health === 'good' ? t.green : c.health === 'warn' ? t.yellow : t.textMuted;
          return (
            <div key={c.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>{c.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO, marginTop: 2 }}>{c.startDate} → {c.endDate} · {c.durationWeeks}w</div>
                </div>
                <StatusPill t={t} tone={c.status === 'Active' ? 'good' : 'neutral'}>{c.status}</StatusPill>
              </div>
              {/* Progress bar */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted, marginBottom: 4 }}>
                  <span>Week {c.weekProgress} of {c.durationWeeks}</span>
                  <span style={{ color: healthColor, fontFamily: FONT_MONO, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 6, background: t.bgInput, borderRadius: 999 }}>
                  <div style={{ height: '100%', width: pct + '%', background: healthColor, borderRadius: 999 }} />
                </div>
              </div>
              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 10 }}>
                {[
                  { l: 'Mentees', v: c.mentees },
                  { l: 'Mentors', v: c.mentors },
                  { l: 'Sessions', v: c.sessionsCompleted },
                ].map((s) => (
                  <div key={s.l} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 6, padding: 6, textAlign: 'center' }}>
                    <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.l}</div>
                    <div style={{ fontSize: 14, color: t.text, fontFamily: FONT_MONO, fontWeight: 700, marginTop: 2 }}>{s.v}</div>
                  </div>
                ))}
              </div>
              {/* Action row */}
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <SmartButton label="Inspect cohort" t={t} soft icon={Eye} sz={28} />
                <SmartButton label="Edit programme" t={t} soft icon={Edit3} sz={28} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// OrgAdmin → Mentors → Availability: mentor capacity heatmap + supply table
function OrgAdminMentorAvailabilityPage({ t }) {
  const ctx = React.useContext(ActionContext);
  // Use mentors mapped to this org (or first 8 as fallback)
  const myMentors = (ctx ? ctx.stores.mentors : MENTORS).slice(0, 8);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat'];
  const slots = ['9a','11a','1p','3p','5p','7p'];
  // Synthesize availability matrix: 1 = bookable, 0.5 = partial, 0 = unavailable
  const matrix = myMentors.map((m, mi) => slots.map((_, si) => days.map((_, di) => {
    // Pseudo-random but stable per mentor/slot/day
    const seed = (mi * 31 + si * 7 + di * 3) % 10;
    return seed < 5 ? 1 : seed < 8 ? 0.5 : 0;
  })));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'Mentors mapped', value: String(myMentors.length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg weekly hrs', value: '14h', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Open slots / week', value: '184', tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Slot fill rate', value: '67%', tone: 'good' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Capacity heatmap</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Per-mentor availability across the next 7 days · click any cell to inspect</div>
          </div>
          <div style={{ display: 'flex', gap: 12, fontSize: 10, color: t.textMuted }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: t.green, borderRadius: 2 }} /> Open</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: t.yellow, borderRadius: 2 }} /> Partial</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 10, height: 10, background: t.bgInput, borderRadius: 2 }} /> Unavail</span>
          </div>
        </div>
        {/* Per-mentor capacity bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {myMentors.map((m, mi) => {
            const totalCells = slots.length * days.length;
            const openCells = matrix[mi].flat().filter((v) => v === 1).length;
            const partialCells = matrix[mi].flat().filter((v) => v === 0.5).length;
            const fillRate = Math.round(((openCells + partialCells * 0.5) / totalCells) * 100);
            return (
              <div key={m.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{m.tier} · MIS {m.mis || '—'}</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + (slots.length * days.length) + ', 1fr)', gap: 1 }}>
                  {matrix[mi].flat().map((v, ci) => (
                    <div key={ci} title={'Slot ' + slots[Math.floor(ci / days.length)] + ' · ' + days[ci % days.length]}
                      style={{ height: 16, background: v === 1 ? t.green : v === 0.5 ? t.yellow : t.bgInput, borderRadius: 1, opacity: v === 0 ? 0.3 : 1, cursor: 'pointer' }} />
                  ))}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, color: fillRate > 60 ? t.green : fillRate > 30 ? t.yellow : t.red, fontFamily: FONT_MONO, fontWeight: 700 }}>{fillRate}%</div>
                  <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>fill</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <SmartButton label="Block slot" t={t} soft icon={MinusCircle} />
        <SmartButton label="Set caps" t={t} soft icon={Sliders} />
        <SmartButton label="Bulk message mentors" t={t} primary icon={Megaphone} />
      </div>
    </div>
  );
}

// OrgAdmin → Credits → Allocations: visual flow showing org → programme → mentee
function OrgAdminAllocationsPage({ t }) {
  const allocations = [
    { id: 'a1', toType: 'Programme', toName: 'Cohort Alpha',         amount: 420, when: '2 days ago', source: 'Org wallet', actor: 'Priya Mehta' },
    { id: 'a2', toType: 'Programme', toName: 'Leadership Sprint',   amount: 180, when: '5 days ago', source: 'Org wallet', actor: 'Priya Mehta' },
    { id: 'a3', toType: 'Mentee',    toName: 'Aarav Singh',          amount: 6,   when: 'today',     source: 'Cohort Alpha', actor: 'Priya Mehta' },
    { id: 'a4', toType: 'Mentee',    toName: 'Diya Kapoor',          amount: 8,   when: 'today',     source: 'Cohort Alpha', actor: 'Priya Mehta' },
    { id: 'a5', toType: 'Programme', toName: 'Data Science Sprint', amount: 350, when: '1 week ago', source: 'Org wallet', actor: 'Vivek Reddy (sub-admin)' },
    { id: 'a6', toType: 'Mentee',    toName: 'Shreya Pillai',        amount: 4,   when: '3 days ago',source: 'Leadership Sprint', actor: 'Priya Mehta' },
  ];
  const totalThisMonth = 1268;
  const remainingWallet = 8420;
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'Allocated this month', value: totalThisMonth.toLocaleString(), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Org wallet remaining', value: remainingWallet.toLocaleString(), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Programmes funded', value: '4', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Direct mentee grants', value: '23', tone: 'neutral' }} />
      </div>
      {/* Allocation flow visualization */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Allocation flow</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr auto 1fr', gap: 14, alignItems: 'center' }}>
          {/* Org wallet */}
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Org wallet</div>
            <div style={{ fontSize: 22, color: t.text, fontFamily: FONT_MONO, fontWeight: 700 }}>{remainingWallet.toLocaleString()}</div>
            <div style={{ fontSize: 10, color: t.green, fontFamily: FONT_MONO, marginTop: 2 }}>+ {totalThisMonth} this month</div>
          </div>
          <ArrowRight size={20} color={t.accent} />
          {/* Programme ledgers */}
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Programme ledgers</div>
            {[
              { n: 'Cohort Alpha', v: 420 },
              { n: 'Leadership', v: 180 },
              { n: 'Data Sci', v: 350 },
            ].map((p) => (
              <div key={p.n} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.text, padding: '3px 0' }}>
                <span>{p.n}</span><span style={{ fontFamily: FONT_MONO, color: t.accent }}>{p.v}</span>
              </div>
            ))}
          </div>
          <ArrowRight size={20} color={t.accent} />
          {/* Mentee wallets */}
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Mentee wallets</div>
            <div style={{ fontSize: 22, color: t.text, fontFamily: FONT_MONO, fontWeight: 700 }}>23</div>
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>direct grants this month</div>
          </div>
        </div>
      </div>
      {/* Allocation history */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Recent allocations</div>
          <SmartButton label="Allocate credits" t={t} primary icon={GitBranch} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {allocations.map((a) => (
            <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr 80px 90px', gap: 10, alignItems: 'center', padding: '10px 12px', background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
              <StatusPill t={t} tone={a.toType === 'Programme' ? 'purple' : 'good'}>{a.toType}</StatusPill>
              <div>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{a.toName}</div>
                <div style={{ fontSize: 10, color: t.textDim }}>by {a.actor}</div>
              </div>
              <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>← {a.source}</div>
              <div style={{ fontSize: 14, color: t.accent, fontFamily: FONT_MONO, fontWeight: 700, textAlign: 'right' }}>+{a.amount}</div>
              <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, textAlign: 'right' }}>{a.when}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// OrgAdmin → Support → Escalations: triage queue with claim/resolve actions
function OrgAdminEscalationsPage({ t }) {
  const ctx = React.useContext(ActionContext);
  const escalations = [
    { id: 'ESC-401', subject: 'Mentee reported unprofessional conduct', mentor: 'Naveen S', mentee: 'Aarav S', priority: 'Urgent', age: '2h', status: 'Open' },
    { id: 'ESC-402', subject: 'Repeated no-shows · 3 sessions',          mentor: 'Pooja R',   mentee: 'Diya K',  priority: 'High',   age: '6h', status: 'Open' },
    { id: 'ESC-403', subject: 'Credit refund disputed by org',           mentor: '—',         mentee: 'Shreya P', priority: 'Medium', age: '1d', status: 'In review' },
    { id: 'ESC-404', subject: 'Booking failed twice for same slot',      mentor: 'Vikram K',  mentee: 'Rohan M',  priority: 'High',   age: '4h', status: 'Open' },
    { id: 'ESC-405', subject: 'SLA breach · response > 48h',             mentor: 'Anita J',   mentee: 'Karan V',  priority: 'Medium', age: '1d', status: 'In review' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'Open escalations', value: '3', tone: 'bad' }} />
        <KPICard t={t} kpi={{ label: 'In review', value: '2', tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Urgent priority', value: '1', tone: 'bad' }} />
        <KPICard t={t} kpi={{ label: 'Avg time to claim', value: '38m', tone: 'good' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmartButton label="Escalate to Super Admin" t={t} primary icon={AlertOctagon} />
        <SmartButton label="Bulk message users" t={t} soft icon={Megaphone} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 11, color: t.textMuted }}>{escalations.length} total · sorted by priority then age</span>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {escalations.map((e) => (
            <div key={e.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 200px 90px 80px auto', gap: 12, alignItems: 'center', padding: 12, background: t.bgCardElev, border: '1px solid ' + (e.priority === 'Urgent' ? t.red + '88' : t.borderSoft), borderRadius: 10 }}>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{e.id}</span>
              <div>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{e.subject}</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{e.status}</div>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>
                {e.mentor !== '—' && <span>M: {e.mentor}</span>}
                {e.mentor !== '—' && <span style={{ margin: '0 6px' }}>·</span>}
                <span>U: {e.mentee}</span>
              </div>
              <StatusPill t={t} tone={e.priority === 'Urgent' ? 'bad' : e.priority === 'High' ? 'warn' : 'neutral'}>{e.priority}</StatusPill>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{e.age}</span>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => { if (ctx) { ctx.appendLog({ actionId: 'ticket.assign', label: 'Take escalation', target: e.id, payload: { assignee: 'me' }, result: 'Completed', destructive: false }); ctx.showToast('Took ' + e.id); } }} style={{ padding: '5px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Take it</button>
                <button onClick={() => { if (ctx) { ctx.appendLog({ actionId: 'ticket.resolve', label: 'Resolve escalation', target: e.id, payload: null, result: 'Completed', destructive: false }); ctx.showToast('Resolved ' + e.id); } }} style={{ padding: '5px 10px', background: t.green, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Resolve</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// OrgAdmin → Reports → Programme: scoped programme dashboard
function OrgAdminProgrammeReportPage({ t }) {
  const programmes = [
    { name: 'Cohort Alpha',       sessions: 184, completion: 87, mis: 4.6, csat: 4.5, mentees: 42, status: 'Healthy' },
    { name: 'Leadership Sprint',  sessions: 142, completion: 82, mis: 4.4, csat: 4.3, mentees: 38, status: 'Healthy' },
    { name: 'Data Science Sprint', sessions: 98,  completion: 71, mis: 4.0, csat: 4.1, mentees: 28, status: 'Watch'   },
    { name: 'Product Foundations', sessions: 220, completion: 91, mis: 4.8, csat: 4.7, mentees: 56, status: 'Healthy' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Programmes', value: String(programmes.length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Sessions MTD', value: programmes.reduce((a, p) => a + p.sessions, 0).toLocaleString(), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg completion', value: Math.round(programmes.reduce((a, p) => a + p.completion, 0) / programmes.length) + '%', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg MIS', value: (programmes.reduce((a, p) => a + p.mis, 0) / programmes.length).toFixed(1), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg CSAT', value: (programmes.reduce((a, p) => a + p.csat, 0) / programmes.length).toFixed(1), tone: 'good' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmartButton label="Share report" t={t} primary icon={Send} />
        <SmartButton label="Schedule report" t={t} soft icon={Calendar} />
        <SmartButton label="Export" t={t} soft icon={Download} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Per-programme breakdown</div>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 80px 100px 70px 70px 80px 80px', gap: 12, padding: '8px 12px', fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid ' + t.borderSoft }}>
          <span>Programme</span><span style={{ textAlign: 'right' }}>Mentees</span><span style={{ textAlign: 'right' }}>Sessions</span><span style={{ textAlign: 'right' }}>Compl.</span><span style={{ textAlign: 'right' }}>MIS</span><span style={{ textAlign: 'right' }}>CSAT</span><span style={{ textAlign: 'right' }}>Status</span>
        </div>
        {programmes.map((p) => (
          <div key={p.name} style={{ display: 'grid', gridTemplateColumns: '180px 80px 100px 70px 70px 80px 80px', gap: 12, padding: '10px 12px', fontSize: 12, color: t.text, borderBottom: '1px solid ' + t.borderSoft + '55', alignItems: 'center' }}>
            <span style={{ fontWeight: 600 }}>{p.name}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO }}>{p.mentees}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO }}>{p.sessions}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO, color: p.completion > 80 ? t.green : t.yellow }}>{p.completion}%</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO, color: p.mis > 4.3 ? t.green : t.yellow }}>{p.mis}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO, color: p.csat > 4.3 ? t.green : t.yellow }}>{p.csat}</span>
            <span style={{ textAlign: 'right' }}><StatusPill t={t} tone={p.status === 'Healthy' ? 'good' : 'warn'}>{p.status}</StatusPill></span>
          </div>
        ))}
      </div>
    </div>
  );
}

// OrgAdmin → Settings → Notifications: notification matrix
function OrgAdminNotificationsPage({ t }) {
  const events = [
    { evt: 'Low credits alert',                channels: { email: true, slack: true, in_app: true } },
    { evt: 'Mentor onboarded',                 channels: { email: true, slack: false, in_app: true } },
    { evt: 'SLA breach',                       channels: { email: true, slack: true, in_app: true } },
    { evt: 'Cohort week summary',              channels: { email: true, slack: false, in_app: false } },
    { evt: 'Renewal due in 30 days',           channels: { email: true, slack: false, in_app: true } },
    { evt: 'Mentor refund request',            channels: { email: true, slack: true, in_app: true } },
    { evt: 'New escalation',                   channels: { email: true, slack: true, in_app: true } },
    { evt: 'Weekly digest',                    channels: { email: true, slack: false, in_app: false } },
  ];
  const channels = ['email','slack','in_app'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Notification preferences</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Pick which channels deliver each event type. Changes apply to your account only.</div>
          </div>
          <SmartButton label="Save preferences" t={t} primary icon={Check} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 8, padding: '8px 12px', fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid ' + t.borderSoft }}>
          <span>Event</span><span style={{ textAlign: 'center' }}>Email</span><span style={{ textAlign: 'center' }}>Slack</span><span style={{ textAlign: 'center' }}>In-app</span>
        </div>
        {events.map((e, ei) => (
          <div key={e.evt} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 80px', gap: 8, padding: '10px 12px', fontSize: 12, color: t.text, borderBottom: '1px solid ' + t.borderSoft + '55', alignItems: 'center' }}>
            <span>{e.evt}</span>
            {channels.map((ch) => (
              <div key={ch} style={{ textAlign: 'center' }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid ' + (e.channels[ch] ? t.accent : t.borderSoft), background: e.channels[ch] ? t.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  {e.channels[ch] && <Check size={9} color="#0a1f28" />}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================================
   SUB-ADMIN — bespoke pages for previously-thin tabs
   ============================================================================ */

// SubAdmin → Programmes & Cohorts: scope-limited cohort view
function SubAdminProgrammesPage({ t }) {
  const myProgrammes = [
    { name: 'Cohort Alpha',       mentees: 42, mentors: 8, weekProgress: 18, durationWeeks: 22, status: 'Active', delegated: true },
    { name: 'Leadership Sprint',  mentees: 38, mentors: 6, weekProgress: 14, durationWeeks: 22, status: 'Active', delegated: true },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.accent + '11', border: '1px solid ' + t.accent + '55', borderRadius: 8, padding: 10, fontSize: 11, color: t.accent }}>
        <strong>Scope:</strong> You manage {myProgrammes.length} programmes delegated to you by your Org Admin. Other programmes in this org are not visible.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {myProgrammes.map((p) => {
          const pct = Math.round((p.weekProgress / p.durationWeeks) * 100);
          return (
            <div key={p.name} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>Week {p.weekProgress} of {p.durationWeeks}</div>
                </div>
                <StatusPill t={t} tone="good">{p.status}</StatusPill>
              </div>
              <div style={{ height: 6, background: t.bgInput, borderRadius: 999, marginBottom: 10 }}>
                <div style={{ height: '100%', width: pct + '%', background: t.accent, borderRadius: 999 }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 6, padding: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>Mentees</div>
                  <div style={{ fontSize: 14, color: t.text, fontFamily: FONT_MONO, fontWeight: 700 }}>{p.mentees}</div>
                </div>
                <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 6, padding: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>Mentors</div>
                  <div style={{ fontSize: 14, color: t.text, fontFamily: FONT_MONO, fontWeight: 700 }}>{p.mentors}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                <SmartButton label="Edit programme" t={t} soft icon={Edit3} sz={28} />
                <SmartButton label="Allocate credits" t={t} soft icon={Wallet} sz={28} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// SubAdmin → Users: scope-limited user table with assign actions
function SubAdminUsersPage({ t }) {
  const ctx = React.useContext(ActionContext);
  const myUsers = (ctx ? ctx.stores.mentees : MENTEES).slice(0, 12);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'My users', value: String(myUsers.length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Active this week', value: '8', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Inactive 7+ days', value: '2', tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Low credits (<5)', value: '3', tone: 'warn' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmartButton label="Invite user" t={t} primary icon={UserPlus} />
        <SmartButton label="Bulk allocate credits" t={t} soft icon={Wallet} />
        <SmartButton label="Bulk message users" t={t} soft icon={Megaphone} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px 80px 100px 90px', gap: 12, padding: '8px 12px', fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid ' + t.borderSoft }}>
          <span>Mentee</span><span>Cohort</span><span style={{ textAlign: 'right' }}>Sessions</span><span style={{ textAlign: 'right' }}>Credits</span><span>Last active</span><span style={{ textAlign: 'right' }}>Actions</span>
        </div>
        {myUsers.map((u) => (
          <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '180px 1fr 80px 80px 100px 90px', gap: 12, padding: '10px 12px', fontSize: 12, color: t.text, borderBottom: '1px solid ' + t.borderSoft + '55', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar name={u.name} t={t} size={24} />
              <span style={{ fontWeight: 600 }}>{u.name}</span>
            </div>
            <span style={{ fontSize: 11, color: t.textMuted }}>{u.cohort || 'Cohort Alpha'}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO }}>{u.sessionsCompleted || 0}</span>
            <span style={{ textAlign: 'right', fontFamily: FONT_MONO, color: (u.creditsRemaining || 0) < 5 ? t.red : t.text }}>{u.creditsRemaining || 0}</span>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{u.lastActive || '—'}</span>
            <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
              <SmartButton label="Allocate credits" t={t} soft icon={Wallet} sz={24} />
              <SmartButton label="Nudge" t={t} soft icon={Bell} sz={24} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// SubAdmin → Tickets: scope-limited ticket queue
function SubAdminTicketsPage({ t }) {
  const ctx = React.useContext(ActionContext);
  const myTickets = (ctx ? ctx.stores.tickets : TICKETS).slice(0, 8);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.accent + '11', border: '1px solid ' + t.accent + '55', borderRadius: 8, padding: 10, fontSize: 11, color: t.accent }}>
        <strong>Scope:</strong> Tickets from users in your delegated programmes. You can resolve first-line issues. Escalate to Org Admin if you need higher access.
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <KPICard t={t} kpi={{ label: 'Open', value: String(myTickets.filter((tk) => tk.status === 'Open').length), tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'In progress', value: '2', tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Resolved this week', value: '14', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg response', value: '2.1h', tone: 'good' }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <SmartButton label="Raise ticket" t={t} primary icon={AlertCircle} />
        <SmartButton label="Escalate" t={t} soft icon={AlertOctagon} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {myTickets.map((tk) => (
            <div key={tk.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 100px 80px 80px auto', gap: 10, alignItems: 'center', padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{tk.id}</span>
              <div>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{tk.title || 'Support request'}</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>by {tk.requester || 'User'}</div>
              </div>
              <StatusPill t={t} tone={tk.priority === 'High' ? 'bad' : tk.priority === 'Medium' ? 'warn' : 'neutral'}>{tk.priority || 'Medium'}</StatusPill>
              <StatusPill t={t} tone={tk.status === 'Open' ? 'warn' : tk.status === 'Resolved' ? 'good' : 'neutral'}>{tk.status || 'Open'}</StatusPill>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{tk.age || '2h'}</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <SmartButton label="Resolve" t={t} soft icon={Check} sz={24} />
                <SmartButton label="Escalate" t={t} soft icon={AlertOctagon} sz={24} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function OrgAdminPageRouter({ moduleKey, tabKey, t, openDrillFor }) {
  // Institution Health is the rich home page already built (OrgAdminHome)
  if (moduleKey === 'overview' && tabKey === 'health') return <OrgAdminHome t={t} />;
  if (moduleKey === 'overview' && tabKey === 'programme_pulse') return <OrgAdminProgrammePulsePage t={t} />;
  if (moduleKey === 'overview' && tabKey === 'mentor_capacity') return <OrgAdminMentorCapacityPage t={t} />;
  if (moduleKey === 'overview' && tabKey === 'revenue_renewals') return <OrgAdminRevenueRenewalsPage t={t} />;
  if (moduleKey === 'programmes' && tabKey === 'cohorts') return <OrgAdminCohortsPage t={t} />;
  if (moduleKey === 'mentors' && tabKey === 'requests') return <OrgAdminPipelinePage t={t} />;
  if (moduleKey === 'mentors' && tabKey === 'availability') return <OrgAdminMentorAvailabilityPage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'wallet') return <OrgAdminWalletPage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'allocations') return <OrgAdminAllocationsPage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'guardrails') return <OrgAdminGuardrailsPage t={t} />;
  if (moduleKey === 'reports' && tabKey === 'executive') return <OrgAdminReportsGridPage t={t} />;
  if (moduleKey === 'reports' && tabKey === 'programme') return <OrgAdminProgrammeReportPage t={t} />;
  if (moduleKey === 'support' && tabKey === 'escalations') return <OrgAdminEscalationsPage t={t} />;
  if (moduleKey === 'settings' && tabKey === 'profile') return <OrgAdminProfilePage t={t} />;
  if (moduleKey === 'settings' && tabKey === 'branding') return <OrgAdminBrandingPage t={t} />;
  if (moduleKey === 'settings' && tabKey === 'policies') return <OrgAdminPoliciesPage t={t} />;
  if (moduleKey === 'settings' && tabKey === 'notifications') return <OrgAdminNotificationsPage t={t} />;
  // All other tabs use generic table
  const ia = ORG_ADMIN_IA.find((m) => m.key === moduleKey);
  const tab = ia && ia.tabs.find((x) => x.key === tabKey);
  const dataKey = tab && tab.config && tab.config.dataKey;
  if (dataKey) return <OrgAdminTablePage t={t} dataKey={dataKey} openDrillFor={openDrillFor} />;
  return <div style={{ color: t.textMuted, padding: 20 }}>Page not found.</div>;
}

function SubAdminHome({ t }) {
  // Used as the My Scope Pulse page. Page header is provided by the chrome.
  const cohorts = PROGRAMMES.slice(0, 4);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Focused KPI strip — sessions today, unresolved tickets, invites pending, low-credit users */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'My users', value: '142', tone: 'neutral' },
          { label: 'Sessions today', value: '8', tone: 'good' },
          { label: 'Unresolved tickets', value: '3', tone: 'warn' },
          { label: 'Invites pending', value: '5', tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>

      {/* 2. Assigned scope table */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>My scope</div>
          <div style={{ display: 'flex', gap: 6 }}>
            <SmartButton label="Filter" t={t} soft icon={Filter} />
            <RequestCTA label="More scope" t={t} />
          </div>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Programme','Cohorts','Mentees','Completion','Status'].map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '8px 0', textTransform: 'uppercase' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {cohorts.map((c) => (
              <tr key={c.id} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '12px 0', fontSize: 13, color: t.text, fontWeight: 500 }}>{c.name}</td>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{c.cohorts}</td>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{c.mentees}</td>
                <td style={{ padding: '12px 0', minWidth: 160 }}><ProgressBar value={c.completion} t={t} color={c.completion > 70 ? t.green : t.yellow} /></td>
                <td style={{ padding: '12px 0' }}><StatusPill t={t} tone={c.status === 'Active' ? 'good' : 'warn'}>{c.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 3. Low-credit users + Session monitor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Low-credit users</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MENTEES.slice(0, 5).map((m) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                <Avatar name={m.name} t={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{m.org}</div>
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: m.creditsRemaining < 5 ? t.red : t.yellow }}>{m.creditsRemaining} credits</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>This week</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d, i) => (
              <div key={d} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10, textAlign: 'center' }}>
                <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO, marginBottom: 4 }}>{d}</div>
                <div className="mu-display" style={{ fontSize: 22, color: t.text }}>{[8, 12, 6, 14, 10, 4, 2][i]}</div>
                <div style={{ fontSize: 9, color: t.textDim, marginTop: 2 }}>{[1, 0, 2, 0, 1, 0, 0][i]} no-shows</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   ORG SUB-ADMIN — secondary pages and page router
   ============================================================================ */

function SubAdminPriorityQueuePage({ t }) {
  const items = [
    { type: 'Pending approval', detail: 'Mentor request — Cohort Sigma', tone: 'warn', icon: BadgeCheck, action: 'Approve' },
    { type: 'No-show', detail: 'Mentor no-show flagged — Cohort Alpha session 12', tone: 'bad', icon: AlertTriangle, action: 'Take action' },
    { type: 'Reminder failure', detail: '12 WhatsApp reminders bounced — needs phone update', tone: 'warn', icon: MessageSquare, action: 'Take action' },
    { type: 'Pending approval', detail: 'Cohort transfer — Diya Patel', tone: 'warn', icon: UserCog, action: 'Approve' },
    { type: 'No-show', detail: 'Mentee no-show — repeat offender flagged (3rd in 14d)', tone: 'bad', icon: AlertTriangle, action: 'Escalate' },
    { type: 'Reminder failure', detail: '4 emails bounced — Leadership Sprint cohort', tone: 'warn', icon: MessageSquare, action: 'Take action' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {[
          { label: 'Items needing action', value: String(items.length), tone: 'warn' },
          { label: 'Pending approvals', value: String(items.filter((i) => i.type === 'Pending approval').length), tone: 'warn' },
          { label: 'No-shows', value: String(items.filter((i) => i.type === 'No-show').length), tone: 'bad' },
          { label: 'Reminder failures', value: String(items.filter((i) => i.type === 'Reminder failure').length), tone: 'warn' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>What needs action first</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {items.map((q, i) => {
            const Ic = q.icon;
            const tone = q.tone === 'bad' ? t.red : q.tone === 'warn' ? t.yellow : t.accent;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, background: tone + '22', color: tone, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Ic size={14} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{q.type}</div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{q.detail}</div>
                </div>
                <button style={{ padding: '6px 12px', background: q.action === 'Escalate' ? t.orange + '22' : t.accent, color: q.action === 'Escalate' ? t.orange : '#0a1f28', border: q.action === 'Escalate' ? '1px solid ' + t.orange : 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>{q.action}</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Generic table page for Sub-Admin tabs — same data-driven pattern as Org Admin's
function SubAdminTablePage({ t, dataKey, openDrillFor }) {
  const dataMap = {
    programmes: { rows: PROGRAMMES.slice(0, 4), kpis: [{ label: 'Assigned', value: '4', tone: 'good' },{ label: 'Active cohorts', value: '8', tone: 'good' },{ label: 'At-risk', value: '1', tone: 'warn' },{ label: 'Avg completion', value: '76%', tone: 'good' }],
      cols: [{ k: 'name', l: 'Programme' },{ k: 'cohorts', l: 'Cohorts', mono: true },{ k: 'mentees', l: 'Mentees', mono: true },{ k: 'completion', l: 'Completion', kind: 'bar' },{ k: 'status', l: 'Status', kind: 'pill' }] },
    users: { rows: MENTEES.slice(0, 12).map((m) => ({ ...m, lastLogin: ['2h ago','1d ago','5d ago','12h ago','30m ago'][Math.floor(Math.random()*5)] })),
      kpis: [{ label: 'My users', value: '142', tone: 'neutral' },{ label: 'Active 7d', value: '108', tone: 'good' },{ label: 'Inactive 30d', value: '8', tone: 'warn' },{ label: 'Low credit', value: '5', tone: 'warn' }],
      cols: [{ k: 'name', l: 'User' },{ k: 'org', l: 'Cohort' },{ k: 'sessionsCompleted', l: 'Completed', mono: true },{ k: 'creditsRemaining', l: 'Credits', mono: true },{ k: 'lastLogin', l: 'Last login', mono: true }] },
    upcoming: { rows: range(8).map((i) => ({ id: 'sess_'+i, mentee: pick(MENTEE_FIRST) + ' ' + pick(['Sharma','Patel','Reddy']), mentor: pick(MENTOR_NAMES), when: ['Today 4pm','Today 6pm','Tomorrow 11am','Tomorrow 2pm','Wed 10am','Thu 4pm','Fri 11am','Fri 6pm'][i], topic: pick(['PM career path','Mock interview','Resume review','System design','OKR coaching']), status: i % 4 === 3 ? 'Reschedule pending' : 'Confirmed' })),
      kpis: [{ label: 'Today', value: '8', tone: 'good' },{ label: 'This week', value: '46', tone: 'neutral' },{ label: 'Reschedules', value: '2', tone: 'warn' },{ label: 'Confirmed', value: '44', tone: 'good' }],
      cols: [{ k: 'mentee', l: 'Mentee' },{ k: 'mentor', l: 'Mentor' },{ k: 'topic', l: 'Topic' },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    issues: { rows: range(8).map((i) => ({ id: 'iss_'+i, who: pick(MENTEE_FIRST) + ' ' + pick(['K','S','M','P']), kind: pick(['No-show','Cancellation','Late join','Repeat no-show']), session: 'Sess #'+(101+i), when: ['12m ago','2h ago','1d ago','3d ago'][i%4], status: i%4===0 ? 'Repeat offender' : 'Open' })),
      kpis: [{ label: 'Open issues', value: '3', tone: 'warn' },{ label: 'No-shows 7d', value: '6', tone: 'warn' },{ label: 'Repeat offenders', value: '2', tone: 'bad' },{ label: 'Late joins 7d', value: '4', tone: 'warn' }],
      cols: [{ k: 'who', l: 'User' },{ k: 'kind', l: 'Issue' },{ k: 'session', l: 'Session', mono: true },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    credit_requests: { rows: [{ id: 'cr1', who: 'Aarav Sharma', amount: 5, reason: 'Need extra session for case prep', status: 'Pending OA', when: '2h ago' },{ id: 'cr2', who: 'Diya Patel', amount: 10, reason: 'Cohort upgrade — premium pool', status: 'Escalated', when: '1d ago' },{ id: 'cr3', who: 'Vihaan R', amount: 3, reason: 'Refund replacement', status: 'Approved', when: '3d ago' },{ id: 'cr4', who: 'Kiara M', amount: 8, reason: 'Mock interview series', status: 'Pending OA', when: '5d ago' }],
      kpis: [{ label: 'Pending OA', value: '2', tone: 'warn' },{ label: 'Escalated', value: '1', tone: 'warn' },{ label: 'Approved 30d', value: '14', tone: 'good' },{ label: 'Avg decision', value: '6h', tone: 'good' }],
      cols: [{ k: 'who', l: 'Requester' },{ k: 'amount', l: 'Credits', mono: true },{ k: 'reason', l: 'Reason' },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    reminders: { rows: [{ id: 'rm1', template: 'Session in 24h', channel: 'Email', sent: 142, delivered: 138, when: '2h ago' },{ id: 'rm2', template: 'Session in 1h', channel: 'WhatsApp', sent: 84, delivered: 82, when: '12h ago' },{ id: 'rm3', template: 'Low credit warning', channel: 'In-app', sent: 12, delivered: 12, when: '1d ago' },{ id: 'rm4', template: 'Cohort start', channel: 'Email', sent: 38, delivered: 36, when: '4d ago' }],
      kpis: [{ label: 'Templates', value: '8', tone: 'neutral' },{ label: 'Sent (7d)', value: '276', tone: 'good' },{ label: 'Delivery rate', value: '98%', tone: 'good' },{ label: 'Bounced', value: '6', tone: 'warn' }],
      cols: [{ k: 'template', l: 'Template' },{ k: 'channel', l: 'Channel', kind: 'pill' },{ k: 'sent', l: 'Sent', mono: true },{ k: 'delivered', l: 'Delivered', mono: true },{ k: 'when', l: 'Last sent', mono: true }] },
    announcements: { rows: [{ id: 'an1', title: 'New mentor pool added', audience: 'Cohort Alpha', sent: '2d ago', opened: 84, status: 'Sent' },{ id: 'an2', title: 'Schedule change — Friday', audience: 'Leadership Sprint', sent: '4d ago', opened: 62, status: 'Sent' },{ id: 'an3', title: 'Mid-cohort survey', audience: 'All assigned', sent: '—', opened: 0, status: 'Draft' }],
      kpis: [{ label: 'This month', value: '3', tone: 'neutral' },{ label: 'Drafts', value: '1', tone: 'warn' },{ label: 'Avg open rate', value: '78%', tone: 'good' },{ label: 'Audience reach', value: '146', tone: 'neutral' }],
      cols: [{ k: 'title', l: 'Title' },{ k: 'audience', l: 'Audience' },{ k: 'sent', l: 'Sent', mono: true },{ k: 'opened', l: 'Open %', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    tickets: { rows: TICKETS.slice(0, 6), kpis: [{ label: 'Open in scope', value: '3', tone: 'warn' },{ label: 'On track', value: '2', tone: 'good' },{ label: 'Resolved 7d', value: '8', tone: 'good' },{ label: 'Avg response', value: '2.4h', tone: 'good' }],
      cols: [{ k: 'id', l: 'ID', mono: true },{ k: 'title', l: 'Title' },{ k: 'owner', l: 'Owner' },{ k: 'priority', l: 'Priority', kind: 'pill' },{ k: 'status', l: 'Status', kind: 'pill' }] },
    chatbot: { rows: [{ id: 'ch1', who: 'Aarav Sharma', intent: 'Refund question', confidence: 38, when: '12m ago', status: 'Awaiting human' },{ id: 'ch2', who: 'Diya Patel', intent: 'Mentor not responding', confidence: 42, when: '1h ago', status: 'Awaiting human' },{ id: 'ch3', who: 'Vihaan R', intent: 'Cohort transfer', confidence: 55, when: '4h ago', status: 'Resolved' }],
      kpis: [{ label: 'Awaiting human', value: '2', tone: 'warn' },{ label: 'Resolved 7d', value: '14', tone: 'good' },{ label: 'Avg confidence', value: '62%', tone: 'neutral' },{ label: 'Bot deflection', value: '84%', tone: 'good' }],
      cols: [{ k: 'who', l: 'User' },{ k: 'intent', l: 'Intent' },{ k: 'confidence', l: 'Bot conf %', mono: true },{ k: 'when', l: 'When', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
  };
  const conf = dataMap[dataKey];
  if (!conf) return <div style={{ color: t.textMuted }}>No data for {dataKey}</div>;

  const renderCell = (row, col) => {
    const v = row[col.k];
    if (col.kind === 'pill') {
      const tone = String(v).match(/Active|Done|Approved|Confirmed|Sent|Resolved/i) ? 'good' : String(v).match(/Pending|Reschedule|Awaiting|Draft|Open|Escalated/i) ? 'warn' : String(v).match(/Repeat offender/i) ? 'bad' : 'neutral';
      return <StatusPill t={t} tone={tone}>{v}</StatusPill>;
    }
    if (col.kind === 'bar') return <div style={{ minWidth: 140 }}><ProgressBar value={Number(v)} t={t} color={v > 75 ? t.green : v > 50 ? t.yellow : t.red} /></div>;
    if (col.mono) return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{v}</span>;
    return <span style={{ fontSize: 12, color: t.text }}>{v}</span>;
  };

  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {conf.kpis.map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.bgCardElev }}>
              {conf.cols.map((c) => (
                <th key={c.k} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '12px 14px', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{c.l}</th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {conf.rows.map((row) => (
              <tr key={row.id} onClick={() => openDrillFor && openDrillFor(row)} style={{ borderTop: '1px solid ' + t.borderSoft, cursor: openDrillFor ? 'pointer' : 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                {conf.cols.map((c) => (
                  <td key={c.k} style={{ padding: '12px 14px' }}>{renderCell(row, c)}</td>
                ))}
                <td style={{ padding: '12px 14px', textAlign: 'right' }}><ChevronRight size={14} color={t.textDim} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubAdminCreditsPage({ t }) {
  // Credits/View & Assign — only if delegated. Show scoped balance + assignment table.
  const delegated = true; // Simulated: this Sub-Admin has been granted credit-assignment scope
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {[
          { label: 'Scoped balance', value: '1,820', tone: 'good' },
          { label: 'Assigned this week', value: '240', tone: 'neutral' },
          { label: 'Pending assigns', value: '3', tone: 'warn' },
          { label: 'Reverses (qtr)', value: '1', tone: 'neutral' },
        ].map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      {!delegated && (
        <div style={{ background: t.yellowSoft + '33', border: '1px dashed ' + t.yellow, borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Lock size={16} color={t.yellow} />
          <div style={{ flex: 1, fontSize: 12, color: t.text }}>Credit assignment is not delegated to you. You can view balances but cannot assign.</div>
          <RequestCTA label="Request delegation" t={t} />
        </div>
      )}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Scoped balance</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Cohort Alpha + Leadership Sprint</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {delegated && <SmartButton label="Assign credit" t={t} primary icon={Plus} />}
            <RequestCTA label="More credits" t={t} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {[
            { name: 'Cohort Alpha', allocated: 1200, used: 480, color: t.accent },
            { name: 'Leadership Sprint', allocated: 800, used: 220, color: t.blue },
          ].map((p) => (
            <div key={p.name} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</span>
                <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{(p.allocated - p.used).toLocaleString()} <span style={{ color: t.textDim }}>/ {p.allocated.toLocaleString()}</span></span>
              </div>
              <ProgressBar value={((p.allocated - p.used) / p.allocated) * 100} t={t} color={p.color} />
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 6 }}>{p.used.toLocaleString()} used this quarter</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Recent assignments</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>{['User','Cohort','Credits','By','When','Status'].map((h) => <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '8px 0', textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
          <tbody>
            {[
              { who: 'Aarav Sharma', cohort: 'Cohort Alpha', credits: 5, by: 'Mukesh V', when: '2h ago', status: 'Done' },
              { who: 'Diya Patel', cohort: 'Cohort Alpha', credits: 8, by: 'Mukesh V', when: '1d ago', status: 'Done' },
              { who: 'Vihaan R', cohort: 'Leadership Sprint', credits: 4, by: 'Mukesh V', when: '3d ago', status: 'Done' },
              { who: 'Kiara M', cohort: 'Leadership Sprint', credits: 6, by: 'Mukesh V', when: '5d ago', status: 'Reversed' },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '10px 0', fontSize: 12, color: t.text, fontWeight: 500 }}>{r.who}</td>
                <td style={{ padding: '10px 0', fontSize: 12, color: t.textMuted }}>{r.cohort}</td>
                <td style={{ padding: '10px 0', fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{r.credits}</td>
                <td style={{ padding: '10px 0', fontSize: 11, color: t.textMuted }}>{r.by}</td>
                <td style={{ padding: '10px 0', fontFamily: FONT_MONO, fontSize: 11, color: t.textDim }}>{r.when}</td>
                <td style={{ padding: '10px 0' }}><StatusPill t={t} tone={r.status === 'Done' ? 'good' : 'warn'}>{r.status}</StatusPill></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SubAdminMyAccessPage({ t }) {
  // Permission summary — explicitly shows what they can and cannot do, in access-language colors
  const myCapabilities = [
    { cap: 'View users in my scope', state: 'Full', notes: 'Cohort Alpha + Leadership Sprint' },
    { cap: 'Invite users to my cohorts', state: 'Scoped', notes: 'Up to 30 invites / month' },
    { cap: 'Suspend users', state: 'Request', notes: 'Must be approved by Org Admin' },
    { cap: 'View programmes in my scope', state: 'Full', notes: '4 assigned programmes' },
    { cap: 'Edit programme content', state: 'None', notes: 'Owned by Org Admin' },
    { cap: 'Assign credits to users', state: 'Scoped', notes: 'Up to 10 credits / user / week' },
    { cap: 'Approve credit refunds', state: 'Request', notes: 'Escalates to Org Admin' },
    { cap: 'Send reminders', state: 'Scoped', notes: 'Within allowed templates' },
    { cap: 'Send announcements', state: 'Scoped', notes: 'Drafts must be approved if &gt; 50 recipients' },
    { cap: 'Resolve first-line tickets', state: 'Full', notes: 'Tickets in your scope' },
    { cap: 'View payout / billing', state: 'None', notes: 'Owned by Super Admin' },
    { cap: 'Edit org policies', state: 'None', notes: 'Locked to Super Admin / Org Admin' },
    { cap: 'View audit logs', state: 'Scoped', notes: 'Only your own actions' },
    { cap: 'Use chatbot help', state: 'Full', notes: 'Anyone can use' },
    { cap: 'Take over chatbot escalations', state: 'Scoped', notes: 'For your assigned users' },
  ];
  const stateMeta = (s) => {
    const e = ACCESS_LEGEND.find((l) => l.label === s);
    return e ? { bg: e.color, fg: e.text } : { bg: t.bgInput, fg: t.textMuted };
  };
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 22, color: t.text }}>What I can and cannot do</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
              Permission summary for your role.
              <ScopeChip label="Cohort Alpha + Leadership Sprint" t={t} />
            </div>
          </div>
          <RequestCTA label="More access" t={t} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginBottom: 18 }}>
          {['Full','Scoped','View','Own','Request','None'].slice(0, 5).map((s) => {
            const m = stateMeta(s);
            const count = myCapabilities.filter((c) => c.state === s).length;
            return (
              <div key={s} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
                <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: m.bg, color: m.fg }}>{s}</span>
                <div className="mu-display" style={{ fontSize: 26, color: t.text, marginTop: 6 }}>{count}</div>
                <div style={{ fontSize: 10, color: t.textMuted }}>{count === 1 ? 'capability' : 'capabilities'}</div>
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: '1px solid ' + t.borderSoft, paddingTop: 12 }}>
          {myCapabilities.map((c, i) => {
            const m = stateMeta(c.state);
            return (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1.4fr 90px 1.6fr 120px', gap: 12, padding: '10px 0', borderBottom: i === myCapabilities.length - 1 ? 'none' : '1px solid ' + t.borderSoft, alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: t.text }}>{c.cap}</span>
                <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 4, fontSize: 9, fontWeight: 700, background: m.bg, color: m.fg, textAlign: 'center' }}>{c.state}</span>
                <span style={{ fontSize: 11, color: t.textMuted }} dangerouslySetInnerHTML={{ __html: c.notes }} />
                {c.state === 'None' && <RequestCTA label="Access" t={t} />}
                {c.state === 'Request' && <span style={{ fontSize: 10, color: t.orange, fontFamily: FONT_MONO, textAlign: 'center' }}>Request needed</span>}
                {(c.state === 'Full' || c.state === 'Scoped' || c.state === 'View' || c.state === 'Own') && <span style={{ fontSize: 10, color: t.green, fontFamily: FONT_MONO, textAlign: 'center' }}>✓ Allowed</span>}
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Recent access changes</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { what: 'Granted: Send reminders within allowed templates', who: 'Anita Sharma (OA)', when: '12d ago' },
            { what: 'Granted: Assign credits up to 10/user/week', who: 'Anita Sharma (OA)', when: '34d ago' },
            { what: 'Denied: Edit programme content', who: 'Anita Sharma (OA)', when: '40d ago' },
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
              <History size={14} color={t.accent} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: t.text }}>{c.what}</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>by {c.who}</div>
              </div>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{c.when}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SubAdminPageRouter({ moduleKey, tabKey, t, openDrillFor }) {
  if (moduleKey === 'overview' && tabKey === 'pulse') return <SubAdminHome t={t} />;
  if (moduleKey === 'overview' && tabKey === 'priority') return <SubAdminPriorityQueuePage t={t} />;
  if (moduleKey === 'work' && tabKey === 'programmes') return <SubAdminProgrammesPage t={t} />;
  if (moduleKey === 'work' && tabKey === 'users') return <SubAdminUsersPage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'assign') return <SubAdminCreditsPage t={t} />;
  if (moduleKey === 'support' && tabKey === 'tickets') return <SubAdminTicketsPage t={t} />;
  if (moduleKey === 'settings' && tabKey === 'access') return <SubAdminMyAccessPage t={t} />;
  // Everything else uses generic table archetype
  const ia = SUB_ADMIN_IA.find((m) => m.key === moduleKey);
  const tab = ia && ia.tabs.find((x) => x.key === tabKey);
  const dataKey = tab && tab.config && tab.config.dataKey;
  if (dataKey) return <SubAdminTablePage t={t} dataKey={dataKey} openDrillFor={openDrillFor} />;
  return <div style={{ color: t.textMuted, padding: 20 }}>Page not found.</div>;
}

function MentorHome({ t }) {
  // Used as the Home/Today page. Page header is provided by chrome.
  // Per spec: Upcoming sessions, pending approvals, next available slot, response speed badge, total earnings MTD
  const me = MENTORS[0];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. KPI strip with response speed + earnings MTD per spec */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Upcoming sessions', value: '4', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Pending requests', value: '2', tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Next slot', value: 'Tue 4pm', tone: 'neutral' }} />
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
          <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Response speed</div>
          <StatusPill t={t} tone={me.responsiveness === 'Fast' ? 'good' : 'warn'}>{me.responsiveness} · auto</StatusPill>
          <div style={{ fontSize: 10, color: t.textDim }}>Avg ~{me.responseHrs}h · auto-calculated</div>
        </div>
        <KPICard t={t} kpi={{ label: 'Earnings MTD', value: '₹' + me.earning.toLocaleString().slice(0, -3) + 'k', tone: 'good' }} />
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 6 }}>
          <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Trust signals</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            <StatusPill t={t} tone="purple">Top mentor</StatusPill>
            <StatusPill t={t} tone="good">Quick responder</StatusPill>
          </div>
        </div>
      </div>

      {/* 2. Action rail */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginRight: 4 }}>Quick actions</span>
        <ActionButton actionId="session.accept_request" t={t} primary />
        <ActionButton actionId="session.suggest_alternative" t={t} soft />
        <ActionButton actionId="session.decline_request" t={t} soft />
        <ActionButton actionId="session.block_slot" t={t} soft />
        <ActionButton actionId="session.join" t={t} soft />
        <div style={{ flex: 1 }} />
        <ActionButton actionId="chatbot.open" t={t} soft />
      </div>

      {/* 3. Upcoming + Requests row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Confirmed sessions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { mentee: 'Aarav Sharma', org: 'IIM Bengaluru', when: 'Today · 4:00 PM', topic: 'Career switch — PM to founder' },
              { mentee: 'Diya Patel', org: 'Stanford GSB', when: 'Tomorrow · 11:00 AM', topic: 'Portfolio review' },
              { mentee: 'Vihaan R.', org: 'External', when: 'Thu · 6:30 PM', topic: 'Mock interview' },
              { mentee: 'Kiara M.', org: 'IIT Mumbai', when: 'Fri · 2:00 PM', topic: 'OKR coaching' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
                <Avatar name={s.mentee} t={t} size={32} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{s.mentee} <span style={{ fontSize: 10, color: t.textDim }}>· {s.org}</span></div>
                  <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{s.topic}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.text }}>{s.when}</div>
                  <button style={{ marginTop: 4, padding: '4px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Pending requests</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { mentee: 'Saanvi K.', when: 'Sat · 10am or Sun · 4pm', topic: 'Tech interview prep' },
              { mentee: 'Reyansh G.', when: 'Mon · 6pm', topic: 'Resume review' },
            ].map((r, i) => (
              <div key={i} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Avatar name={r.mentee} t={t} size={26} />
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{r.mentee}</div>
                </div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>{r.topic} · {r.when}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button style={{ flex: 1, padding: '6px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Accept</button>
                  <button style={{ flex: 1, padding: '6px 10px', background: 'transparent', color: t.text, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Propose</button>
                  <button style={{ padding: '6px 10px', background: 'transparent', color: t.red, border: '1px solid ' + t.red + '55', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
   MENTOR — secondary pages and page router.
   The Today page (MentorHome) already exists above; everything below covers
   the remaining 16 tabs in MENTOR_IA so nothing in the spec is missing.
   ============================================================================ */

function MentorPerformanceSnapshotPage({ t }) {
  // Personal quality + impact: completion %, repeat bookings, avg rating, no-show %, breakthrough reflections
  const me = MENTORS[0];
  const trend = [82, 85, 88, 86, 89, 91, 93, 92, 94, 95, 94, 96];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Completion %', value: '94%', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Repeat bookings', value: '48%', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg rating', value: '★ ' + me.rating, tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'No-show %', value: '2.8%', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Breakthroughs', value: '14', tone: 'purple' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Completion trend</div>
        <LineChart series={[{ data: trend, color: t.green }]} seriesNames={['Completion %']} summary={[{ label: 'Avg', value: '90%' },{ label: 'Last 30d', value: '96%' }]} labels={months} t={t} height={180} />
      </div>
      <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.purple + '55', borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Sparkles size={16} color={t.purple} />
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Breakthrough reflections preview</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { date: 'Apr 14', text: '“Finally understood how to scope a product spec — used at work.” — Aarav Sharma' },
            { date: 'Mar 28', text: '“Aced the case interview using the framework Pratika walked me through.” — Diya Patel' },
          ].map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 12 }}>
              <span style={{ color: t.textDim, fontFamily: FONT_MONO, minWidth: 50 }}>{b.date}</span>
              <span style={{ color: t.text }}>{b.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MentorRequestsPage({ t }) {
  // Manual approval queue with Accept / Suggest time / Decline
  const requests = [
    { id: 'r1', mentee: 'Saanvi Kapoor', topic: 'Tech interview prep', when: 'Sat · 10am or Sun · 4pm', context: 'Targeting MAANG offers in 8 weeks. 2 mock interviews so far. Wants tougher behavioural rounds.' },
    { id: 'r2', mentee: 'Reyansh Gupta', topic: 'Resume review', when: 'Mon · 6pm', context: 'Switching from QA to PM. Has 2 product internships. Wants positioning for FAANG PM roles.' },
    { id: 'r3', mentee: 'Tanvi Iyer', topic: 'Career transition guidance', when: 'Wed · 5pm or Thu · 7pm', context: 'Currently consultant at Big 4. Considering startup PM roles. Needs framework for evaluating offers.' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Open requests', value: String(requests.length), tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Avg response', value: '14m', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Accept rate (30d)', value: '82%', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Oldest pending', value: '4h', tone: 'warn' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 12 }}>
        {requests.map((r) => (
          <div key={r.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={r.mentee} t={t} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{r.mentee}</div>
                <div style={{ fontSize: 11, color: t.textMuted }}>{r.topic}</div>
              </div>
            </div>
            <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>Agenda context</div>
              <div style={{ fontSize: 11, color: t.text, lineHeight: 1.5 }}>{r.context}</div>
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Clock size={11} /> {r.when}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ flex: 1, padding: '8px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Accept</button>
              <button style={{ flex: 1, padding: '8px 10px', background: 'transparent', color: t.text, border: '1px solid ' + t.border, borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Suggest time</button>
              <button style={{ padding: '8px 10px', background: 'transparent', color: t.red, border: '1px solid ' + t.red + '55', borderRadius: 8, fontSize: 12, cursor: 'pointer' }}>Decline</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Generic table for sessions/upcoming, sessions/history, payouts, notifications
function MentorTablePage({ t, dataKey, openDrillFor }) {
  const dataMap = {
    upcoming: { rows: [
        { id: 's1', mentee: 'Aarav Sharma', org: 'IIM Bengaluru', topic: 'Career switch — PM to founder', when: 'Today · 4:00 PM', countdown: '4h 12m', status: 'Confirmed' },
        { id: 's2', mentee: 'Diya Patel', org: 'Stanford GSB', topic: 'Portfolio review', when: 'Tomorrow · 11:00 AM', countdown: '23h', status: 'Confirmed' },
        { id: 's3', mentee: 'Vihaan R.', org: 'External', topic: 'Mock interview', when: 'Thu · 6:30 PM', countdown: '2d 4h', status: 'Confirmed' },
        { id: 's4', mentee: 'Kiara M.', org: 'IIT Mumbai', topic: 'OKR coaching', when: 'Fri · 2:00 PM', countdown: '3d', status: 'Confirmed' },
      ],
      kpis: [{ label: 'Today', value: '1', tone: 'good' },{ label: 'This week', value: '4', tone: 'good' },{ label: 'Next 24h', value: '2', tone: 'good' },{ label: 'Reschedules', value: '0', tone: 'good' }],
      cols: [{ k: 'mentee', l: 'Mentee', kind: 'avatar' },{ k: 'org', l: 'Org' },{ k: 'topic', l: 'Topic' },{ k: 'when', l: 'When', mono: true },{ k: 'countdown', l: 'Countdown', mono: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    history: { rows: range(10).map((i) => ({ id: 'h_'+i, mentee: pick(MENTEE_FIRST) + ' ' + pick(['K.','S.','M.','P.','R.']), org: pick(['IIM Bengaluru','Stanford GSB','External','IIT Mumbai']), topic: pick(['Career strategy','Mock interview','Resume review','System design','OKR coaching']), date: '2026-04-' + String(20 - i).padStart(2, '0'), rating: (4 + Math.random()).toFixed(1), feedback: pick(['Very helpful, will rebook','Concrete frameworks applied','Confidence boost','Need follow-up on caching','Great frameworks']) })),
      kpis: [{ label: 'All-time sessions', value: '284', tone: 'good' },{ label: 'Avg rating', value: '★ 4.8', tone: 'good' },{ label: 'Repeat bookings', value: '48%', tone: 'good' },{ label: 'Last 30d', value: '24', tone: 'neutral' }],
      cols: [{ k: 'mentee', l: 'Mentee' },{ k: 'org', l: 'Org' },{ k: 'topic', l: 'Topic' },{ k: 'date', l: 'Date', mono: true },{ k: 'rating', l: 'Rating', kind: 'rating' },{ k: 'feedback', l: 'Feedback' }] },
    payouts: { rows: [
        { id: 'p1', period: 'Apr 2026', org: 'IIM Bengaluru', sessions: 14, gross: 24800, fee: 1240, net: 23560, status: 'Paid' },
        { id: 'p2', period: 'Apr 2026', org: 'Stanford GSB', sessions: 9, gross: 18200, fee: 910, net: 17290, status: 'Paid' },
        { id: 'p3', period: 'Apr 2026', org: 'External (B2C)', sessions: 7, gross: 11400, fee: 570, net: 10830, status: 'Paid' },
        { id: 'p4', period: 'Apr 2026', org: 'IIT Mumbai', sessions: 4, gross: 6200, fee: 310, net: 5890, status: 'Pending' },
        { id: 'p5', period: 'Mar 2026', org: 'IIM Bengaluru', sessions: 12, gross: 21200, fee: 1060, net: 20140, status: 'Paid' },
        { id: 'p6', period: 'Mar 2026', org: 'External (B2C)', sessions: 9, gross: 14800, fee: 740, net: 14060, status: 'Paid' },
      ],
      kpis: [{ label: 'YTD net', value: '₹84.2k', tone: 'good' },{ label: 'Pending', value: '₹5.9k', tone: 'warn' },{ label: 'Next payout', value: 'Apr 30', tone: 'neutral' },{ label: 'Avg / month', value: '₹19.4k', tone: 'good' }],
      cols: [{ k: 'period', l: 'Period', mono: true },{ k: 'org', l: 'Org' },{ k: 'sessions', l: 'Sessions', mono: true },{ k: 'gross', l: 'Gross', mono: true, money: true },{ k: 'fee', l: 'Fee', mono: true, money: true },{ k: 'net', l: 'Net', mono: true, money: true },{ k: 'status', l: 'Status', kind: 'pill' }] },
    notifications: { rows: [
        { id: 'n1', event: 'New booking request', email: true, whatsapp: true, inapp: true },
        { id: 'n2', event: 'Session reminder (24h)', email: true, whatsapp: true, inapp: true },
        { id: 'n3', event: 'Session reminder (1h)', email: false, whatsapp: true, inapp: true },
        { id: 'n4', event: 'Mentee cancelled', email: true, whatsapp: true, inapp: true },
        { id: 'n5', event: 'New review received', email: true, whatsapp: false, inapp: true },
        { id: 'n6', event: 'Payout processed', email: true, whatsapp: false, inapp: true },
        { id: 'n7', event: 'Marketing updates', email: false, whatsapp: false, inapp: false },
      ],
      kpis: [{ label: 'Active rules', value: '6', tone: 'good' },{ label: 'Channels enabled', value: '3', tone: 'good' },{ label: 'Quiet hours', value: '10p–8a', tone: 'neutral' },{ label: 'Last edit', value: '12d ago', tone: 'neutral' }],
      cols: [{ k: 'event', l: 'Event' },{ k: 'email', l: 'Email', kind: 'toggle' },{ k: 'whatsapp', l: 'WhatsApp', kind: 'toggle' },{ k: 'inapp', l: 'In-app', kind: 'toggle' }] },
  };
  const conf = dataMap[dataKey];
  if (!conf) return <div style={{ color: t.textMuted }}>No data for {dataKey}</div>;
  const renderCell = (row, col) => {
    const v = row[col.k];
    if (col.kind === 'avatar') return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <Avatar name={v} t={t} size={26} />
        <span style={{ fontSize: 12, color: t.text }}>{v}</span>
      </div>
    );
    if (col.kind === 'pill') {
      const tone = String(v).match(/Confirmed|Paid|Done/i) ? 'good' : String(v).match(/Pending|Reschedule/i) ? 'warn' : 'neutral';
      return <StatusPill t={t} tone={tone}>{v}</StatusPill>;
    }
    if (col.kind === 'rating') return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}><span style={{ color: t.yellow }}>★</span> {v}</span>;
    if (col.kind === 'toggle') return v ? <ToggleRight size={20} color={t.accent} /> : <ToggleLeft size={20} color={t.textDim} />;
    if (col.money) return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>₹{Number(v).toLocaleString()}</span>;
    if (col.mono) return <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: t.text }}>{v}</span>;
    return <span style={{ fontSize: 12, color: t.text }}>{v}</span>;
  };
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        {conf.kpis.map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.bgCardElev }}>
              {conf.cols.map((c) => (
                <th key={c.k} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '12px 14px', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{c.l}</th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {conf.rows.map((row) => (
              <tr key={row.id} onClick={() => openDrillFor && openDrillFor(row)} style={{ borderTop: '1px solid ' + t.borderSoft, cursor: openDrillFor ? 'pointer' : 'default' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                {conf.cols.map((c) => (
                  <td key={c.k} style={{ padding: '12px 14px' }}>{renderCell(row, c)}</td>
                ))}
                <td style={{ padding: '12px 14px', textAlign: 'right' }}><ChevronRight size={14} color={t.textDim} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MentorCalendarPage({ t }) {
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const slots = ['8a','10a','12p','2p','4p','6p','8p'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Open slots / week', value: '24', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Booked / week', value: '14', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Blocked time', value: '6h', tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Buffer (default)', value: '15 min', tone: 'neutral' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Weekly availability</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>Apr 27 — May 3</span>
            <IconButton t={t} icon={ChevronLeft} sz={28} />
            <IconButton t={t} icon={ChevronRight} sz={28} />
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 6 }}>
          <div />
          {days.map((d, i) => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, fontWeight: 600, padding: '4px 0' }}>
              {d} <span style={{ color: t.textDim }}>{27 + i}</span>
            </div>
          ))}
          {slots.map((s, si) => (
            <React.Fragment key={s}>
              <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, padding: '8px 4px', textAlign: 'right' }}>{s}</div>
              {days.map((d, di) => {
                const seed = (di * 13 + si * 7) % 11;
                const state = seed < 5 ? 'open' : seed < 8 ? 'booked' : seed < 10 ? 'blocked' : 'empty';
                const styleMap = {
                  open: { bg: t.accentSoft + '88', border: t.accent + '55', color: t.accent, label: 'Open' },
                  booked: { bg: t.accent, border: t.accent, color: '#0a1f28', label: 'Booked' },
                  blocked: { bg: 'transparent', border: t.borderSoft, color: t.textDim, label: 'Blocked' },
                  empty: { bg: 'transparent', border: t.borderSoft, color: t.textDim, label: '+' },
                };
                const s = styleMap[state];
                return (
                  <div key={d + si} style={{
                    padding: '6px 4px', borderRadius: 6, fontSize: 9, textAlign: 'center', fontFamily: FONT_MONO,
                    background: s.bg, color: s.color, border: '1px solid ' + s.border, cursor: 'pointer', fontWeight: 600,
                  }}>{s.label}</div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 14, marginTop: 14, fontSize: 10, color: t.textMuted, alignItems: 'center' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: t.accent, borderRadius: 2 }} /> Booked</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, background: t.accentSoft, border: '1px solid ' + t.accent, borderRadius: 2 }} /> Open</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><span style={{ width: 10, height: 10, border: '1px solid ' + t.borderSoft, borderRadius: 2 }} /> Blocked / empty</span>
          <div style={{ flex: 1 }} />
          <SmartButton label="Add slot" t={t} primary icon={Plus} />
          <SmartButton label="Block time" t={t} soft icon={MinusCircle} />
        </div>
      </div>
    </div>
  );
}

function MentorPreferencesPage({ t }) {
  const [leadTime, setLeadTime] = useState(24);
  const [buffer, setBuffer] = useState(15);
  const [visibility, setVisibility] = useState('public');
  const [autoAccept, setAutoAccept] = useState(false);
  const [maxPerWeek, setMaxPerWeek] = useState(20);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Booking preferences</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Minimum lead time</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>How far ahead can mentees book?</div>
            </div>
            <input type="range" min="1" max="72" value={leadTime} onChange={(e) => setLeadTime(Number(e.target.value))} style={{ accentColor: t.accent }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: t.text, textAlign: 'right' }}>{leadTime} hours</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Buffer between sessions</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>Auto-blocked break time</div>
            </div>
            <input type="range" min="0" max="60" step="5" value={buffer} onChange={(e) => setBuffer(Number(e.target.value))} style={{ accentColor: t.accent }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: t.text, textAlign: 'right' }}>{buffer} minutes</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 200px', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Max sessions per week</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>Caps your weekly load</div>
            </div>
            <input type="range" min="1" max="40" value={maxPerWeek} onChange={(e) => setMaxPerWeek(Number(e.target.value))} style={{ accentColor: t.accent }} />
            <span style={{ fontFamily: FONT_MONO, fontSize: 13, color: t.text, textAlign: 'right' }}>{maxPerWeek} sessions</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Visibility</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>Who can see your profile</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[{ k: 'public', l: 'Public marketplace' },{ k: 'org', l: 'Org-only' },{ k: 'hidden', l: 'Hidden' }].map((opt) => (
                <button key={opt.k} onClick={() => setVisibility(opt.k)} style={{
                  padding: '6px 14px', background: visibility === opt.k ? t.accent : 'transparent',
                  color: visibility === opt.k ? '#0a1f28' : t.textMuted,
                  border: '1px solid ' + (visibility === opt.k ? t.accent : t.border),
                  borderRadius: 999, fontSize: 12, cursor: 'pointer', fontWeight: visibility === opt.k ? 600 : 500,
                }}>{opt.l}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 12, alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>Auto-accept bookings</div>
              <div style={{ fontSize: 10, color: t.textMuted }}>If off, every request needs approval</div>
            </div>
            <button onClick={() => setAutoAccept(!autoAccept)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              {autoAccept ? <ToggleRight size={28} color={t.accent} /> : <ToggleLeft size={28} color={t.textDim} />}
              <span style={{ fontSize: 12, color: t.text }}>{autoAccept ? 'On' : 'Off (manual approval)'}</span>
            </button>
          </div>
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid ' + t.borderSoft, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <SmartButton label="Discard" t={t} soft icon={X} />
          <SmartButton label="Save changes" t={t} primary icon={Check} />
        </div>
      </div>
      <div style={{ background: t.accentSoft + '22', border: '1px dashed ' + t.accent + '55', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Info size={14} color={t.accent} />
        <span style={{ fontSize: 12, color: t.text }}>Estimated impact: ~3 fewer bookable slots per week with current settings. Mentees see your next available slot as <strong>Tue 4pm</strong>.</span>
      </div>
    </div>
  );
}

function MentorInquiryInboxPage({ t }) {
  const conversations = [
    { id: 'c1', mentee: 'Aarav Sharma', last: 'Thanks — see you tomorrow at 4pm. Will share my deck before that.', when: '12m ago', unread: 0, session: 'Today 4pm session' },
    { id: 'c2', mentee: 'Saanvi Kapoor', last: 'Could you share the framework you mentioned? Going through prep this weekend.', when: '2h ago', unread: 2, session: 'Pre-session inquiry' },
    { id: 'c3', mentee: 'Diya Patel', last: 'Sounds great. I will send the portfolio link before our call.', when: '1d ago', unread: 0, session: 'Tomorrow 11am session' },
    { id: 'c4', mentee: 'Reyansh Gupta', last: 'Hi — I had a quick question about the resume structure you suggested.', when: '3d ago', unread: 1, session: 'Past session follow-up' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Active threads', value: String(conversations.length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Unread', value: String(conversations.reduce((s, c) => s + c.unread, 0)), tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Avg reply', value: '14m', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Pre-session chats', value: '3', tone: 'neutral' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14 }}>
        {conversations.map((c, i) => (
          <div key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 14, borderTop: i ? '1px solid ' + t.borderSoft : 'none', cursor: 'pointer' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ position: 'relative' }}>
              <Avatar name={c.mentee} t={t} size={40} />
              {c.unread > 0 && <span style={{ position: 'absolute', top: -2, right: -2, minWidth: 16, height: 16, padding: '0 4px', background: t.red, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT_MONO }}>{c.unread}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                <span style={{ fontSize: 13, color: t.text, fontWeight: c.unread > 0 ? 700 : 600 }}>{c.mentee}</span>
                <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, padding: '1px 6px', background: t.bgInput, borderRadius: 3 }}>{c.session}</span>
              </div>
              <div style={{ fontSize: 12, color: c.unread > 0 ? t.text : t.textMuted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.last}</div>
            </div>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{c.when}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MentorResourcesPage({ t }) {
  const files = [
    { name: 'PM Career Frameworks.pdf', size: '2.4 MB', kind: 'PDF', shared: 'with Aarav Sharma', when: '2h ago', dir: 'sent' },
    { name: 'Resume template — senior PM.docx', size: '184 KB', kind: 'DOCX', shared: 'with Reyansh Gupta', when: '1d ago', dir: 'sent' },
    { name: 'aarav_portfolio.pdf', size: '8.2 MB', kind: 'PDF', shared: 'from Aarav Sharma', when: '3d ago', dir: 'received' },
    { name: 'System design notes.md', size: '12 KB', kind: 'MD', shared: 'with Vihaan R.', when: '5d ago', dir: 'sent' },
    { name: 'diya_case_study.pdf', size: '1.8 MB', kind: 'PDF', shared: 'from Diya Patel', when: '1w ago', dir: 'received' },
    { name: 'Mock interview questions.docx', size: '320 KB', kind: 'DOCX', shared: 'with Saanvi Kapoor', when: '2w ago', dir: 'sent' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Files in library', value: String(files.length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Sent', value: String(files.filter((f) => f.dir === 'sent').length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Received', value: String(files.filter((f) => f.dir === 'received').length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Total size', value: '13.0 MB', tone: 'neutral' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Resource library</div>
          <SmartButton label="Upload file" t={t} primary icon={Plus} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
          {files.map((f, i) => (
            <div key={i} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12, cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: f.dir === 'sent' ? t.accent + '22' : t.purple + '22', color: f.dir === 'sent' ? t.accent : t.purple, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><FileText size={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2, fontFamily: FONT_MONO }}>{f.kind} · {f.size}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, color: t.textMuted }}>{f.shared}</span>
                <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{f.when}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MentorEarningsOverviewPage({ t }) {
  // Total money picture — total earnings shown FIRST, org-wise breakdown only inside filtered tables (per spec note)
  const earningsTrend = [12, 14, 18, 16, 22, 24, 26, 28, 30, 32, 31, 34];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hero number per "Mentors see total earnings first" */}
      <div style={{ background: 'linear-gradient(135deg, ' + t.accent + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.accent + '55', borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total earnings YTD</div>
        <div className="mu-display" style={{ fontSize: 56, color: t.text, lineHeight: 1.05, marginTop: 4 }}>₹84,200</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>Across 4 orgs and self-serve marketplace</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginTop: 18, paddingTop: 18, borderTop: '1px solid ' + t.borderSoft }}>
          <div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Paid</div>
            <div style={{ fontFamily: FONT_MONO, color: t.green, fontWeight: 700, fontSize: 22, marginTop: 4 }}>₹78,310</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pending</div>
            <div style={{ fontFamily: FONT_MONO, color: t.yellow, fontWeight: 700, fontSize: 22, marginTop: 4 }}>₹5,890</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Next payout</div>
            <div style={{ fontFamily: FONT_MONO, color: t.text, fontWeight: 700, fontSize: 22, marginTop: 4 }}>Apr 30</div>
          </div>
          <div>
            <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Avg / month</div>
            <div style={{ fontFamily: FONT_MONO, color: t.text, fontWeight: 700, fontSize: 22, marginTop: 4 }}>₹19,400</div>
          </div>
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Earnings trend</div>
        <LineChart series={[{ data: earningsTrend.map((v) => v * 1000), color: t.accent }]} seriesNames={['Net earnings']} summary={[{ label: 'YTD', value: '₹84.2k' },{ label: 'Avg / mo', value: '₹19.4k' }]} labels={months} t={t} height={180} />
      </div>
      <div style={{ background: t.accentSoft + '22', border: '1px dashed ' + t.accent + '55', borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Info size={14} color={t.accent} />
        <span style={{ fontSize: 12, color: t.text }}>Want the org-wise breakdown? It lives inside <strong>Earnings → Payout Table</strong> with filters by org, period, and status.</span>
        <div style={{ flex: 1 }} />
        <SmartButton label="Download invoice" t={t} soft icon={Download} />
      </div>
    </div>
  );
}

function MentorPerformanceTrendsPage({ t }) {
  // Mentor-quality view: ratings line, response speed, completion trend
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Rating trend</div>
          <StatusPill t={t} tone="good">↑ from 4.6 → 4.8</StatusPill>
        </div>
        <LineChart series={[{ data: [4.4, 4.5, 4.5, 4.6, 4.6, 4.7, 4.7, 4.7, 4.8, 4.8, 4.8, 4.8], color: t.yellow }]} seriesNames={['Avg rating']} summary={[{ label: 'Current', value: '★ 4.8' },{ label: 'Reviews YTD', value: '186' }]} labels={months} t={t} height={160} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Response speed</div>
          <StatusPill t={t} tone="good">Quick responder · auto</StatusPill>
        </div>
        <LineChart series={[{ data: [42, 38, 30, 28, 22, 18, 16, 14, 14, 12, 14, 12], color: t.accent }]} seriesNames={['Avg response (min)']} summary={[{ label: 'Current avg', value: '12 min' },{ label: 'Vs platform avg', value: '↓ 68%' }]} labels={months} t={t} height={160} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Completion trend</div>
          <StatusPill t={t} tone="good">Top quartile</StatusPill>
        </div>
        <LineChart series={[{ data: [82, 85, 88, 86, 89, 91, 93, 92, 94, 95, 94, 96], color: t.green }]} seriesNames={['Completion %']} summary={[{ label: 'Current', value: '96%' },{ label: 'No-show %', value: '2.8%' }]} labels={months} t={t} height={160} />
      </div>
      <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.purple + '55', borderRadius: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Sparkles size={14} color={t.purple} />
        <div style={{ flex: 1, fontSize: 12, color: t.text }}>
          <strong>MIS-lite tip:</strong> Adding 2 more open slots in the next 7 days could push response speed from <em>12m</em> to <em>9m</em>. Quick responder badge is auto-renewed weekly.
        </div>
      </div>
    </div>
  );
}

function MentorBreakthroughsPage({ t }) {
  const events = [
    { date: 'Apr 22, 2026', kind: 'Job offer', who: 'Aarav Sharma', text: 'Switched into Senior PM role at Series-B fintech', sessions: 8, color: t.green, ai: true },
    { date: 'Apr 12, 2026', kind: 'Promotion', who: 'Diya Patel', text: 'Got promoted to Staff Designer — cited mentor’s portfolio review', sessions: 5, color: t.accent, ai: false },
    { date: 'Mar 28, 2026', kind: 'Internship', who: 'Vihaan R.', text: 'Cleared FAANG technical screen using system-design framework', sessions: 4, color: t.blue, ai: true },
    { date: 'Mar 14, 2026', kind: 'Skill confidence', who: 'Saanvi Kapoor', text: 'Self-rated case-interview confidence ↑ from 4 → 8 / 10', sessions: 3, color: t.purple, ai: true },
    { date: 'Feb 22, 2026', kind: 'Job offer', who: 'Reyansh Gupta', text: 'PM offer at growth-stage SaaS — 1.6x previous compensation', sessions: 6, color: t.green, ai: false },
    { date: 'Feb 02, 2026', kind: 'Clarity gain', who: 'Tanvi Iyer', text: 'Decided to leave consulting for startup PM role', sessions: 2, color: t.accent, ai: true },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Total breakthroughs', value: String(events.length), tone: 'purple' }} />
        <KPICard t={t} kpi={{ label: 'Job / internship wins', value: '4', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'AI-drafted', value: String(events.filter((e) => e.ai).length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'This quarter', value: '5', tone: 'good' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Outcome timeline</div>
          <SmartButton label="Add reflection" t={t} primary icon={Plus} />
        </div>
        <Timeline t={t} events={events.map((e) => ({
          date: e.date, color: e.color,
          title: e.kind + ' — ' + e.who,
          detail: e.text + ' · ' + e.sessions + ' sessions linked' + (e.ai ? ' · AI-drafted (confirmed)' : ''),
        }))} />
      </div>
    </div>
  );
}

function MentorPublicProfilePage({ t }) {
  const me = MENTORS[0];
  const reviewCount = 84;
  const similar = MENTORS.slice(1, 4);
  // Plan / session cards per spec — short descriptions, call count + response expectation
  const sessionPlans = [
    { name: 'Single session',    duration: '60 min', price: me.pricePerSession,        calls: '1 call',           respond: 'Replies in <2h', tag: null },
    { name: 'Career sprint',     duration: '4 weeks', price: me.pricePerSession * 4,    calls: '4 calls + chat',   respond: 'Replies same day', tag: 'Most picked' },
    { name: 'Interview prep',    duration: '2 weeks', price: me.pricePerSession * 2,    calls: '2 calls + 5 mocks',respond: 'Replies in <2h',  tag: null },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 14 }}>
        {/* Left column — Marketplace preview + Similar mentors */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Marketplace preview</div>
              <StatusPill t={t} tone="info">What mentees see</StatusPill>
            </div>
            <div style={{ background: '#0a1f28', border: '1px solid ' + t.borderSoft, borderRadius: 12, padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <Avatar name={me.name} t={t} size={64} />
                <div style={{ flex: 1 }}>
                  <div className="mu-display" style={{ fontSize: 22, color: '#f4ead7' }}>{me.name}</div>
                  <div style={{ fontSize: 11, color: '#94a3a8', marginTop: 2 }}>Senior Product Mentor · {me.country}</div>
                  <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                    <StatusPill t={t} tone="purple">Top mentor</StatusPill>
                    <StatusPill t={t} tone="good">Quick responder</StatusPill>
                    <StatusPill t={t} tone="info">★ {me.rating} ({reviewCount} reviews)</StatusPill>
                  </div>
                  {/* Active signal — auto-derived per spec, hide if stale */}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 8, padding: '3px 8px', background: '#163139', borderRadius: 999 }}>
                    <span style={{ width: 6, height: 6, borderRadius: 999, background: '#4ec3a9' }} />
                    <span style={{ fontSize: 10, color: '#94a3a8' }}>Active 2 days ago</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, padding: 12, background: '#163139', borderRadius: 8, marginBottom: 12 }}>
                <div><div style={{ fontSize: 9, color: '#94a3a8', textTransform: 'uppercase' }}>Sessions</div><div style={{ color: '#f4ead7', fontFamily: FONT_MONO, fontWeight: 700 }}>{me.sessions}</div></div>
                <div><div style={{ fontSize: 9, color: '#94a3a8', textTransform: 'uppercase' }}>Usually responds</div><div style={{ color: '#f4ead7', fontFamily: FONT_MONO, fontWeight: 700 }}>within {me.responseHrs}h</div></div>
                <div><div style={{ fontSize: 9, color: '#94a3a8', textTransform: 'uppercase' }}>Next slot · IST</div><div style={{ color: '#f4ead7', fontFamily: FONT_MONO, fontWeight: 700 }}>Tue 4pm</div></div>
              </div>
              <div style={{ fontSize: 12, color: '#f4ead7', lineHeight: 1.5, marginBottom: 12 }}>
                15+ years building product at scale. Coached 280+ mentees through career switches, mock interviews, and 0-to-1 problems. Specialise in PM career transitions and frameworks for founder-style PM work.
              </div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 12, flexWrap: 'wrap' }}>
                {me.domains.concat(['Product strategy','Mock interview','Career switch']).slice(0, 6).map((d, i) => (
                  <span key={i} style={{ padding: '3px 8px', background: '#163139', color: '#94a3a8', borderRadius: 4, fontSize: 10 }}>{d}</span>
                ))}
              </div>
              <button style={{ width: '100%', padding: 10, background: '#4ec3a9', border: 'none', borderRadius: 8, color: '#0a1f28', fontWeight: 700, fontSize: 13 }}>Book a session</button>
            </div>
          </div>

          {/* Similar mentors section — keeps discovery flowing per spec */}
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Similar mentors</div>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>matched on domain · tier · availability · rating</span>
            </div>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 12 }}>If {me.name.split(' ')[0]} isn’t the right fit, these mentors solve adjacent problems.</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {similar.map((s, i) => (
                <div key={s.id} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12, cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Avatar name={s.name} t={t} size={32} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                      <div style={{ fontSize: 10, color: t.textDim }}>★ {s.rating} · {s.sessions}+ sessions</div>
                    </div>
                  </div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 6, lineHeight: 1.4 }}>
                    {s.domains.slice(0, 2).join(', ')}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 10, color: t.green, fontFamily: FONT_MONO }}>Next: {['Wed 11am','Thu 3pm','Fri 5pm'][i]}</span>
                    <button style={{ padding: '3px 8px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent, borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>View</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right column — Plan / session cards (cue 8) + editable profile */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Plan / session cards — clarifies what user gets, short descriptions, call count + response expectation */}
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Plans & sessions</div>
              <SmartButton label="Add plan" t={t} soft icon={Plus} sz={28} />
            </div>
            <div style={{ fontSize: 10, color: t.textDim, marginBottom: 10 }}>What mentees see in your profile right panel</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sessionPlans.map((p, i) => (
                <div key={p.name} style={{
                  padding: 12, background: i === 1 ? t.accent + '11' : t.bgCardElev,
                  border: '1px solid ' + (i === 1 ? t.accent + '66' : t.borderSoft),
                  borderRadius: 10, position: 'relative',
                }}>
                  {p.tag && <span style={{ position: 'absolute', top: -8, right: 10, padding: '2px 7px', background: t.accent, color: '#0a1f28', fontSize: 9, fontWeight: 700, borderRadius: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{p.tag}</span>}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{p.name}</div>
                      <div style={{ display: 'flex', gap: 8, marginTop: 4, fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>
                        <span>{p.duration}</span>
                        <span>·</span>
                        <span>{p.calls}</span>
                      </div>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 10, color: t.green }}>
                        <Clock size={9} /> {p.respond}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, color: t.text, fontFamily: FONT_MONO, fontWeight: 700 }}>₹{p.price.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editable profile fields */}
          <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Profile details</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['Display name', me.name],
                ['Headline', 'Senior Product Mentor · ex-FAANG'],
                ['Hourly rate', '₹' + me.pricePerSession],
                ['Country', me.country],
                ['Years of experience', '15'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{k}</div>
                  <input defaultValue={v} style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
                </div>
              ))}
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Bio (mentees see this)</div>
                <textarea defaultValue="15+ years building product at scale. Coached 280+ mentees through career switches, mock interviews, and 0-to-1 problems." rows={3} style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <SmartButton label="Discard" t={t} soft icon={X} />
                <SmartButton label="Save profile" t={t} primary icon={Check} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MentorAvailabilitySignalsPage({ t }) {
  const me = MENTORS[0];
  // MentorCruise-style trust signals — auto-calculated, not manually claimed (per spec)
  const signals = [
    { name: 'Quick responder', earned: me.responsiveness === 'Fast', state: 'Active', basis: 'Replies under 2 hours on average. Re-evaluated weekly.', icon: Zap },
    { name: 'Top mentor', earned: me.tier === 'Excellent', state: 'Active', basis: 'MIS ≥ 85, ratings ≥ 4.7, ≥ 50 sessions in last 6 months.', icon: BadgeCheck },
    { name: 'Active last week', earned: true, state: 'Active', basis: 'At least one confirmed session in the last 7 days.', icon: Activity },
    { name: 'Usually responds in ' + me.responseHrs + ' hours', earned: true, state: 'Active', basis: 'Auto-calculated from your last 30 booking responses.', icon: Clock },
    { name: 'Next available shown', earned: true, state: 'Active', basis: 'Calendar has at least one open slot in the next 7 days.', icon: Calendar },
    { name: 'Verified credentials', earned: me.kyc === 'Verified', state: 'Active', basis: 'KYC + LOE on file and current.', icon: Shield },
    { name: 'Repeat-booking magnet', earned: false, state: 'Locked', basis: 'Earned when ≥ 35% of mentees book a second session within 60 days. You are at 28%.', icon: RefreshCw },
    { name: 'High-impact mentor', earned: false, state: 'Locked', basis: 'Earned with ≥ 5 confirmed breakthroughs in last quarter. You have 4.', icon: Sparkles },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.accentSoft + '22', border: '1px dashed ' + t.accent + '55', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <Info size={14} color={t.accent} />
        <span style={{ fontSize: 12, color: t.text }}>Signals are <strong>auto-calculated</strong>, not manually claimed. Click any signal to see how it’s calculated.</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10 }}>
        {signals.map((s, i) => {
          const Ic = s.icon;
          const earned = s.earned;
          return (
            <div key={i} style={{
              background: earned ? t.bgCard : t.bgCardElev,
              border: '1px solid ' + (earned ? t.accent + '55' : t.borderSoft),
              borderRadius: 12, padding: 14, position: 'relative',
              opacity: earned ? 1 : 0.7,
            }}>
              {!earned && <div style={{ position: 'absolute', top: 10, right: 10 }}><Lock size={12} color={t.textDim} /></div>}
              <div style={{ width: 36, height: 36, borderRadius: 8, background: earned ? t.accent + '22' : t.bgInput, color: earned ? t.accent : t.textDim, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Ic size={16} /></div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{s.name}</div>
              <StatusPill t={t} tone={earned ? 'good' : 'neutral'}>{s.state}</StatusPill>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 8, lineHeight: 1.5 }}>{s.basis}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MentorComplianceAndPaymentPage({ t }) {
  const items = [
    { name: 'Letter of Engagement (LOE)', state: 'Verified', when: 'Mar 14, 2026', icon: FileText },
    { name: 'PAN / tax ID', state: 'Verified', when: 'Mar 14, 2026', icon: Shield },
    { name: 'GST registration', state: 'Not applicable', when: '—', icon: Shield },
    { name: 'Bank account (payout)', state: 'Verified', when: 'Mar 14, 2026', icon: Banknote },
    { name: 'Address proof', state: 'Pending review', when: '5d ago', icon: FileText },
    { name: 'Background check', state: 'Verified', when: 'Mar 12, 2026', icon: BadgeCheck },
  ];
  const stateMeta = (s) => s === 'Verified' ? { tone: 'good', icon: BadgeCheck }
    : s === 'Pending review' ? { tone: 'warn', icon: Clock }
    : { tone: 'neutral', icon: MinusCircle };
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Compliance items', value: String(items.length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Verified', value: String(items.filter((i) => i.state === 'Verified').length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Pending', value: String(items.filter((i) => i.state === 'Pending review').length), tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Last LOE update', value: '40d ago', tone: 'neutral' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Compliance checklist</div>
        {items.map((it, i) => {
          const meta = stateMeta(it.state);
          const SI = meta.icon;
          const Ic = it.icon;
          return (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 130px 100px 110px', gap: 12, padding: '12px 0', borderTop: i ? '1px solid ' + t.borderSoft : 'none', alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: t.bgInput, color: t.textMuted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Ic size={16} /></div>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 500 }}>{it.name}</div>
              <StatusPill t={t} tone={meta.tone}>{it.state}</StatusPill>
              <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{it.when}</span>
              <SmartButton label="Update details" t={t} soft icon={Edit3} />
            </div>
          );
        })}
      </div>
      <div style={{ background: t.yellowSoft + '33', border: '1px dashed ' + t.yellow, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
        <AlertCircle size={14} color={t.yellow} />
        <span style={{ fontSize: 12, color: t.text }}>Address proof is pending review. Payouts are unaffected, but your verified-credentials badge will renew faster once reviewed.</span>
      </div>
    </div>
  );
}

function MentorPageRouter({ moduleKey, tabKey, t, openDrillFor }) {
  if (moduleKey === 'home' && tabKey === 'today') return <MentorHome t={t} />;
  if (moduleKey === 'home' && tabKey === 'snapshot') return <MentorPerformanceSnapshotPage t={t} />;
  if (moduleKey === 'sessions' && tabKey === 'requests') return <MentorRequestsPage t={t} />;
  if (moduleKey === 'availability' && tabKey === 'calendar') return <MentorCalendarPage t={t} />;
  if (moduleKey === 'availability' && tabKey === 'preferences') return <MentorPreferencesPage t={t} />;
  if (moduleKey === 'requests_chat' && tabKey === 'inbox') return <MentorInquiryInboxPage t={t} />;
  if (moduleKey === 'requests_chat' && tabKey === 'resources') return <MentorResourcesPage t={t} />;
  if (moduleKey === 'earnings' && tabKey === 'overview') return <MentorEarningsOverviewPage t={t} />;
  if (moduleKey === 'impact' && tabKey === 'trends') return <MentorPerformanceTrendsPage t={t} />;
  if (moduleKey === 'impact' && tabKey === 'breakthroughs') return <MentorBreakthroughsPage t={t} />;
  if (moduleKey === 'profile' && tabKey === 'public') return <MentorPublicProfilePage t={t} />;
  if (moduleKey === 'profile' && tabKey === 'signals') return <MentorAvailabilitySignalsPage t={t} />;
  if (moduleKey === 'profile' && tabKey === 'compliance') return <MentorComplianceAndPaymentPage t={t} />;
  // Generic table fallback
  const ia = MENTOR_IA.find((m) => m.key === moduleKey);
  const tab = ia && ia.tabs.find((x) => x.key === tabKey);
  const dataKey = tab && tab.config && tab.config.dataKey;
  if (dataKey) return <MentorTablePage t={t} dataKey={dataKey} openDrillFor={openDrillFor} />;
  return <div style={{ color: t.textMuted, padding: 20 }}>Page not found.</div>;
}

function MenteeHome({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* 1. Top KPI strip — immediate status */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Upcoming', value: '1', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Credits left', value: '8', tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Sessions completed', value: '14', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Learning streak', value: '6 wks', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg mentor rating', value: '★ 4.9', tone: 'good' }} />
      </div>

      {/* 2. Next action row — next best action should be obvious */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
        {[
          { label: 'Join upcoming', detail: 'Today 4pm · Pratika S.', icon: PlayCircle, color: t.accent, primary: true },
          { label: 'Rebook', detail: 'Last mentor', icon: RefreshCw, color: t.blue },
          { label: 'Request credit', detail: 'You have 8 left', icon: Wallet, color: t.orange },
          { label: 'Resume booking', detail: 'Draft saved', icon: Edit3, color: t.purple },
          { label: 'Open chatbot', detail: 'Ask anything', icon: MessageSquare, color: t.textMuted },
        ].map((a, i) => {
          const Ic = a.icon;
          return (
            <button key={i} style={{
              padding: 14, background: a.primary ? a.color : t.bgCard,
              border: '1px solid ' + (a.primary ? a.color : t.border),
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
              display: 'flex', flexDirection: 'column', gap: 8,
              color: a.primary ? '#0a1f28' : t.text,
            }}>
              <Ic size={18} color={a.primary ? '#0a1f28' : a.color} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{a.label}</div>
                <div style={{ fontSize: 10, color: a.primary ? '#0a1f2899' : t.textMuted, marginTop: 2 }}>{a.detail}</div>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Mentor explorer shortcuts */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Find a mentor</div>
          <button style={{ background: 'transparent', border: 'none', color: t.accent, fontSize: 11, cursor: 'pointer' }}>Explore all →</button>
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Saved + recent</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
            {MENTORS.slice(0, 4).map((m) => (
              <div key={m.id} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12, cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Avatar name={m.name} t={t} size={32} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{m.tier} · ★ {m.rating}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                  {m.responsiveness === 'Fast' && <StatusPill t={t} tone="good">Quick responder</StatusPill>}
                  {m.tier === 'Excellent' && <StatusPill t={t} tone="purple">Top mentor</StatusPill>}
                </div>
                <button style={{ width: '100%', padding: '6px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Book next slot</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. Learning ROI row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14 }}>
        <div style={{ background: 'linear-gradient(135deg, ' + t.accent + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.accent + '55', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <Sparkles size={18} color={t.accent} />
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Your learning journey</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
            <div><div style={{ fontSize: 10, color: t.textMuted }}>Clarity gain</div><div className="mu-display" style={{ fontSize: 22, color: t.accent }}>+38%</div></div>
            <div><div style={{ fontSize: 10, color: t.textMuted }}>Skill confidence</div><div className="mu-display" style={{ fontSize: 22, color: t.green }}>↑ 4.6/5</div></div>
            <div><div style={{ fontSize: 10, color: t.textMuted }}>Breakthroughs</div><div className="mu-display" style={{ fontSize: 22, color: t.purple }}>3</div></div>
          </div>
          <div style={{ borderTop: '1px solid ' + t.borderSoft, paddingTop: 12 }}>
            <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recent breakthroughs</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { date: 'Apr 14', text: '“Finally understood how to scope a product spec — used at work.”' },
                { date: 'Mar 28', text: '“Aced the case interview using the framework Pratika walked me through.”' },
                { date: 'Mar 02', text: '“Wrote my first proper PRD for the team.”' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, fontSize: 11, padding: '6px 0' }}>
                  <span style={{ color: t.textDim, fontFamily: FONT_MONO, minWidth: 50 }}>{b.date}</span>
                  <span style={{ color: t.text }}>{b.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Session-to-session progress</div>
          {[
            { skill: 'Product strategy', val: 78, color: t.accent },
            { skill: 'Stakeholder mgmt', val: 64, color: t.blue },
            { skill: 'Data fluency', val: 52, color: t.purple },
            { skill: 'Communication', val: 84, color: t.green },
          ].map((s) => (
            <div key={s.skill} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                <span>{s.skill}</span><span style={{ fontFamily: FONT_MONO, color: t.text }}>{s.val}%</span>
              </div>
              <ProgressBar value={s.val} t={t} color={s.color} />
            </div>
          ))}
        </div>
      </div>

      {/* 5. History + feedback */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Past sessions & feedback</div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>{['Date','Mentor','Topic','My rating','Notes'].map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '8px 0', textTransform: 'uppercase' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {[
              { date: 'Apr 22', mentor: 'Pratika Shah', topic: 'PM career path', rating: 5, notes: 'Great frameworks, will rewatch.' },
              { date: 'Apr 15', mentor: 'Arvind Menon', topic: 'Resume review', rating: 5, notes: 'Concrete edits applied.' },
              { date: 'Apr 08', mentor: 'Sneha Iyer', topic: 'System design', rating: 4, notes: 'Need to revisit caching.' },
              { date: 'Apr 01', mentor: 'Pratika Shah', topic: 'Mock interview', rating: 5, notes: 'Confidence boost.' },
            ].map((r, i) => (
              <tr key={i} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '12px 0', fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{r.date}</td>
                <td style={{ padding: '12px 0', fontSize: 12, color: t.text, fontWeight: 500 }}>{r.mentor}</td>
                <td style={{ padding: '12px 0', fontSize: 12, color: t.textMuted }}>{r.topic}</td>
                <td style={{ padding: '12px 0' }}>{Array.from({length: r.rating}).map((_, i) => <span key={i} style={{ color: t.yellow }}>★</span>)}</td>
                <td style={{ padding: '12px 0', fontSize: 11, color: t.textMuted }}>{r.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ============================================================================
   MENTEE — secondary pages and page router.
   The My Next Actions page (MenteeHome) already exists above; everything
   below covers the remaining 13 tabs in MENTEE_IA.
   ============================================================================ */

function MenteeLearningPulsePage({ t }) {
  // Simple ROI view: sessions completed, learning streak, skill confidence pulse, clarity gain trend
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  const confidence = [4, 5, 6, 6, 7, 8];
  const clarity = [3, 4, 5, 6, 7, 8];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Sessions completed', value: '14', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Learning streak', value: '6 wks', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Confidence (1-10)', value: '8', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Clarity gain', value: '+5', tone: 'purple' }} />
      </div>
      <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.purple + '55', borderRadius: 14, padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Sparkles size={16} color={t.purple} />
          <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Your ROI so far</div>
        </div>
        <div className="mu-display" style={{ fontSize: 32, color: t.text, lineHeight: 1.2 }}>
          14 sessions · confidence ↑ from <span style={{ color: t.textDim }}>4</span> to <span style={{ color: t.purple }}>8</span>
        </div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6 }}>Mentors helped you cross 3 clarity gains: PM career path, mock interview structure, framework for evaluating offers.</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Skill confidence pulse</div>
          <LineChart series={[{ data: confidence, color: t.accent }]} seriesNames={['Confidence']} summary={[{ label: 'Now', value: '8 / 10' },{ label: '6 mo ago', value: '4 / 10' }]} labels={months} t={t} height={150} />
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Clarity gain trend</div>
          <LineChart series={[{ data: clarity, color: t.purple }]} seriesNames={['Clarity']} summary={[{ label: 'Now', value: '8 / 10' },{ label: 'Δ 6 mo', value: '+5' }]} labels={months} t={t} height={150} />
        </div>
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Streak detail</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 6 }}>
          {months.map((m, i) => (
            <div key={m} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO, marginBottom: 4 }}>{m}</div>
              <div className="mu-display" style={{ fontSize: 22, color: t.text }}>{[2, 3, 2, 3, 2, 2][i]}</div>
              <div style={{ fontSize: 9, color: t.textDim, marginTop: 2 }}>sessions</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenteeDiscoverPage({ t }) {
  const [search, setSearch] = useState('');
  const mentors = MENTORS.slice(0, 9);
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Search + filters */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8 }}>
            <Search size={14} color={t.textMuted} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by skill, role, or company (e.g. 'product manager FAANG')" style={{ flex: 1, background: 'transparent', border: 'none', color: t.text, fontSize: 13, fontFamily: FONT_BODY, outline: 'none' }} />
          </div>
          <SmartButton label="Filters" t={t} soft icon={Filter} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['Quick responder','Top mentor','Available this week','★ 4.5+','Under ₹500/session','PM','Design','Data','Engineering'].map((f, i) => (
            <button key={f} style={{
              padding: '5px 10px', background: i < 3 ? t.accent + '22' : 'transparent',
              color: i < 3 ? t.accent : t.textMuted, border: '1px solid ' + (i < 3 ? t.accent : t.borderSoft),
              borderRadius: 999, fontSize: 11, cursor: 'pointer', fontFamily: FONT_BODY, fontWeight: i < 3 ? 600 : 500,
            }}>{f}</button>
          ))}
        </div>
      </div>
      {/* Mentor cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {mentors.map((m, idx) => {
          const isQuick = m.responsiveness === 'Fast';
          const isTop = m.tier === 'Excellent';
          // Marketplace cues per spec — auto-derived signals, plain language, never raw data
          const respondsIn = m.responseHrs <= 1 ? 'within an hour' : m.responseHrs <= 4 ? 'within ' + m.responseHrs + ' hours' : m.responseHrs <= 12 ? 'same day' : m.responseHrs <= 24 ? 'within a day' : 'within ' + Math.ceil(m.responseHrs / 24) + ' days';
          // Active signal: hide if too stale, otherwise show plain-language cue
          const activitySignal = idx % 5 === 0 ? null : idx % 3 === 0 ? 'Active today' : idx % 4 === 1 ? 'Active this week' : 'Active last week';
          const reviewCount = 12 + ((idx * 7) % 80); // mocked aggregate count
          return (
            <div key={m.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 16, cursor: 'pointer', position: 'relative' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent + '55'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.border; }}>
              <button title="Save mentor · notify on slot open" style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', border: 'none', cursor: 'pointer', color: t.textMuted, padding: 4 }}>
                <Bookmark size={14} />
              </button>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <Avatar name={m.name} t={t} size={42} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.name}</div>
                  <div style={{ fontSize: 11, color: t.textMuted }}>{m.country}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 8 }}>
                {isTop && <StatusPill t={t} tone="purple">Top mentor</StatusPill>}
                {isQuick && <StatusPill t={t} tone="good">Quick responder</StatusPill>}
                <StatusPill t={t} tone="info">★ {m.rating} ({reviewCount})</StatusPill>
              </div>
              {/* Plain-language responds-in cue (never raw timestamp) */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Clock size={11} color={t.textMuted} />
                <span style={{ fontSize: 11, color: t.textMuted }}>Usually responds <strong style={{ color: t.text }}>{respondsIn}</strong></span>
              </div>
              {/* Active-last-week engagement signal — hidden if stale per spec */}
              {activitySignal && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: 999, background: activitySignal === 'Active today' ? t.green : activitySignal === 'Active this week' ? t.accent : t.textDim }} />
                  <span style={{ fontSize: 11, color: t.textMuted }}>{activitySignal}</span>
                </div>
              )}
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 10, lineHeight: 1.5 }}>
                Specialises in {m.domains.slice(0, 2).join(' and ').toLowerCase()}. {m.sessions}+ sessions delivered.
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 10, background: t.bgCardElev, borderRadius: 8, marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase' }}>Next slot · your time</div>
                  <div style={{ fontSize: 12, color: t.text, fontFamily: FONT_MONO }}>Tue 4pm IST</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase' }}>From</div>
                  <div style={{ fontSize: 12, color: t.text, fontFamily: FONT_MONO }}>₹{m.pricePerSession}</div>
                </div>
              </div>
              <button style={{ width: '100%', padding: 8, background: t.accent, border: 'none', borderRadius: 8, color: '#0a1f28', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Book a session</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MenteeSavedMentorsPage({ t }) {
  const saved = MENTORS.slice(0, 4).map((m) => ({ ...m, savedOn: ['2 days ago','1 week ago','2 weeks ago','1 month ago'][MENTORS.indexOf(m) % 4], notifyOnSlot: [true, false, true, true][MENTORS.indexOf(m) % 4] }));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Saved mentors', value: String(saved.length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Notify on slot', value: String(saved.filter((m) => m.notifyOnSlot).length), tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Booked from saved', value: '2', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'New slots this week', value: '3', tone: 'good' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        {saved.map((m) => (
          <div key={m.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={m.name} t={t} size={40} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO }}>Saved {m.savedOn}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
              <StatusPill t={t} tone="info">★ {m.rating}</StatusPill>
              {m.tier === 'Excellent' && <StatusPill t={t} tone="purple">Top</StatusPill>}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: t.bgCardElev, borderRadius: 8, marginBottom: 10, fontSize: 11 }}>
              <Bell size={12} color={m.notifyOnSlot ? t.accent : t.textDim} />
              <span style={{ flex: 1, color: m.notifyOnSlot ? t.text : t.textMuted }}>
                {m.notifyOnSlot ? 'Notifying you when slots open' : 'Slot notifications off'}
              </span>
              {m.notifyOnSlot ? <ToggleRight size={20} color={t.accent} /> : <ToggleLeft size={20} color={t.textDim} />}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ flex: 1, padding: 8, background: t.accent, border: 'none', borderRadius: 8, color: '#0a1f28', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Open profile</button>
              <button style={{ padding: 8, background: 'transparent', border: '1px solid ' + t.border, borderRadius: 8, color: t.textMuted, fontSize: 12, cursor: 'pointer' }}>Remove</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenteeBookingFlowPage({ t }) {
  const [step, setStep] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [topic, setTopic] = useState('');
  const [agenda, setAgenda] = useState('');
  const slots = ['Today 4pm','Today 6pm','Tomorrow 10am','Tomorrow 2pm','Wed 11am','Wed 4pm','Thu 6pm','Fri 10am'];
  const mentor = MENTORS[0];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Stepper */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {['Pick a slot','Agenda','Confirm'].map((label, i) => (
          <React.Fragment key={label}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 26, height: 26, borderRadius: 999, background: step > i ? t.green : step === i + 1 ? t.accent : t.bgInput, color: step >= i + 1 ? '#0a1f28' : t.textMuted, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{step > i + 1 ? <Check size={14} /> : i + 1}</div>
              <span style={{ fontSize: 13, color: step === i + 1 ? t.text : t.textMuted, fontWeight: step === i + 1 ? 600 : 500 }}>{label}</span>
            </div>
            {i < 2 && <div style={{ flex: 1, height: 1, background: t.borderSoft }} />}
          </React.Fragment>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          {step === 1 && (
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Available slots</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                {slots.map((s) => (
                  <button key={s} onClick={() => setSelectedSlot(s)} style={{
                    padding: 12, background: selectedSlot === s ? t.accent : t.bgCardElev,
                    color: selectedSlot === s ? '#0a1f28' : t.text,
                    border: '1px solid ' + (selectedSlot === s ? t.accent : t.borderSoft),
                    borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FONT_MONO,
                  }}>{s}</button>
                ))}
              </div>
              <div style={{ marginTop: 14, padding: 12, background: t.accentSoft + '22', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 12, color: t.text, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Info size={13} color={t.accent} />
                Don’t see a time that works? <button style={{ background: 'transparent', border: 'none', color: t.accent, cursor: 'pointer', fontSize: 12, fontFamily: FONT_BODY, textDecoration: 'underline', padding: 0 }}>Request a custom slot</button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 14 }}>
                <button onClick={() => selectedSlot && setStep(2)} disabled={!selectedSlot} style={{ padding: '8px 16px', background: selectedSlot ? t.accent : t.bgInput, color: selectedSlot ? '#0a1f28' : t.textDim, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: selectedSlot ? 'pointer' : 'not-allowed' }}>Next: Agenda →</button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>What do you want to cover?</div>
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Topic (one line)</div>
                <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. PM career switch from QA" style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              </div>
              <div>
                <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Agenda — what would make this session a success? (the mentor sees this)</div>
                <textarea value={agenda} onChange={(e) => setAgenda(e.target.value)} rows={5} placeholder="e.g. I want to walk through my resume, pick the top 2 things to fix, and decide whether to apply now or wait 2 months." style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 14 }}>
                <button onClick={() => setStep(1)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid ' + t.border, borderRadius: 8, color: t.textMuted, fontSize: 12, cursor: 'pointer' }}>← Back</button>
                <button onClick={() => topic && setStep(3)} disabled={!topic} style={{ padding: '8px 16px', background: topic ? t.accent : t.bgInput, color: topic ? '#0a1f28' : t.textDim, border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: topic ? 'pointer' : 'not-allowed' }}>Next: Confirm →</button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div>
              <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Confirm booking</div>
              <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 14, marginBottom: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 8, fontSize: 12 }}>
                  <span style={{ color: t.textMuted }}>Mentor</span><span style={{ color: t.text }}>{mentor.name}</span>
                  <span style={{ color: t.textMuted }}>When</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>{selectedSlot}</span>
                  <span style={{ color: t.textMuted }}>Topic</span><span style={{ color: t.text }}>{topic || '—'}</span>
                  <span style={{ color: t.textMuted }}>Cost</span><span style={{ color: t.text, fontFamily: FONT_MONO }}>2 credits</span>
                  <span style={{ color: t.textMuted }}>You have</span><span style={{ color: t.green, fontFamily: FONT_MONO }}>8 credits</span>
                </div>
              </div>
              <div style={{ padding: 12, background: t.accentSoft + '22', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 12, color: t.text, marginBottom: 14, display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                <Info size={13} color={t.accent} style={{ marginTop: 2 }} />
                <span>You can reschedule for free up to 24 hours before the session. Cancel within 24h and 1 credit is forfeited per the cancellation policy.</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <button onClick={() => setStep(2)} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid ' + t.border, borderRadius: 8, color: t.textMuted, fontSize: 12, cursor: 'pointer' }}>← Back</button>
                <button style={{ padding: '8px 20px', background: t.green, color: '#0a1f28', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Check size={14} /> Confirm booking</button>
              </div>
            </div>
          )}
        </div>
        {/* Mentor summary side panel */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14, height: 'fit-content' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Avatar name={mentor.name} t={t} size={48} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{mentor.name}</div>
              <div style={{ fontSize: 11, color: t.textMuted }}>{mentor.country}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
            <StatusPill t={t} tone="purple">Top mentor</StatusPill>
            <StatusPill t={t} tone="good">Quick responder</StatusPill>
          </div>
          <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5, marginBottom: 10 }}>15+ years building product at scale. Coached 280+ mentees through career transitions.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8, padding: 10, background: t.bgCardElev, borderRadius: 8, fontSize: 11 }}>
            <div><div style={{ color: t.textDim, fontSize: 9, textTransform: 'uppercase' }}>Rating</div><div style={{ color: t.text, fontFamily: FONT_MONO }}>★ {mentor.rating}</div></div>
            <div><div style={{ color: t.textDim, fontSize: 9, textTransform: 'uppercase' }}>Sessions</div><div style={{ color: t.text, fontFamily: FONT_MONO }}>{mentor.sessions}</div></div>
            <div><div style={{ color: t.textDim, fontSize: 9, textTransform: 'uppercase' }}>Responds</div><div style={{ color: t.text, fontFamily: FONT_MONO }}>~{mentor.responseHrs}h</div></div>
            <div><div style={{ color: t.textDim, fontSize: 9, textTransform: 'uppercase' }}>Per session</div><div style={{ color: t.text, fontFamily: FONT_MONO }}>2 credits</div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenteeUpcomingPage({ t }) {
  const upcoming = [
    { id: 'us1', mentor: MENTORS[0].name, topic: 'Career switch — PM to founder', when: 'Today · 4:00 PM', countdown: '4h 12m', joinable: true, status: 'Confirmed' },
    { id: 'us2', mentor: MENTORS[1].name, topic: 'Mock interview — system design', when: 'Tomorrow · 11:00 AM', countdown: '23h', joinable: false, status: 'Confirmed' },
    { id: 'us3', mentor: MENTORS[2].name, topic: 'Resume review (round 2)', when: 'Fri · 6:30 PM', countdown: '3d', joinable: false, status: 'Confirmed' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Today', value: '1', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'This week', value: '3', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Joinable now', value: String(upcoming.filter((u) => u.joinable).length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Reschedules', value: '0', tone: 'good' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {upcoming.map((u) => (
          <div key={u.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 16, display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: 14, alignItems: 'center' }}>
            <Avatar name={u.mentor} t={t} size={48} />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontSize: 14, color: t.text, fontWeight: 600 }}>{u.mentor}</span>
                <StatusPill t={t} tone="good">{u.status}</StatusPill>
              </div>
              <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 6 }}>{u.topic}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 11, color: t.textDim, fontFamily: FONT_MONO }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><Calendar size={11} /> {u.when}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: u.joinable ? t.green : t.textDim }}><Clock size={11} /> in {u.countdown}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button style={{ padding: '8px 16px', background: u.joinable ? t.green : t.accent, color: '#0a1f28', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}><Video size={12} /> {u.joinable ? 'Join now' : 'Join'}</button>
              <SmartButton label="Reschedule" t={t} soft icon={Edit3} />
              <SmartButton label="Cancel" t={t} soft icon={X} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenteeHistoryPage({ t }) {
  const history = range(8).map((i) => ({
    id: 'h_'+i,
    mentor: MENTORS[i % MENTORS.length].name,
    topic: pick(['Resume review','Career strategy','Mock interview','System design','Portfolio review','OKR coaching','PM case prep']),
    date: '2026-04-' + String(20 - i*2).padStart(2, '0'),
    rating: 5,
    feedback: pick(['Concrete frameworks I could apply at work next day','Mentor was very candid — exactly the feedback I needed','Walked through 3 hard questions and unblocked me','Pushed me to think harder about positioning','Reframed how I think about this entire problem']),
    yourNotes: pick(['Need to follow up on the SWOT framework next time','Update resume with “impact-first” opening lines','Try the 3-2-1 prep method before next mock','Reach out to the 2 contacts mentor suggested','Re-read the case prep doc before Friday']),
  }));
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Sessions completed', value: String(history.length + 6), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Mentors worked with', value: '5', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg rating given', value: '★ 4.9', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Notes captured', value: String(history.length), tone: 'neutral' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {history.map((h) => (
          <div key={h.id} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={h.mentor} t={t} size={32} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{h.mentor} · {h.topic}</div>
                <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{h.date}</div>
              </div>
              <span style={{ fontSize: 12, color: t.yellow, fontFamily: FONT_MONO }}>★ {h.rating}.0</span>
              <SmartButton label="Rebook" t={t} soft icon={RefreshCw} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{ background: t.bgCardElev, padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Mentor’s feedback</div>
                <div style={{ fontSize: 11, color: t.text, lineHeight: 1.5 }}>“{h.feedback}”</div>
              </div>
              <div style={{ background: t.bgCardElev, padding: 10, borderRadius: 8 }}>
                <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', marginBottom: 4 }}>Your notes</div>
                <div style={{ fontSize: 11, color: t.text, lineHeight: 1.5 }}>{h.yourNotes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MenteeBalancePage({ t }) {
  const balance = 8;
  const total = 24;
  const expiring = 4;
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Hero balance card */}
      <div style={{ background: balance < 5 ? 'linear-gradient(135deg, ' + t.red + '33 0%, ' + t.bgCard + ' 100%)' : 'linear-gradient(135deg, ' + t.accent + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + (balance < 5 ? t.red : t.accent) + '55', borderRadius: 14, padding: 24 }}>
        <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Credits remaining</div>
        <div className="mu-display" style={{ fontSize: 56, color: t.text, lineHeight: 1, marginTop: 4 }}>{balance}</div>
        <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>of {total} purchased · ~{Math.floor(balance / 2)} sessions left at 2-credit tier</div>
        <div style={{ marginTop: 16 }}>
          <ProgressBar value={(balance / total) * 100} t={t} color={balance < 5 ? t.red : balance < 10 ? t.yellow : t.accent} />
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
          <button style={{ padding: '10px 20px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={13} /> Buy credits
          </button>
          <button style={{ padding: '10px 20px', background: t.orange + '22', color: t.orange, border: '1px solid ' + t.orange, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Send size={12} /> Request from org
          </button>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, alignSelf: 'center' }}>Powered by Razorpay</span>
        </div>
      </div>

      {/* Low credit alert */}
      {balance < 10 && (
        <div style={{ background: t.yellowSoft + '33', border: '1px dashed ' + t.yellow, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <AlertCircle size={14} color={t.yellow} />
          <div style={{ flex: 1, fontSize: 12, color: t.text }}>
            Heads up — at your current pace you’ll run out of credits in <strong>3 weeks</strong>. Top up now or request from your org to avoid a booking gap.
          </div>
        </div>
      )}

      {/* Validity & expiry */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Validity & expiry</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: t.bgCardElev, borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: t.text }}>Active</span>
              <span style={{ fontFamily: FONT_MONO, color: t.text, fontWeight: 600 }}>{balance - expiring} credits · no expiry</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: 10, background: t.bgCardElev, borderRadius: 8 }}>
              <span style={{ fontSize: 12, color: t.text }}>Expiring soon</span>
              <span style={{ fontFamily: FONT_MONO, color: t.yellow, fontWeight: 600 }}>{expiring} credits · in 12d</span>
            </div>
          </div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Top-up packs</div>
          {[
            { credits: 5, price: '₹2,499', tag: null },
            { credits: 12, price: '₹5,499', tag: 'Most popular' },
            { credits: 30, price: '₹12,999', tag: 'Best value' },
          ].map((pack, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: t.bgCardElev, border: '1px solid ' + (pack.tag ? t.accent + '55' : t.borderSoft), borderRadius: 8, marginBottom: 6, position: 'relative' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{pack.credits} credits</div>
                <div style={{ fontSize: 10, color: t.textMuted }}>{pack.price} · ~₹{Math.round(parseInt(pack.price.replace(/\D/g, '')) / pack.credits)} per credit</div>
              </div>
              {pack.tag && <StatusPill t={t} tone="purple">{pack.tag}</StatusPill>}
              <button style={{ padding: '6px 12px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Buy</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenteeUsageHistoryPage({ t }) {
  const usage = [
    { id: 'u1', when: 'Apr 22', mentor: MENTORS[0].name, topic: 'Career switch', credits: 2, status: 'Used' },
    { id: 'u2', when: 'Apr 15', mentor: MENTORS[1].name, topic: 'Resume review', credits: 2, status: 'Used' },
    { id: 'u3', when: 'Apr 12', mentor: MENTORS[2].name, topic: 'Mock interview', credits: 3, status: 'Used' },
    { id: 'u4', when: 'Apr 09', mentor: '—', topic: 'Top-up', credits: 12, status: 'Added' },
    { id: 'u5', when: 'Apr 02', mentor: MENTORS[0].name, topic: 'Career switch (no-show)', credits: 1, status: 'Refunded' },
    { id: 'u6', when: 'Mar 28', mentor: MENTORS[1].name, topic: 'Portfolio review', credits: 2, status: 'Used' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Used (90d)', value: '12', tone: 'neutral' }} />
        <KPICard t={t} kpi={{ label: 'Added (90d)', value: '12', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Refunded', value: '1', tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Avg / week', value: '0.9', tone: 'neutral' }} />
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: t.bgCardElev }}>
              {['Date','Mentor','What for','Credits','Status'].map((h) => (
                <th key={h} style={{ textAlign: 'left', fontSize: 10, color: t.textMuted, padding: '12px 14px', textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>{h}</th>
              ))}
              <th style={{ width: 40 }} />
            </tr>
          </thead>
          <tbody>
            {usage.map((u) => (
              <tr key={u.id} style={{ borderTop: '1px solid ' + t.borderSoft }}>
                <td style={{ padding: '12px 14px', fontFamily: FONT_MONO, fontSize: 11, color: t.textMuted }}>{u.when}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: t.text, fontWeight: 500 }}>{u.mentor}</td>
                <td style={{ padding: '12px 14px', fontSize: 12, color: t.textMuted }}>{u.topic}</td>
                <td style={{ padding: '12px 14px', fontFamily: FONT_MONO, fontSize: 12, color: u.status === 'Added' || u.status === 'Refunded' ? t.green : t.text, fontWeight: 600 }}>{u.status === 'Used' ? '−' : '+'}{u.credits}</td>
                <td style={{ padding: '12px 14px' }}><StatusPill t={t} tone={u.status === 'Used' ? 'neutral' : u.status === 'Added' ? 'good' : 'info'}>{u.status}</StatusPill></td>
                <td style={{ padding: '12px 14px', textAlign: 'right' }}><ChevronRight size={14} color={t.textDim} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MenteeBreakthroughLogPage({ t }) {
  const events = [
    { date: 'Apr 22, 2026', kind: 'Job offer', text: 'Switched into Senior PM role at Series-B fintech', sessions: 8, color: t.green, ai: true, confirmed: true },
    { date: 'Apr 12, 2026', kind: 'Skill confidence', text: 'Self-rated case-interview confidence rose from 4 to 8 / 10', sessions: 5, color: t.purple, ai: true, confirmed: true },
    { date: 'Mar 28, 2026', kind: 'Internship cleared', text: 'Cleared FAANG technical screen using mentor’s system-design framework', sessions: 4, color: t.blue, ai: true, confirmed: true },
    { date: 'Mar 14, 2026', kind: 'Clarity gain', text: 'Decided to leave consulting for startup PM role — clear on what you want', sessions: 2, color: t.accent, ai: true, confirmed: false },
    { date: 'Feb 20, 2026', kind: 'Skill confidence', text: 'Resume positioning sharpened — stopped second-guessing', sessions: 3, color: t.purple, ai: false, confirmed: true },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
        <KPICard t={t} kpi={{ label: 'Total breakthroughs', value: String(events.length), tone: 'purple' }} />
        <KPICard t={t} kpi={{ label: 'Job / internship wins', value: String(events.filter((e) => /job|internship/i.test(e.kind)).length), tone: 'good' }} />
        <KPICard t={t} kpi={{ label: 'Pending confirmation', value: String(events.filter((e) => !e.confirmed).length), tone: 'warn' }} />
        <KPICard t={t} kpi={{ label: 'Last 30 days', value: '2', tone: 'good' }} />
      </div>
      {events.some((e) => !e.confirmed) && (
        <div style={{ background: 'linear-gradient(135deg, ' + t.purple + '22 0%, ' + t.bgCard + ' 100%)', border: '1px dashed ' + t.purple + '55', borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles size={14} color={t.purple} />
          <span style={{ fontSize: 12, color: t.text, flex: 1 }}>
            We drafted <strong>{events.filter((e) => !e.confirmed).length} breakthrough</strong> from your last sessions. Take a moment to confirm or edit them.
          </span>
        </div>
      )}

      {/* Cohort outcome mix — pie chart per "Sample Dashboard Visuals" spec image */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12, gap: 14 }}>
          <div>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Reflective outcome mix</div>
            <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>How peers in your cohort have grown this quarter</div>
          </div>
          <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{REFLECTIVE_OUTCOME_MIX.reduce((a, o) => a + o.count, 0)} milestones · cohort sample</span>
        </div>
        {(() => {
          const total = REFLECTIVE_OUTCOME_MIX.reduce((a, o) => a + o.count, 0);
          return (
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, alignItems: 'center' }}>
              <PieChart
                t={t} size={200}
                slices={REFLECTIVE_OUTCOME_MIX.map((o) => ({ value: o.count, color: o.color, label: o.type }))}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {REFLECTIVE_OUTCOME_MIX.map((o) => {
                  const pct = Math.round((o.count / total) * 100);
                  return (
                    <div key={o.type} style={{ display: 'grid', gridTemplateColumns: '14px 1fr 50px 50px', gap: 10, alignItems: 'center', padding: '8px 12px', background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                      <span style={{ width: 10, height: 10, borderRadius: 999, background: o.color }} />
                      <span style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{o.type}</span>
                      <span style={{ fontSize: 14, color: o.color, fontFamily: FONT_MONO, fontWeight: 700, textAlign: 'right' }}>{o.count}</span>
                      <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, textAlign: 'right' }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Reflective milestones</div>
          <ActionButton actionId="mentee.add_milestone" t={t} primary />
        </div>
        <Timeline t={t} events={events.map((e) => ({
          date: e.date, color: e.color,
          title: e.kind + (e.confirmed ? '' : ' · awaiting your confirmation'),
          detail: e.text + ' · ' + e.sessions + ' sessions linked' + (e.ai ? ' · AI-drafted' : ''),
        }))} />
      </div>
    </div>
  );
}

function MenteeGrowthPage({ t }) {
  // Simple trend view: confidence trend, mentor variety, repeat learning themes
  const months = ['Nov','Dec','Jan','Feb','Mar','Apr'];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>Confidence trend</div>
        <LineChart series={[{ data: [4, 5, 6, 6, 7, 8], color: t.accent }]} seriesNames={['Confidence']} summary={[{ label: 'Now', value: '8 / 10' },{ label: '6mo ago', value: '4 / 10' }]} labels={months} t={t} height={170} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Mentor variety</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {MENTORS.slice(0, 5).map((m, i) => (
              <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 8, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                <Avatar name={m.name} t={t} size={28} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 500 }}>{m.name}</div>
                  <div style={{ fontSize: 10, color: t.textDim }}>{m.domains[0]}</div>
                </div>
                <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.text }}>{[5, 3, 2, 2, 1][i]} sessions</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: t.textMuted }}>You’ve worked with 5 mentors so far.</div>
        </div>
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>Repeat learning themes</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { theme: 'PM career strategy', count: 5, weight: 100 },
              { theme: 'Resume positioning', count: 3, weight: 60 },
              { theme: 'Mock interviews', count: 3, weight: 60 },
              { theme: 'Case prep', count: 2, weight: 40 },
              { theme: 'System design', count: 1, weight: 20 },
            ].map((th, i) => (
              <div key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                  <span>{th.theme}</span>
                  <span style={{ fontFamily: FONT_MONO, color: t.text }}>{th.count}×</span>
                </div>
                <ProgressBar value={th.weight} t={t} color={th.weight > 70 ? t.accent : t.blue} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenteeProfilePage({ t }) {
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 14 }}>Your profile</div>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 16, alignItems: 'flex-start' }}>
          <Avatar name="Aarav Sharma" t={t} size={100} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              ['Display name', 'Aarav Sharma'],
              ['Email', 'aarav.s@iimb.ac.in'],
              ['Phone', '+91 98765 43210'],
              ['Country', 'India'],
              ['Time zone', 'Asia/Kolkata (IST)'],
              ['Org', 'IIM Bengaluru — MBA 2026'],
              ['Goal in 6 months', 'Get into PM role at growth-stage SaaS'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k}</span>
                <input defaultValue={v} style={{ padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              </div>
            ))}
          </div>
        </div>
        <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px solid ' + t.borderSoft, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <SmartButton label="Discard" t={t} soft icon={X} />
          <SmartButton label="Save profile" t={t} primary icon={Check} />
        </div>
      </div>
    </div>
  );
}

function MenteePreferencesPage({ t }) {
  const [prefs, setPrefs] = useState({
    emailNotif: true, whatsappNotif: true, inappNotif: true,
    chatbotEnabled: true, hideFromMentor: false, allowAnalytics: true,
  });
  const toggle = (k) => setPrefs({ ...prefs, [k]: !prefs[k] });
  const groups = [
    { title: 'Notifications', items: [
      { key: 'emailNotif', label: 'Email notifications' },
      { key: 'whatsappNotif', label: 'WhatsApp notifications' },
      { key: 'inappNotif', label: 'In-app notifications' },
    ]},
    { title: 'Chatbot', items: [
      { key: 'chatbotEnabled', label: 'Show chatbot help on every page' },
    ]},
    { title: 'Privacy', items: [
      { key: 'hideFromMentor', label: 'Hide my real name from mentors before booking' },
      { key: 'allowAnalytics', label: 'Use my session data to improve the platform (anonymised)' },
    ]},
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {groups.map((g) => (
        <div key={g.title} style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div className="mu-display" style={{ fontSize: 16, color: t.text, marginBottom: 12 }}>{g.title}</div>
          {g.items.map((it, i) => (
            <div key={it.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', borderTop: i ? '1px solid ' + t.borderSoft : 'none' }}>
              <span style={{ flex: 1, fontSize: 13, color: t.text }}>{it.label}</span>
              <button onClick={() => toggle(it.key)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                {prefs[it.key] ? <ToggleRight size={26} color={t.accent} /> : <ToggleLeft size={26} color={t.textDim} />}
              </button>
            </div>
          ))}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <SmartButton label="Save preferences" t={t} primary icon={Check} />
      </div>
    </div>
  );
}

function MenteeHelpPage({ t }) {
  const faqs = [
    { q: 'How do I book a session?', a: 'Pick a mentor in Discover, then go to Sessions → Booking Flow.' },
    { q: 'Can I cancel a booking?', a: 'Yes — free up to 24 hours before. Within 24h, 1 credit is forfeited.' },
    { q: 'How do credits work?', a: 'Sessions cost 1, 2, or 3 credits depending on the mentor tier. Buy more anytime.' },
    { q: 'What if my mentor is a no-show?', a: 'You get a full refund automatically and can rebook with another mentor.' },
    { q: 'How do I get more credits if my org provides them?', a: 'Click “Request from org” on the Balance page.' },
    { q: 'How is my progress measured?', a: 'See Progress → Learning Pulse for confidence and clarity gains over time.' },
  ];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {/* Chatbot */}
        <div style={{ background: 'linear-gradient(135deg, ' + t.accent + '22 0%, ' + t.bgCard + ' 100%)', border: '1px solid ' + t.accent + '55', borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <Bot size={18} color={t.accent} />
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Ask the assistant</div>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>Most questions get answered instantly. If not, we escalate to a human within 24 hours.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12, marginBottom: 10, minHeight: 120, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ alignSelf: 'flex-start', maxWidth: '80%', background: t.accent + '22', color: t.text, padding: '8px 12px', borderRadius: 12, fontSize: 12 }}>Hi Aarav! What can I help you with today?</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <input placeholder="Type your question..." style={{ flex: 1, padding: '10px 12px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, outline: 'none' }} />
            <button style={{ padding: '10px 16px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Send</button>
          </div>
        </div>
        {/* Raise ticket */}
        <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <ShieldAlert size={18} color={t.orange} />
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>Need a human?</div>
          </div>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 12 }}>Raise a ticket if it’s urgent or needs to involve your org admin.</div>
          <select style={{ width: '100%', padding: '10px 12px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, marginBottom: 10 }}>
            <option>Booking issue</option>
            <option>Credit / refund</option>
            <option>Mentor problem</option>
            <option>Account / profile</option>
            <option>Other</option>
          </select>
          <textarea placeholder="Describe what happened..." rows={4} style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical', marginBottom: 10 }} />
          <button style={{ width: '100%', padding: 10, background: t.orange + '22', color: t.orange, border: '1px solid ' + t.orange, borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Raise ticket</button>
        </div>
      </div>
      {/* FAQ */}
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 18 }}>
        <div className="mu-display" style={{ fontSize: 18, color: t.text, marginBottom: 12 }}>FAQ shortcuts</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 12 }}>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 4 }}>{f.q}</div>
              <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MenteePageRouter({ moduleKey, tabKey, t }) {
  if (moduleKey === 'home' && tabKey === 'next') return <MenteeHome t={t} />;
  if (moduleKey === 'home' && tabKey === 'pulse') return <MenteeLearningPulsePage t={t} />;
  if (moduleKey === 'explorer' && tabKey === 'discover') return <MenteeDiscoverPage t={t} />;
  if (moduleKey === 'explorer' && tabKey === 'saved') return <MenteeSavedMentorsPage t={t} />;
  if (moduleKey === 'sessions' && tabKey === 'booking') return <MenteeBookingFlowPage t={t} />;
  if (moduleKey === 'sessions' && tabKey === 'upcoming') return <MenteeUpcomingPage t={t} />;
  if (moduleKey === 'sessions' && tabKey === 'history') return <MenteeHistoryPage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'balance') return <MenteeBalancePage t={t} />;
  if (moduleKey === 'credits' && tabKey === 'usage') return <MenteeUsageHistoryPage t={t} />;
  if (moduleKey === 'progress' && tabKey === 'breakthroughs') return <MenteeBreakthroughLogPage t={t} />;
  if (moduleKey === 'progress' && tabKey === 'growth') return <MenteeGrowthPage t={t} />;
  if (moduleKey === 'profile' && tabKey === 'profile') return <MenteeProfilePage t={t} />;
  if (moduleKey === 'profile' && tabKey === 'preferences') return <MenteePreferencesPage t={t} />;
  if (moduleKey === 'support' && tabKey === 'help') return <MenteeHelpPage t={t} />;
  return <div style={{ color: t.textMuted, padding: 20 }}>Page not found.</div>;
}

function TablePage({ t, kpis, cols, dataKey, openDrillFor }) {
  const dataMap = {
    orgs: ORGS, mentors: MENTORS, mentees: MENTEES, users: USERS_ALL, roles: ROLES,
    programmes: PROGRAMMES, websites: WEBSITES, risk_signals: RISK_SIGNALS, chatbot: CHATBOT_HANDOFFS,
    tickets: TICKETS,
  };
  const rows = dataMap[dataKey] || [];
  return (
    <div className="mu-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(' + kpis.length + ', 1fr)', gap: 12 }}>
        {kpis.map((k, i) => <KPICard key={i} kpi={k} t={t} />)}
      </div>
      <DataTable rows={rows} cols={cols} t={t} dataKey={dataKey} onRowClick={openDrillFor} />
    </div>
  );
}

/* ============================================================================
   PAGE ROUTER — picks the archetype renderer
   ============================================================================ */

function PageRouter({ tabConfig, t, openDrillFor, onAction }) {
  const arc = tabConfig.archetype;
  const cfg = tabConfig.config || {};
  if (arc === 'executive') return <ExecutiveSummary t={t} onCreateOrg={() => onAction('Onboard Organization')} openDrillFor={openDrillFor} onAction={onAction} />;
  if (arc === 'charts') return <ChartsDashboard tab={tabConfig} t={t} kpis={cfg.kpis || []} charts={cfg.charts || []} onAction={onAction} />;
  if (arc === 'table') return <TablePage t={t} kpis={cfg.kpis || []} cols={cfg.cols || []} dataKey={cfg.dataKey} openDrillFor={openDrillFor} />;
  if (arc === 'pipeline') {
    const kindMap = { onboarding: 'onboarding', access: 'access', refunds: 'refunds', abuse: 'abuse', compliance: 'compliance' };
    const kind = kindMap[tabConfig.key] || 'onboarding';
    return <PipelinePage t={t} kind={kind} onAction={onAction} />;
  }
  if (arc === 'mis_heatmap') return <MISHeatmapPage t={t} />;
  if (arc === 'capacity') return <CapacityPage t={t} />;
  if (arc === 'rule_builder') return <RuleBuilderPage t={t} kind={tabConfig.key === 'engine' ? 'engine' : 'policy'} />;
  if (arc === 'audit') return <AuditLogPage t={t} />;
  if (arc === 'permissions') return <PermissionsPage t={t} />;
  if (arc === 'tickets') return <TicketsPage t={t} />;
  if (arc === 'sla') return <SLAPage t={t} />;
  if (arc === 'templates') return <TemplatesPage t={t} />;
  if (arc === 'integrations') return <IntegrationsPage t={t} />;
  if (arc === 'flags') return <FlagsPage t={t} />;
  if (arc === 'controllers') return <ControllersPage t={t} />;
  if (arc === 'pricing') return <PricingPage t={t} />;
  if (arc === 'invoices') return <InvoicesPage t={t} />;
  if (arc === 'exports') return <ExportsPage t={t} />;
  if (arc === 'reports_grid') return <ReportsGridPage t={t} />;
  if (arc === 'system_status') return <SystemStatusPage t={t} />;
  return <div style={{ color: t.text, padding: 40, textAlign: 'center' }}>{tabConfig.label} — coming soon</div>;
}

/* ============================================================================
   APP CHROME: Sidebar, Header, Action Center
   ============================================================================ */

function Sidebar({ t, currentModule, onSelectModule, collapsed, onToggleCollapse, ia, brandSubLabel }) {
  const moduleList = ia || IA;
  return (
    <div style={{
      width: collapsed ? 64 : 220, flexShrink: 0,
      background: t.bgPanel, borderRight: '1px solid ' + t.border,
      display: 'flex', flexDirection: 'column', padding: '16px 10px',
      transition: 'width 200ms ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '4px 8px 16px' }}>
        {collapsed ? (
          /* Collapsed: just the M mark from the logo */
          <svg width="18" height="18" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M8.70416 34.5284C8.36922 33.8855 8.09011 33.356 7.81099 32.8076C7.56909 32.3348 7.32719 31.8432 7.14112 31.3515C6.69453 30.1413 6.862 29.574 7.92264 28.8932C10.6394 27.1346 13.3375 25.3759 16.0728 23.6551C21.2271 20.4404 26.4 17.2635 31.573 14.0677C31.8893 13.8786 32.187 13.6517 32.4103 13.2924C32.1684 13.387 31.9079 13.4815 31.666 13.595C24.1113 17.4148 16.538 21.2346 8.98327 25.0545C8.44365 25.3192 7.90403 25.584 7.3458 25.792C6.21073 26.2269 5.6339 26.0189 5.03845 24.9788C4.81516 24.6195 4.62909 24.2224 4.44301 23.8442C3.99643 22.8609 4.08946 22.3882 4.92681 21.6885C5.96884 20.8375 7.01086 19.9488 8.10872 19.1735C11.8861 16.5071 15.6634 13.8597 19.478 11.2691C20.3153 10.6828 21.2829 10.2668 22.1947 9.8319C22.6413 9.6239 23.1251 9.4348 23.6461 9.7373C23.981 10.4559 23.4228 10.9854 23.1437 11.7985C24.1857 11.2691 25.0603 10.8341 25.9348 10.3992C30.9403 7.8274 36.0202 5.3502 41.2303 3.1945C44.1703 1.9653 47.1848 0.944196 50.3481 0.395796C51.2598 0.244496 52.0972 0.357996 52.9159 0.830696C53.5672 1.2089 53.8649 1.7384 53.7905 2.5137C53.6416 4.0076 53.0834 5.3502 52.3391 6.6361C52.1344 6.9954 51.8925 7.3547 51.6134 7.8085C52.0786 8.0544 52.4693 8.3191 52.8787 8.4893C53.3439 8.6784 53.53 8.9999 53.53 9.4726C53.53 10.4181 53.53 11.3447 53.0834 12.1957C52.9717 12.4226 52.8229 12.6495 52.7671 12.8764C52.2833 15.0511 50.776 16.3559 49.0455 17.4905C48.6734 17.7363 48.3012 18.001 47.9849 18.4549C48.692 18.3414 49.3991 18.228 50.1062 18.1334C50.7016 18.0389 51.2971 17.8687 51.8925 17.8876C52.4321 17.8876 52.9904 18.0767 53.5114 18.2658C53.9021 18.3981 54.2557 18.6818 54.6464 18.852C55.428 19.1924 55.8001 19.8164 55.7629 20.6295C55.7257 21.3859 55.614 22.1234 55.428 22.8609C54.665 25.9243 53.1392 28.4961 50.8505 30.6897C45.8078 35.5117 40.5046 40.0501 35.127 44.4751C34.6432 44.8722 34.178 45.3071 33.657 45.761C36.8203 45.4206 39.872 45.0802 42.9236 44.7398C48.9897 45.1369 51.0552 45.4584 51.9483 46.2148C51.7436 46.9712 51.111 47.3305 50.5155 47.6709C47.9105 49.1837 45.2868 50.6776 42.6445 52.1526C41.342 52.8711 40.058 53.6464 38.6811 54.1948C36.7087 54.9701 34.6804 55.5942 32.6336 56.1993C29.6192 57.0881 26.5675 57.9201 23.5345 58.7522C21.2829 59.3762 20.1293 59.0547 18.3987 56.8422C17.4498 55.632 16.7241 54.2705 16.2216 52.7955C15.7937 51.5853 15.8681 50.4317 16.6682 49.4295C17.6544 48.2193 18.622 46.9523 19.7943 45.9312C23.5345 42.6408 27.3676 39.4639 31.1636 36.2492C32.5778 35.0579 34.0106 33.9044 35.3317 32.5618C35.1084 32.6563 34.8665 32.7509 34.6432 32.8643C25.2836 37.5351 15.9239 42.2059 6.56428 46.8767C5.96884 47.1792 5.33618 47.425 4.72212 47.6898C4.1825 47.9167 3.66149 47.8411 3.23351 47.4629C2.80554 47.0847 2.39617 46.6876 2.04262 46.2526C1.18667 45.1369 0.647049 43.851 0.16325 42.5273C-0.208903 41.5062 0.0516048 40.712 0.981987 39.9934C1.89376 39.3126 2.82414 38.6697 3.75453 38.0078C5.37339 36.8543 6.99226 35.7197 8.72277 34.5095" fill={t.text} />
          </svg>
        ) : (
          /* Expanded: full wordmark */
          <svg width="92" height="25" viewBox="0 0 219 60" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M8.70416 34.5284C8.36922 33.8855 8.09011 33.356 7.81099 32.8076C7.56909 32.3348 7.32719 31.8432 7.14112 31.3515C6.69453 30.1413 6.862 29.574 7.92264 28.8932C10.6394 27.1346 13.3375 25.3759 16.0728 23.6551C21.2271 20.4404 26.4 17.2635 31.573 14.0677C31.8893 13.8786 32.187 13.6517 32.4103 13.2924C32.1684 13.387 31.9079 13.4815 31.666 13.595C24.1113 17.4148 16.538 21.2346 8.98327 25.0545C8.44365 25.3192 7.90403 25.584 7.3458 25.792C6.21073 26.2269 5.6339 26.0189 5.03845 24.9788C4.81516 24.6195 4.62909 24.2224 4.44301 23.8442C3.99643 22.8609 4.08946 22.3882 4.92681 21.6885C5.96884 20.8375 7.01086 19.9488 8.10872 19.1735C11.8861 16.5071 15.6634 13.8597 19.478 11.2691C20.3153 10.6828 21.2829 10.2668 22.1947 9.8319C22.6413 9.6239 23.1251 9.4348 23.6461 9.7373C23.981 10.4559 23.4228 10.9854 23.1437 11.7985C24.1857 11.2691 25.0603 10.8341 25.9348 10.3992C30.9403 7.8274 36.0202 5.3502 41.2303 3.1945C44.1703 1.9653 47.1848 0.944196 50.3481 0.395796C51.2598 0.244496 52.0972 0.357996 52.9159 0.830696C53.5672 1.2089 53.8649 1.7384 53.7905 2.5137C53.6416 4.0076 53.0834 5.3502 52.3391 6.6361C52.1344 6.9954 51.8925 7.3547 51.6134 7.8085C52.0786 8.0544 52.4693 8.3191 52.8787 8.4893C53.3439 8.6784 53.53 8.9999 53.53 9.4726C53.53 10.4181 53.53 11.3447 53.0834 12.1957C52.9717 12.4226 52.8229 12.6495 52.7671 12.8764C52.2833 15.0511 50.776 16.3559 49.0455 17.4905C48.6734 17.7363 48.3012 18.001 47.9849 18.4549C48.692 18.3414 49.3991 18.228 50.1062 18.1334C50.7016 18.0389 51.2971 17.8687 51.8925 17.8876C52.4321 17.8876 52.9904 18.0767 53.5114 18.2658C53.9021 18.3981 54.2557 18.6818 54.6464 18.852C55.428 19.1924 55.8001 19.8164 55.7629 20.6295C55.7257 21.3859 55.614 22.1234 55.428 22.8609C54.665 25.9243 53.1392 28.4961 50.8505 30.6897C45.8078 35.5117 40.5046 40.0501 35.127 44.4751C34.6432 44.8722 34.178 45.3071 33.657 45.761C36.8203 45.4206 39.872 45.0802 42.9236 44.7398C48.9897 45.1369 51.0552 45.4584 51.9483 46.2148C51.7436 46.9712 51.111 47.3305 50.5155 47.6709C47.9105 49.1837 45.2868 50.6776 42.6445 52.1526C41.342 52.8711 40.058 53.6464 38.6811 54.1948C36.7087 54.9701 34.6804 55.5942 32.6336 56.1993C29.6192 57.0881 26.5675 57.9201 23.5345 58.7522C21.2829 59.3762 20.1293 59.0547 18.3987 56.8422C17.4498 55.632 16.7241 54.2705 16.2216 52.7955C15.7937 51.5853 15.8681 50.4317 16.6682 49.4295C17.6544 48.2193 18.622 46.9523 19.7943 45.9312C23.5345 42.6408 27.3676 39.4639 31.1636 36.2492C32.5778 35.0579 34.0106 33.9044 35.3317 32.5618C35.1084 32.6563 34.8665 32.7509 34.6432 32.8643C25.2836 37.5351 15.9239 42.2059 6.56428 46.8767C5.96884 47.1792 5.33618 47.425 4.72212 47.6898C4.1825 47.9167 3.66149 47.8411 3.23351 47.4629C2.80554 47.0847 2.39617 46.6876 2.04262 46.2526C1.18667 45.1369 0.647049 43.851 0.16325 42.5273C-0.208903 41.5062 0.0516048 40.712 0.981987 39.9934C1.89376 39.3126 2.82414 38.6697 3.75453 38.0078C5.37339 36.8543 6.99226 35.7197 8.72277 34.5095" fill={t.text} />
            <path d="M77.5934 27.7789C76.4825 28.1789 71.6224 28.2189 70.2734 27.8589V3.4608C70.7495 3.4008 71.1066 3.3209 71.4637 3.3209C73.0507 3.3209 74.6376 3.3209 76.2048 3.3209C77.1768 3.3209 77.276 3.4608 77.2363 4.4808C77.2165 4.9807 77.1966 5.4607 77.157 6.1806C78.5456 4.7007 79.8945 3.5208 81.7394 3.0609C83.5842 2.6209 85.3894 2.6609 87.1946 3.2609C89.0593 3.9008 90.2297 5.3007 91.1422 7.1605C91.539 6.6406 91.8365 6.2206 92.1341 5.8207C94.6733 2.5409 99.6921 1.701 103.124 4.0008C104.889 5.1607 105.703 6.9406 106.1 8.9204C106.318 10.0403 106.457 11.1802 106.457 12.3201C106.516 17.2197 106.516 22.1194 106.536 26.999C106.536 27.259 106.516 27.5189 106.496 27.7589C105.524 28.1589 100.962 28.2389 99.2953 27.8789C99.2755 27.4389 99.216 26.959 99.216 26.479C99.2358 21.8794 99.2755 17.2997 99.2755 12.7001C99.2755 11.8802 99.1763 11.0202 98.9581 10.2403C98.3432 8.0005 95.9429 7.5405 94.3757 8.9004C93.4632 9.7003 92.9078 10.7203 92.5308 11.8402C92.0944 13.1201 91.9754 14.44 91.9754 15.7599C91.9952 19.3596 92.0349 22.9793 92.0547 26.579C92.0547 26.979 92.0547 27.3989 92.0547 27.7589C90.9835 28.1789 86.2226 28.2189 84.8141 27.8389C84.7943 27.3589 84.7348 26.839 84.7348 26.319C84.7546 21.7994 84.8141 17.2797 84.8141 12.7601C84.8141 11.9402 84.7348 11.0802 84.5166 10.2803C83.9016 7.9405 81.422 7.5205 79.8747 8.8804C78.9622 9.6803 78.4265 10.7003 78.0496 11.8402C77.6132 13.1601 77.4942 14.5 77.514 15.8799C77.5339 19.4396 77.5735 23.0193 77.5934 26.579C77.5934 26.979 77.5934 27.3989 77.5934 27.7589" fill={t.text} />
            <path d="M103.014 58.2002C101.864 58.5402 96.8052 58.5202 95.6943 58.2002C95.6744 57.8402 95.6348 57.4403 95.6348 57.0203C95.6348 49.7409 95.6744 42.4415 95.6943 35.142C95.6943 34.922 95.6943 34.6821 95.6943 34.4621C95.6943 33.9621 95.9323 33.6621 96.4481 33.6621C98.293 33.6621 100.138 33.6621 101.983 33.6621C102.459 33.6621 102.677 33.9621 102.657 34.4021C102.657 35.042 102.598 35.682 102.558 36.4419C103.133 35.982 103.629 35.562 104.145 35.182C107.101 33.0222 110.354 32.5022 113.786 33.7621C116.781 34.862 118.21 37.2819 118.725 40.3216C118.924 41.4415 118.944 42.5814 118.963 43.7213C119.023 48.041 119.063 52.3807 119.102 56.7003C119.102 56.8603 119.102 57.0003 119.102 57.1603C119.102 58.3802 119.043 58.4402 117.813 58.4402C116.186 58.4402 114.579 58.4602 112.953 58.4402C111.802 58.4402 111.762 58.4002 111.762 57.1803C111.782 52.9606 111.842 48.761 111.822 44.5413C111.822 43.3014 111.723 42.0215 111.405 40.8416C110.909 39.0217 109.144 38.1418 107.299 38.5818C105.137 39.1017 104.006 40.6416 103.411 42.6214C103.074 43.7413 102.935 44.9413 102.915 46.1012C102.875 49.7009 102.915 53.3206 102.935 56.9203C102.935 57.3603 102.935 57.8002 102.935 58.2002" fill={t.text} />
            <path d="M180.568 58.2992C180.132 58.3592 179.755 58.4192 179.398 58.4392C177.771 58.4392 176.144 58.4592 174.538 58.4392C173.387 58.4392 173.347 58.3792 173.347 57.1993C173.367 53.8996 173.427 50.5998 173.427 47.2801C173.427 45.7602 173.407 44.2403 173.328 42.7205C173.308 42.0805 173.189 41.4406 173.01 40.8206C172.475 39.0808 170.749 38.1408 168.983 38.5208C167.257 38.9008 166.127 40.0007 165.393 41.5406C164.738 42.9404 164.48 44.4203 164.48 45.9602C164.48 49.3799 164.5 52.7997 164.52 56.2194C164.52 56.5594 164.52 56.8993 164.52 57.2393C164.52 58.3392 164.46 58.3792 163.369 58.3992C161.703 58.3992 160.056 58.3992 158.39 58.3992C158.033 58.3992 157.656 58.3192 157.22 58.2792C157.2 57.8193 157.16 57.4393 157.16 57.0793C157.16 49.7199 157.2 42.3405 157.22 34.9811C157.22 34.7811 157.22 34.6011 157.22 34.4211C157.22 33.9212 157.478 33.6412 157.973 33.6412C159.779 33.6412 161.604 33.6412 163.409 33.6412C163.984 33.6412 164.222 33.9612 164.202 34.5011C164.183 35.1011 164.143 35.701 164.103 36.401C164.659 35.961 165.135 35.561 165.651 35.2011C168.884 32.9012 172.356 32.3813 176.006 34.0212C177.85 34.8411 179.021 36.361 179.735 38.2408C180.231 39.5607 180.489 40.9606 180.509 42.3605C180.568 47.2601 180.588 52.1597 180.628 57.0593C180.628 57.4393 180.588 57.7993 180.548 58.2592" fill={t.text} />
            <path d="M156.66 28.34C156.224 28.4 155.847 28.46 155.49 28.48C153.863 28.48 152.236 28.5 150.629 28.48C149.479 28.48 149.439 28.42 149.439 27.2401C149.459 23.9404 149.519 20.6406 149.519 17.3209C149.519 15.801 149.499 14.2811 149.419 12.7612C149.399 12.1213 149.28 11.4813 149.102 10.8614C148.566 9.1215 146.84 8.1816 145.075 8.5616C143.349 8.9415 142.218 10.0414 141.484 11.5813C140.83 12.9812 140.572 14.4611 140.572 16.001C140.572 19.4207 140.592 22.8404 140.612 26.2602C140.612 26.6001 140.612 26.9401 140.612 27.2801C140.612 28.38 140.552 28.42 139.461 28.44C137.795 28.44 136.148 28.44 134.482 28.44C134.125 28.44 133.748 28.36 133.311 28.32C133.292 27.86 133.252 27.4801 133.252 27.1201C133.252 19.7607 133.292 12.3813 133.311 5.0218C133.311 4.8219 133.311 4.6419 133.311 4.4619C133.311 3.9619 133.569 3.682 134.065 3.682C135.87 3.682 137.696 3.682 139.501 3.682C140.076 3.682 140.314 4.0019 140.294 4.5419C140.274 5.1418 140.235 5.7418 140.195 6.4417C140.75 6.0018 141.227 5.6018 141.742 5.2418C144.976 2.942 148.447 2.4221 152.097 4.0619C153.942 4.8819 155.113 6.40171 155.827 8.28161C156.323 9.60151 156.581 11.0014 156.6 12.4013C156.66 17.3009 156.68 22.2005 156.719 27.1001C156.719 27.4801 156.68 27.8401 156.64 28.3" fill={t.text} />
            <path d="M77.236 33.6572C77.236 34.4572 77.2756 35.0571 77.2756 35.6571C77.236 40.1767 77.1963 44.6963 77.1566 49.196C77.1566 50.3559 77.4145 51.4358 78.208 52.3557C79.1403 53.4357 80.2909 53.8156 81.6597 53.5356C83.207 53.2157 84.2782 52.2557 85.032 50.8959C85.8453 49.436 86.1231 47.8361 86.1231 46.1762C86.1231 42.8365 86.0834 39.4968 86.0834 36.157C86.0834 35.3771 86.1231 34.5772 86.1429 33.7772C86.5198 33.7172 86.7777 33.6572 87.0157 33.6572C88.7813 33.6572 90.5666 33.6572 92.3321 33.6572C93.3637 33.6572 93.4628 33.7572 93.4628 34.8771C93.4628 39.8167 93.4033 44.7363 93.4033 49.676C93.4033 52.1358 93.4232 54.6156 93.4033 57.0754C93.4033 58.3353 93.3042 58.4353 92.0346 58.4353C90.5666 58.4353 89.0986 58.4353 87.6307 58.4353C86.4603 58.4353 86.4008 58.3553 86.4206 57.2154C86.4206 56.7354 86.4206 56.2554 86.4206 55.8355C85.1907 56.6154 84.06 57.5753 82.7706 58.1153C79.6561 59.4152 76.5218 59.4352 73.6057 57.4753C72.0981 56.4554 71.1261 55.0155 70.6897 53.2757C70.3723 52.0358 70.1342 50.7359 70.0946 49.476C69.9755 44.8163 69.9755 40.1367 69.916 35.4771C69.916 35.1371 69.916 34.7971 69.916 34.4572C69.9359 33.9772 70.1739 33.6772 70.6897 33.6572C72.7924 33.6572 74.8952 33.6572 77.2161 33.6572" fill={t.text} />
            <path d="M142.759 33.0994C145.596 33.0994 147.996 33.5993 150.198 34.9592C152.837 36.5791 154.324 39.0189 155.019 41.9787C155.634 44.5585 155.634 47.1583 155.078 49.7781C154.344 53.1778 152.579 55.8576 149.504 57.5374C147.996 58.3574 146.37 58.8173 144.644 58.9573C142.085 59.1773 139.585 58.9773 137.205 57.9774C134.507 56.8375 132.523 54.9176 131.432 52.1979C129.845 48.2382 129.845 44.1785 131.373 40.1988C132.503 37.299 134.527 35.2792 137.423 34.0993C139.248 33.3593 141.133 33.1194 142.759 33.1394M147.937 46.0983C148.016 45.1384 147.461 41.6387 147.064 40.5388C146.628 39.3389 145.695 38.5789 144.465 38.199C141.668 37.319 139.109 38.6589 138.256 41.5387C137.939 42.6586 137.78 43.8385 137.701 44.9984C137.562 46.8583 137.641 48.7181 138.197 50.518C138.574 51.7779 139.189 52.8978 140.399 53.5578C143.374 55.1776 146.727 53.7577 147.54 50.458C147.897 49.0381 148.016 46.0783 147.937 46.0583" fill={t.text} />
            <path d="M186.919 3.293C189.756 3.293 192.156 3.7807 194.358 5.1075C196.996 6.6879 198.484 9.0682 199.178 11.9558C199.793 14.4727 199.793 17.0091 199.238 19.565C198.504 22.8819 196.738 25.4963 193.664 27.1352C192.156 27.9352 190.53 28.3839 188.804 28.5205C186.245 28.7351 183.745 28.54 181.365 27.5645C178.667 26.4523 176.683 24.5793 175.592 21.9258C174.005 18.0627 174.005 14.102 175.533 10.2193C176.663 7.3902 178.687 5.4197 181.583 4.2685C183.408 3.5466 185.293 3.3125 186.919 3.332M192.097 15.975C192.176 15.0385 191.621 11.6241 191.224 10.551C190.787 9.3804 189.855 8.6389 188.625 8.2682C185.828 7.4098 183.269 8.717 182.416 11.5265C182.099 12.6192 181.94 13.7703 181.861 14.9019C181.722 16.7164 181.801 18.5309 182.357 20.2869C182.734 21.5161 183.349 22.6087 184.559 23.2526C187.534 24.8329 190.887 23.4477 191.7 20.2284C192.057 18.8431 192.176 15.9555 192.097 15.936" fill={t.text} />
            <path d="M160.942 8.5796C160.188 8.5596 159.513 8.5396 158.859 8.4996C158.006 8.4396 157.867 8.3197 157.847 7.4797C157.827 6.4598 157.827 5.4199 157.847 4.4C157.867 3.42 157.986 3.3 158.997 3.3C162.231 3.3 165.484 3.3 168.718 3.3C170.146 3.3 171.574 3.3 173.022 3.3C173.955 3.3 174.034 3.42 174.054 4.36C174.054 5.3399 174.054 6.3398 174.054 7.3197C174.054 8.3596 173.955 8.4596 172.864 8.4796C171.654 8.4996 170.444 8.4796 169.253 8.4796C168.956 8.4796 168.658 8.4996 168.261 8.5196C168.222 8.8796 168.182 9.1996 168.182 9.5196C168.182 13.0793 168.182 16.659 168.202 20.2187C168.202 22.5785 169.194 23.4585 171.535 23.2385C172.288 23.1785 173.022 23.0385 173.836 22.9185C173.915 23.1985 174.034 23.4385 174.034 23.6784C174.054 24.6584 174.034 25.6583 174.034 26.6382C174.034 27.2182 173.816 27.5781 173.28 27.7581C170.939 28.5181 168.579 28.798 166.179 28.0981C163.143 27.1982 161.378 25.0183 161.08 21.7186C160.942 20.1787 161.021 18.6188 161.021 17.059C161.021 14.6392 161.041 12.1993 161.061 9.7795C161.061 9.4196 161.021 9.0396 160.981 8.5596" fill={t.text} />
            <path d="M207.959 7.1581C208.276 6.8981 208.395 6.8181 208.475 6.7181C210.201 4.6783 212.422 3.5984 215.021 3.2784C215.775 3.1784 216.509 3.1384 217.263 3.1384C217.719 3.1384 218.215 3.3184 218.235 3.8984C218.334 5.4382 218.314 6.9781 218.175 8.558C217.084 8.638 216.112 8.678 215.14 8.798C210.796 9.3579 208.217 12.2977 208.177 16.7374C208.137 19.9971 208.177 23.2568 208.177 26.5166C208.177 28.0165 208.177 28.0565 206.67 28.0765C205.241 28.0765 203.813 28.0765 202.385 28.0765C200.917 28.0565 200.917 28.0365 200.937 26.4966C200.976 24.1568 201.056 21.797 201.056 19.4371C201.056 14.6575 200.976 9.8779 200.937 5.0983C200.937 4.8383 200.917 4.5583 200.937 4.2983C200.976 3.4984 201.095 3.3384 201.849 3.3184C203.654 3.2984 205.459 3.2784 207.265 3.3184C208.038 3.3184 208.177 3.4984 208.157 4.2983C208.137 5.1783 208.038 6.0382 207.979 7.1581" fill={t.text} />
            <path d="M121.191 58.3753V57.0954C121.191 49.6959 121.191 42.2965 121.191 34.9171C121.191 33.7572 121.271 33.6572 122.401 33.6572C124.068 33.6572 125.714 33.6572 127.381 33.6572C128.432 33.6572 128.551 33.7772 128.551 34.8371C128.531 37.8369 128.452 40.8367 128.452 43.8364C128.452 48.0361 128.531 52.2557 128.551 56.4554C128.551 58.3353 128.849 58.4553 126.587 58.4353C125.298 58.4353 124.028 58.4353 122.739 58.4353C122.302 58.4353 121.846 58.3953 121.211 58.3553" fill={t.text} />
            <path d="M113.917 18.5246C114.75 21.5387 117.011 23.0458 120.698 23.0458C123.071 23.0458 124.867 22.2442 126.085 20.6409L131.088 23.5268C128.715 26.9579 125.22 28.6734 120.602 28.6734C116.626 28.6734 113.436 27.4709 111.031 25.066C108.626 22.661 107.423 19.6308 107.423 15.9753C107.423 12.3519 108.61 9.3377 110.982 6.9328C113.355 4.4958 116.402 3.2773 120.121 3.2773C123.648 3.2773 126.55 4.4958 128.827 6.9328C131.136 9.3698 132.29 12.384 132.29 15.9753C132.29 16.777 132.21 17.6267 132.05 18.5246H113.917Z" fill={t.text} />
          </svg>
        )}
        {!collapsed && brandSubLabel && (
          <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5, alignSelf: 'flex-end' }}>{brandSubLabel}</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
        {moduleList.map((m) => {
          const Icon = m.icon;
          const active = currentModule === m.key;
          return (
            <button key={m.key} onClick={() => onSelectModule(m.key)} title={m.label} style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '10px' : '10px 12px',
              background: active ? t.sidebarActive : 'transparent',
              border: 'none', borderRadius: 8, cursor: 'pointer', color: active ? t.accent : t.textMuted,
              fontSize: 13, fontFamily: FONT_BODY, fontWeight: 500, textAlign: 'left',
              justifyContent: collapsed ? 'center' : 'flex-start',
            }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = t.sidebarHover; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
              <Icon size={16} />
              {!collapsed && m.label}
              {active && !collapsed && <span style={{ marginLeft: 'auto', width: 4, height: 16, background: t.accent, borderRadius: 2 }} />}
            </button>
          );
        })}
      </div>
      <div style={{ borderTop: '1px solid ' + t.borderSoft, paddingTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <button onClick={onToggleCollapse} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: t.textMuted, borderRadius: 8, fontSize: 12, justifyContent: collapsed ? 'center' : 'flex-start' }}>
          {collapsed ? <ChevronRight size={14} /> : <><ChevronLeft size={14} />{!collapsed && 'Collapse'}</>}
        </button>
      </div>
    </div>
  );
}

function Header({ t, currentTabLabel, theme, onToggleTheme, onSearchClick, persona, onChangePersona }) {
  const [open, setOpen] = useState(false);
  const personas = ROLE_ARCHITECTURE.filter((r) => r.key !== 'system');
  return (
    <div style={{
      height: 56, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 18px',
      background: t.bgPanel, borderBottom: '1px solid ' + t.border,
    }}>
      <div style={{ position: 'relative', flex: 1, maxWidth: 480 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: t.textMuted }} />
        <input placeholder="Search everything..." style={{
          width: '100%', padding: '8px 12px 8px 36px', background: t.bgInput, color: t.text,
          border: '1px solid ' + t.border, borderRadius: 999, fontSize: 13, fontFamily: FONT_BODY,
        }} onClick={onSearchClick} />
      </div>
      <div style={{ flex: 1 }} />
      {/* Persona switcher: lets SA preview each role home dashboard */}
      <div style={{ position: 'relative' }}>
        <button onClick={() => setOpen(!open)} style={{ padding: '6px 12px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, color: t.text, fontSize: 11, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Eye size={12} color={t.accent} />
          View as: {ROLE_ARCHITECTURE.find((r) => r.key === persona).role}
          <ChevronDown size={11} />
        </button>
        {open && (
          <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: 6, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 10, minWidth: 240, zIndex: 50, padding: 4, boxShadow: '0 12px 32px rgba(0,0,0,0.4)' }}>
            <div style={{ padding: '8px 12px', fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid ' + t.borderSoft }}>Preview as role</div>
            {personas.map((p) => (
              <div key={p.key} onClick={() => { onChangePersona(p.key); setOpen(false); }} style={{ padding: '10px 12px', cursor: 'pointer', borderRadius: 6, fontSize: 12, color: persona === p.key ? t.accent : t.text, background: persona === p.key ? t.accentSoft + '44' : 'transparent' }}
                onMouseEnter={(e) => { if (persona !== p.key) e.currentTarget.style.background = t.bgCardElev; }}
                onMouseLeave={(e) => { if (persona !== p.key) e.currentTarget.style.background = 'transparent'; }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 600 }}>{p.role}</span>
                  {persona === p.key && <Check size={12} color={t.accent} />}
                </div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{p.homeFocus}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button style={{ padding: '6px 12px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, color: t.text, fontSize: 11, cursor: 'pointer', fontFamily: FONT_MONO, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: t.accent }} className="mu-pulse" />
        8 Days Synchronization <ChevronDown size={11} />
      </button>
      <button onClick={onToggleTheme} style={{ width: 34, height: 34, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, color: t.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        {theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />}
      </button>
      <button style={{ width: 34, height: 34, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, color: t.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Bell size={14} />
        <span style={{ position: 'absolute', top: 4, right: 6, width: 7, height: 7, borderRadius: 999, background: t.red }} />
      </button>
      <button style={{ width: 34, height: 34, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, color: t.textMuted, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <Mail size={14} />
      </button>
      <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 12px 4px 4px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 999, cursor: 'pointer' }}>
        <Avatar name="Lemei Lc" t={t} size={26} />
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 11, color: t.text, fontWeight: 600 }}>Lemei Lc</div>
          <div style={{ fontSize: 9, color: t.textMuted }}>Super Admin</div>
        </div>
        <ChevronDown size={11} color={t.textMuted} />
      </button>
    </div>
  );
}

function SecondaryTabs({ t, module, currentTab, onSelectTab, ia }) {
  const moduleList = ia || IA;
  const moduleConf = moduleList.find((m) => m.key === module);
  if (!moduleConf) return null;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '12px 24px 0', borderBottom: '1px solid ' + t.border, background: t.bg }}>
      {moduleConf.tabs.map((tb) => {
        const active = tb.key === currentTab;
        return (
          <button key={tb.key} onClick={() => onSelectTab(tb.key)} style={{
            padding: '10px 16px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            color: active ? t.accent : t.textMuted,
            borderBottom: active ? '2px solid ' + t.accent : '2px solid transparent',
            fontSize: 13, fontFamily: FONT_BODY, fontWeight: active ? 700 : 500,
            marginBottom: -1, display: 'inline-flex', alignItems: 'center', gap: 6,
            transition: 'all 120ms ease',
          }}
            onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = t.text; }}
            onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = t.textMuted; }}>
            {/* Circle-check prefix per brand spec — filled when active, hollow when inactive */}
            {active
              ? <CheckCircle2 size={13} color={t.accent} />
              : <Circle size={13} color={t.textDim} strokeWidth={1.5} />}
            {tb.label}
          </button>
        );
      })}
      <div style={{ flex: 1 }} />
      <span style={{ fontSize: 10, color: t.textMuted, paddingBottom: 8, fontFamily: FONT_MONO }}>
        {moduleConf.tabs.findIndex((x) => x.key === currentTab) + 1} of {moduleConf.tabs.length}
      </span>
    </div>
  );
}

function ActionCenter({ t, onAction, items }) {
  const ctx = React.useContext(ActionContext);
  // Map each item key → canonical action id in the registry
  const keyToActionId = {
    create_org: 'org.create',
    invite_admin: 'user.invite',
    add_credits: 'credits.add',
    add_mentor: 'mentor.add',
    export: 'report.export',
    review_esc: 'escalation.review',
    send_bulk: 'comm.send_bulk',
  };
  const defaultItems = [
    { icon: Plus, label: 'Create Org', key: 'create_org' },
    { icon: UserPlus, label: 'Invite Org Admin', key: 'invite_admin' },
    { icon: Wallet, label: 'Add Credits', key: 'add_credits' },
    { icon: GraduationCap, label: 'Add Mentor', key: 'add_mentor' },
    { icon: Megaphone, label: 'Send Bulk Message', key: 'send_bulk' },
    { icon: Download, label: 'Export Report', key: 'export' },
    { icon: AlertTriangle, label: 'Review Escalations', key: 'review_esc' },
  ];
  const list = items || defaultItems;
  const handleClick = (it) => {
    const aid = keyToActionId[it.key];
    if (aid && ctx && ctx.canDo(aid)) {
      ctx.setActiveAction({ actionId: aid });
    } else if (onAction) {
      onAction(it.label);
    }
  };
  return (
    <div style={{
      width: 240, flexShrink: 0, padding: 14,
      display: 'flex', flexDirection: 'column', gap: 12,
    }}>
      <div style={{ background: t.cream, color: t.creamText, borderRadius: 14, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} />
          <div className="mu-display" style={{ fontSize: 18 }}>Action Center</div>
        </div>
        {list.map((it) => {
          const Ic = it.icon;
          const aid = keyToActionId[it.key];
          // Hide if persona lacks permission (Strict mode)
          if (aid && ctx && !ctx.canDo(aid)) return null;
          return (
            <button key={it.key} onClick={() => handleClick(it)} style={{
              padding: '10px 12px', background: 'rgba(255,255,255,0.6)',
              border: '1px solid rgba(0,0,0,0.06)', borderRadius: 999, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 8,
              color: t.creamText, fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
              textAlign: 'left',
            }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.9)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.6)'; }}>
              <Ic size={13} />
              {it.label}
            </button>
          );
        })}
      </div>
      <div style={{ background: t.bgCard, border: '1px solid ' + t.border, borderRadius: 14, padding: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <Calendar size={12} color={t.accent} />
          <div style={{ fontSize: 11, color: t.text, textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: 600 }}>Upcoming Renewals</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {RENEWALS.map((r) => (
            <div key={r.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, padding: 8, background: t.bgInput, borderRadius: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: t.yellow, marginTop: 6 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: t.text, fontWeight: 600 }}>{r.name}</div>
                <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{r.detail}</div>
                <div style={{ fontSize: 9, color: t.textDim, marginTop: 2, fontFamily: FONT_MONO }}>{r.meta}</div>
              </div>
            </div>
          ))}
        </div>
        <button style={{ width: '100%', marginTop: 10, padding: 8, background: 'transparent', border: '1px solid ' + t.border, borderRadius: 8, color: t.textMuted, fontSize: 11, cursor: 'pointer', fontFamily: FONT_BODY }}>
          Snoozed · Resend Report
        </button>
      </div>
    </div>
  );
}

/* ============================================================================
   ACTION INFRASTRUCTURE — runtime engine for the ACTION_REGISTRY.
   - ActionContext: shared state for mutate, toast, action log, run-action
   - ActionButton: gated button that auto-hides if persona lacks permission
   - ActionModal: generic modal driven by registry fields
   - ActionLogDrawer: right-side audit trail of every action this session
   - Bespoke flow modals for the 12 highest-stakes actions
   ============================================================================ */

const ActionContext = React.createContext(null);

function useActionEngine(persona) {
  const [actionLog, setActionLog] = useState([]);
  const [toast, setToastInner] = useState(null);
  const [activeAction, setActiveAction] = useState(null); // { actionId, target } | null
  const [actionLogOpen, setActionLogOpen] = useState(false);
  const [dbStatus, setDbStatus] = useState('connecting'); // 'connecting' | 'connected' | 'offline'
  // Navigator ref — App registers a function here so flows can do { module, tab, filters } navigation
  const navigatorRef = React.useRef(null);

  // Mutable stores — start with the seed clone so the UI renders instantly,
  // then hydrate from MongoDB on mount (see useEffect below).
  const [orgsStore, setOrgsStore] = useState(() => ORGS.map((o) => Object.assign({}, o)));
  const [mentorsStore, setMentorsStore] = useState(() => MENTORS.map((m) => Object.assign({}, m)));
  const [menteesStore, setMenteesStore] = useState(() => MENTEES.map((m) => Object.assign({}, m)));
  const [ticketsStore, setTicketsStore] = useState(() => TICKETS.map((tk) => Object.assign({}, tk)));

  // Hydrate stores from MongoDB on first mount. Falls back to seed data if the API is offline.
  useEffect(() => {
    let cancelled = false;
    // Add an `id` alias for `_id` so legacy mutators that look up by 'id' keep working.
    const aliasId = (rows) => rows.map((r) => r && r._id && !r.id ? Object.assign({ id: String(r._id) }, r) : r);
    (async () => {
      try {
        const [orgs, mentors, mentees, tickets, users, invoices, payouts, audit] = await Promise.all([
          api.list('orgs').then(aliasId),
          api.list('mentors').then(aliasId),
          api.list('mentees').then(aliasId),
          api.list('tickets').then(aliasId),
          api.list('users').then(aliasId),
          api.list('invoices').then(aliasId),
          api.list('payouts').then(aliasId),
          api.list('auditlog', { limit: 50 }).then(aliasId),
        ]);
        if (cancelled) return;
        if (orgs.length)    { setOrgsStore(orgs);     ORGS.splice(0, ORGS.length, ...orgs); }
        if (mentors.length) { setMentorsStore(mentors); MENTORS.splice(0, MENTORS.length, ...mentors); }
        if (mentees.length) { setMenteesStore(mentees); MENTEES.splice(0, MENTEES.length, ...mentees); }
        if (tickets.length) { setTicketsStore(tickets); TICKETS.splice(0, TICKETS.length, ...tickets); }
        if (users.length)   { USERS_ALL.splice(0, USERS_ALL.length, ...users); }
        if (invoices.length){ INVOICES.splice(0, INVOICES.length, ...invoices); }
        if (payouts.length) { PAYOUTS.splice(0, PAYOUTS.length, ...payouts); }
        if (audit.length)   { AUDIT_LOG.splice(0, AUDIT_LOG.length, ...audit); }
        setDbStatus('connected');
      } catch (e) {
        console.warn('[mu] DB hydrate failed, using seed data:', e.message);
        if (!cancelled) setDbStatus('offline');
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const [creditsLog, setCreditsLog] = useState([]); // append-only log of credit movements
  const [savedSearches, setSavedSearches] = useState([
    { id: 'ss_seed_1', name: 'High-MIS mentors',           visibility: 'team',    owner: persona, scope: 'mentors',  filters: { tier: 'Excellent', minMis: 4.5 }, ts: Date.now() - 86400000 * 6 },
    { id: 'ss_seed_2', name: 'Low-credit orgs',            visibility: 'private', owner: persona, scope: 'orgs',     filters: { creditsBelow: 500 },                 ts: Date.now() - 86400000 * 3 },
    { id: 'ss_seed_3', name: 'SLA breaches this week',     visibility: 'team',    owner: persona, scope: 'tickets',  filters: { slaBreach: true, age: '7d' },        ts: Date.now() - 86400000 * 1 },
  ]);
  // Pending credit requests from orgs awaiting SA approval (push from OA → review by SA)
  const [creditRequests, setCreditRequests] = useState([
    { id: 'cr_001', orgName: "Masters' Union", requester: 'Priya Mehta', requesterRole: 'Org Admin', amount: 500,  reason: 'New cohort starting Mon · need credits before Fri',           submittedDays: 1, status: 'Pending', priority: 'High' },
    { id: 'cr_002', orgName: 'IIM Bengaluru',   requester: 'Rohan Kapur', requesterRole: 'Org Admin', amount: 1200, reason: 'Renewal top-up · per signed contract',                       submittedDays: 2, status: 'Pending', priority: 'Medium' },
    { id: 'cr_003', orgName: 'Tetr',            requester: 'Anita Singh', requesterRole: 'Org Sub-Admin', amount: 300,  reason: 'Top-up for Leadership Sprint cohort · wallet hit zero', submittedDays: 0, status: 'Pending', priority: 'High' },
    { id: 'cr_004', orgName: 'Corporate Alpha', requester: 'Vikram S',    requesterRole: 'Org Admin', amount: 2000, reason: 'Q2 expansion · adding 80 mentees to programme',              submittedDays: 4, status: 'Pending', priority: 'Low' },
    { id: 'cr_005', orgName: 'Institution Beta',requester: 'Devika R',    requesterRole: 'Org Admin', amount: 150,  reason: 'Goodwill · 3 mentor no-shows last week',                     submittedDays: 1, status: 'Pending', priority: 'Medium' },
  ]);
  const approveRequest = (id, note) => setCreditRequests((prev) => prev.map((r) => r.id === id ? Object.assign({}, r, { status: 'Approved', approvalNote: note, decidedAt: Date.now() }) : r));
  const denyRequest = (id, reason) => setCreditRequests((prev) => prev.map((r) => r.id === id ? Object.assign({}, r, { status: 'Denied', denyReason: reason, decidedAt: Date.now() }) : r));

  const stores = { orgs: orgsStore, mentors: mentorsStore, mentees: menteesStore, tickets: ticketsStore, credits: creditsLog, savedSearches, creditRequests };

  const saveSearch = (name, visibility, scope, filters) => {
    const newId = 'ss_' + Date.now();
    setSavedSearches((prev) => [{ id: newId, name, visibility, owner: persona, scope: scope || 'current', filters: filters || {}, ts: Date.now() }, ...prev]);
    return newId;
  };
  const updateSearch = (id, name, visibility, filters) => {
    setSavedSearches((prev) => prev.map((s) => s.id === id ? Object.assign({}, s, { name, visibility, filters: filters || s.filters, ts: Date.now() }) : s));
  };
  const deleteSearch = (id) => {
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const showToast = (msg, tone) => {
    setToastInner({ msg, tone: tone || 'good', ts: Date.now() });
    setTimeout(() => setToastInner(null), 2800);
  };

  const appendLog = (entry) => {
    const newEntry = {
      id: 'al_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      ts: new Date(),
      persona, ...entry,
    };
    setActionLog((prev) => [newEntry, ...prev].slice(0, 200));
    // Mirror to MongoDB audit log (best-effort — fail silently if offline).
    api.audit({
      who: persona,
      action: entry.label || entry.actionId || 'action',
      object: entry.target || null,
      when: new Date().toISOString(),
      result: entry.result || 'Completed',
      payload: entry.payload || null,
    }).catch(() => {});
  };

  // Apply a mutation to the in-memory store + persist to MongoDB.
  // Returns the optimistic doc for `add` so flows can pick up its server _id.
  const applyMutation = (mut, payload, target) => {
    if (!mut) return null;
    const setter = mut.entity === 'orgs' ? setOrgsStore
      : mut.entity === 'mentors' ? setMentorsStore
      : mut.entity === 'mentees' ? setMenteesStore
      : mut.entity === 'tickets' ? setTicketsStore
      : null;
    if (!setter) return null;
    if (mut.op === 'patch' && target) {
      const patch = Object.assign({}, mut.set || {}, payload || {});
      setter((arr) => arr.map((row) => row[mut.findBy] === target[mut.findBy]
        ? Object.assign({}, row, patch)
        : row));
      // Persist patch to API if we have a server _id
      if (target && target._id) {
        api.update(mut.entity, target._id, patch).catch((e) => console.warn('[mu] patch failed', e.message));
      }
    } else if (mut.op === 'add') {
      const optimistic = Object.assign({ id: mut.entity + '_' + Date.now() }, payload || {});
      setter((arr) => [optimistic, ...arr]);
      api.create(mut.entity, payload || {}).then((saved) => {
        // Replace optimistic row with the server-assigned one (now has _id)
        setter((arr) => arr.map((row) => row === optimistic || row.id === optimistic.id ? saved : row));
      }).catch((e) => console.warn('[mu] create failed', e.message));
    } else if (mut.op === 'remove' && target) {
      setter((arr) => arr.filter((row) => row[mut.findBy] !== target[mut.findBy]));
      if (target && target._id) {
        api.remove(mut.entity, target._id).catch((e) => console.warn('[mu] remove failed', e.message));
      }
    }
    return true;
  };

  // Apply credit movement (special: append to credits log + patch org wallet)
  const moveCredits = (amount, fromKind, toKind, toName, reason) => {
    setCreditsLog((prev) => [{
      id: 'cl_' + Date.now(), ts: new Date(),
      amount, fromKind, toKind, toName, reason, actor: persona,
    }, ...prev].slice(0, 100));
  };

  const runAction = (actionId, target, payload, opts) => {
    const a = ACTION_REGISTRY[actionId];
    if (!a) return;
    if (!canDo(actionId, persona)) {
      showToast('Not allowed: ' + a.label + ' requires ' + a.allowedPersonas.join(' or ') + ' access', 'bad');
      return;
    }
    // Apply mutation
    if (a.mutates) {
      applyMutation(a.mutates, payload, target);
    }
    // Append to action log
    appendLog({
      actionId, label: a.label,
      target: target ? (target.name || target.id || JSON.stringify(target).slice(0, 60)) : null,
      payload: payload || null,
      result: opts && opts.cancelled ? 'Cancelled' : 'Completed',
      destructive: !!a.destructive,
    });
    if (!(opts && opts.cancelled)) {
      showToast(a.label + (target && target.name ? ' — ' + target.name : '') + ' · done', a.destructive ? 'warn' : 'good');
    }
  };

  return {
    persona, actionLog, toast, activeAction, setActiveAction,
    actionLogOpen, setActionLogOpen,
    stores, showToast, runAction, moveCredits, appendLog, canDo: (id) => canDo(id, persona),
    saveSearch, updateSearch, deleteSearch,
    approveRequest, denyRequest,
    navigatorRef,
    navigate: (target) => { if (navigatorRef.current) navigatorRef.current(target); },
    dbStatus,
  };
}

// Map of icon string → component (registry-friendly)
const ICON_MAP = {
  Building2, Wallet, GitBranch, UserPlus, UserCheck, UserX, Eye, BadgeCheck, BadgeX,
  Calendar, X, Check, Sliders, AlertCircle, AlertOctagon, CheckCircle2, RotateCcw,
  Receipt, Send, History, Cpu, PauseCircle, PlayCircle, Shield, Copy, Key, FileBarChart,
  Download, Megaphone, Bell, Bookmark, Sparkles, Plus, MessageSquare, Filter, Users,
};

function ActionButton({ actionId, target, t, primary, soft, danger, label: customLabel, sz, disableReason, onAfter }) {
  const ctx = React.useContext(ActionContext);
  if (!ctx) return null;
  if (!ctx.canDo(actionId)) return null; // Strict gating
  const a = ACTION_REGISTRY[actionId];
  if (!a) return null;
  const Icon = ICON_MAP[a.icon] || ChevronRight;
  const isDanger = danger || a.destructive;
  const onClick = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    if (disableReason) { ctx.showToast(disableReason, 'warn'); return; }
    ctx.setActiveAction({ actionId, target, onAfter });
  };
  return (
    <IconButton t={t} icon={Icon} primary={primary} soft={soft} danger={isDanger}
      label={customLabel || a.label} sz={sz} onClick={onClick} />
  );
}

// SmartButton — auto-resolves a label string to a registry action.
// If the label maps and the persona is allowed → renders ActionButton (real flow).
// If the label maps but persona is blocked → renders nothing (Strict gating).
// If the label does not map → renders a wired IconButton that toasts + logs (so it never feels dead).
// Use this for inline page buttons whose label is a free-text string from a spec.
function SmartButton({ label, icon, t, primary, soft, danger, target, onAfter, sz }) {
  const ctx = React.useContext(ActionContext);
  if (!ctx) return null;
  const aid = resolveLabelToActionId(label);
  if (aid) {
    if (!ctx.canDo(aid)) return null; // Strict gating for mapped actions
    // Pass the original rail label as context so the modal can show "Open programme" not just "Open"
    const enrichedTarget = Object.assign({ contextLabel: label }, target || {});
    return <ActionButton actionId={aid} t={t} primary={primary} soft={soft} danger={danger} customLabel={label} target={enrichedTarget} onAfter={onAfter} sz={sz} />;
  }
  // Unmapped label: heuristic gating — hide destructive / admin-tier verbs from low-privilege personas.
  // This prevents "Suspend org" or "Override visibility" or "Approve refund" from showing for Mentor/Mentee.
  if (isAdminVerb(label) && (ctx.persona === 'mentor' || ctx.persona === 'mentee')) return null;
  if (isPlatformOnlyVerb(label) && ctx.persona !== 'super_admin') return null;
  // Otherwise: lightweight wired fallback — logs + toasts
  const Ic = icon || (primary ? Plus : Send);
  return <IconButton t={t} icon={Ic} primary={primary} soft={soft} danger={danger} label={label} sz={sz} onClick={() => {
    ctx.appendLog({ actionId: 'misc.' + label.toLowerCase().replace(/\s+/g, '_'), label: label, payload: null, result: 'Completed', destructive: !!danger });
    ctx.showToast(label + ' · done');
    if (onAfter) onAfter();
  }} />;
}

// Heuristic: does this label imply an admin-only verb (destructive / authoritative)?
// Self-care verbs (edit own profile, edit own preferences) are NOT admin verbs.
function isAdminVerb(label) {
  if (!label) return false;
  const l = label.toLowerCase();
  // Whitelist self-care actions that look admin-y but aren't
  if (/\b(edit profile|edit preferences|edit my|save profile|save preferences|edit milestone|edit reflection|edit rate|edit availability|edit own)\b/.test(l)) return false;
  return /\b(suspend|delete|remove|reject|deny|override|^pause|reactivate|^publish|rollback|reverse|freeze|terminate|impersonate|resend invite|resolve|escalate|^approve|allocate|reassign|create cohort|create programme|raise invoice|grant|revoke|takeover|take over|map mentor|set caps|set floor|set sla|change sla|edit logic|edit access|edit policy|publish polic|publish role|publish brand)\b/.test(l);
}
// Heuristic: does this label imply a platform-tier verb (only Super Admin)?
function isPlatformOnlyVerb(label) {
  if (!label) return false;
  const l = label.toLowerCase();
  return /\b(create org|onboard org|create plan|create role|copy role|create custom role|impersonate|approve domain|approve setup|publish role version|edit logic|tune threshold|rotate key|disable rule|create alert)\b/.test(l);
}

function ActionModal({ t }) {
  const ctx = React.useContext(ActionContext);
  if (!ctx || !ctx.activeAction) return null;
  const { actionId, target, onAfter } = ctx.activeAction;
  const a = ACTION_REGISTRY[actionId];
  if (!a) return null;
  // Bespoke flows are rendered separately — generic modal only for non-bespoke actions
  if (a.bespoke) return <BespokeFlowRouter t={t} ctx={ctx} actionId={actionId} target={target} onAfter={onAfter} />;
  const Icon = ICON_MAP[a.icon] || ChevronRight;
  return <GenericActionModal t={t} ctx={ctx} actionId={actionId} target={target} a={a} Icon={Icon} onAfter={onAfter} />;
}

function GenericActionModal({ t, ctx, actionId, target, a, Icon, onAfter }) {
  const [values, setValues] = useState({});
  const close = (cancelled) => {
    if (cancelled) {
      ctx.appendLog({ actionId, label: a.label, target: target ? (target.name || target.id) : null, payload: null, result: 'Cancelled', destructive: !!a.destructive });
    }
    ctx.setActiveAction(null);
  };
  const submit = () => {
    // Validate required fields
    const missing = (a.fields || []).filter((f) => f.required && !values[f.key]);
    if (missing.length) {
      ctx.showToast('Required: ' + missing.map((f) => f.label).join(', '), 'bad');
      return;
    }
    ctx.runAction(actionId, target, values);
    if (onAfter) onAfter(values);
    ctx.setActiveAction(null);
  };
  const personaLabels = a.allowedPersonas.map((p) => {
    const r = ROLE_ARCHITECTURE.find((x) => x.key === p);
    return r ? r.role : p;
  }).join(', ');
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, display: 'flex', justifyContent: 'flex-end', animation: 'mu-fade-in 200ms ease' }} onClick={() => close(true)}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 480, maxWidth: '95vw', height: '100vh',
        background: t.bgPanel, borderLeft: '1px solid ' + t.border,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 64px rgba(0,0,0,0.4)',
        animation: 'mu-slide-in-right 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* HEADER */}
        <div style={{ padding: '20px 24px 16px', flexShrink: 0, borderBottom: '1px solid ' + t.borderSoft }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 38, height: 38, borderRadius: 9, background: a.destructive ? t.red + '22' : t.accent + '22', color: a.destructive ? t.red : t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={18} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mu-display" style={{ fontSize: 20, color: t.text, lineHeight: 1.2 }}>
                {/* Use the rail-context label if this is a generic.* action AND a contextLabel was passed */}
                {(actionId.indexOf('generic.') === 0 && target && target.contextLabel) ? target.contextLabel : a.label}
              </div>
              {target && target.name && (
                <div style={{ fontSize: 11, color: t.accent, marginTop: 2, fontFamily: FONT_MONO }}>target: {target.name}</div>
              )}
              <div style={{ fontSize: 12, color: t.textMuted, marginTop: 6, lineHeight: 1.5 }}>{a.desc}</div>
            </div>
            <button onClick={() => close(true)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 24px' }} className="mu-scroll">
          {/* Persona-permission strip */}
          <div style={{ display: 'flex', gap: 8, padding: '8px 12px', background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, marginBottom: 14, fontSize: 11 }}>
            <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Allowed for:</span>
            <span style={{ color: t.text, flex: 1 }}>{personaLabels}</span>
          </div>
          {(a.fields || []).map((f) => (
            <div key={f.key} style={{ marginBottom: 12 }}>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                {f.label} {f.required && <span style={{ color: t.red }}>*</span>}
              </label>
              {f.type === 'textarea' ? (
                <textarea rows={3} value={values[f.key] || ''} onChange={(e) => setValues(Object.assign({}, values, { [f.key]: e.target.value }))} style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical' }} />
              ) : f.type === 'select' ? (
                <select value={values[f.key] || ''} onChange={(e) => setValues(Object.assign({}, values, { [f.key]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }}>
                  <option value="">— choose —</option>
                  {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type === 'number' ? 'number' : f.type === 'date' ? 'date' : 'text'} value={values[f.key] || ''} onChange={(e) => setValues(Object.assign({}, values, { [f.key]: e.target.value }))} style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              )}
            </div>
          ))}
          {(!a.fields || a.fields.length === 0) && (
            <div style={{ padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, fontSize: 12, color: t.textMuted, marginBottom: 14 }}>{a.summary || 'No additional input required. Click Confirm to execute.'}</div>
          )}
        </div>

        {/* STICKY FOOTER */}
        <div style={{
          flexShrink: 0, padding: '14px 24px',
          borderTop: '1px solid ' + t.borderSoft, background: t.bgPanel,
          display: 'flex', justifyContent: 'flex-end', gap: 8,
        }}>
          <button onClick={() => close(true)} style={{
            padding: '9px 18px', background: 'transparent',
            border: '1px solid ' + t.border, color: t.textMuted,
            borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
          }}>Cancel</button>
          <button onClick={submit} style={{
            padding: '9px 20px',
            background: a.destructive ? t.red : t.accent,
            border: '1px solid ' + (a.destructive ? t.red : t.accent),
            color: a.destructive ? '#fff' : '#0a1f28',
            borderRadius: 999, cursor: 'pointer',
            fontSize: 12, fontWeight: 700, fontFamily: FONT_BODY,
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {a.destructive ? 'Confirm ' + a.label.toLowerCase() : 'Confirm'}
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---- Bespoke flow modals — 12 highest-stakes flows get multi-step depth ---- */

function BespokeFlowRouter({ t, ctx, actionId, target, onAfter }) {
  if (actionId === 'org.create')         return <FlowCreateOrg t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'org.inspect')        return <FlowInspectOrg t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'org.assign_admin')   return <FlowAssignAdmin t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'credits.add')        return <FlowAddCredits t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'credits.allocate')   return <FlowAllocateCredits t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'user.invite')        return <FlowInviteUser t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'mentor.add')         return <FlowAddMentor t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'session.book')       return <FlowBookSession t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'escalation.review')  return <FlowReviewEscalations t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'report.open')        return <FlowOpenReport t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'report.open_filtered') return <FlowOpenFilteredTables t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'comm.nudge')         return <FlowNudgeUser t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'comm.send_bulk')     return <FlowSendBulk t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'mentee.top_up')      return <FlowMenteeTopUp t={t} ctx={ctx} onAfter={onAfter} />;
  if (actionId === 'mentee.confirm_booking') return <FlowMenteeConfirmBooking t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  if (actionId === 'mentor.map_to_org')  return <FlowMapMentorToOrg t={t} ctx={ctx} target={target} onAfter={onAfter} />;
  // Fallback: render generic if no bespoke match
  const a = ACTION_REGISTRY[actionId];
  const Icon = ICON_MAP[a.icon] || ChevronRight;
  return <GenericActionModal t={t} ctx={ctx} actionId={actionId} target={target} a={a} Icon={Icon} onAfter={onAfter} />;
}

// Shared flow shell with steps + nav
function FlowShell({ t, title, subtitle, icon: Icon, step, totalSteps, stepLabels, onClose, onBack, onNext, nextLabel, nextDisabled, danger, children, footerExtra, width }) {
  // Right-side drawer per UX spec for multi-step flows.
  // Generous horizontal room (default 720px), full-height,
  // breadcrumb-style step strip, sticky footer.
  // Background page stays visible at 30% opacity for context retention.
  const drawerWidth = width || 720;
  const isMultiStep = totalSteps > 1;
  const stepLabel = isMultiStep && stepLabels[step] ? stepLabels[step] : null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, display: 'flex', justifyContent: 'flex-end', animation: 'mu-fade-in 200ms ease' }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: drawerWidth, maxWidth: '95vw', height: '100vh',
        background: t.bgPanel, borderLeft: '1px solid ' + t.border,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-24px 0 64px rgba(0,0,0,0.4)',
        animation: 'mu-slide-in-right 240ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}>
        {/* HEADER — sticky at top */}
        <div style={{ padding: '20px 24px 0', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: (danger ? t.red : t.accent) + '22', color: danger ? t.red : t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={18} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="mu-display" style={{ fontSize: 22, color: t.text, lineHeight: 1.15 }}>{title}</div>
              {subtitle && <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4, lineHeight: 1.5 }}>{subtitle}</div>}
            </div>
            <button onClick={onClose} title="Close" style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', padding: 4 }}><X size={18} /></button>
          </div>

          {/* BREADCRUMB STEP STRIP — replaces the progress dots */}
          {isMultiStep && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginTop: 16, marginBottom: 0, overflowX: 'auto', paddingBottom: 12, borderBottom: '1px solid ' + t.borderSoft }} className="mu-scroll">
              {stepLabels.map((lbl, i) => {
                const isActive = i === step;
                const isComplete = i < step;
                const isClickable = i < step; // can jump back to earlier steps
                return (
                  <React.Fragment key={i}>
                    <button
                      onClick={() => isClickable && onBack && (i === step - 1 ? onBack() : null)}
                      disabled={!isClickable}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '4px 8px', background: 'transparent', border: 'none',
                        cursor: isClickable ? 'pointer' : 'default',
                        whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                      {isComplete
                        ? <CheckCircle2 size={14} color={t.accent} />
                        : isActive
                          ? <span style={{ width: 14, height: 14, borderRadius: 999, background: t.accent, color: '#0a1f28', fontSize: 9, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{i + 1}</span>
                          : <Circle size={14} color={t.textDim} strokeWidth={1.5} />}
                      <span style={{
                        fontSize: 11, fontWeight: isActive ? 700 : 500,
                        color: isActive ? t.text : isComplete ? t.textMuted : t.textDim,
                      }}>{lbl}</span>
                    </button>
                    {i < stepLabels.length - 1 && (
                      <ChevronRight size={12} color={t.textDim} style={{ flexShrink: 0, opacity: 0.5 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* STEP COUNTER + CURRENT STEP LABEL — small breadcrumb context line */}
          {isMultiStep && (
            <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, padding: '8px 0', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Step {step + 1} of {totalSteps} · <span style={{ color: t.accent }}>{stepLabel}</span>
            </div>
          )}
        </div>

        {/* SCROLLABLE BODY */}
        <div style={{ flex: 1, overflow: 'auto', padding: '8px 24px 24px' }} className="mu-scroll">
          {children}
        </div>

        {/* STICKY FOOTER */}
        <div style={{
          flexShrink: 0, padding: '14px 24px',
          borderTop: '1px solid ' + t.borderSoft, background: t.bgPanel,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8,
        }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {footerExtra}
            {/* Persistent escape hatch — always show how to exit */}
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>
              esc to close · auto-saved as draft
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {onBack && step > 0 ? (
              <button onClick={onBack} style={{
                padding: '9px 18px', background: 'transparent',
                border: '1px solid ' + t.border, color: t.text,
                borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                <ChevronLeft size={13} /> Back
              </button>
            ) : (
              <button onClick={onClose} style={{
                padding: '9px 18px', background: 'transparent',
                border: '1px solid ' + t.border, color: t.textMuted,
                borderRadius: 999, cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: FONT_BODY,
              }}>Cancel</button>
            )}
            {onNext && (
              <button onClick={onNext} disabled={nextDisabled} style={{
                padding: '9px 20px',
                background: nextDisabled ? t.borderSoft : (danger ? t.red : t.accent),
                border: '1px solid ' + (nextDisabled ? t.borderSoft : (danger ? t.red : t.accent)),
                color: nextDisabled ? t.textDim : (danger ? '#fff' : '#0a1f28'),
                borderRadius: 999, cursor: nextDisabled ? 'not-allowed' : 'pointer',
                fontSize: 12, fontWeight: 700, fontFamily: FONT_BODY,
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}>
                {nextLabel || (step + 1 === totalSteps ? 'Confirm' : 'Continue')}
                {!nextDisabled && <ArrowRight size={13} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. Create Organisation — full 6-step onboarding flow capturing every field
//    needed to actually onboard a real org (institution or corporate client).
//    Steps: Profile → Billing & legal → Plan & credits → Branding & domain →
//           Defaults & policies → First admin & go-live → Confirm.
function FlowCreateOrg({ t, ctx, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    // Step 0 — Profile
    name: '', orgType: 'institution', industry: 'Higher Education', size: '500-2000',
    country: 'India', city: '', website: '',
    // Step 1 — Billing & legal
    legalName: '', gstin: '', pan: '', billingEmail: '', billingAddress: '',
    poNumber: '', salesRep: '',
    // Step 2 — Plan & credits
    plan: 'Growth', initialCredits: 1000, contractTerm: '12 months',
    autoRenew: true, dataResidency: 'India',
    // Step 3 — Branding & domain
    subdomain: '', primaryColor: '#4ec3a9', secondaryColor: '#9b6dff',
    logoUploaded: false, restrictDomain: '',
    // Step 4 — Defaults & policies
    approvalMode: 'auto', mentorSourcing: 'platform_pool',
    refundPolicy: 'inherit_platform', noShowPolicy: 'inherit_platform',
    slaPolicy: 'standard', defaultProgrammeBudget: 'org_wallet',
    enableMisVisibility: true, enableAiMilestones: true, enableChatbot: true,
    // Step 5 — First admin & go-live
    adminName: '', adminEmail: '', adminRole: 'Org Admin', adminPhone: '',
    goLiveDate: '', sendWelcomeKit: true,
  });

  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'org.create', label: 'Onboard organisation', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };
  const update = (patch) => setData(Object.assign({}, data, patch));

  // Auto-suggest subdomain from name as user types it
  useEffect(() => {
    if (data.name && !data.subdomain) {
      const slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30);
      if (slug) update({ subdomain: slug });
    }
  }, [data.name]);

  // Validation per step
  const stepValid = () => {
    if (step === 0) return data.name && data.country && data.industry && data.orgType;
    if (step === 1) return data.legalName && data.billingEmail && data.gstin;
    if (step === 2) return data.plan && parseInt(data.initialCredits, 10) > 0;
    if (step === 3) return data.subdomain && /^[a-z0-9-]+$/.test(data.subdomain);
    if (step === 4) return true; // all defaults pre-filled
    if (step === 5) return data.adminName && data.adminEmail;
    return true;
  };

  const next = () => {
    if (step < 6) { setStep(step + 1); return; }
    // Final confirm — mutate orgsStore + side-effect logs
    const newOrg = {
      id: 'org_' + Date.now(),
      name: data.name,
      plan: data.plan,
      mentees: 0, mentors: 0,
      creditsLeft: parseInt(data.initialCredits, 10),
      mis: 0, slaBreach: false, ticketsOpen: 0,
      status: data.goLiveDate && new Date(data.goLiveDate) > new Date() ? 'Scheduled' : 'Active',
      lastActive: 'just now',
      // Extended profile — preserved for inspect / settings views
      orgType: data.orgType, industry: data.industry, size: data.size,
      country: data.country, city: data.city, website: data.website,
      legalName: data.legalName, gstin: data.gstin, pan: data.pan,
      billingEmail: data.billingEmail, salesRep: data.salesRep,
      contractTerm: data.contractTerm, autoRenew: data.autoRenew,
      subdomain: data.subdomain, primaryColor: data.primaryColor,
      restrictDomain: data.restrictDomain,
      approvalMode: data.approvalMode, mentorSourcing: data.mentorSourcing,
    };
    ctx.stores.orgs.unshift(newOrg);
    ctx.runAction('org.create', null, data);
    ctx.moveCredits(parseInt(data.initialCredits, 10), 'platform', 'org', data.name, 'Initial allocation on org create · ' + data.plan + ' plan');
    if (data.adminEmail) {
      ctx.appendLog({ actionId: 'user.invite', label: 'Invite first admin', target: data.adminName, payload: { email: data.adminEmail, role: data.adminRole, org: data.name }, result: 'Completed', destructive: false });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };

  const stepLabels = ['Profile','Billing','Plan','Branding','Defaults','Admin','Confirm'];
  const Icon = ICON_MAP.Building2;

  return (
    <FlowShell t={t}
      title="Onboard new organisation"
      subtitle="Onboard an institution or corporate client. 6 steps — about 4 minutes."
      icon={Icon}
      step={step}
      totalSteps={7}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => setStep(step - 1)}
      onNext={next}
      nextLabel={step === 6 ? 'Create organisation & send invite' : 'Continue'}
      nextDisabled={!stepValid()}
      width={780}
    >
      {/* STEP 0 — Profile */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Tell us who they are.</div>
          <FlowField t={t} label="Organisation name" required value={data.name} onChange={(v) => update({ name: v })} placeholder="e.g. IIT Bombay Mentorship Programme" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowSelectField t={t} label="Organisation type" required value={data.orgType} onChange={(v) => update({ orgType: v })}
              options={[
                { v: 'institution', l: 'Higher Education Institution' },
                { v: 'corporate', l: 'Corporate Client' },
                { v: 'school', l: 'School / K-12' },
                { v: 'nonprofit', l: 'Non-profit / NGO' },
                { v: 'b2c', l: 'External / B2C' },
              ]} />
            <FlowSelectField t={t} label="Industry" required value={data.industry} onChange={(v) => update({ industry: v })}
              options={['Higher Education','Technology','Financial Services','Consulting','Healthcare','Manufacturing','Retail','Government','Other'].map((x) => ({ v: x, l: x }))} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlowSelectField t={t} label="Org size (users)" value={data.size} onChange={(v) => update({ size: v })}
              options={['<100','100-500','500-2000','2000-10000','>10000'].map((x) => ({ v: x, l: x }))} />
            <FlowField t={t} label="Country / region" required value={data.country} onChange={(v) => update({ country: v })} placeholder="India" />
            <FlowField t={t} label="City" value={data.city} onChange={(v) => update({ city: v })} placeholder="Mumbai" />
          </div>
          <FlowField t={t} label="Website" type="url" value={data.website} onChange={(v) => update({ website: v })} placeholder="https://iitbombay.ac.in" />
        </div>
      )}

      {/* STEP 1 — Billing & legal */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Who pays the bill, and to whom do invoices get issued.</div>
          <FlowField t={t} label="Legal entity name" required value={data.legalName} onChange={(v) => update({ legalName: v })} placeholder="Indian Institute of Technology Bombay" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="GSTIN" required value={data.gstin} onChange={(v) => update({ gstin: v.toUpperCase() })} placeholder="27AABCU9603R1ZM" />
            <FlowField t={t} label="PAN" value={data.pan} onChange={(v) => update({ pan: v.toUpperCase() })} placeholder="AABCU9603R" />
          </div>
          <FlowField t={t} label="Billing email (invoices go here)" type="email" required value={data.billingEmail} onChange={(v) => update({ billingEmail: v })} placeholder="accounts@iitbombay.ac.in" />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Billing address</label>
            <textarea rows={2} value={data.billingAddress} onChange={(e) => update({ billingAddress: e.target.value })} placeholder="Powai, Mumbai 400076"
              style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="PO number (optional)" value={data.poNumber} onChange={(v) => update({ poNumber: v })} placeholder="PO-2026-0431" />
            <FlowField t={t} label="Sales rep / account owner" value={data.salesRep} onChange={(v) => update({ salesRep: v })} placeholder="Vikram Sharma" />
          </div>
        </div>
      )}

      {/* STEP 2 — Plan & credits */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>What did they buy.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Plan</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { k: 'Starter',    credits: 250,  price: '₹50k / yr',  caps: '50 mentees · 1 admin' },
                { k: 'Growth',     credits: 1000, price: '₹2L / yr',   caps: '500 mentees · 5 admins · sub-admins' },
                { k: 'Enterprise', credits: 5000, price: 'Custom',     caps: 'Unlimited · SSO · custom SLA' },
              ].map((p) => (
                <button key={p.k} onClick={() => update({ plan: p.k, initialCredits: p.credits })} style={{
                  padding: 14, background: data.plan === p.k ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.plan === p.k ? t.accent : t.borderSoft),
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700, marginBottom: 4 }}>{p.k}</div>
                  <div style={{ fontSize: 11, color: t.accent, fontFamily: FONT_MONO, marginBottom: 6 }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginBottom: 4 }}>{p.credits.toLocaleString()} credits included</div>
                  <div style={{ fontSize: 10, color: t.textDim, lineHeight: 1.4 }}>{p.caps}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Initial credits" type="number" value={data.initialCredits} onChange={(v) => update({ initialCredits: v })} />
            <FlowSelectField t={t} label="Contract term" value={data.contractTerm} onChange={(v) => update({ contractTerm: v })}
              options={['1 month','3 months','6 months','12 months','24 months'].map((x) => ({ v: x, l: x }))} />
            <FlowSelectField t={t} label="Data residency" value={data.dataResidency} onChange={(v) => update({ dataResidency: v })}
              options={['India','Singapore','EU','US'].map((x) => ({ v: x, l: x }))} />
          </div>
          <FlowToggle t={t} label="Auto-renew at end of term" desc="If off, account requires manual renewal action by Super Admin."
            value={data.autoRenew} onChange={(v) => update({ autoRenew: v })} />
        </div>
      )}

      {/* STEP 3 — Branding & domain */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>How they show up to their users.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
              Subdomain <span style={{ color: t.red }}>*</span>
            </label>
            <div style={{ display: 'flex', alignItems: 'stretch', border: '1px solid ' + t.border, borderRadius: 8, overflow: 'hidden' }}>
              <input value={data.subdomain} onChange={(e) => update({ subdomain: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="iit-bombay"
                style={{ flex: 1, padding: '8px 10px', background: t.bgInput, border: 'none', color: t.text, fontSize: 13, fontFamily: FONT_MONO }} />
              <span style={{ padding: '8px 12px', background: t.bgCardElev, color: t.textMuted, fontSize: 12, fontFamily: FONT_MONO, borderLeft: '1px solid ' + t.borderSoft, display: 'inline-flex', alignItems: 'center' }}>.mentorunion.com</span>
            </div>
            {data.subdomain && /^[a-z0-9-]+$/.test(data.subdomain) && (
              <div style={{ fontSize: 10, color: t.green, marginTop: 4, fontFamily: FONT_MONO }}>✓ {data.subdomain}.mentorunion.com is available</div>
            )}
          </div>
          <FlowField t={t} label="Restrict signups to this email domain (optional)" value={data.restrictDomain} onChange={(v) => update({ restrictDomain: v })} placeholder="iitbombay.ac.in" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Primary brand color</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={data.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })}
                  style={{ width: 38, height: 36, padding: 0, border: '1px solid ' + t.border, borderRadius: 6, background: 'transparent', cursor: 'pointer' }} />
                <input value={data.primaryColor} onChange={(e) => update({ primaryColor: e.target.value })}
                  style={{ flex: 1, padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 12, fontFamily: FONT_MONO }} />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Secondary brand color</label>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <input type="color" value={data.secondaryColor} onChange={(e) => update({ secondaryColor: e.target.value })}
                  style={{ width: 38, height: 36, padding: 0, border: '1px solid ' + t.border, borderRadius: 6, background: 'transparent', cursor: 'pointer' }} />
                <input value={data.secondaryColor} onChange={(e) => update({ secondaryColor: e.target.value })}
                  style={{ flex: 1, padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 12, fontFamily: FONT_MONO }} />
              </div>
            </div>
          </div>
          <div style={{ padding: 12, background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5 }}>Logo</span>
              <button onClick={() => update({ logoUploaded: !data.logoUploaded })} style={{
                padding: '4px 10px', background: data.logoUploaded ? t.green + '22' : t.bgInput,
                color: data.logoUploaded ? t.green : t.text, border: '1px solid ' + (data.logoUploaded ? t.green : t.border),
                borderRadius: 6, fontSize: 10, cursor: 'pointer', fontFamily: FONT_BODY,
              }}>{data.logoUploaded ? '✓ Uploaded' : 'Upload PNG / SVG'}</button>
            </div>
            <div style={{ fontSize: 10, color: t.textDim }}>Recommended: SVG, 200×60px, transparent background.</div>
          </div>
          {/* Live preview */}
          <div style={{ background: '#0a1f28', border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 9, color: '#94a3a8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Marketplace preview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: data.primaryColor, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={14} color="#0a1f28" />
              </div>
              <div style={{ flex: 1 }}>
                <div className="mu-display" style={{ fontSize: 16, color: '#f4ead7' }}>{data.name || 'Your organisation'}</div>
                <div style={{ fontSize: 10, color: '#94a3a8', fontFamily: FONT_MONO }}>{data.subdomain || 'subdomain'}.mentorunion.com</div>
              </div>
              <button style={{ padding: '6px 14px', background: data.primaryColor, color: '#0a1f28', border: 'none', borderRadius: 999, fontSize: 11, fontWeight: 700 }}>Book a session</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 4 — Defaults & policies */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>How the platform should behave for this org by default. The Org Admin can change most of these later.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowSelectField t={t} label="Booking approval mode" value={data.approvalMode} onChange={(v) => update({ approvalMode: v })}
              options={[
                { v: 'auto', l: 'Auto-accept (no friction)' },
                { v: 'mentor', l: 'Mentor approves each request' },
                { v: 'admin', l: 'Org Admin approves each request' },
              ]} />
            <FlowSelectField t={t} label="Mentor sourcing" value={data.mentorSourcing} onChange={(v) => update({ mentorSourcing: v })}
              options={[
                { v: 'platform_pool', l: 'Platform pool only' },
                { v: 'private_pool', l: 'Private pool only' },
                { v: 'both', l: 'Both (recommended)' },
              ]} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlowSelectField t={t} label="Refund policy" value={data.refundPolicy} onChange={(v) => update({ refundPolicy: v })}
              options={[
                { v: 'inherit_platform', l: 'Inherit platform default' },
                { v: 'strict', l: 'Strict (no refunds after start)' },
                { v: 'lenient', l: 'Lenient (24h post-session)' },
              ]} />
            <FlowSelectField t={t} label="No-show policy" value={data.noShowPolicy} onChange={(v) => update({ noShowPolicy: v })}
              options={[
                { v: 'inherit_platform', l: 'Inherit platform default' },
                { v: 'mentee_charged', l: 'Mentee fully charged' },
                { v: 'half_credit', l: 'Half credit charged' },
              ]} />
            <FlowSelectField t={t} label="SLA tier" value={data.slaPolicy} onChange={(v) => update({ slaPolicy: v })}
              options={[
                { v: 'standard', l: 'Standard (24h response)' },
                { v: 'priority', l: 'Priority (4h response)' },
                { v: 'enterprise', l: 'Enterprise (1h, dedicated CSM)' },
              ]} />
          </div>
          <FlowSelectField t={t} label="Programme budget structure" value={data.defaultProgrammeBudget} onChange={(v) => update({ defaultProgrammeBudget: v })}
            options={[
              { v: 'org_wallet', l: 'Single org wallet (simpler)' },
              { v: 'programme_ledger', l: 'Per-programme ring-fenced budgets' },
            ]} />
          <div style={{ padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Feature flags</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <FlowToggle t={t} label="Mentor Impact Score visible" desc="Show MIS to mentees in the marketplace." value={data.enableMisVisibility} onChange={(v) => update({ enableMisVisibility: v })} compact />
              <FlowToggle t={t} label="AI milestone suggestions" desc="AI Milestone Assistant drafts breakthroughs from session feedback." value={data.enableAiMilestones} onChange={(v) => update({ enableAiMilestones: v })} compact />
              <FlowToggle t={t} label="Support chatbot" desc="First-line support routed via Chatbot Router." value={data.enableChatbot} onChange={(v) => update({ enableChatbot: v })} compact />
            </div>
          </div>
        </div>
      )}

      {/* STEP 5 — First admin & go-live */}
      {step === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>The first Org Admin will receive an email invite. They take ownership from here.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="First admin name" required value={data.adminName} onChange={(v) => update({ adminName: v })} placeholder="Priya Mehta" />
            <FlowSelectField t={t} label="Admin role" value={data.adminRole} onChange={(v) => update({ adminRole: v })}
              options={[{ v: 'Org Admin', l: 'Org Admin (full access)' }, { v: 'Org Sub-Admin', l: 'Org Sub-Admin (delegated)' }]} />
          </div>
          <FlowField t={t} label="First admin email" type="email" required value={data.adminEmail} onChange={(v) => update({ adminEmail: v })} placeholder="priya@iitbombay.ac.in" />
          <FlowField t={t} label="First admin phone (optional)" value={data.adminPhone} onChange={(v) => update({ adminPhone: v })} placeholder="+91 98765 43210" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Go-live date</label>
              <input type="date" value={data.goLiveDate} onChange={(e) => update({ goLiveDate: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 4 }}>Leave blank to activate immediately.</div>
            </div>
            <FlowToggle t={t} label="Send welcome kit" desc="Onboarding email · admin docs · video walkthrough." value={data.sendWelcomeKit} onChange={(v) => update({ sendWelcomeKit: v })} />
          </div>
        </div>
      )}

      {/* STEP 6 — Confirm */}
      {step === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Review and confirm. Click any section header below to jump back and edit.</div>
          {[
            { label: 'Profile', step: 0, rows: [
              ['Organisation', data.name],
              ['Type · industry', data.orgType + ' · ' + data.industry],
              ['Size', data.size + ' users'],
              ['Location', [data.city, data.country].filter(Boolean).join(', ')],
              ['Website', data.website || '—'],
            ]},
            { label: 'Billing & legal', step: 1, rows: [
              ['Legal entity', data.legalName],
              ['GSTIN · PAN', data.gstin + (data.pan ? ' · ' + data.pan : '')],
              ['Billing email', data.billingEmail],
              ['Sales rep', data.salesRep || '—'],
            ]},
            { label: 'Plan & credits', step: 2, rows: [
              ['Plan', data.plan + ' · ' + data.contractTerm + (data.autoRenew ? ' · auto-renew' : ' · manual renew')],
              ['Initial credits', parseInt(data.initialCredits, 10).toLocaleString()],
              ['Data residency', data.dataResidency],
            ]},
            { label: 'Branding & domain', step: 3, rows: [
              ['Subdomain', data.subdomain + '.mentorunion.com'],
              ['Brand colors', data.primaryColor + ' · ' + data.secondaryColor],
              ['Domain restriction', data.restrictDomain || 'none (any email can sign up)'],
              ['Logo', data.logoUploaded ? '✓ uploaded' : 'not uploaded'],
            ]},
            { label: 'Defaults & policies', step: 4, rows: [
              ['Approval mode', data.approvalMode],
              ['Mentor sourcing', data.mentorSourcing.replace(/_/g, ' ')],
              ['Policies', 'refund=' + data.refundPolicy + ' · noshow=' + data.noShowPolicy + ' · sla=' + data.slaPolicy],
              ['Programme budgets', data.defaultProgrammeBudget.replace(/_/g, ' ')],
              ['Feature flags', [data.enableMisVisibility && 'MIS', data.enableAiMilestones && 'AI', data.enableChatbot && 'Chatbot'].filter(Boolean).join(' · ') || 'all off'],
            ]},
            { label: 'First admin & go-live', step: 5, rows: [
              ['First admin', data.adminName + ' · ' + data.adminEmail + (data.adminPhone ? ' · ' + data.adminPhone : '')],
              ['Role', data.adminRole],
              ['Go-live', data.goLiveDate || 'immediately'],
              ['Welcome kit', data.sendWelcomeKit ? 'will be sent' : 'skipped'],
            ]},
          ].map((sec) => (
            <div key={sec.label} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>{sec.label}</div>
                <button onClick={() => setStep(sec.step)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontFamily: FONT_BODY }}>Edit</button>
              </div>
              {sec.rows.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, padding: '5px 0', fontSize: 11 }}>
                  <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 9 }}>{k}</span>
                  <span style={{ color: t.text, lineHeight: 1.4 }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
          <div style={{ marginTop: 4, padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Org "<strong>{data.name}</strong>" appears in the Organisations list with status <strong style={{ color: data.goLiveDate ? t.yellow : t.green }}>{data.goLiveDate ? 'Scheduled · ' + data.goLiveDate : 'Active'}</strong></li>
              <li><strong>{parseInt(data.initialCredits, 10).toLocaleString()}</strong> credits move from platform wallet to org wallet (Allocation Engine logs the transfer)</li>
              <li>Email invite goes to <strong>{data.adminEmail}</strong> with admin onboarding link</li>
              {data.sendWelcomeKit && <li>Welcome kit (docs · video · CSM intro) emailed to admin</li>}
              <li>Subdomain <strong>{data.subdomain}.mentorunion.com</strong> activates with custom branding</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the creator with full payload</li>
              {data.restrictDomain && <li>Signup restriction: only @{data.restrictDomain} email addresses can join this org</li>}
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// Helper field component for flows
function FlowField({ t, label, value, onChange, type, placeholder, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
        {label} {required && <span style={{ color: t.red }}>*</span>}
      </label>
      <input type={type || 'text'} value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
    </div>
  );
}

// Helper select field for flows
function FlowSelectField({ t, label, value, onChange, options, required }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
        {label} {required && <span style={{ color: t.red }}>*</span>}
      </label>
      <select value={value || ''} onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }}>
        <option value="">— choose —</option>
        {options.map((o) => <option key={o.v} value={o.v}>{o.l}</option>)}
      </select>
    </div>
  );
}

// Helper toggle for flows
function FlowToggle({ t, label, desc, value, onChange, compact }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: compact ? 0 : 10, background: compact ? 'transparent' : t.bgCardElev, border: compact ? 'none' : '1px solid ' + t.borderSoft, borderRadius: 8 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: compact ? 12 : 13, color: t.text, fontWeight: 600 }}>{label}</div>
        {desc && <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2, lineHeight: 1.4 }}>{desc}</div>}
      </div>
      <button onClick={() => onChange(!value)} style={{
        width: 36, height: 20, borderRadius: 999,
        background: value ? t.accent : t.borderSoft, border: 'none',
        position: 'relative', cursor: 'pointer', flexShrink: 0,
      }}>
        <div style={{ position: 'absolute', top: 2, left: value ? 18 : 2, width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'left 150ms ease' }} />
      </button>
    </div>
  );
}

/* ============================================================================
   AUDIENCE BUILDER — pick user types AND/OR specific users for any bulk action.
   Composable rule list: each rule is one of
     { kind: 'type',     userType: 'mentees' | 'mentors' | 'org_admins' | 'sub_admins' | 'all_admins' }
     { kind: 'org',      orgName: 'IIM Bengaluru', userType: 'mentees' | 'mentors' | 'all' }
     { kind: 'cohort',   cohort: 'Cohort Alpha' }
     { kind: 'attr',     attribute: 'tier'|'mis'|'plan'|'lastActive'|'creditsLow', value: ... }
     { kind: 'specific', users: [{id, name, kind: 'mentor'|'mentee'|'admin'}] }
   Resolver runs the union of rules through the in-memory stores and dedupes by id.
   ============================================================================ */

// Pure: given a list of rules + the engine stores, return the resolved recipient list
function resolveAudience(rules, stores) {
  if (!rules || rules.length === 0) return [];
  const mentors = (stores.mentors || []);
  const mentees = (stores.mentees || []);
  const orgs = (stores.orgs || []);
  // Synthetic admins list — derive from orgs (each org has a primary admin in real product)
  const admins = orgs.flatMap((o) => [{
    id: 'admin_' + o.id, name: 'Admin · ' + o.name, kind: 'admin',
    org: o.name, role: 'org_admin', email: 'admin@' + (o.subdomain || 'demo') + '.com',
  }]);
  const out = {};
  const add = (u, kind) => {
    const id = (kind || u.kind || 'u') + '_' + (u.id || u.name);
    if (!out[id]) out[id] = Object.assign({ kind: kind || u.kind }, u);
  };
  rules.forEach((rule) => {
    if (rule.kind === 'type') {
      if (rule.userType === 'mentees') mentees.forEach((m) => add(m, 'mentee'));
      else if (rule.userType === 'mentors') mentors.forEach((m) => add(m, 'mentor'));
      else if (rule.userType === 'org_admins') admins.forEach((a) => add(a, 'admin'));
      else if (rule.userType === 'sub_admins') admins.filter((a) => a.role === 'sub_admin').forEach((a) => add(a, 'admin'));
      else if (rule.userType === 'all_admins') admins.forEach((a) => add(a, 'admin'));
    } else if (rule.kind === 'org') {
      const orgName = rule.orgName;
      if (rule.userType === 'mentees' || rule.userType === 'all') mentees.filter((m) => m.org === orgName).forEach((m) => add(m, 'mentee'));
      if (rule.userType === 'mentors' || rule.userType === 'all') {
        // Mentors mapped to orgs are stored as mappedOrgs array on extended profiles, fallback to first N
        mentors.filter((m) => (m.mappedOrgs && m.mappedOrgs.indexOf(orgName) >= 0)).forEach((m) => add(m, 'mentor'));
      }
      if (rule.userType === 'admins' || rule.userType === 'all') admins.filter((a) => a.org === orgName).forEach((a) => add(a, 'admin'));
    } else if (rule.kind === 'cohort') {
      mentees.filter((m) => m.cohort === rule.cohort).forEach((m) => add(m, 'mentee'));
    } else if (rule.kind === 'attr') {
      if (rule.attribute === 'tier') mentors.filter((m) => m.tier === rule.value).forEach((m) => add(m, 'mentor'));
      else if (rule.attribute === 'mis_above') mentors.filter((m) => m.mis >= parseInt(rule.value, 10)).forEach((m) => add(m, 'mentor'));
      else if (rule.attribute === 'mis_below') mentors.filter((m) => m.mis < parseInt(rule.value, 10)).forEach((m) => add(m, 'mentor'));
      else if (rule.attribute === 'kyc_pending') mentors.filter((m) => m.kyc === 'Pending').forEach((m) => add(m, 'mentor'));
      else if (rule.attribute === 'plan') {
        const matchOrgs = orgs.filter((o) => o.plan === rule.value).map((o) => o.name);
        mentees.filter((m) => matchOrgs.indexOf(m.org) >= 0).forEach((m) => add(m, 'mentee'));
      }
      else if (rule.attribute === 'credits_low') mentees.filter((m) => m.creditsRemaining < parseInt(rule.value || 5, 10)).forEach((m) => add(m, 'mentee'));
      else if (rule.attribute === 'inactive_7d') mentees.filter((m) => /w ago|2d ago/.test(m.lastActive || '')).forEach((m) => add(m, 'mentee'));
      else if (rule.attribute === 'recent_session') mentors.filter((m) => /h ago|today/.test(m.lastSession || '')).forEach((m) => add(m, 'mentor'));
    } else if (rule.kind === 'specific') {
      (rule.users || []).forEach((u) => add(u, u.kind));
    }
  });
  return Object.values(out);
}

// Returns a short human-readable description of a rule for the chip UI
function describeAudienceRule(rule) {
  if (rule.kind === 'type') {
    const labels = { mentees: 'All mentees', mentors: 'All mentors', org_admins: 'All org admins', sub_admins: 'All sub-admins', all_admins: 'All admins' };
    return labels[rule.userType] || 'All users';
  }
  if (rule.kind === 'org') return (rule.userType === 'all' ? 'Everyone' : rule.userType.charAt(0).toUpperCase() + rule.userType.slice(1)) + ' in ' + rule.orgName;
  if (rule.kind === 'cohort') return 'Mentees in ' + rule.cohort;
  if (rule.kind === 'attr') {
    if (rule.attribute === 'tier') return 'Mentors · tier = ' + rule.value;
    if (rule.attribute === 'mis_above') return 'Mentors · MIS ≥ ' + rule.value;
    if (rule.attribute === 'mis_below') return 'Mentors · MIS < ' + rule.value;
    if (rule.attribute === 'kyc_pending') return 'Mentors · KYC pending';
    if (rule.attribute === 'plan') return 'Mentees in orgs on ' + rule.value + ' plan';
    if (rule.attribute === 'credits_low') return 'Mentees · credits < ' + (rule.value || 5);
    if (rule.attribute === 'inactive_7d') return 'Mentees · inactive 7+ days';
    if (rule.attribute === 'recent_session') return 'Mentors · session today';
    return 'Attribute filter';
  }
  if (rule.kind === 'specific') return (rule.users || []).length + ' specific user' + ((rule.users || []).length === 1 ? '' : 's');
  return 'Rule';
}

// AudienceBuilder — composable rule list + live count + recipient preview
function AudienceBuilder({ t, ctx, value, onChange, label, scopeOrgName }) {
  const rules = value || [];
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerKind, setPickerKind] = useState(null); // 'type' | 'org' | 'cohort' | 'attr' | 'specific'
  const [pickerDraft, setPickerDraft] = useState({});
  const [previewOpen, setPreviewOpen] = useState(false);

  const resolved = resolveAudience(rules, ctx.stores);
  const counts = {
    mentees: resolved.filter((r) => r.kind === 'mentee').length,
    mentors: resolved.filter((r) => r.kind === 'mentor').length,
    admins:  resolved.filter((r) => r.kind === 'admin').length,
  };
  const total = resolved.length;

  const addRule = (rule) => {
    onChange((rules || []).concat([rule]));
    setPickerOpen(false);
    setPickerKind(null);
    setPickerDraft({});
  };
  const removeRule = (idx) => onChange(rules.filter((_, i) => i !== idx));

  const cohorts = Array.from(new Set((ctx.stores.mentees || []).map((m) => m.cohort).filter(Boolean))).slice(0, 8);
  const orgNames = (ctx.stores.orgs || []).map((o) => o.name).slice(0, 12);

  return (
    <div>
      {label && <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>{label}</label>}
      {/* Rule chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8, minHeight: 30 }}>
        {rules.length === 0 && (
          <span style={{ padding: '6px 12px', fontSize: 11, color: t.textDim, border: '1px dashed ' + t.borderSoft, borderRadius: 999 }}>
            No audience rules yet — click below to add one
          </span>
        )}
        {rules.map((rule, idx) => (
          <span key={idx} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 6px 5px 12px', background: t.accent + '22', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 999, fontSize: 11, fontWeight: 500 }}>
            {describeAudienceRule(rule)}
            <button onClick={() => removeRule(idx)} style={{ background: 'transparent', border: 'none', color: t.accent, cursor: 'pointer', padding: 2, display: 'inline-flex', alignItems: 'center' }} title="Remove rule"><X size={11} /></button>
          </span>
        ))}
      </div>

      {/* Add rule + count summary */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, marginBottom: 8 }}>
        <button onClick={() => setPickerOpen(!pickerOpen)} style={{ padding: '6px 12px', background: pickerOpen ? t.accent : 'transparent', color: pickerOpen ? '#0a1f28' : t.accent, border: '1px solid ' + t.accent, borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Plus size={11} /> Add audience rule
        </button>
        <div style={{ flex: 1, fontSize: 11, color: t.textMuted, textAlign: 'right' }}>
          Reaches <strong style={{ color: total > 0 ? t.text : t.textDim, fontFamily: FONT_MONO, fontSize: 13 }}>{total}</strong> {total === 1 ? 'recipient' : 'recipients'}
          {total > 0 && (
            <span style={{ display: 'block', fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, marginTop: 2 }}>
              {[counts.mentees && counts.mentees + ' mentees', counts.mentors && counts.mentors + ' mentors', counts.admins && counts.admins + ' admins'].filter(Boolean).join(' · ')}
            </span>
          )}
        </div>
        {total > 0 && (
          <button onClick={() => setPreviewOpen(!previewOpen)} style={{ padding: '5px 10px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 10, cursor: 'pointer' }}>
            {previewOpen ? 'Hide' : 'Preview'}
          </button>
        )}
      </div>

      {/* Picker panel — opens when user wants to add a rule */}
      {pickerOpen && (
        <div style={{ background: t.bgPanel, border: '1px solid ' + t.accent + '55', borderRadius: 10, padding: 12, marginBottom: 8 }}>
          {/* Step 1: pick rule kind */}
          {!pickerKind && (
            <>
              <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>Rule type</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6 }}>
                {[
                  { k: 'type',     l: 'User type',           d: 'All mentees, all mentors, all admins…' },
                  { k: 'org',      l: 'By organisation',     d: 'Everyone in a specific org' },
                  { k: 'cohort',   l: 'By cohort',           d: 'Mentees in a cohort' },
                  { k: 'attr',     l: 'By attribute',        d: 'MIS, tier, plan, last active, credits…' },
                  { k: 'specific', l: 'Specific named users', d: 'Pick individual users by name' },
                ].map((opt) => (
                  <button key={opt.k} onClick={() => setPickerKind(opt.k)} style={{
                    padding: 10, background: t.bgCardElev, border: '1px solid ' + t.borderSoft,
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  }} onMouseEnter={(e) => { e.currentTarget.style.background = t.accent + '11'; e.currentTarget.style.borderColor = t.accent; }} onMouseLeave={(e) => { e.currentTarget.style.background = t.bgCardElev; e.currentTarget.style.borderColor = t.borderSoft; }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                    <div style={{ fontSize: 10, color: t.textMuted }}>{opt.d}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — type rule */}
          {pickerKind === 'type' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setPickerKind(null)} style={{ padding: 4, background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', display: 'inline-flex' }}><ChevronLeft size={12} /></button>
                <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pick user type</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {[
                  { v: 'mentees', l: 'All mentees', count: ctx.stores.mentees.length },
                  { v: 'mentors', l: 'All mentors', count: ctx.stores.mentors.length },
                  { v: 'org_admins', l: 'All org admins', count: ctx.stores.orgs.length },
                  { v: 'sub_admins', l: 'All sub-admins', count: 0 },
                  { v: 'all_admins', l: 'All admins (org + sub)', count: ctx.stores.orgs.length },
                ].map((opt) => (
                  <button key={opt.v} onClick={() => addRule({ kind: 'type', userType: opt.v })} style={{
                    padding: '8px 10px', background: 'transparent', border: '1px solid ' + t.border,
                    borderRadius: 6, cursor: 'pointer', fontSize: 12, color: t.text, textAlign: 'left',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  }} onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <span>{opt.l}</span>
                    <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>~{opt.count}</span>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — org rule */}
          {pickerKind === 'org' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setPickerKind(null)} style={{ padding: 4, background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', display: 'inline-flex' }}><ChevronLeft size={12} /></button>
                <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>By organisation</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <FlowSelectField t={t} label="Organisation" value={pickerDraft.orgName || (scopeOrgName || '')} onChange={(v) => setPickerDraft(Object.assign({}, pickerDraft, { orgName: v }))}
                  options={orgNames.map((n) => ({ v: n, l: n }))} />
                <FlowSelectField t={t} label="Who within this org" value={pickerDraft.userType || 'mentees'} onChange={(v) => setPickerDraft(Object.assign({}, pickerDraft, { userType: v }))}
                  options={[{ v: 'mentees', l: 'Mentees' }, { v: 'mentors', l: 'Mentors mapped to this org' }, { v: 'admins', l: 'Admins of this org' }, { v: 'all', l: 'Everyone in this org' }]} />
                <button onClick={() => pickerDraft.orgName && addRule({ kind: 'org', orgName: pickerDraft.orgName, userType: pickerDraft.userType || 'mentees' })} disabled={!pickerDraft.orgName} style={{ padding: '6px 12px', background: pickerDraft.orgName ? t.accent : t.borderSoft, color: pickerDraft.orgName ? '#0a1f28' : t.textDim, border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: pickerDraft.orgName ? 'pointer' : 'not-allowed', alignSelf: 'flex-end' }}>Add rule</button>
              </div>
            </>
          )}

          {/* Step 2 — cohort rule */}
          {pickerKind === 'cohort' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setPickerKind(null)} style={{ padding: 4, background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', display: 'inline-flex' }}><ChevronLeft size={12} /></button>
                <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>By cohort</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {cohorts.map((c) => {
                  const cnt = ctx.stores.mentees.filter((m) => m.cohort === c).length;
                  return (
                    <button key={c} onClick={() => addRule({ kind: 'cohort', cohort: c })} style={{
                      padding: '8px 10px', background: 'transparent', border: '1px solid ' + t.border,
                      borderRadius: 6, cursor: 'pointer', fontSize: 12, color: t.text, textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between',
                    }} onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <span>{c}</span>
                      <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{cnt} mentees</span>
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {/* Step 2 — attribute rule */}
          {pickerKind === 'attr' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <button onClick={() => setPickerKind(null)} style={{ padding: 4, background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', display: 'inline-flex' }}><ChevronLeft size={12} /></button>
                <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>By attribute</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {[
                  { v: { attribute: 'tier', value: 'Excellent' }, l: 'Mentors · Excellent tier' },
                  { v: { attribute: 'tier', value: 'Good' },      l: 'Mentors · Good tier' },
                  { v: { attribute: 'tier', value: 'Basic' },     l: 'Mentors · Basic tier' },
                  { v: { attribute: 'mis_above', value: 80 },     l: 'Mentors · MIS ≥ 80' },
                  { v: { attribute: 'mis_below', value: 60 },     l: 'Mentors · MIS < 60' },
                  { v: { attribute: 'kyc_pending' },              l: 'Mentors · KYC pending' },
                  { v: { attribute: 'recent_session' },           l: 'Mentors · session today' },
                  { v: { attribute: 'plan', value: 'Enterprise' }, l: 'Mentees on Enterprise plan' },
                  { v: { attribute: 'plan', value: 'Growth' },     l: 'Mentees on Growth plan' },
                  { v: { attribute: 'credits_low', value: 5 },     l: 'Mentees · credits < 5' },
                  { v: { attribute: 'credits_low', value: 10 },    l: 'Mentees · credits < 10' },
                  { v: { attribute: 'inactive_7d' },               l: 'Mentees · inactive 7+ days' },
                ].map((opt, i) => (
                  <button key={i} onClick={() => addRule(Object.assign({ kind: 'attr' }, opt.v))} style={{
                    padding: '7px 10px', background: 'transparent', border: '1px solid ' + t.border,
                    borderRadius: 6, cursor: 'pointer', fontSize: 11, color: t.text, textAlign: 'left',
                  }} onMouseEnter={(e) => { e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2 — specific named users */}
          {pickerKind === 'specific' && (
            <SpecificUserPicker t={t} ctx={ctx} onConfirm={(users) => addRule({ kind: 'specific', users })} onBack={() => setPickerKind(null)} />
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button onClick={() => { setPickerOpen(false); setPickerKind(null); }} style={{ padding: '5px 10px', background: 'transparent', border: '1px solid ' + t.border, color: t.textMuted, borderRadius: 6, fontSize: 10, cursor: 'pointer' }}>Close picker</button>
          </div>
        </div>
      )}

      {/* Recipient preview list */}
      {previewOpen && total > 0 && (
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10, maxHeight: 220, overflow: 'auto' }} className="mu-scroll">
          <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>First {Math.min(20, total)} of {total} recipients</div>
          {resolved.slice(0, 20).map((r) => (
            <div key={(r.kind || 'u') + '_' + (r.id || r.name)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', fontSize: 11, color: t.text }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: r.kind === 'mentor' ? t.purple : r.kind === 'admin' ? t.orange : t.accent, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{r.name}</span>
              <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>{r.kind}</span>
              {r.org && <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, maxWidth: 140, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.org}</span>}
            </div>
          ))}
          {total > 20 && <div style={{ fontSize: 10, color: t.textDim, marginTop: 6, textAlign: 'center' }}>…and {total - 20} more</div>}
        </div>
      )}
    </div>
  );
}

// SpecificUserPicker — searchable list of all known users (mentors + mentees + admins)
function SpecificUserPicker({ t, ctx, onConfirm, onBack }) {
  const [query, setQuery] = useState('');
  const [picked, setPicked] = useState([]);
  const allUsers = []
    .concat(ctx.stores.mentors.map((m) => ({ id: m.id, name: m.name, kind: 'mentor', meta: m.tier || 'Mentor' })))
    .concat(ctx.stores.mentees.map((m) => ({ id: m.id, name: m.name, kind: 'mentee', meta: m.org || 'Mentee' })));
  const filtered = query
    ? allUsers.filter((u) => u.name.toLowerCase().indexOf(query.toLowerCase()) >= 0).slice(0, 30)
    : allUsers.slice(0, 30);
  const togglePick = (u) => {
    const has = picked.find((p) => p.id === u.id);
    setPicked(has ? picked.filter((p) => p.id !== u.id) : picked.concat([u]));
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
        <button onClick={onBack} style={{ padding: 4, background: 'transparent', border: 'none', color: t.textDim, cursor: 'pointer', display: 'inline-flex' }}><ChevronLeft size={12} /></button>
        <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pick specific users</div>
      </div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users by name…" autoFocus
        style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 12, marginBottom: 8 }} />
      <div style={{ maxHeight: 220, overflow: 'auto' }} className="mu-scroll">
        {filtered.length === 0 && <div style={{ fontSize: 11, color: t.textDim, padding: 8 }}>No matches.</div>}
        {filtered.map((u) => {
          const isPicked = !!picked.find((p) => p.id === u.id);
          return (
            <button key={u.id} onClick={() => togglePick(u)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
              background: isPicked ? t.accent + '22' : 'transparent', border: '1px solid ' + (isPicked ? t.accent + '55' : 'transparent'),
              borderRadius: 6, cursor: 'pointer', textAlign: 'left', marginBottom: 2,
            }}>
              <span style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid ' + (isPicked ? t.accent : t.borderSoft), background: isPicked ? t.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {isPicked && <Check size={9} color="#0a1f28" />}
              </span>
              <span style={{ flex: 1, fontSize: 12, color: t.text }}>{u.name}</span>
              <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>{u.kind} · {u.meta}</span>
            </button>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 8, borderTop: '1px solid ' + t.borderSoft }}>
        <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO }}>{picked.length} picked</span>
        <button onClick={() => picked.length > 0 && onConfirm(picked)} disabled={picked.length === 0} style={{ padding: '5px 12px', background: picked.length ? t.accent : t.borderSoft, color: picked.length ? '#0a1f28' : t.textDim, border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: picked.length ? 'pointer' : 'not-allowed' }}>Add as rule</button>
      </div>
    </>
  );
}

// 2. Inspect Organisation — read-only deep-dive
function FlowInspectOrg({ t, ctx, target, onAfter }) {
  const org = target || ctx.stores.orgs[0];
  return (
    <FlowShell t={t} title={'Inspecting · ' + (org.name || 'Organisation')} subtitle="Read-only deep-dive · audit-logged. No changes can be made from this view." icon={ICON_MAP.Eye} step={0} totalSteps={1} stepLabels={['Inspect']} onClose={() => ctx.setActiveAction(null)} width={820}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
        {[
          { k: 'Plan', v: org.plan || 'Growth' },
          { k: 'Status', v: org.status || 'Active' },
          { k: 'Credits left', v: (org.creditsLeft || 0).toLocaleString() },
          { k: 'MIS', v: org.mis || '—' },
        ].map((m) => (
          <div key={m.k} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10 }}>
            <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5 }}>{m.k}</div>
            <div style={{ fontSize: 16, color: t.text, fontFamily: FONT_MONO, fontWeight: 700, marginTop: 4 }}>{m.v}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, color: t.text, fontWeight: 700, marginBottom: 8 }}>Members</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{org.mentees || 0} mentees</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{org.mentors || 0} mentors mapped</div>
          <div style={{ fontSize: 11, color: t.textMuted }}>2 admins</div>
        </div>
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
          <div style={{ fontSize: 12, color: t.text, fontWeight: 700, marginBottom: 8 }}>Recent activity</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Last active: {org.lastActive || '—'}</div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>{org.ticketsOpen || 0} open tickets</div>
          <div style={{ fontSize: 11, color: t.textMuted }}>{org.slaBreach ? 'SLA breach this week' : 'SLA on-track'}</div>
        </div>
      </div>
      <div style={{ marginTop: 12, padding: 10, background: t.bgInput, border: '1px dashed ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted }}>
        Inspection logged · this view does not change any data. To take action, close and use the Organisations table or Action Log.
      </div>
    </FlowShell>
  );
}

// 3. Add Credits — two-mode flow
//    Mode A: Review pending credit requests from orgs (queue)
//    Mode B: Allocate credits to an org → drill into programme/users → single or bulk
function FlowAddCredits({ t, ctx, target, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    mode: null, // 'review' | 'allocate'
    // Allocate path
    selectedOrg: target ? target.name : null,
    scope: null, // 'org_wallet' | 'programme' | 'specific_users'
    programmeName: '',
    audienceRules: [],
    amount: 100,
    source: 'Top-up purchase',
    note: '',
    // Review path
    activeRequest: null,
    decisionReason: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'credits.add', label: 'Add credits', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };

  const pendingRequests = (ctx.stores.creditRequests || []).filter((r) => r.status === 'Pending');
  const orgsRanked = ctx.stores.orgs.slice().sort((a, b) => (a.creditsLeft || 0) - (b.creditsLeft || 0));
  const recipients = data.audienceRules.length > 0 ? resolveAudience(data.audienceRules, ctx.stores) : [];

  // Step labels depend on chosen mode
  const stepLabels = data.mode === 'review' ? ['Mode','Review queue']
    : data.mode === 'allocate' ? ['Mode','Pick org','Pick scope','Amount & source','Confirm']
    : ['Mode'];
  const totalSteps = stepLabels.length;

  const stepValid = () => {
    if (step === 0) return !!data.mode;
    if (data.mode === 'allocate') {
      if (step === 1) return !!data.selectedOrg;
      if (step === 2) {
        if (data.scope === 'org_wallet') return true;
        if (data.scope === 'programme') return !!data.programmeName;
        if (data.scope === 'specific_users') return recipients.length > 0;
        return false;
      }
      if (step === 3) return parseInt(data.amount, 10) > 0;
    }
    return true;
  };

  const next = () => {
    if (data.mode === 'allocate' && step === totalSteps - 1) {
      // Confirm allocation
      ctx.runAction('credits.add', null, {
        org: data.selectedOrg, scope: data.scope, programme: data.programmeName,
        audience: data.audienceRules.map((r) => describeAudienceRule(r)).join(' · '),
        recipientCount: recipients.length, amount: data.amount, source: data.source, note: data.note,
      });
      const amt = parseInt(data.amount, 10);
      // Side effects depend on scope
      if (data.scope === 'org_wallet') {
        ctx.moveCredits(amt, 'platform', 'org', data.selectedOrg, data.source + (data.note ? ' · ' + data.note : ''));
        ctx.stores.orgs.forEach((o) => { if (o.name === data.selectedOrg) o.creditsLeft = (o.creditsLeft || 0) + amt; });
      } else if (data.scope === 'programme') {
        ctx.moveCredits(amt, 'org', 'programme', data.selectedOrg + ' · ' + data.programmeName, data.source);
      } else if (data.scope === 'specific_users') {
        const perUser = recipients.length === 1 ? amt : Math.floor(amt / recipients.length);
        recipients.forEach((u) => {
          ctx.appendLog({ actionId: 'credits.add', label: 'Credits granted', target: u.name, payload: { amount: perUser, org: data.selectedOrg, scope: 'user' }, result: 'Completed', destructive: false });
        });
        ctx.moveCredits(amt, 'org', 'users', data.selectedOrg + ' · ' + recipients.length + ' users', data.source);
      }
      if (onAfter) onAfter(data);
      ctx.setActiveAction(null);
      return;
    }
    if (data.mode === 'review' && step === totalSteps - 1) {
      // No final confirm — review actions happen inline. Just close.
      ctx.setActiveAction(null);
      return;
    }
    setStep(step + 1);
  };

  const handleApproveRequest = (req) => {
    ctx.approveRequest(req.id, '');
    ctx.runAction('credits.approve_request', req, { amount: req.amount, org: req.orgName });
    ctx.moveCredits(req.amount, 'platform', 'org', req.orgName, 'Approved request from ' + req.requester);
    ctx.stores.orgs.forEach((o) => { if (o.name === req.orgName) o.creditsLeft = (o.creditsLeft || 0) + req.amount; });
    ctx.showToast('Approved · ' + req.amount + ' credits → ' + req.orgName);
  };
  const handleDenyRequest = (req) => {
    const reason = data.decisionReason || 'Denied without reason';
    ctx.denyRequest(req.id, reason);
    ctx.runAction('credits.deny_request', req, { amount: req.amount, org: req.orgName, reason });
    ctx.showToast('Denied · ' + req.orgName, 'warn');
    update({ activeRequest: null, decisionReason: '' });
  };

  return (
    <FlowShell t={t}
      title={data.mode === 'review' ? 'Review credit requests' : data.mode === 'allocate' ? 'Allocate credits' : 'Add credits'}
      subtitle={data.mode === 'review' ? 'Pending requests from org admins · approve to release credits.'
        : data.mode === 'allocate' ? 'Push credits to an org, programme, or specific users.'
        : 'How do you want to add credits today?'}
      icon={ICON_MAP.Wallet}
      step={step}
      totalSteps={totalSteps}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => { if (step === 0) close(true); else setStep(step - 1); }}
      onNext={next}
      nextLabel={data.mode === 'allocate' && step === totalSteps - 1 ? 'Allocate credits' : data.mode === 'review' ? 'Done' : 'Continue'}
      nextDisabled={!stepValid()}
      width={820}
    >
      {/* STEP 0 — Mode pick */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>You can review pending requests from org admins, or proactively allocate credits to an org or its users.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <button onClick={() => update({ mode: 'review' })} style={{
              padding: 18, background: data.mode === 'review' ? t.accent + '22' : t.bgCardElev,
              border: '1px solid ' + (data.mode === 'review' ? t.accent : t.borderSoft),
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><Bell size={16} /></div>
                <div>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>Review credit requests</div>
                  <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>Pull-based</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5, marginBottom: 8 }}>See orgs that have asked for credits, approve or deny each one.</div>
              {pendingRequests.length > 0 && (
                <div style={{ padding: '4px 8px', background: t.yellow + '22', color: t.yellow, fontSize: 10, fontWeight: 700, borderRadius: 4, display: 'inline-block', fontFamily: FONT_MONO }}>{pendingRequests.length} pending</div>
              )}
            </button>
            <button onClick={() => update({ mode: 'allocate' })} style={{
              padding: 18, background: data.mode === 'allocate' ? t.accent + '22' : t.bgCardElev,
              border: '1px solid ' + (data.mode === 'allocate' ? t.accent : t.borderSoft),
              borderRadius: 12, cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: t.purple + '22', color: t.purple, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><GitBranch size={16} /></div>
                <div>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700 }}>Allocate to an org</div>
                  <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>Push-based</div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>Browse orgs by balance, pick one, drill into programme or users, single or bulk allocation.</div>
            </button>
          </div>
        </div>
      )}

      {/* === REVIEW PATH === */}
      {data.mode === 'review' && step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>{pendingRequests.length} pending request{pendingRequests.length === 1 ? '' : 's'}. Approve to move credits from platform → org wallet.</div>
          {pendingRequests.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 10, color: t.textDim }}>
              <Check size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
              <div style={{ fontSize: 12 }}>No pending credit requests right now.</div>
              <button onClick={() => update({ mode: 'allocate' })} style={{ marginTop: 10, padding: '6px 12px', background: t.purple, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}>Allocate proactively instead</button>
            </div>
          )}
          {pendingRequests.map((req) => {
            const isActive = data.activeRequest === req.id;
            return (
              <div key={req.id} style={{ background: t.bgCardElev, border: '1px solid ' + (isActive ? t.red : t.borderSoft), borderRadius: 10, padding: 12 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, color: t.text, fontWeight: 700 }}>{req.orgName}</span>
                      <StatusPill t={t} tone={req.priority === 'High' ? 'bad' : req.priority === 'Medium' ? 'warn' : 'neutral'}>{req.priority}</StatusPill>
                      <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{req.submittedDays === 0 ? 'today' : req.submittedDays + 'd ago'}</span>
                    </div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 4 }}>by {req.requester} · {req.requesterRole}</div>
                    <div style={{ fontSize: 12, color: t.text, lineHeight: 1.5 }}>"{req.reason}"</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 22, color: t.accent, fontFamily: FONT_MONO, fontWeight: 700 }}>{req.amount.toLocaleString()}</div>
                    <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>credits</div>
                  </div>
                </div>
                {!isActive ? (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, justifyContent: 'flex-end' }}>
                    <button onClick={() => update({ activeRequest: req.id, decisionReason: '' })} style={{ padding: '5px 12px', background: 'transparent', color: t.red, border: '1px solid ' + t.red + '55', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Deny</button>
                    <button onClick={() => handleApproveRequest(req)} style={{ padding: '5px 14px', background: t.green, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Approve · {req.amount}</button>
                  </div>
                ) : (
                  <div style={{ marginTop: 10, padding: 10, background: t.red + '11', border: '1px solid ' + t.red + '55', borderRadius: 8 }}>
                    <div style={{ fontSize: 11, color: t.red, fontWeight: 600, marginBottom: 6 }}>Reason for denial (will be sent to {req.requester})</div>
                    <textarea rows={2} value={data.decisionReason} onChange={(e) => update({ decisionReason: e.target.value })} placeholder="e.g. Q2 budget allocated · please re-request next quarter"
                      style={{ width: '100%', padding: 8, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 6, color: t.text, fontSize: 12, fontFamily: FONT_BODY, resize: 'vertical' }} />
                    <div style={{ display: 'flex', gap: 6, marginTop: 8, justifyContent: 'flex-end' }}>
                      <button onClick={() => update({ activeRequest: null, decisionReason: '' })} style={{ padding: '5px 12px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Cancel</button>
                      <button onClick={() => handleDenyRequest(req)} style={{ padding: '5px 14px', background: t.red, color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Confirm denial</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* === ALLOCATE PATH — Step 1: pick org === */}
      {data.mode === 'allocate' && step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Pick an organisation. Sorted by current balance — orgs with lowest credits first.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '180px 1fr 90px 90px 90px', gap: 8, padding: '6px 10px', fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, borderBottom: '1px solid ' + t.borderSoft }}>
            <span>Organisation</span><span>Plan · last topup</span><span style={{ textAlign: 'right' }}>Balance</span><span style={{ textAlign: 'right' }}>Burn /wk</span><span style={{ textAlign: 'right' }}>Days left</span>
          </div>
          <div style={{ maxHeight: 360, overflowY: 'auto' }} className="mu-scroll">
            {orgsRanked.slice(0, 14).map((o) => {
              const burnPerWeek = Math.max(20, Math.floor(((o.mentees || 0) * 0.6 + (o.mentors || 0) * 1.2)));
              const daysLeft = Math.floor((o.creditsLeft || 0) / (burnPerWeek / 7));
              const isLow = (o.creditsLeft || 0) < 200;
              const isSelected = data.selectedOrg === o.name;
              return (
                <button key={o.id} onClick={() => update({ selectedOrg: o.name })} style={{
                  width: '100%', display: 'grid', gridTemplateColumns: '180px 1fr 90px 90px 90px', gap: 8, alignItems: 'center',
                  padding: 10, marginBottom: 4,
                  background: isSelected ? t.accent + '22' : 'transparent',
                  border: '1px solid ' + (isSelected ? t.accent : 'transparent'),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <span style={{ fontSize: 12, color: t.text, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{o.name}</span>
                  <span style={{ fontSize: 10, color: t.textMuted }}>{o.plan || 'Growth'} · {o.lastActive || '—'}</span>
                  <span style={{ fontSize: 12, color: isLow ? t.red : t.text, fontFamily: FONT_MONO, textAlign: 'right', fontWeight: 700 }}>{(o.creditsLeft || 0).toLocaleString()}</span>
                  <span style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, textAlign: 'right' }}>{burnPerWeek}</span>
                  <span style={{ fontSize: 11, color: daysLeft < 7 ? t.red : daysLeft < 30 ? t.yellow : t.green, fontFamily: FONT_MONO, textAlign: 'right' }}>{daysLeft}d</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* === ALLOCATE PATH — Step 2: pick scope === */}
      {data.mode === 'allocate' && step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Where in <strong style={{ color: t.text }}>{data.selectedOrg}</strong> do these credits go?</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { v: 'org_wallet',     l: 'Org wallet',         d: 'Adds to the org\u2019s general balance. Org Admin distributes from there.', icon: Building2 },
              { v: 'programme',      l: 'Specific programme', d: 'Ring-fenced budget for one programme / cohort.', icon: GitBranch },
              { v: 'specific_users', l: 'Specific users',     d: 'Direct grant to picked users (single or bulk).', icon: Users },
            ].map((opt) => {
              const Ic = opt.icon;
              return (
                <button key={opt.v} onClick={() => update({ scope: opt.v })} style={{
                  padding: 14, background: data.scope === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.scope === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                }}>
                  <Ic size={16} color={data.scope === opt.v ? t.accent : t.textMuted} style={{ marginBottom: 8 }} />
                  <div style={{ fontSize: 13, color: t.text, fontWeight: 700, marginBottom: 4 }}>{opt.l}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>{opt.d}</div>
                </button>
              );
            })}
          </div>
          {data.scope === 'programme' && (
            <FlowField t={t} label="Programme name" required value={data.programmeName} onChange={(v) => update({ programmeName: v })} placeholder="e.g. Cohort Alpha · Leadership Sprint" />
          )}
          {data.scope === 'specific_users' && (
            <div>
              <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Pick users — within {data.selectedOrg} only.</div>
              <AudienceBuilder t={t} ctx={ctx} value={data.audienceRules} onChange={(v) => update({ audienceRules: v })} scopeOrgName={data.selectedOrg} />
            </div>
          )}
        </div>
      )}

      {/* === ALLOCATE PATH — Step 3: amount + source === */}
      {data.mode === 'allocate' && step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>How many credits, and from where.</div>
          <FlowField t={t} label={data.scope === 'specific_users' && recipients.length > 1 ? 'Total credits (will be split equally across ' + recipients.length + ' users)' : 'Credits to add'} type="number" required value={data.amount} onChange={(v) => update({ amount: v })} />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Source</label>
            <select value={data.source} onChange={(e) => update({ source: e.target.value })}
              style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }}>
              {['Top-up purchase','Goodwill grant','Promotional','Renewal','Refund reversal','Compensation for SLA breach'].map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <FlowField t={t} label="Internal note" value={data.note} onChange={(v) => update({ note: v })} placeholder="e.g. Q2 top-up per renewal contract" />
          {data.scope === 'specific_users' && recipients.length > 1 && (
            <div style={{ padding: 10, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.accent, lineHeight: 1.5 }}>
              <strong>Per-user split:</strong> {Math.floor(parseInt(data.amount, 10) / recipients.length)} credits each · {parseInt(data.amount, 10)} total.
            </div>
          )}
        </div>
      )}

      {/* === ALLOCATE PATH — Step 4: confirm === */}
      {data.mode === 'allocate' && step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Review and confirm.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            {[
              ['Organisation', data.selectedOrg],
              ['Scope', data.scope === 'org_wallet' ? 'Org wallet (general balance)'
                       : data.scope === 'programme' ? 'Programme · ' + data.programmeName
                       : 'Specific users · ' + recipients.length + ' recipient' + (recipients.length === 1 ? '' : 's')],
              ...(data.scope === 'specific_users' ? [['Audience rules', data.audienceRules.map((r) => describeAudienceRule(r)).join(' · ') || '—']] : []),
              ['Amount', parseInt(data.amount, 10).toLocaleString() + ' credits' + (data.scope === 'specific_users' && recipients.length > 1 ? ' (' + Math.floor(parseInt(data.amount, 10) / recipients.length) + ' per user)' : '')],
              ['Source', data.source],
              ['Note', data.note || '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, padding: '6px 0', borderBottom: '1px solid ' + t.borderSoft + '55', fontSize: 12 }}>
                <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{k}</span>
                <span style={{ color: t.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Credit Engine logs transfer · platform → {data.scope === 'org_wallet' ? 'org wallet' : data.scope === 'programme' ? 'programme ledger' : 'user wallets'}</li>
              {data.scope === 'org_wallet' && <li><strong>{data.selectedOrg}</strong> wallet balance updates immediately</li>}
              {data.scope === 'programme' && <li>Ring-fenced budget created for <strong>{data.programmeName}</strong>. Org Admin sees it in their wallet view.</li>}
              {data.scope === 'specific_users' && <li>{recipients.length <= 8 ? 'Per-user log entry created' : 'Bulk log summary created · individual entries suppressed'}</li>}
              <li>Communication Engine notifies {data.scope === 'specific_users' ? 'each user' : data.selectedOrg + ' Org Admin'}</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the actor</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// FlowAssignAdmin — assign Org Admin or Sub-Admin to a specific org
function FlowAssignAdmin({ t, ctx, target, onAfter }) {
  const [step, setStep] = useState(target ? 1 : 0);
  const [data, setData] = useState({
    selectedOrg: target ? target.name : null,
    mode: 'invite_new', // 'invite_new' | 'promote_existing'
    role: 'Org Admin',  // 'Org Admin' | 'Org Sub-Admin'
    email: '',
    name: '',
    promoteUserId: null,
    scope: 'all',       // 'all' | 'specific_programmes' (only for Sub-Admin)
    programmes: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'org.assign_admin', label: 'Assign admin', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };

  // For "promote existing": list mentees + mentors of the chosen org as candidates
  const promoteCandidates = data.selectedOrg
    ? ctx.stores.mentees.filter((m) => m.org === data.selectedOrg).slice(0, 8).map((m) => ({ id: m.id, name: m.name, kind: 'mentee', meta: m.cohort }))
    : [];

  const stepLabels = ['Pick org','Mode & details','Confirm'];

  const stepValid = () => {
    if (step === 0) return !!data.selectedOrg;
    if (step === 1) {
      if (data.mode === 'invite_new') return data.email && data.name;
      if (data.mode === 'promote_existing') return !!data.promoteUserId;
    }
    return true;
  };

  const next = () => {
    if (step < 2) { setStep(step + 1); return; }
    // Confirm
    ctx.runAction('org.assign_admin', { name: data.selectedOrg }, {
      org: data.selectedOrg, role: data.role, mode: data.mode,
      email: data.email, name: data.name, promotedUserId: data.promoteUserId,
      scope: data.scope, programmes: data.programmes,
    });
    if (data.mode === 'invite_new') {
      ctx.appendLog({ actionId: 'user.invite', label: 'Invite ' + data.role, target: data.name, payload: { email: data.email, org: data.selectedOrg, role: data.role }, result: 'Completed', destructive: false });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };

  return (
    <FlowShell t={t}
      title="Assign admin"
      subtitle={data.selectedOrg ? 'Assign an admin to ' + data.selectedOrg : 'Pick an organisation, then assign an admin to it.'}
      icon={ICON_MAP.UserPlus}
      step={step}
      totalSteps={3}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => { if (step === 0) close(true); else setStep(step - 1); }}
      onNext={next}
      nextLabel={step === 2 ? (data.mode === 'invite_new' ? 'Send invite' : 'Promote user') : 'Continue'}
      nextDisabled={!stepValid()}
      width={680}
    >
      {/* STEP 0 — Pick org */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Which organisation gets a new admin?</div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }} className="mu-scroll">
            {ctx.stores.orgs.slice(0, 14).map((o) => {
              const isSelected = data.selectedOrg === o.name;
              return (
                <button key={o.id} onClick={() => update({ selectedOrg: o.name })} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 10, marginBottom: 4,
                  background: isSelected ? t.accent + '22' : 'transparent',
                  border: '1px solid ' + (isSelected ? t.accent : 'transparent'),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }} onMouseEnter={(e) => { if (!isSelected) e.currentTarget.style.background = t.bgCardElev; }} onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <Building2 size={14} color={isSelected ? t.accent : t.textMuted} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{o.name}</div>
                    <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, marginTop: 2 }}>{o.plan || 'Growth'} · {(o.mentees || 0)} mentees · {(o.mentors || 0)} mentors</div>
                  </div>
                  {isSelected && <Check size={14} color={t.accent} />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 1 — Mode & details */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Promoting an existing user keeps their data and history. Inviting fresh creates a new account.</div>
          {/* Mode pick */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { v: 'invite_new', l: 'Invite new admin', d: 'Send sign-up email' },
              { v: 'promote_existing', l: 'Promote existing user', d: 'Pick from current org users' },
            ].map((opt) => (
              <button key={opt.v} onClick={() => update({ mode: opt.v })} style={{
                padding: 12, background: data.mode === opt.v ? t.accent + '22' : t.bgCardElev,
                border: '1px solid ' + (data.mode === opt.v ? t.accent : t.borderSoft),
                borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                <div style={{ fontSize: 10, color: t.textMuted }}>{opt.d}</div>
              </button>
            ))}
          </div>
          {/* Role pick */}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Role</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {[
                { v: 'Org Admin',     d: 'Full access to org · can manage everything' },
                { v: 'Org Sub-Admin', d: 'Scoped access · can be limited to specific programmes' },
              ].map((opt) => (
                <button key={opt.v} onClick={() => update({ role: opt.v })} style={{
                  flex: 1, padding: 10, background: data.role === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.role === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.v}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Mode-specific fields */}
          {data.mode === 'invite_new' ? (
            <>
              <FlowField t={t} label="Display name" required value={data.name} onChange={(v) => update({ name: v })} placeholder="Priya Mehta" />
              <FlowField t={t} label="Email" type="email" required value={data.email} onChange={(v) => update({ email: v })} placeholder="priya@" />
            </>
          ) : (
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Pick user to promote</label>
              {promoteCandidates.length === 0 ? (
                <div style={{ padding: 16, textAlign: 'center', background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textDim }}>
                  No existing users in {data.selectedOrg} to promote. Switch to "Invite new admin" instead.
                </div>
              ) : (
                <div style={{ maxHeight: 180, overflowY: 'auto' }} className="mu-scroll">
                  {promoteCandidates.map((u) => {
                    const isPicked = data.promoteUserId === u.id;
                    return (
                      <button key={u.id} onClick={() => update({ promoteUserId: u.id, name: u.name })} style={{
                        width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', marginBottom: 3,
                        background: isPicked ? t.accent + '22' : 'transparent',
                        border: '1px solid ' + (isPicked ? t.accent : 'transparent'),
                        borderRadius: 6, cursor: 'pointer', textAlign: 'left',
                      }}>
                        <span style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid ' + (isPicked ? t.accent : t.borderSoft), background: isPicked ? t.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                          {isPicked && <Check size={9} color="#0a1f28" />}
                        </span>
                        <span style={{ flex: 1, fontSize: 12, color: t.text }}>{u.name}</span>
                        <span style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>{u.kind} · {u.meta}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {/* Sub-admin scope (conditional) */}
          {data.role === 'Org Sub-Admin' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Scope</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                {[
                  { v: 'all', l: 'All programmes' },
                  { v: 'specific_programmes', l: 'Specific programmes only' },
                ].map((opt) => (
                  <button key={opt.v} onClick={() => update({ scope: opt.v })} style={{
                    padding: '6px 12px', background: data.scope === opt.v ? t.accent + '22' : 'transparent',
                    color: data.scope === opt.v ? t.accent : t.textMuted,
                    border: '1px solid ' + (data.scope === opt.v ? t.accent : t.border),
                    borderRadius: 999, fontSize: 11, cursor: 'pointer', fontFamily: FONT_BODY,
                  }}>{opt.l}</button>
                ))}
              </div>
              {data.scope === 'specific_programmes' && (
                <FlowField t={t} label="Programmes (comma-separated)" value={data.programmes} onChange={(v) => update({ programmes: v })} placeholder="Cohort Alpha, Leadership Sprint" />
              )}
            </div>
          )}
        </div>
      )}

      {/* STEP 2 — Confirm */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Review and confirm.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            {[
              ['Organisation', data.selectedOrg],
              ['Mode', data.mode === 'invite_new' ? 'Invite new admin' : 'Promote existing user'],
              ['Role', data.role],
              ['Person', data.mode === 'invite_new' ? data.name + ' · ' + data.email : (promoteCandidates.find((u) => u.id === data.promoteUserId) || {}).name],
              ...(data.role === 'Org Sub-Admin' ? [['Scope', data.scope === 'all' ? 'All programmes in org' : 'Specific: ' + (data.programmes || '—')]] : []),
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 10, padding: '6px 0', borderBottom: '1px solid ' + t.borderSoft + '55', fontSize: 12 }}>
                <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{k}</span>
                <span style={{ color: t.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              {data.mode === 'invite_new' && <li>Email invite sent to <strong>{data.email}</strong> with sign-up link for <strong>{data.selectedOrg}</strong></li>}
              {data.mode === 'promote_existing' && <li>Existing user promoted · all session history and data preserved</li>}
              <li>Role set to <strong>{data.role}</strong>{data.role === 'Org Sub-Admin' && data.scope === 'specific_programmes' ? ' · scoped to: ' + (data.programmes || '—') : ''}</li>
              <li>Permission Engine grants access immediately on accept</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the assigner</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// 4. Allocate Credits — org → programme → mentee
function FlowAllocateCredits({ t, ctx, target, onAfter }) {
  const [data, setData] = useState({ from: 'Org wallet', to: 'Cohort Alpha', amount: 50, reason: '' });
  const submit = () => {
    ctx.runAction('credits.allocate', null, data);
    ctx.moveCredits(parseInt(data.amount, 10), 'org wallet', 'programme ledger', data.to, data.reason || 'Allocation');
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };
  return (
    <FlowShell t={t} title="Allocate credits" subtitle="Move credits from org wallet → programme ledger → mentee wallet." icon={ICON_MAP.GitBranch} step={0} totalSteps={1} stepLabels={['Allocate']} onClose={() => ctx.setActiveAction(null)} onNext={submit} nextLabel="Allocate" nextDisabled={!data.to || !data.amount}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: 10, alignItems: 'flex-end', marginBottom: 14 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>From</label>
          <select value={data.from} onChange={(e) => setData(Object.assign({}, data, { from: e.target.value }))} style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13 }}>
            {['Org wallet','Programme ledger','Mentee wallet'].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <ArrowRight size={20} color={t.accent} style={{ marginBottom: 10 }} />
        <div>
          <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>To</label>
          <input value={data.to} onChange={(e) => setData(Object.assign({}, data, { to: e.target.value }))} placeholder="Cohort name or mentee name" style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13 }} />
        </div>
      </div>
      <FlowField t={t} label="Credits" type="number" required value={data.amount} onChange={(v) => setData(Object.assign({}, data, { amount: v }))} />
      <div style={{ marginTop: 10 }}>
        <FlowField t={t} label="Reason" value={data.reason} onChange={(v) => setData(Object.assign({}, data, { reason: v }))} placeholder="e.g. Cohort start" />
      </div>
    </FlowShell>
  );
}

// 5. Invite User
function FlowInviteUser({ t, ctx, onAfter }) {
  const [data, setData] = useState({ email: '', name: '', role: 'mentee', org: '' });
  const submit = () => {
    ctx.runAction('user.invite', null, data);
    if (data.role === 'mentee') {
      ctx.stores.mentees.unshift({ id: 'me_' + Date.now(), name: data.name, email: data.email, status: 'Invited', credits: 10 });
    } else if (data.role === 'mentor') {
      ctx.stores.mentors.unshift({ id: 'm_' + Date.now(), name: data.name, email: data.email, tier: 'Basic', mis: 0, sessions: 0, country: 'India', domains: [], rating: 0, responseHrs: 24, responsiveness: 'Steady', pricePerSession: 1500, lastSession: 'never' });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };
  const allowedRoles = ctx.persona === 'super_admin' ? ['mentee','mentor','org_admin','sub_admin'] : ctx.persona === 'org_admin' ? ['mentee','mentor','sub_admin'] : ['mentee'];
  return (
    <FlowShell t={t} title="Invite user" subtitle="Send a sign-up invite. Role and scope are honored automatically." icon={ICON_MAP.UserPlus} step={0} totalSteps={1} stepLabels={['Invite']} onClose={() => ctx.setActiveAction(null)} onNext={submit} nextLabel="Send invite" nextDisabled={!data.email || !data.name}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Role</label>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {allowedRoles.map((r) => (
              <button key={r} onClick={() => setData(Object.assign({}, data, { role: r }))} style={{
                padding: '6px 12px', background: data.role === r ? t.accent : 'transparent',
                color: data.role === r ? '#0a1f28' : t.textMuted,
                border: '1px solid ' + (data.role === r ? t.accent : t.border),
                borderRadius: 999, fontSize: 11, cursor: 'pointer', textTransform: 'capitalize', fontWeight: data.role === r ? 700 : 500,
              }}>{r.replace('_',' ')}</button>
            ))}
          </div>
        </div>
        <FlowField t={t} label="Full name" required value={data.name} onChange={(v) => setData(Object.assign({}, data, { name: v }))} />
        <FlowField t={t} label="Email" type="email" required value={data.email} onChange={(v) => setData(Object.assign({}, data, { email: v }))} />
        {(data.role === 'mentor' || data.role === 'mentee') && (
          <FlowField t={t} label="Organisation (optional)" value={data.org} onChange={(v) => setData(Object.assign({}, data, { org: v }))} placeholder="Leave blank for external" />
        )}
      </div>
    </FlowShell>
  );
}

// 6. Add Mentor — full 8-step onboarding flow capturing every field needed
//    to bring a new mentor onto the platform AND map them to an org.
//    Steps: Identity → Credibility → Expertise → Pricing & tier →
//           Availability → Org mapping → Compliance & payout → Confirm.
function FlowAddMentor({ t, ctx, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    // Step 0 — Identity
    name: '', displayName: '', email: '', phone: '', country: 'India', city: '',
    timezone: 'Asia / Kolkata (IST)', languages: ['English'], photoUploaded: false,
    // Step 1 — Credibility
    currentRole: '', currentCompany: '', yearsExperience: 5,
    linkedin: '', website: '', pastEmployers: '',
    resumeUploaded: false, certificationsUploaded: false,
    // Step 2 — Expertise & coverage
    primaryDomain: 'Product', subSkills: [], careerStages: ['Mid-career'],
    industries: ['Technology'],
    // Step 3 — Pricing & tier
    tier: 'Good', pricePerSession: 2000, currency: 'INR',
    freeIntro: true, sessionLengthMin: 45,
    // Step 4 — Availability
    weeklyHours: 6, leadTimeHrs: 24, bufferMin: 15,
    workingDays: ['Mon','Tue','Wed','Thu','Fri'], workingHoursStart: '18:00', workingHoursEnd: '21:00',
    // Step 5 — Org mapping
    poolType: 'platform_only', mappedOrgs: [], mappedProgrammes: [],
    visibility: 'visible',
    // Step 6 — Compliance & payout
    payoutMethod: 'upi', payoutHandle: '', taxId: '',
    acceptedLOE: false, acceptedCoC: false, dataConsent: false, sendLOE: true,
    // Step 7 — Bio (also captured for marketplace)
    headline: '', bio: '',
    // Step 8 — Activation
    goLive: 'after_verification',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'mentor.add', label: 'Add mentor', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };

  // Live org list pulled from store, so newly-created orgs from earlier session show up here too
  const availableOrgs = ctx.stores.orgs.map((o) => o.name).slice(0, 12);

  const stepValid = () => {
    if (step === 0) return data.name && data.email && data.country && data.timezone;
    if (step === 1) return data.currentRole && data.currentCompany && data.linkedin;
    if (step === 2) return data.primaryDomain && data.subSkills.length > 0 && data.careerStages.length > 0;
    if (step === 3) return data.tier && parseInt(data.pricePerSession, 10) > 0;
    if (step === 4) return parseInt(data.weeklyHours, 10) > 0 && data.workingDays.length > 0;
    if (step === 5) return data.poolType === 'platform_only' || data.mappedOrgs.length > 0;
    if (step === 6) return data.acceptedLOE && data.acceptedCoC && data.dataConsent && data.payoutHandle;
    if (step === 7) return data.headline && data.bio;
    return true;
  };

  const next = () => {
    if (step < 8) { setStep(step + 1); return; }
    // Final confirm — mutate mentorsStore + log everything
    const newMentor = {
      id: 'm_' + Date.now(),
      name: data.displayName || data.name,
      email: data.email,
      tier: data.tier, mis: 0, sessions: 0,
      country: data.country,
      domains: [data.primaryDomain].concat(data.subSkills.slice(0, 3)),
      rating: 0, responseHrs: data.leadTimeHrs, responsiveness: 'Steady',
      pricePerSession: parseInt(data.pricePerSession, 10),
      lastSession: 'pending verification',
      // Extended fields preserved on the mentor record
      displayName: data.displayName,
      phone: data.phone, city: data.city, timezone: data.timezone,
      languages: data.languages,
      currentRole: data.currentRole, currentCompany: data.currentCompany,
      yearsExperience: parseInt(data.yearsExperience, 10),
      linkedin: data.linkedin, website: data.website,
      careerStages: data.careerStages, industries: data.industries,
      freeIntro: data.freeIntro, sessionLengthMin: data.sessionLengthMin,
      weeklyHours: parseInt(data.weeklyHours, 10), leadTimeHrs: parseInt(data.leadTimeHrs, 10),
      workingDays: data.workingDays,
      poolType: data.poolType, mappedOrgs: data.mappedOrgs, mappedProgrammes: data.mappedProgrammes,
      visibility: data.visibility, payoutMethod: data.payoutMethod,
      headline: data.headline, bio: data.bio,
      status: data.goLive === 'immediately' ? 'Live' : 'Pending verification',
    };
    ctx.stores.mentors.unshift(newMentor);
    ctx.runAction('mentor.add', null, data);
    // Side-effect logs — LOE + org mapping count as separate audit events
    if (data.sendLOE) {
      ctx.appendLog({ actionId: 'mentor.add', label: 'LOE sent for digital signature', target: data.name, payload: { email: data.email }, result: 'Completed', destructive: false });
    }
    if (data.poolType !== 'platform_only' && data.mappedOrgs.length > 0) {
      data.mappedOrgs.forEach((org) => {
        ctx.appendLog({ actionId: 'mentor.map_to_org', label: 'Map mentor to org', target: data.name, payload: { org: org }, result: 'Completed', destructive: false });
      });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };

  const stepLabels = ['Identity','Credibility','Expertise','Pricing','Availability','Org mapping','Compliance','Bio','Confirm'];
  const Icon = ICON_MAP.UserPlus;

  return (
    <FlowShell t={t}
      title="Add mentor"
      subtitle="Onboard a new mentor and (optionally) map them to one or more orgs. 8 steps — about 5 minutes."
      icon={Icon}
      step={step}
      totalSteps={9}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => setStep(step - 1)}
      onNext={next}
      nextLabel={step === 8 ? 'Create mentor & send LOE' : 'Continue'}
      nextDisabled={!stepValid()}
      width={780}
    >
      {/* STEP 0 — Identity */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Who they are. Display name is what mentees see — leave blank to use full name.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Full legal name" required value={data.name} onChange={(v) => update({ name: v })} placeholder="Naveen Kumar Sharma" />
            <FlowField t={t} label="Display name (optional)" value={data.displayName} onChange={(v) => update({ displayName: v })} placeholder="Naveen Sharma" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Work email" type="email" required value={data.email} onChange={(v) => update({ email: v })} placeholder="naveen@example.com" />
            <FlowField t={t} label="Phone" value={data.phone} onChange={(v) => update({ phone: v })} placeholder="+91 98765 43210" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Country" required value={data.country} onChange={(v) => update({ country: v })} />
            <FlowField t={t} label="City" value={data.city} onChange={(v) => update({ city: v })} placeholder="Bengaluru" />
            <FlowSelectField t={t} label="Timezone" required value={data.timezone} onChange={(v) => update({ timezone: v })}
              options={['Asia / Kolkata (IST)','Asia / Singapore','Asia / Dubai','Europe / London (GMT)','Europe / Berlin (CET)','America / New York (EST)','America / San Francisco (PST)'].map((x) => ({ v: x, l: x }))} />
          </div>
          <FlowChips t={t} label="Languages spoken" value={data.languages} onChange={(v) => update({ languages: v })}
            options={['English','Hindi','Marathi','Tamil','Telugu','Bengali','Gujarati','Punjabi','Kannada','Malayalam','Mandarin','Spanish','Arabic','French']} />
          <div style={{ padding: 12, background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Profile photo</div>
              <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Square JPG / PNG, min 400×400. Used everywhere mentees see them.</div>
            </div>
            <button onClick={() => update({ photoUploaded: !data.photoUploaded })} style={{
              padding: '5px 12px', background: data.photoUploaded ? t.green + '22' : t.bgInput,
              color: data.photoUploaded ? t.green : t.text, border: '1px solid ' + (data.photoUploaded ? t.green : t.border),
              borderRadius: 6, fontSize: 11, cursor: 'pointer', fontFamily: FONT_BODY,
            }}>{data.photoUploaded ? '✓ Uploaded' : 'Upload photo'}</button>
          </div>
        </div>
      )}

      {/* STEP 1 — Credibility */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Why mentees should trust them. LinkedIn is required because the trust badge ("Verified profile") is auto-derived from LinkedIn + employer match.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 2fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Current role" required value={data.currentRole} onChange={(v) => update({ currentRole: v })} placeholder="Senior Product Manager" />
            <FlowField t={t} label="Current company" required value={data.currentCompany} onChange={(v) => update({ currentCompany: v })} placeholder="Razorpay" />
            <FlowField t={t} label="Years of XP" type="number" value={data.yearsExperience} onChange={(v) => update({ yearsExperience: v })} />
          </div>
          <FlowField t={t} label="LinkedIn URL" type="url" required value={data.linkedin} onChange={(v) => update({ linkedin: v })} placeholder="https://linkedin.com/in/naveen-sharma" />
          <FlowField t={t} label="Personal website / portfolio" type="url" value={data.website} onChange={(v) => update({ website: v })} placeholder="https://naveen.work (optional)" />
          <FlowField t={t} label="Notable past employers (comma-separated, max 5)" value={data.pastEmployers} onChange={(v) => update({ pastEmployers: v })} placeholder="Flipkart, Swiggy, Microsoft" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div style={{ padding: 12, background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Resume / CV</div>
                <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>PDF, max 5MB. Visible only to compliance.</div>
              </div>
              <button onClick={() => update({ resumeUploaded: !data.resumeUploaded })} style={{
                padding: '5px 10px', background: data.resumeUploaded ? t.green + '22' : t.bgInput,
                color: data.resumeUploaded ? t.green : t.text, border: '1px solid ' + (data.resumeUploaded ? t.green : t.border),
                borderRadius: 6, fontSize: 10, cursor: 'pointer',
              }}>{data.resumeUploaded ? '✓ Uploaded' : 'Upload PDF'}</button>
            </div>
            <div style={{ padding: 12, background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Certifications (optional)</div>
                <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Multiple PDFs allowed.</div>
              </div>
              <button onClick={() => update({ certificationsUploaded: !data.certificationsUploaded })} style={{
                padding: '5px 10px', background: data.certificationsUploaded ? t.green + '22' : t.bgInput,
                color: data.certificationsUploaded ? t.green : t.text, border: '1px solid ' + (data.certificationsUploaded ? t.green : t.border),
                borderRadius: 6, fontSize: 10, cursor: 'pointer',
              }}>{data.certificationsUploaded ? '✓ Uploaded' : 'Upload PDFs'}</button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Expertise & coverage */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>What they coach. This drives marketplace search and matching.</div>
          <FlowSelectField t={t} label="Primary domain" required value={data.primaryDomain} onChange={(v) => update({ primaryDomain: v })}
            options={['Product','Engineering','Design','Data Science','Strategy','Marketing','Sales','Finance','Operations','Career','Founder / Startup','Leadership'].map((x) => ({ v: x, l: x }))} />
          <FlowChips t={t} label="Sub-skills (pick at least one)" required value={data.subSkills} onChange={(v) => update({ subSkills: v })}
            options={['Career switch','Mock interview','Roadmapping','User research','SQL','System design','Frontend','Pricing strategy','Fundraising','GTM','Performance review','Promotion prep','Founder coaching','Negotiation','Leadership 1:1s','OKRs','Product analytics']} />
          <FlowChips t={t} label="Career stages they coach" required value={data.careerStages} onChange={(v) => update({ careerStages: v })}
            options={['Student','Early-career (0-3 yr)','Mid-career (3-7 yr)','Senior (7-15 yr)','Executive (15+ yr)','Founder']} />
          <FlowChips t={t} label="Industries served" value={data.industries} onChange={(v) => update({ industries: v })}
            options={['Technology','Financial Services','Consulting','Healthcare','E-commerce','EdTech','Manufacturing','Retail','Government','Non-profit','Media','Creator economy']} />
        </div>
      )}

      {/* STEP 3 — Pricing & tier */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>What it costs. Tier determines credit burn rate per session via the Credit Engine.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Tier</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {[
                { k: 'Basic',     burn: 1, recPrice: '₹1k–2k',  hint: 'Less than 5 yr XP' },
                { k: 'Good',      burn: 2, recPrice: '₹2k–4k',  hint: '5–10 yr XP' },
                { k: 'Excellent', burn: 3, recPrice: '₹4k+',    hint: '10+ yr XP / senior leaders' },
              ].map((tier) => (
                <button key={tier.k} onClick={() => update({ tier: tier.k })} style={{
                  padding: 14, background: data.tier === tier.k ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.tier === tier.k ? t.accent : t.borderSoft),
                  borderRadius: 10, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 14, color: t.text, fontWeight: 700, marginBottom: 4 }}>{tier.k}</div>
                  <div style={{ fontSize: 11, color: t.accent, fontFamily: FONT_MONO, marginBottom: 4 }}>{tier.burn} credit / session</div>
                  <div style={{ fontSize: 10, color: t.textMuted }}>{tier.recPrice}</div>
                  <div style={{ fontSize: 9, color: t.textDim, marginTop: 4 }}>{tier.hint}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 1fr', gap: 12 }}>
            <FlowField t={t} label="Price per session" type="number" required value={data.pricePerSession} onChange={(v) => update({ pricePerSession: v })} />
            <FlowSelectField t={t} label="Currency" value={data.currency} onChange={(v) => update({ currency: v })}
              options={['INR','USD','EUR','GBP','SGD','AED'].map((x) => ({ v: x, l: x }))} />
            <FlowSelectField t={t} label="Default session length" value={String(data.sessionLengthMin)} onChange={(v) => update({ sessionLengthMin: parseInt(v, 10) })}
              options={['30','45','60','90'].map((x) => ({ v: x, l: x + ' min' }))} />
          </div>
          <FlowToggle t={t} label="Offer a free 15-min intro call" desc="First-call free reduces booking friction. Mentee uses 0 credits for the intro." value={data.freeIntro} onChange={(v) => update({ freeIntro: v })} />
        </div>
      )}

      {/* STEP 4 — Availability */}
      {step === 4 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>How much capacity they're offering. Per Availability & Buffer Logic, mentor sets defaults; org or platform may apply caps/floors.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <FlowField t={t} label="Weekly hours commitment" type="number" required value={data.weeklyHours} onChange={(v) => update({ weeklyHours: v })} />
            <FlowField t={t} label="Lead time (hours)" type="number" value={data.leadTimeHrs} onChange={(v) => update({ leadTimeHrs: v })} />
            <FlowField t={t} label="Buffer between sessions (min)" type="number" value={data.bufferMin} onChange={(v) => update({ bufferMin: v })} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Working days</label>
            <div style={{ display: 'flex', gap: 6 }}>
              {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((d) => {
                const selected = data.workingDays.indexOf(d) >= 0;
                return (
                  <button key={d} onClick={() => update({ workingDays: selected ? data.workingDays.filter((x) => x !== d) : data.workingDays.concat([d]) })} style={{
                    flex: 1, padding: '8px 0', background: selected ? t.accent + '22' : t.bgCardElev,
                    color: selected ? t.accent : t.textMuted,
                    border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                    borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: selected ? 700 : 500, fontFamily: FONT_BODY,
                  }}>{d}</button>
                );
              })}
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Working hours start</label>
              <input type="time" value={data.workingHoursStart} onChange={(e) => update({ workingHoursStart: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Working hours end</label>
              <input type="time" value={data.workingHoursEnd} onChange={(e) => update({ workingHoursEnd: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
            </div>
          </div>
          <div style={{ padding: 10, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.5 }}>
            <strong style={{ color: t.accent }}>Estimated capacity:</strong> ~{Math.floor((parseInt(data.weeklyHours, 10) * 60) / (parseInt(data.sessionLengthMin || 45, 10) + parseInt(data.bufferMin || 0, 10)))} sessions / week, {data.workingDays.length} working day{data.workingDays.length === 1 ? '' : 's'}.
          </div>
        </div>
      )}

      {/* STEP 5 — Org mapping */}
      {step === 5 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Where this mentor appears. The Permission Engine + Map Mentors To Orgs controllers govern this.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Pool placement</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { v: 'platform_only', l: 'Platform pool only', d: 'Discoverable to any mentee on the platform. No org restriction.' },
                { v: 'specific_orgs', l: 'Mapped to specific orgs only', d: 'Only mentees in chosen orgs can book this mentor. Pick orgs below.' },
                { v: 'both',          l: 'Platform pool + specific orgs', d: 'Visible everywhere. Mapped orgs get this mentor in their featured pool.' },
              ].map((opt) => (
                <button key={opt.v} onClick={() => update({ poolType: opt.v })} style={{
                  padding: 12, background: data.poolType === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.poolType === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>
          {(data.poolType === 'specific_orgs' || data.poolType === 'both') && (
            <FlowChips t={t} label={data.poolType === 'specific_orgs' ? 'Pick orgs (required)' : 'Featured in these orgs (optional)'} value={data.mappedOrgs} onChange={(v) => update({ mappedOrgs: v })} options={availableOrgs} />
          )}
          <FlowSelectField t={t} label="Marketplace visibility" value={data.visibility} onChange={(v) => update({ visibility: v })}
            options={[
              { v: 'visible', l: 'Visible — appears in search results' },
              { v: 'unlisted', l: 'Unlisted — direct-link bookings only' },
              { v: 'hidden', l: 'Hidden — not bookable yet (soft-launch)' },
            ]} />
        </div>
      )}

      {/* STEP 6 — Compliance & payout */}
      {step === 6 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Legal + financial setup. Payouts run via the Invoicing & Payout Engine on a monthly cycle.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 12 }}>
            <FlowSelectField t={t} label="Payout method" value={data.payoutMethod} onChange={(v) => update({ payoutMethod: v })}
              options={[
                { v: 'upi', l: 'UPI' },
                { v: 'bank', l: 'Bank transfer (NEFT)' },
                { v: 'paypal', l: 'PayPal (international)' },
                { v: 'wise', l: 'Wise (international)' },
              ]} />
            <FlowField t={t} label={data.payoutMethod === 'upi' ? 'UPI ID' : data.payoutMethod === 'bank' ? 'Bank account · IFSC' : 'Email on file'}
              value={data.payoutHandle} onChange={(v) => update({ payoutHandle: v })}
              placeholder={data.payoutMethod === 'upi' ? 'naveen@hdfc' : data.payoutMethod === 'bank' ? '50100123456 · HDFC0000123' : 'naveen@example.com'} />
          </div>
          <FlowField t={t} label="Tax ID / PAN (for TDS)" value={data.taxId} onChange={(v) => update({ taxId: v.toUpperCase() })} placeholder="AABCU9603R" />
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 11, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>Required acknowledgements</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={data.acceptedLOE} onChange={(e) => update({ acceptedLOE: e.target.checked })} style={{ marginTop: 3, accentColor: t.accent }} />
                <div>
                  <div style={{ fontSize: 12, color: t.text }}>Mentor accepts the <strong>Letter of Engagement (LOE)</strong></div>
                  <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Sent for digital e-signature on confirm. Profile stays Pending until LOE returns signed.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={data.acceptedCoC} onChange={(e) => update({ acceptedCoC: e.target.checked })} style={{ marginTop: 3, accentColor: t.accent }} />
                <div>
                  <div style={{ fontSize: 12, color: t.text }}>Mentor accepts the <strong>Code of Conduct</strong></div>
                  <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Includes data privacy, professionalism, and no-poaching clauses.</div>
                </div>
              </label>
              <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
                <input type="checkbox" checked={data.dataConsent} onChange={(e) => update({ dataConsent: e.target.checked })} style={{ marginTop: 3, accentColor: t.accent }} />
                <div>
                  <div style={{ fontSize: 12, color: t.text }}>Mentor consents to <strong>data processing for matching, analytics, MIS</strong></div>
                  <div style={{ fontSize: 10, color: t.textDim, marginTop: 2 }}>Required for Mentor Impact Score calculation and AI-assisted matching.</div>
                </div>
              </label>
            </div>
          </div>
          <FlowToggle t={t} label="Send LOE for digital signature on confirm" desc="If off, you must trigger LOE manually from the mentor profile later." value={data.sendLOE} onChange={(v) => update({ sendLOE: v })} />
        </div>
      )}

      {/* STEP 7 — Bio (marketing copy) */}
      {step === 7 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Marketing copy that appears on the mentor's marketplace profile. The mentor can edit later.</div>
          <FlowField t={t} label="One-line headline" required value={data.headline} onChange={(v) => update({ headline: v })} placeholder="Senior PM at Razorpay · ex-Flipkart · helped 200+ mentees switch into product" />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
              Bio <span style={{ color: t.red }}>*</span>
            </label>
            <textarea rows={6} value={data.bio} onChange={(e) => update({ bio: e.target.value })} placeholder="3–4 paragraphs. What you specialise in, who you've coached, what mentees can expect from a session with you."
              style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical', lineHeight: 1.5 }} />
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 4, fontFamily: FONT_MONO }}>{data.bio.length} chars · recommended 300–800</div>
          </div>
          {/* Live marketplace preview */}
          <div style={{ background: '#0a1f28', border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 9, color: '#94a3a8', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>Marketplace preview</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <Avatar name={data.displayName || data.name || 'Mentor'} t={t} size={42} />
              <div style={{ flex: 1 }}>
                <div className="mu-display" style={{ fontSize: 16, color: '#f4ead7' }}>{data.displayName || data.name || 'Mentor name'}</div>
                <div style={{ fontSize: 10, color: '#94a3a8' }}>{data.currentRole || 'Role'} · {data.country}</div>
              </div>
              <div style={{ display: 'flex', gap: 4 }}>
                <span style={{ padding: '2px 7px', background: '#9b6dff22', color: '#9b6dff', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>{data.tier}</span>
                {data.freeIntro && <span style={{ padding: '2px 7px', background: '#4ec3a922', color: '#4ec3a9', borderRadius: 4, fontSize: 9, fontWeight: 700 }}>Free intro</span>}
              </div>
            </div>
            <div style={{ fontSize: 11, color: '#f4ead7', lineHeight: 1.5, marginBottom: 10, fontStyle: data.headline ? 'normal' : 'italic', opacity: data.headline ? 1 : 0.5 }}>
              {data.headline || 'Your one-line headline will appear here'}
            </div>
            <div style={{ fontSize: 10, color: '#94a3a8', lineHeight: 1.5, opacity: data.bio ? 1 : 0.5, fontStyle: data.bio ? 'normal' : 'italic' }}>
              {data.bio.slice(0, 200) || 'Your bio will appear here.'}{data.bio.length > 200 ? '…' : ''}
            </div>
          </div>
        </div>
      )}

      {/* STEP 8 — Confirm */}
      {step === 8 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Review and confirm. Click any section header to jump back and edit.</div>
          {[
            { label: 'Identity', step: 0, rows: [
              ['Name', data.name + (data.displayName ? ' (display: ' + data.displayName + ')' : '')],
              ['Email · phone', data.email + (data.phone ? ' · ' + data.phone : '')],
              ['Location', [data.city, data.country].filter(Boolean).join(', ') + ' · ' + data.timezone],
              ['Languages', data.languages.join(', ')],
              ['Photo', data.photoUploaded ? '✓ uploaded' : 'not uploaded'],
            ]},
            { label: 'Credibility', step: 1, rows: [
              ['Current role', data.currentRole + ' @ ' + data.currentCompany + ' · ' + data.yearsExperience + ' yr XP'],
              ['LinkedIn', data.linkedin],
              ['Past employers', data.pastEmployers || '—'],
              ['Docs', [data.resumeUploaded && 'resume', data.certificationsUploaded && 'certs'].filter(Boolean).join(' · ') || 'none uploaded'],
            ]},
            { label: 'Expertise', step: 2, rows: [
              ['Primary domain', data.primaryDomain],
              ['Sub-skills', data.subSkills.join(', ') || '—'],
              ['Career stages', data.careerStages.join(', ')],
              ['Industries', data.industries.join(', ') || '—'],
            ]},
            { label: 'Pricing', step: 3, rows: [
              ['Tier', data.tier + ' · ' + (data.tier === 'Excellent' ? 3 : data.tier === 'Good' ? 2 : 1) + ' credit / session'],
              ['Price', data.currency + ' ' + parseInt(data.pricePerSession, 10).toLocaleString() + ' / ' + data.sessionLengthMin + 'min session'],
              ['Free intro', data.freeIntro ? 'Yes (15-min)' : 'No'],
            ]},
            { label: 'Availability', step: 4, rows: [
              ['Commitment', data.weeklyHours + ' hrs / week'],
              ['Working days', data.workingDays.join(' · ')],
              ['Working hours', data.workingHoursStart + '–' + data.workingHoursEnd],
              ['Lead time · buffer', data.leadTimeHrs + 'h lead · ' + data.bufferMin + 'min buffer'],
            ]},
            { label: 'Org mapping', step: 5, rows: [
              ['Pool placement', data.poolType.replace(/_/g, ' ')],
              ['Mapped orgs', data.mappedOrgs.length > 0 ? data.mappedOrgs.join(', ') : 'none (platform pool)'],
              ['Visibility', data.visibility],
            ]},
            { label: 'Compliance & payout', step: 6, rows: [
              ['Payout', data.payoutMethod.toUpperCase() + ' · ' + (data.payoutHandle || '—')],
              ['Tax ID', data.taxId || '—'],
              ['LOE · CoC · Data consent', [data.acceptedLOE && 'LOE', data.acceptedCoC && 'CoC', data.dataConsent && 'Data'].filter(Boolean).join(' · ')],
              ['Send LOE on confirm', data.sendLOE ? 'Yes' : 'No'],
            ]},
            { label: 'Bio', step: 7, rows: [
              ['Headline', data.headline],
              ['Bio', data.bio.slice(0, 140) + (data.bio.length > 140 ? '…' : '')],
            ]},
          ].map((sec) => (
            <div key={sec.label} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>{sec.label}</div>
                <button onClick={() => setStep(sec.step)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontFamily: FONT_BODY }}>Edit</button>
              </div>
              {sec.rows.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 10, padding: '5px 0', fontSize: 11 }}>
                  <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 9 }}>{k}</span>
                  <span style={{ color: t.text, lineHeight: 1.4, wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Activation</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { v: 'after_verification', l: 'Go live after compliance approval', d: 'Status starts as Pending. You review docs, then approve.' },
                { v: 'immediately',        l: 'Go live immediately', d: 'Skips review. Use only if pre-vetted offline.' },
              ].map((opt) => (
                <button key={opt.v} onClick={() => update({ goLive: opt.v })} style={{
                  padding: 12, background: data.goLive === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.goLive === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginTop: 4, padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Mentor "<strong>{data.displayName || data.name}</strong>" added to platform pool with status <strong style={{ color: data.goLive === 'immediately' ? t.green : t.yellow }}>{data.goLive === 'immediately' ? 'Live' : 'Pending verification'}</strong></li>
              {data.sendLOE && <li>LOE emailed to <strong>{data.email}</strong> for digital signature</li>}
              {data.poolType !== 'platform_only' && data.mappedOrgs.length > 0 && (
                <li>Mapped to {data.mappedOrgs.length} org{data.mappedOrgs.length === 1 ? '' : 's'}: <strong>{data.mappedOrgs.join(', ')}</strong> — Map Mentors To Orgs Engine logs each mapping</li>
              )}
              <li>Profile created at <strong>mentorunion.com/m/{(data.displayName || data.name).toLowerCase().replace(/\s+/g, '-')}</strong></li>
              <li>{data.freeIntro ? 'Free 15-min intro session enabled' : 'Standard pricing only — no free intro'}</li>
              <li>Mentor Impact Score initialised at <strong>0</strong> · grows from sessions, ratings, profile completion (visible {data.visibility})</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the creator with full payload</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// Helper multi-select chips component for flows
function FlowChips({ t, label, value, onChange, options, required }) {
  const selected = value || [];
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>
        {label} {required && <span style={{ color: t.red }}>*</span>}
        {selected.length > 0 && <span style={{ color: t.accent, fontFamily: FONT_MONO, marginLeft: 6 }}>· {selected.length} selected</span>}
      </label>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {options.map((opt) => {
          const isSelected = selected.indexOf(opt) >= 0;
          return (
            <button key={opt} onClick={() => onChange(isSelected ? selected.filter((x) => x !== opt) : selected.concat([opt]))} style={{
              padding: '5px 12px', background: isSelected ? t.accent + '22' : 'transparent',
              color: isSelected ? t.accent : t.textMuted,
              border: '1px solid ' + (isSelected ? t.accent : t.border),
              borderRadius: 999, fontSize: 11, cursor: 'pointer', fontFamily: FONT_BODY,
              fontWeight: isSelected ? 600 : 500,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              {isSelected && <Check size={10} />} {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 7. Book Session — mentee 3-step
function FlowBookSession({ t, ctx, target, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ mentor: target ? target.name : 'Naveen Sharma', slot: 'Tue 4pm IST', agenda: '', tier: target ? target.tier : 'Good' });
  const credits = target ? (target.tier === 'Excellent' ? 3 : target.tier === 'Good' ? 2 : 1) : 2;
  const next = () => {
    if (step < 2) { setStep(step + 1); return; }
    ctx.runAction('session.book', target, data);
    ctx.moveCredits(-credits, 'mentee wallet', 'session', data.mentor, 'Booking ' + data.slot);
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };
  return (
    <FlowShell t={t} title="Book a session" subtitle={'with ' + data.mentor} icon={ICON_MAP.Calendar} step={step} totalSteps={3} stepLabels={['Pick slot','Add agenda','Confirm']} onClose={() => ctx.setActiveAction(null)} onBack={() => setStep(step - 1)} onNext={next} nextLabel={step === 2 ? 'Confirm booking' : 'Continue'}>
      {step === 0 && (
        <div>
          <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>Available slots (your timezone)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            {['Mon 11am','Tue 4pm','Wed 6pm','Thu 9am','Fri 3pm','Sat 11am'].map((s) => (
              <button key={s} onClick={() => setData(Object.assign({}, data, { slot: s + ' IST' }))} style={{
                padding: '8px 12px', background: data.slot === s + ' IST' ? t.accent + '22' : t.bgCardElev,
                border: '1px solid ' + (data.slot === s + ' IST' ? t.accent : t.borderSoft),
                borderRadius: 8, cursor: 'pointer', fontSize: 12, color: t.text, fontFamily: FONT_MONO,
              }}>{s}</button>
            ))}
          </div>
        </div>
      )}
      {step === 1 && (
        <FlowField t={t} label="Agenda (helps your mentor prepare)" value={data.agenda} onChange={(v) => setData(Object.assign({}, data, { agenda: v }))} placeholder="e.g. Career transition into PM, mock interview, portfolio review" />
      )}
      {step === 2 && (
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
          {[['Mentor', data.mentor],['Slot', data.slot],['Agenda', data.agenda || '—'],['Tier', data.tier],['Credits', credits + ' (will be deducted)']].map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '8px 0', borderTop: '1px solid ' + t.borderSoft, fontSize: 12 }}>
              <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{k}</span>
              <span style={{ color: t.text }}>{v}</span>
            </div>
          ))}
          <div style={{ marginTop: 12, padding: 10, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.accent }}>
            Booking Lock Controller will hold this slot for 60s. Credit Engine deducts {credits} credit{credits > 1 ? 's' : ''}. Communication Engine sends confirm + reminder. Zoom link auto-generated.
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// 8. Review Escalations
function FlowReviewEscalations({ t, ctx, onAfter }) {
  const escalations = ctx.stores.tickets.filter((tk) => tk.status === 'Escalated' || tk.priority === 'High' || tk.priority === 'Urgent').slice(0, 6);
  const queue = escalations.length > 0 ? escalations : [
    { id: 'TK-2391', subject: 'Mentor no-show · 2nd time', owner: 'Aarav S', priority: 'High', age: '6h', org: "Masters' Union" },
    { id: 'TK-2389', subject: 'Credit refund disputed', owner: 'Priya M', priority: 'Urgent', age: '2h', org: 'Tetr' },
    { id: 'TK-2384', subject: 'Booking failed twice', owner: 'Rahul K', priority: 'High', age: '12h', org: 'Corporate Alpha' },
  ];
  return (
    <FlowShell t={t} title="Review escalations" subtitle="Triage queue · resolve, reassign, or escalate further with full context." icon={ICON_MAP.AlertOctagon} step={0} totalSteps={1} stepLabels={['Triage']} onClose={() => ctx.setActiveAction(null)} width={840}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {queue.map((tk) => (
          <div key={tk.id} style={{ display: 'grid', gridTemplateColumns: '90px 1fr 120px 80px 80px auto', gap: 12, alignItems: 'center', padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{tk.id}</span>
            <div>
              <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{tk.subject}</div>
              <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{tk.org} · {tk.owner}</div>
            </div>
            <StatusPill t={t} tone={tk.priority === 'Urgent' ? 'bad' : 'warn'}>{tk.priority}</StatusPill>
            <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{tk.age}</span>
            <button onClick={() => { ctx.runAction('ticket.assign', tk, { assignee: 'me' }); }} style={{ padding: '5px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Take it</button>
            <button onClick={() => { ctx.runAction('ticket.resolve', tk, { resolution: 'Resolved from escalation queue' }); }} style={{ padding: '5px 10px', background: t.green, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Resolve</button>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, padding: 10, background: t.bgInput, border: '1px dashed ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted }}>
        Click "Take it" to assign yourself · "Resolve" to close. Each action logs the actor + reason. Closing this view does not change anything.
      </div>
    </FlowShell>
  );
}

// 9. Open Report
function FlowOpenReport({ t, ctx, target, onAfter }) {
  const reports = [
    { id: 'rpt_ops', name: 'Weekly operations pulse', desc: 'Sessions, completion, no-shows, cancellations · 6w trend', owner: 'Rakesh K' },
    { id: 'rpt_credits', name: 'Credit allocation snapshot', desc: 'Allocated · consumed · remaining per org', owner: 'Finance' },
    { id: 'rpt_mis', name: 'MIS distribution', desc: 'Mentor Impact Score across tiers and domains', owner: 'Anita S' },
    { id: 'rpt_sla', name: 'Support SLA breakdown', desc: 'Ticket resolution by team and priority', owner: 'Vivek P' },
    { id: 'rpt_outcomes', name: 'Reflective outcomes', desc: 'Career breakthroughs by type, cohort sample', owner: 'Product' },
  ];
  return (
    <FlowShell t={t} title="Open report" subtitle="Pick a report to view. You can also export or schedule it from here." icon={ICON_MAP.FileBarChart} step={0} totalSteps={1} stepLabels={['Choose']} onClose={() => ctx.setActiveAction(null)} width={680}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {reports.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><FileBarChart size={14} /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>{r.desc}</div>
              <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, marginTop: 4 }}>owner: {r.owner}</div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { ctx.showToast('Opening · ' + r.name); ctx.appendLog({ actionId: 'report.open', label: 'Open report', target: r.name, payload: null, result: 'Completed', destructive: false }); ctx.setActiveAction(null); }} style={{ padding: '6px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 700 }}>Open</button>
              {ctx.canDo('report.export') && (
                <button onClick={() => { ctx.runAction('report.export', { name: r.name }, { format: 'CSV' }); ctx.setActiveAction(null); }} style={{ padding: '6px 10px', background: 'transparent', color: t.text, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Export</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </FlowShell>
  );
}

// 9b. Open Filtered Tables — drill router from a chart-heavy overview into a
//     focused data table with filters pre-applied. Lists exception classes
//     computed live from stores; click a row to navigate to the matching tab.
function FlowOpenFilteredTables({ t, ctx, target, onAfter }) {
  // Per-persona destination map — drills into the persona's own table tabs
  const destinations = {
    super_admin: {
      orgs:    { module: 'organisations', tab: 'all_orgs',  label: 'All organisations table' },
      mentors: { module: 'mentors',       tab: 'directory', label: 'Mentor directory'         },
      sessions:{ module: 'sessions',      tab: 'sessions',  label: 'Sessions table'           },
      tickets: { module: 'support',       tab: 'tickets',   label: 'Ticket command center'    },
      credits: { module: 'credits',       tab: 'engine',    label: 'Credit engine'            },
    },
    org_admin: {
      mentors: { module: 'mentors',  tab: 'directory',     label: 'Org mentor directory'    },
      sessions:{ module: 'sessions', tab: 'sessions_log',  label: 'Sessions log'            },
      tickets: { module: 'support',  tab: 'tickets',       label: 'Tickets'                 },
      credits: { module: 'credits',  tab: 'wallet',        label: 'Org wallet'              },
    },
    sub_admin: {
      mentors: { module: 'mentors',  tab: 'directory',     label: 'Mentor directory'        },
      sessions:{ module: 'sessions', tab: 'sessions_log',  label: 'Sessions log'            },
    },
    mentor: {
      sessions:{ module: 'sessions', tab: 'upcoming',      label: 'My sessions'             },
    },
    mentee: {
      sessions:{ module: 'sessions', tab: 'upcoming',      label: 'My sessions'             },
    },
  };
  const personaDest = destinations[ctx.persona] || destinations.super_admin;

  // Compute exception inventory live from stores
  const noShowSessions = Math.max(3, Math.floor((ctx.stores.tickets || []).filter((tk) => /no.show/i.test(tk.title || '')).length * 4 + 8));
  const lowCreditOrgs = (ctx.stores.orgs || []).filter((o) => (o.creditsLeft || 0) < 200).length;
  const slaBreaches = (ctx.stores.tickets || []).filter((tk) => tk.sla === 'Breached').length;
  const kycPending = (ctx.stores.mentors || []).filter((m) => m.kyc === 'Pending').length;
  const lowMis = (ctx.stores.mentors || []).filter((m) => m.mis < 60).length;
  const inactiveMentees = (ctx.stores.mentees || []).filter((m) => /w ago|2d ago/.test(m.lastActive || '')).length;
  const pendingRequests = (ctx.stores.creditRequests || []).filter((r) => r.status === 'Pending').length;

  // Build exception cards — hide ones whose destination tab doesn't exist for this persona
  const cards = [
    {
      key: 'no_show', kind: 'sessions', count: noShowSessions, severity: 'bad',
      title: 'Sessions with no-shows',
      desc: 'Booked sessions where mentor or mentee did not attend',
      filters: { status: 'No-show', age: '14d' },
    },
    {
      key: 'low_credits', kind: 'orgs', count: lowCreditOrgs, severity: lowCreditOrgs > 0 ? 'bad' : 'good',
      title: 'Orgs with low credits (<200)',
      desc: 'Organisations approaching wallet zero — credit top-up may be needed',
      filters: { creditsBelow: 200 },
    },
    {
      key: 'sla_breach', kind: 'tickets', count: slaBreaches, severity: slaBreaches > 0 ? 'bad' : 'good',
      title: 'SLA-breached tickets',
      desc: 'Support tickets that missed their SLA window',
      filters: { sla: 'Breached' },
    },
    {
      key: 'kyc_pending', kind: 'mentors', count: kycPending, severity: kycPending > 5 ? 'warn' : 'neutral',
      title: 'Mentors with KYC pending',
      desc: 'Onboarded mentors blocked from going live until verification clears',
      filters: { kyc: 'Pending' },
    },
    {
      key: 'low_mis', kind: 'mentors', count: lowMis, severity: 'warn',
      title: 'Mentors with low MIS (<60)',
      desc: 'Underperforming mentors flagged by the MIS engine',
      filters: { misBelow: 60 },
    },
    {
      key: 'inactive_mentees', kind: 'sessions', count: inactiveMentees, severity: 'neutral',
      title: 'Inactive mentees (7+ days)',
      desc: 'Mentees who have not booked or completed a session recently',
      filters: { lastActiveOver: '7d' },
    },
    {
      key: 'pending_requests', kind: 'credits', count: pendingRequests, severity: pendingRequests > 0 ? 'warn' : 'good',
      title: 'Pending credit requests',
      desc: 'Org admins waiting on you to approve credit top-ups',
      filters: { requestStatus: 'Pending' },
    },
  ].filter((c) => personaDest[c.kind]); // drop cards with no valid destination

  const goTo = (card) => {
    const dest = personaDest[card.kind];
    if (!dest) return;
    ctx.navigate({ module: dest.module, tab: dest.tab, filters: card.filters });
    ctx.appendLog({
      actionId: 'report.open_filtered',
      label: 'Open filtered table',
      target: dest.label,
      payload: { exception: card.key, filters: card.filters, count: card.count },
      result: 'Completed', destructive: false,
    });
    ctx.showToast('Opened ' + dest.label + ' · ' + card.title.toLowerCase());
    ctx.setActiveAction(null);
  };

  return (
    <FlowShell t={t}
      title="Open filtered tables"
      subtitle="Pick an exception class to investigate. We'll jump you to the matching table with filters pre-applied."
      icon={ICON_MAP.Filter}
      step={0}
      totalSteps={1}
      stepLabels={['Pick a drill destination']}
      onClose={() => { ctx.appendLog({ actionId: 'report.open_filtered', label: 'Open filtered tables', payload: null, result: 'Cancelled', destructive: false }); ctx.setActiveAction(null); }}
      width={760}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cards.length === 0 && (
          <div style={{ padding: 20, textAlign: 'center', background: t.bgCardElev, border: '1px dashed ' + t.borderSoft, borderRadius: 10, color: t.textDim }}>
            <CheckCircle2 size={20} style={{ marginBottom: 8, opacity: 0.6 }} />
            <div style={{ fontSize: 12 }}>No drill destinations available for this persona.</div>
          </div>
        )}
        {cards.map((card) => {
          const dest = personaDest[card.kind];
          const sevColor = card.severity === 'bad' ? t.red : card.severity === 'warn' ? t.yellow : card.severity === 'good' ? t.green : t.textMuted;
          const sevBg = card.severity === 'bad' ? t.red + '11' : card.severity === 'warn' ? t.yellow + '11' : card.severity === 'good' ? t.green + '11' : 'transparent';
          const isEmpty = card.count === 0;
          return (
            <button key={card.key} onClick={() => !isEmpty && goTo(card)} disabled={isEmpty} style={{
              display: 'grid', gridTemplateColumns: '60px 1fr 140px 28px', gap: 12, alignItems: 'center',
              padding: 14, background: isEmpty ? t.bgCardElev : sevBg,
              border: '1px solid ' + (isEmpty ? t.borderSoft : sevColor + '55'),
              borderRadius: 10, cursor: isEmpty ? 'not-allowed' : 'pointer', textAlign: 'left',
              opacity: isEmpty ? 0.5 : 1, transition: 'all 150ms',
            }} onMouseEnter={(e) => { if (!isEmpty) { e.currentTarget.style.background = sevColor + '22'; e.currentTarget.style.borderColor = sevColor; } }} onMouseLeave={(e) => { if (!isEmpty) { e.currentTarget.style.background = sevBg; e.currentTarget.style.borderColor = sevColor + '55'; } }}>
              <div style={{ fontSize: 24, color: sevColor, fontFamily: FONT_MONO, fontWeight: 700, textAlign: 'center' }}>{card.count}</div>
              <div>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 2 }}>{card.title}</div>
                <div style={{ fontSize: 11, color: t.textMuted, lineHeight: 1.4 }}>{card.desc}</div>
              </div>
              <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, textAlign: 'right' }}>
                {isEmpty ? <span style={{ color: t.green }}>nothing here</span> : '→ ' + dest.label}
              </div>
              {!isEmpty && <ChevronRight size={16} color={sevColor} />}
            </button>
          );
        })}
      </div>
      <div style={{ marginTop: 14, padding: 10, background: t.bgInput, border: '1px dashed ' + t.borderSoft, borderRadius: 8, fontSize: 11, color: t.textMuted, lineHeight: 1.5 }}>
        Counts are computed live from current data. Empty rows are disabled. Clicking any row closes this modal, navigates you to the matching table tab, and pre-applies the relevant filters so you land on exactly the affected entities.
      </div>
    </FlowShell>
  );
}

// 10. Nudge user — multi-target with three modes:
//     (1) specific users picked from a searchable list
//     (2) cohort by user-type filter (e.g. "all mentees with low credits")
//     (3) saved segment (predefined groups)
function FlowNudgeUser({ t, ctx, target, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    mode: 'specific',          // 'specific' | 'cohort' | 'segment'
    userType: 'mentees',       // for both specific + cohort
    selected: target ? [{ kind: 'mentee', id: target.id, name: target.name, email: target.email }] : [],
    cohortFilter: 'all',       // 'all' | 'low_credits' | 'inactive_30d' | 'no_show_flagged' | 'profile_incomplete' | 'top_mis' | 'pending_verification'
    segment: null,             // saved segment id
    searchQ: '',
    channel: 'in_app',         // 'in_app' | 'email' | 'whatsapp' | 'all'
    template: 'custom',        // 'custom' | 'feedback_overdue' | 'session_reminder' | 'credits_expiring' | 'profile_incomplete'
    subject: '',
    message: '',
    schedule: 'now',           // 'now' | 'later'
    scheduledAt: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'comm.nudge', label: 'Nudge user', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };

  // Pre-fill message based on template selection
  const TEMPLATES = {
    custom: { subject: '', body: '' },
    feedback_overdue: {
      subject: 'Quick favour — your session feedback',
      body: 'Hi {{name}}, your session on {{date}} is still pending feedback. It only takes 30 seconds and helps your mentor improve. Click here to share: {{link}}',
    },
    session_reminder: {
      subject: 'Heads up — session in 2 hours',
      body: 'Hi {{name}}, just a reminder your session with {{mentor}} is in 2 hours. Bring your prep notes. Zoom link: {{link}}',
    },
    credits_expiring: {
      subject: 'Your credits expire soon',
      body: 'Hi {{name}}, you have {{credits}} credits expiring on {{date}}. Book a session before they\u2019re gone: {{link}}',
    },
    profile_incomplete: {
      subject: 'Complete your profile to unlock matching',
      body: 'Hi {{name}}, your profile is {{percent}}% complete. Mentees can\u2019t find you in search until it hits 80%. Finish here: {{link}}',
    },
  };

  // Resolve recipients from store based on mode + filter
  const resolveRecipients = () => {
    if (data.mode === 'specific') return data.selected;
    if (data.mode === 'cohort') {
      const pool = data.userType === 'mentees' ? ctx.stores.mentees
        : data.userType === 'mentors' ? ctx.stores.mentors
        : ctx.stores.orgs;
      let filtered = pool;
      if (data.cohortFilter === 'low_credits' && data.userType === 'mentees') {
        filtered = pool.filter((u) => (u.credits || 0) < 5);
      } else if (data.cohortFilter === 'inactive_30d') {
        filtered = pool.slice(0, Math.floor(pool.length * 0.4));
      } else if (data.cohortFilter === 'no_show_flagged') {
        filtered = pool.slice(0, Math.floor(pool.length * 0.15));
      } else if (data.cohortFilter === 'profile_incomplete' && data.userType === 'mentors') {
        filtered = pool.filter((m) => !m.bio || (m.bio && m.bio.length < 100)).slice(0, 12);
      } else if (data.cohortFilter === 'top_mis' && data.userType === 'mentors') {
        filtered = pool.filter((m) => (m.mis || 0) >= 4.5);
      } else if (data.cohortFilter === 'pending_verification' && data.userType === 'mentors') {
        filtered = pool.filter((m) => m.lastSession === 'pending verification' || m.status === 'Pending verification');
      }
      return filtered.map((u) => ({ kind: data.userType.slice(0, -1), id: u.id, name: u.name, email: u.email || (u.name + '@example.com') }));
    }
    if (data.mode === 'segment' && data.segment) {
      // Saved segments — for the prototype, derive 5 fake segments
      const SEGMENTS = {
        seg_low_engagement: ctx.stores.mentees.slice(0, 8).map((u) => ({ kind: 'mentee', id: u.id, name: u.name, email: u.email })),
        seg_top_mentors: ctx.stores.mentors.filter((m) => (m.mis || 0) >= 4.3).map((u) => ({ kind: 'mentor', id: u.id, name: u.name, email: u.email })),
        seg_billing_overdue: ctx.stores.orgs.slice(0, 3).map((u) => ({ kind: 'org', id: u.id, name: u.name, email: u.billingEmail || 'billing@' + u.name.toLowerCase().replace(/\s+/g, '') + '.com' })),
        seg_new_mentors_7d: ctx.stores.mentors.slice(0, 4).map((u) => ({ kind: 'mentor', id: u.id, name: u.name, email: u.email })),
        seg_unfinished_milestones: ctx.stores.mentees.slice(5, 14).map((u) => ({ kind: 'mentee', id: u.id, name: u.name, email: u.email })),
      };
      return SEGMENTS[data.segment] || [];
    }
    return [];
  };

  const recipients = resolveRecipients();

  const stepValid = () => {
    if (step === 0) {
      if (data.mode === 'specific') return data.selected.length > 0;
      if (data.mode === 'cohort') return data.userType && data.cohortFilter;
      if (data.mode === 'segment') return !!data.segment;
      return false;
    }
    if (step === 1) return data.message.trim().length > 0;
    if (step === 2) return data.schedule === 'now' || data.scheduledAt;
    return true;
  };

  const next = () => {
    if (step < 3) { setStep(step + 1); return; }
    // Confirm: log the nudge with recipient count
    ctx.runAction('comm.nudge', null, {
      mode: data.mode,
      recipientCount: recipients.length,
      channel: data.channel,
      template: data.template,
      subject: data.subject || (TEMPLATES[data.template] && TEMPLATES[data.template].subject) || '',
      schedule: data.schedule === 'now' ? 'sent immediately' : 'scheduled · ' + data.scheduledAt,
    });
    // Append a per-recipient log entry up to 5, then aggregate
    if (recipients.length <= 5) {
      recipients.forEach((r) => ctx.appendLog({ actionId: 'comm.nudge', label: 'Nudge sent', target: r.name, payload: { kind: r.kind, channel: data.channel }, result: 'Completed', destructive: false }));
    } else {
      ctx.appendLog({ actionId: 'comm.nudge', label: 'Nudge bulk sent', target: recipients.length + ' recipients', payload: { mode: data.mode, channel: data.channel, template: data.template }, result: 'Completed', destructive: false });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };

  const stepLabels = ['Audience','Message','Delivery','Confirm'];

  // Render --------------------------------------------------------------------
  return (
    <FlowShell t={t}
      title="Nudge user"
      subtitle="Send a one-off reminder to specific users, a cohort, or a saved segment."
      icon={ICON_MAP.Bell}
      step={step}
      totalSteps={4}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => setStep(step - 1)}
      onNext={next}
      nextLabel={step === 3 ? (data.schedule === 'now' ? 'Send now to ' + recipients.length : 'Schedule for ' + recipients.length) : 'Continue'}
      nextDisabled={!stepValid()}
      width={720}
    >
      {/* STEP 0 — Audience */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Who should receive this nudge.</div>
          {/* Mode selector — 3 cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {[
              { v: 'specific', l: 'Specific users', d: 'Pick named users from a list', icon: Users },
              { v: 'cohort',   l: 'User-type cohort', d: 'Filter by role + state', icon: Filter },
              { v: 'segment',  l: 'Saved segment', d: 'Predefined group', icon: Bookmark },
            ].map((opt) => {
              const Ic = opt.icon;
              const selected = data.mode === opt.v;
              return (
                <button key={opt.v} onClick={() => update({ mode: opt.v, selected: [], cohortFilter: 'all', segment: null })} style={{
                  padding: 12, background: selected ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <Ic size={14} color={selected ? t.accent : t.textMuted} style={{ marginBottom: 6 }} />
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, lineHeight: 1.4 }}>{opt.d}</div>
                </button>
              );
            })}
          </div>

          {/* MODE 1 — Specific users picker */}
          {data.mode === 'specific' && (
            <NudgeSpecificPicker t={t} ctx={ctx} data={data} update={update} />
          )}

          {/* MODE 2 — Cohort filter */}
          {data.mode === 'cohort' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>User type</label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[
                    { v: 'mentees', l: 'Mentees' },
                    { v: 'mentors', l: 'Mentors' },
                    { v: 'orgs', l: 'Org admins' },
                  ].map((opt) => {
                    const selected = data.userType === opt.v;
                    return (
                      <button key={opt.v} onClick={() => update({ userType: opt.v, cohortFilter: 'all' })} style={{
                        padding: '7px 14px', background: selected ? t.accent : 'transparent',
                        color: selected ? '#0a1f28' : t.textMuted,
                        border: '1px solid ' + (selected ? t.accent : t.border),
                        borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: selected ? 700 : 500, fontFamily: FONT_BODY,
                      }}>{opt.l}</button>
                    );
                  })}
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Filter</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {(data.userType === 'mentees' ? [
                    { v: 'all',                 l: 'All mentees',                  d: 'Send to every mentee in scope' },
                    { v: 'low_credits',         l: 'Low credits (< 5 left)',       d: 'Mentees about to run out — good time to remind' },
                    { v: 'inactive_30d',        l: 'Inactive 30+ days',            d: 'No bookings in last 30 days' },
                    { v: 'no_show_flagged',     l: 'No-show flagged',              d: 'Mentees with at least one no-show on record' },
                  ] : data.userType === 'mentors' ? [
                    { v: 'all',                 l: 'All mentors',                  d: 'Send to every mentor in scope' },
                    { v: 'profile_incomplete',  l: 'Profile incomplete',           d: 'Mentors with bio < 100 chars' },
                    { v: 'pending_verification',l: 'Pending verification',         d: 'Mentors awaiting compliance approval' },
                    { v: 'inactive_30d',        l: 'Inactive 30+ days',            d: 'No sessions in last 30 days' },
                    { v: 'top_mis',             l: 'Top MIS (≥ 4.5)',              d: 'High-impact mentors — useful for advocacy nudges' },
                  ] : [
                    { v: 'all',                 l: 'All org admins',               d: 'Send to every org admin' },
                    { v: 'inactive_30d',        l: 'Orgs inactive 30+ days',       d: 'Orgs that haven\u2019t logged in recently' },
                    { v: 'low_credits',         l: 'Orgs with low credits',        d: 'Wallet < 500 credits — renewal nudge' },
                  ]).map((opt) => {
                    const selected = data.cohortFilter === opt.v;
                    return (
                      <button key={opt.v} onClick={() => update({ cohortFilter: opt.v })} style={{
                        padding: 10, background: selected ? t.accent + '22' : t.bgCardElev,
                        border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                        borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
                      }}>
                        <div>
                          <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.l}</div>
                          <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                        </div>
                        {selected && <Check size={14} color={t.accent} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MODE 3 — Saved segments */}
          {data.mode === 'segment' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Pick a saved segment</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[
                  { v: 'seg_low_engagement', l: 'Low engagement mentees', d: '8 mentees · zero sessions in 60 days', kind: 'mentee' },
                  { v: 'seg_top_mentors', l: 'Top mentors (MIS ≥ 4.3)', d: 'Most impactful mentors · for advocacy', kind: 'mentor' },
                  { v: 'seg_billing_overdue', l: 'Billing overdue orgs', d: '3 orgs · invoice overdue 14+ days', kind: 'org' },
                  { v: 'seg_new_mentors_7d', l: 'New mentors (joined < 7d)', d: '4 mentors · onboarding nudge', kind: 'mentor' },
                  { v: 'seg_unfinished_milestones', l: 'Mentees with unfinished milestones', d: '9 mentees · stalled progress', kind: 'mentee' },
                ].map((opt) => {
                  const selected = data.segment === opt.v;
                  return (
                    <button key={opt.v} onClick={() => update({ segment: opt.v })} style={{
                      padding: 10, background: selected ? t.accent + '22' : t.bgCardElev,
                      border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                      borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                      display: 'flex', alignItems: 'center', gap: 10,
                    }}>
                      <Bookmark size={14} color={selected ? t.accent : t.textMuted} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.l}</div>
                        <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                      </div>
                      <span style={{ padding: '2px 7px', background: opt.kind === 'mentor' ? t.purple + '22' : opt.kind === 'mentee' ? t.blue + '22' : t.green + '22', color: opt.kind === 'mentor' ? t.purple : opt.kind === 'mentee' ? t.blue : t.green, borderRadius: 4, fontSize: 9, fontWeight: 700, textTransform: 'uppercase' }}>{opt.kind}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live recipient count summary */}
          <div style={{ padding: 10, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.5 }}>
            <strong style={{ color: t.accent }}>This nudge will reach</strong> <strong>{recipients.length}</strong> {recipients.length === 1 ? 'recipient' : 'recipients'}{recipients.length > 0 && recipients.length <= 4 ? ' · ' + recipients.map((r) => r.name).join(', ') : ''}{recipients.length === 0 && data.mode !== 'specific' ? ' · adjust the filter to find people' : ''}
          </div>
        </div>
      )}

      {/* STEP 1 — Message */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Pick a template or write from scratch. Variables like <code style={{ fontSize: 10, padding: '1px 5px', background: t.bgCardElev, borderRadius: 3, fontFamily: FONT_MONO, color: t.accent }}>{'{{name}}'}</code> auto-fill per recipient.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Template</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { v: 'custom', l: 'Custom' },
                { v: 'feedback_overdue', l: 'Feedback overdue' },
                { v: 'session_reminder', l: 'Session reminder' },
                { v: 'credits_expiring', l: 'Credits expiring' },
                { v: 'profile_incomplete', l: 'Profile incomplete' },
              ].map((opt) => {
                const selected = data.template === opt.v;
                return (
                  <button key={opt.v} onClick={() => {
                    const tmpl = TEMPLATES[opt.v];
                    update({ template: opt.v, subject: tmpl.subject, message: tmpl.body });
                  }} style={{
                    padding: '5px 12px', background: selected ? t.accent + '22' : 'transparent',
                    color: selected ? t.accent : t.textMuted,
                    border: '1px solid ' + (selected ? t.accent : t.border),
                    borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: selected ? 700 : 500, fontFamily: FONT_BODY,
                  }}>{opt.l}</button>
                );
              })}
            </div>
          </div>
          <FlowField t={t} label="Subject (shown for email + WhatsApp; ignored for in-app)" value={data.subject} onChange={(v) => update({ subject: v })} placeholder="e.g. Heads up — your session in 2 hours" />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
              Message <span style={{ color: t.red }}>*</span>
            </label>
            <textarea rows={6} value={data.message} onChange={(e) => update({ message: e.target.value })} placeholder="Hi {{name}}, ..."
              style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical', lineHeight: 1.5 }} />
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6, fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>
              <span>{data.message.length} chars</span>
              <span>·</span>
              <span>variables: {'{{name}}'} · {'{{date}}'} · {'{{credits}}'} · {'{{mentor}}'} · {'{{link}}'}</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 — Delivery */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>How and when. Communication Engine routes per channel.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Channel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { v: 'in_app', l: 'In-app', d: 'Toast + bell badge' },
                { v: 'email', l: 'Email', d: 'Subject + body' },
                { v: 'whatsapp', l: 'WhatsApp', d: 'Verified template' },
                { v: 'all', l: 'All channels', d: 'Maximum reach' },
              ].map((opt) => {
                const selected = data.channel === opt.v;
                return (
                  <button key={opt.v} onClick={() => update({ channel: opt.v })} style={{
                    padding: 10, background: selected ? t.accent + '22' : t.bgCardElev,
                    border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.l}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>When to send</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { v: 'now', l: 'Send now', d: 'Goes out within 60 seconds' },
                { v: 'later', l: 'Schedule', d: 'Pick a date + time' },
              ].map((opt) => {
                const selected = data.schedule === opt.v;
                return (
                  <button key={opt.v} onClick={() => update({ schedule: opt.v })} style={{
                    padding: 12, background: selected ? t.accent + '22' : t.bgCardElev,
                    border: '1px solid ' + (selected ? t.accent : t.borderSoft),
                    borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                  }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.l}</div>
                    <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                  </button>
                );
              })}
            </div>
            {data.schedule === 'later' && (
              <div style={{ marginTop: 8 }}>
                <input type="datetime-local" value={data.scheduledAt} onChange={(e) => update({ scheduledAt: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* STEP 3 — Confirm */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted, marginBottom: 4 }}>Review and confirm. Click any section header to jump back and edit.</div>
          {[
            { label: 'Audience', step: 0, rows: [
              ['Mode', data.mode],
              ['Recipients', recipients.length + (recipients.length <= 4 ? ' · ' + recipients.map((r) => r.name).join(', ') : ' total')],
              data.mode === 'cohort' ? ['Filter', data.userType + ' · ' + data.cohortFilter.replace(/_/g, ' ')] : null,
              data.mode === 'segment' ? ['Segment', data.segment] : null,
            ].filter(Boolean) },
            { label: 'Message', step: 1, rows: [
              ['Template', data.template],
              ['Subject', data.subject || '—'],
              ['Body', data.message.slice(0, 140) + (data.message.length > 140 ? '…' : '')],
            ]},
            { label: 'Delivery', step: 2, rows: [
              ['Channel', data.channel.replace(/_/g, ' ')],
              ['When', data.schedule === 'now' ? 'Now (within 60s)' : 'Scheduled · ' + data.scheduledAt],
            ]},
          ].map((sec) => (
            <div key={sec.label} style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>{sec.label}</div>
                <button onClick={() => setStep(sec.step)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer', fontFamily: FONT_BODY }}>Edit</button>
              </div>
              {sec.rows.map(([k, v]) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '5px 0', fontSize: 11 }}>
                  <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 9 }}>{k}</span>
                  <span style={{ color: t.text, lineHeight: 1.4, wordBreak: 'break-word' }}>{v}</span>
                </div>
              ))}
            </div>
          ))}
          {recipients.length > 8 && (
            <div style={{ padding: 10, background: t.yellow + '11', border: '1px dashed ' + t.yellow + '88', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.5 }}>
              <strong style={{ color: t.yellow }}>Heads up:</strong> nudging {recipients.length} people at once. Consider scheduling for a calmer time of day or splitting the audience.
            </div>
          )}
          <div style={{ marginTop: 4, padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Communication Engine queues <strong>{recipients.length}</strong> nudge{recipients.length === 1 ? '' : 's'} on channel <strong>{data.channel.replace(/_/g, ' ')}</strong></li>
              <li>Variables ({'{{name}}'}, {'{{credits}}'}, etc.) auto-fill per recipient from their profile</li>
              <li>{data.schedule === 'now' ? 'Sends within 60 seconds' : 'Scheduled to send at ' + data.scheduledAt}</li>
              <li>Each send is rate-limited to 1 nudge / user / day to prevent spam</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the sender with full payload</li>
              <li>Recipients can unsubscribe from non-essential nudges via their notification settings</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

/* ----- FlowSendBulk — bulk message via AudienceBuilder ----- */
function FlowSendBulk({ t, ctx, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    audienceRules: [],
    channel: 'email', // 'email' | 'whatsapp' | 'in_app' | 'all'
    subject: '',
    body: '',
    schedule: 'now', // 'now' | 'later'
    scheduledAt: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'comm.send_bulk', label: 'Send bulk message', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };

  const recipients = resolveAudience(data.audienceRules, ctx.stores);

  const stepValid = () => {
    if (step === 0) return recipients.length > 0;
    if (step === 1) return data.subject && data.body && data.channel;
    if (step === 2) return data.schedule === 'now' || (data.schedule === 'later' && data.scheduledAt);
    return true;
  };

  const next = () => {
    if (step < 3) { setStep(step + 1); return; }
    // Confirm: log the bulk send + one entry per audience rule for audit
    ctx.runAction('comm.send_bulk', null, {
      recipientCount: recipients.length, channel: data.channel,
      subject: data.subject, schedule: data.schedule,
      rules: data.audienceRules.map((r) => describeAudienceRule(r)).join(' · '),
    });
    if (recipients.length <= 8) {
      // small audience: log per recipient
      recipients.forEach((r) => ctx.appendLog({ actionId: 'comm.send_bulk', label: 'Bulk message sent', target: r.name, payload: { channel: data.channel, subject: data.subject }, result: 'Completed', destructive: false }));
    } else {
      ctx.appendLog({ actionId: 'comm.send_bulk', label: 'Bulk dispatch summary', target: recipients.length + ' recipients', payload: { channel: data.channel, subject: data.subject, rules: data.audienceRules.length }, result: 'Completed', destructive: false });
    }
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };

  return (
    <FlowShell t={t}
      title="Send bulk message"
      subtitle="Compose an audience, write the message, schedule. Communication Engine handles delivery."
      icon={ICON_MAP.Megaphone}
      step={step}
      totalSteps={4}
      stepLabels={['Audience','Compose','Schedule','Confirm']}
      onClose={() => close(true)}
      onBack={() => setStep(step - 1)}
      onNext={next}
      nextLabel={step === 3 ? (data.schedule === 'now' ? 'Send to ' + recipients.length + ' now' : 'Schedule for ' + (data.scheduledAt || 'later')) : 'Continue'}
      nextDisabled={!stepValid()}
      width={780}
    >
      {/* STEP 0 — Audience */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Build the audience by combining rules. Rules are additive (OR semantics) and dedupe by user.</div>
          <AudienceBuilder t={t} ctx={ctx} value={data.audienceRules} onChange={(v) => update({ audienceRules: v })} />
        </div>
      )}

      {/* STEP 1 — Compose */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>What to send. Sending to <strong style={{ color: t.text }}>{recipients.length}</strong> recipient{recipients.length === 1 ? '' : 's'}.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Channel</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { v: 'email',    l: 'Email',    icon: '✉️' },
                { v: 'whatsapp', l: 'WhatsApp', icon: '💬' },
                { v: 'in_app',   l: 'In-app',   icon: '🔔' },
                { v: 'all',      l: 'All channels', icon: '📡' },
              ].map((opt) => (
                <button key={opt.v} onClick={() => update({ channel: opt.v })} style={{
                  padding: '10px 8px', background: data.channel === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.channel === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', fontSize: 11, color: t.text, fontWeight: data.channel === opt.v ? 700 : 500, fontFamily: FONT_BODY,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                }}>
                  <span style={{ fontSize: 14 }}>{opt.icon}</span> {opt.l}
                </button>
              ))}
            </div>
          </div>
          <FlowField t={t} label="Subject / heading" required value={data.subject} onChange={(v) => update({ subject: v })} placeholder="e.g. Cohort Alpha — week 4 recap" />
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
              Message body <span style={{ color: t.red }}>*</span>
            </label>
            <textarea rows={6} value={data.body} onChange={(e) => update({ body: e.target.value })} placeholder="Hi {{name}}, …"
              style={{ width: '100%', padding: 10, background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY, resize: 'vertical', lineHeight: 1.5 }} />
            <div style={{ fontSize: 10, color: t.textDim, marginTop: 4, fontFamily: FONT_MONO }}>{data.body.length} chars · placeholders: {'{{name}}'}, {'{{org}}'}, {'{{cohort}}'}, {'{{credits}}'}</div>
          </div>
        </div>
      )}

      {/* STEP 2 — Schedule */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>When to send.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { v: 'now',   l: 'Send now',   d: 'Dispatched immediately on confirm.' },
              { v: 'later', l: 'Schedule',   d: 'Hold for a specific datetime.' },
            ].map((opt) => (
              <button key={opt.v} onClick={() => update({ schedule: opt.v })} style={{
                padding: 12, background: data.schedule === opt.v ? t.accent + '22' : t.bgCardElev,
                border: '1px solid ' + (data.schedule === opt.v ? t.accent : t.borderSoft),
                borderRadius: 8, cursor: 'pointer', textAlign: 'left',
              }}>
                <div style={{ fontSize: 13, color: t.text, fontWeight: 600, marginBottom: 2 }}>{opt.l}</div>
                <div style={{ fontSize: 10, color: t.textMuted }}>{opt.d}</div>
              </button>
            ))}
          </div>
          {data.schedule === 'later' && (
            <div>
              <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 4 }}>Send at <span style={{ color: t.red }}>*</span></label>
              <input type="datetime-local" value={data.scheduledAt} onChange={(e) => update({ scheduledAt: e.target.value })}
                style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 13, fontFamily: FONT_BODY }} />
            </div>
          )}
        </div>
      )}

      {/* STEP 3 — Confirm */}
      {step === 3 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Review and confirm.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Audience</div>
              <button onClick={() => setStep(0)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Edit</button>
            </div>
            <div style={{ fontFamily: FONT_MONO, fontSize: 11, color: t.text }}>
              {data.audienceRules.map((r) => describeAudienceRule(r)).join(' · ') || '—'}
            </div>
            <div style={{ marginTop: 10, padding: 8, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 6, fontSize: 11, color: t.accent }}>
              Reaches <strong style={{ fontFamily: FONT_MONO, fontSize: 13 }}>{recipients.length}</strong> recipient{recipients.length === 1 ? '' : 's'}
            </div>
          </div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Message</div>
              <button onClick={() => setStep(1)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Edit</button>
            </div>
            {[
              ['Channel', data.channel.replace('_', ' ')],
              ['Subject', data.subject],
              ['Body preview', data.body.slice(0, 140) + (data.body.length > 140 ? '…' : '')],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '5px 0', fontSize: 11 }}>
                <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4, fontSize: 9 }}>{k}</span>
                <span style={{ color: t.text, lineHeight: 1.4, wordBreak: 'break-word' }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontSize: 11, color: t.text, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.6 }}>Schedule</div>
              <button onClick={() => setStep(2)} style={{ padding: '3px 10px', background: 'transparent', color: t.accent, border: '1px solid ' + t.accent + '55', borderRadius: 4, fontSize: 10, cursor: 'pointer' }}>Edit</button>
            </div>
            <div style={{ fontSize: 12, color: t.text }}>{data.schedule === 'now' ? 'Send immediately on confirm' : 'Send at ' + data.scheduledAt}</div>
          </div>
          <div style={{ marginTop: 4, padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Communication Engine dispatches via {data.channel === 'all' ? 'all channels' : data.channel} to <strong>{recipients.length}</strong> recipient{recipients.length === 1 ? '' : 's'}</li>
              <li>Audience resolves at send-time, so any users who match the rules at that moment get the message</li>
              <li>{recipients.length <= 8 ? 'Per-recipient delivery logged' : 'Bulk dispatch summary logged (audience > 8, individual entries suppressed)'}</li>
              <li>Audit log records you ({(ROLE_ARCHITECTURE.find((r) => r.key === ctx.persona) || {}).role}) as the sender with rule snapshot</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

/* ============================================================================
   FlowMenteeTopUp — purchase credit pack
   ============================================================================ */
function FlowMenteeTopUp({ t, ctx, onAfter }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    pack: null, // 0|1|2|3
    paymentMethod: 'card',
    promoCode: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'mentee.top_up', label: 'Top up credits', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };
  const packs = [
    { id: 0, credits: 10,  price: 2000,  perCredit: 200, popular: false, savings: '' },
    { id: 1, credits: 25,  price: 4500,  perCredit: 180, popular: true,  savings: 'Save 10%' },
    { id: 2, credits: 50,  price: 8500,  perCredit: 170, popular: false, savings: 'Save 15%' },
    { id: 3, credits: 100, price: 15000, perCredit: 150, popular: false, savings: 'Save 25%' },
  ];
  const selectedPack = data.pack !== null ? packs[data.pack] : null;
  const stepValid = () => {
    if (step === 0) return data.pack !== null;
    if (step === 1) return !!data.paymentMethod;
    return true;
  };
  const next = () => {
    if (step < 2) { setStep(step + 1); return; }
    // Confirm purchase
    ctx.runAction('mentee.top_up', null, { pack: selectedPack.credits + ' credits', amount: selectedPack.price, method: data.paymentMethod });
    ctx.moveCredits(selectedPack.credits, 'external', 'mentee', 'self', 'Top-up purchase · ₹' + selectedPack.price);
    ctx.showToast('+' + selectedPack.credits + ' credits added to your wallet');
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };
  return (
    <FlowShell t={t}
      title="Top up credits"
      subtitle="Add credits to your wallet. Credits never expire."
      icon={ICON_MAP.Wallet}
      step={step}
      totalSteps={3}
      stepLabels={['Pick pack','Payment','Confirm']}
      onClose={() => close(true)}
      onBack={() => { if (step === 0) close(true); else setStep(step - 1); }}
      onNext={next}
      nextLabel={step === 2 ? 'Pay ₹' + (selectedPack ? selectedPack.price.toLocaleString() : '0') : 'Continue'}
      nextDisabled={!stepValid()}
      width={680}
    >
      {/* STEP 0 — Pack picker */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>1 credit = 1 Basic-tier session. Good-tier mentors cost 2, Excellent-tier 3 credits per session.</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {packs.map((p) => (
              <button key={p.id} onClick={() => update({ pack: p.id })} style={{
                padding: 16, background: data.pack === p.id ? t.accent + '22' : t.bgCardElev,
                border: '1px solid ' + (data.pack === p.id ? t.accent : t.borderSoft),
                borderRadius: 12, cursor: 'pointer', textAlign: 'left', position: 'relative',
              }}>
                {p.popular && <span style={{ position: 'absolute', top: -8, right: 12, padding: '2px 8px', background: t.purple, color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 4, letterSpacing: 0.4 }}>POPULAR</span>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                  <div className="mu-display" style={{ fontSize: 26, color: t.text }}>{p.credits}</div>
                  <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, textTransform: 'uppercase', letterSpacing: 0.5 }}>credits</div>
                </div>
                <div style={{ fontSize: 16, color: t.accent, fontFamily: FONT_MONO, fontWeight: 700, marginBottom: 4 }}>₹{p.price.toLocaleString()}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: t.textMuted }}>
                  <span>₹{p.perCredit} / credit</span>
                  {p.savings && <span style={{ color: t.green, fontWeight: 700 }}>{p.savings}</span>}
                </div>
              </button>
            ))}
          </div>
          <FlowField t={t} label="Promo code (optional)" value={data.promoCode} onChange={(v) => update({ promoCode: v.toUpperCase() })} placeholder="e.g. WELCOME20" />
        </div>
      )}
      {/* STEP 1 — Payment method */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Payment is processed by Razorpay. We never store card details.</div>
          <div>
            <label style={{ display: 'block', fontSize: 11, color: t.textMuted, marginBottom: 6 }}>Payment method</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                { v: 'card',     l: 'Credit / debit card', d: 'Visa, Mastercard, Amex · saved on file' },
                { v: 'upi',      l: 'UPI',                 d: 'GPay, PhonePe, Paytm' },
                { v: 'netbank',  l: 'Net banking',         d: 'All major Indian banks' },
                { v: 'wallet',   l: 'Wallet',              d: 'Paytm, Mobikwik' },
              ].map((opt) => (
                <button key={opt.v} onClick={() => update({ paymentMethod: opt.v })} style={{
                  padding: 12, background: data.paymentMethod === opt.v ? t.accent + '22' : t.bgCardElev,
                  border: '1px solid ' + (data.paymentMethod === opt.v ? t.accent : t.borderSoft),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{opt.l}</div>
                  <div style={{ fontSize: 10, color: t.textMuted, marginTop: 2 }}>{opt.d}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* STEP 2 — Confirm */}
      {step === 2 && selectedPack && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Review and pay.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            {[
              ['Pack', selectedPack.credits + ' credits'],
              ['Price', '₹' + selectedPack.price.toLocaleString()],
              ['Per-credit', '₹' + selectedPack.perCredit],
              ['Payment', data.paymentMethod === 'card' ? 'Card on file' : data.paymentMethod === 'upi' ? 'UPI' : data.paymentMethod === 'netbank' ? 'Net banking' : 'Wallet'],
              ['Promo', data.promoCode || '—'],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '6px 0', borderBottom: '1px solid ' + t.borderSoft + '55', fontSize: 12 }}>
                <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{k}</span>
                <span style={{ color: t.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li>Razorpay charges your {data.paymentMethod}</li>
              <li><strong>{selectedPack.credits} credits</strong> appear in your wallet immediately</li>
              <li>Receipt + GST invoice emailed for your records</li>
              <li>Credits never expire · usable across any mentor on the platform</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

/* ============================================================================
   FlowMenteeConfirmBooking — final-step booking confirmation with credit deduction
   ============================================================================ */
function FlowMenteeConfirmBooking({ t, ctx, target, onAfter }) {
  // target carries booking context if passed: { mentor, slot, agenda, tier }
  // Defaults if invoked from the Booking Flow page directly:
  const booking = target || {
    mentor: { name: 'Naveen Sharma', tier: 'Good', rating: 4.8 },
    slot: 'Tue 24 Jun · 4:00 PM IST',
    agenda: 'Career switch from consulting → product management',
    durationMin: 45,
  };
  const creditCost = booking.mentor.tier === 'Excellent' ? 3 : booking.mentor.tier === 'Good' ? 2 : 1;
  const me = MENTEES[0];
  const balanceAfter = (me.creditsRemaining || 12) - creditCost;
  const canAfford = balanceAfter >= 0;

  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'mentee.confirm_booking', label: 'Confirm booking', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };
  const confirm = () => {
    if (!canAfford) { ctx.showToast('Not enough credits — top up first', 'warn'); return; }
    ctx.runAction('mentee.confirm_booking', null, { mentor: booking.mentor.name, slot: booking.slot, credits: creditCost });
    ctx.moveCredits(creditCost, 'mentee', 'mentor', booking.mentor.name, 'Session booking · ' + booking.slot);
    ctx.showToast('Booked · calendar invite sent');
    if (onAfter) onAfter(booking);
    ctx.setActiveAction(null);
  };

  return (
    <FlowShell t={t}
      title="Confirm booking"
      subtitle="One-click confirm. Your mentor is notified instantly."
      icon={ICON_MAP.Check}
      step={0}
      totalSteps={1}
      stepLabels={['Review & confirm']}
      onClose={() => close(true)}
      onNext={confirm}
      nextLabel={canAfford ? 'Confirm · use ' + creditCost + ' credit' + (creditCost === 1 ? '' : 's') : 'Top up to confirm'}
      nextDisabled={!canAfford}
      width={620}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* Mentor + slot summary */}
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar name={booking.mentor.name} t={t} size={48} />
          <div style={{ flex: 1 }}>
            <div className="mu-display" style={{ fontSize: 18, color: t.text }}>{booking.mentor.name}</div>
            <div style={{ fontSize: 11, color: t.textMuted, fontFamily: FONT_MONO, marginTop: 2 }}>{booking.mentor.tier} tier · ★ {booking.mentor.rating || '—'}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 22, color: t.accent, fontFamily: FONT_MONO, fontWeight: 700 }}>{creditCost}</div>
            <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, textTransform: 'uppercase', letterSpacing: 0.4 }}>credit{creditCost === 1 ? '' : 's'}</div>
          </div>
        </div>
        {/* Slot + agenda */}
        <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
          {[
            ['Slot', booking.slot],
            ['Duration', (booking.durationMin || 45) + ' minutes'],
            ['Agenda', booking.agenda],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'grid', gridTemplateColumns: '90px 1fr', gap: 10, padding: '6px 0', fontSize: 12 }}>
              <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 9 }}>{k}</span>
              <span style={{ color: t.text }}>{v}</span>
            </div>
          ))}
        </div>
        {/* Credit balance impact */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>Balance now</div>
            <div style={{ fontSize: 20, color: t.text, fontFamily: FONT_MONO, fontWeight: 700, marginTop: 4 }}>{me.creditsRemaining || 12}</div>
          </div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 8, padding: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>Cost</div>
            <div style={{ fontSize: 20, color: t.orange, fontFamily: FONT_MONO, fontWeight: 700, marginTop: 4 }}>−{creditCost}</div>
          </div>
          <div style={{ background: canAfford ? t.green + '11' : t.red + '11', border: '1px solid ' + (canAfford ? t.green + '55' : t.red), borderRadius: 8, padding: 10, textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.4 }}>After booking</div>
            <div style={{ fontSize: 20, color: canAfford ? t.green : t.red, fontFamily: FONT_MONO, fontWeight: 700, marginTop: 4 }}>{balanceAfter}</div>
          </div>
        </div>
        {!canAfford && (
          <div style={{ padding: 10, background: t.red + '11', border: '1px solid ' + t.red + '55', borderRadius: 8, fontSize: 11, color: t.red }}>
            Not enough credits. Top up before booking.
          </div>
        )}
        <div style={{ padding: 10, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
          <strong style={{ color: t.accent }}>What happens on confirm:</strong>
          <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
            <li>Calendar invite sent to both you and {booking.mentor.name.split(' ')[0]}</li>
            <li>Zoom / Meet link generated and added to invite</li>
            <li>{creditCost} credit{creditCost === 1 ? '' : 's'} held in escrow until session completes</li>
            <li>Cancellation 12+ hrs before refunds 100% · within 12 hrs no refund</li>
          </ul>
        </div>
      </div>
    </FlowShell>
  );
}

/* ============================================================================
   FlowMapMentorToOrg — pick org + scope from live store, not free-text
   ============================================================================ */
function FlowMapMentorToOrg({ t, ctx, target, onAfter }) {
  const [step, setStep] = useState(target ? 1 : 0);
  const [data, setData] = useState({
    mentorName: target ? (target.name || target.mentorName) : null,
    selectedOrgs: [],
    programmes: '',
    visibility: 'visible',
    note: '',
  });
  const update = (patch) => setData(Object.assign({}, data, patch));
  const close = (cancelled) => {
    if (cancelled) ctx.appendLog({ actionId: 'mentor.map_to_org', label: 'Map mentor to org', payload: null, result: 'Cancelled', destructive: false });
    ctx.setActiveAction(null);
  };
  const mentors = ctx.stores.mentors.slice(0, 12);
  const orgs = ctx.stores.orgs.slice(0, 14);
  const stepValid = () => {
    if (step === 0) return !!data.mentorName;
    if (step === 1) return data.selectedOrgs.length > 0;
    return true;
  };
  const next = () => {
    if (step < 2) { setStep(step + 1); return; }
    // Confirm — fire one log per (mentor, org) mapping
    ctx.runAction('mentor.map_to_org', { name: data.mentorName }, {
      mentor: data.mentorName, orgs: data.selectedOrgs, programmes: data.programmes, visibility: data.visibility,
    });
    data.selectedOrgs.forEach((org) => {
      ctx.appendLog({ actionId: 'mentor.map_to_org', label: 'Mentor mapped', target: data.mentorName + ' → ' + org, payload: { programme: data.programmes }, result: 'Completed', destructive: false });
    });
    // Mutate mentor record's mappedOrgs
    ctx.stores.mentors.forEach((m) => {
      if (m.name === data.mentorName) m.mappedOrgs = (m.mappedOrgs || []).concat(data.selectedOrgs.filter((o) => (m.mappedOrgs || []).indexOf(o) < 0));
    });
    if (onAfter) onAfter(data);
    ctx.setActiveAction(null);
  };
  const stepLabels = ['Pick mentor','Pick orgs','Confirm'];
  return (
    <FlowShell t={t}
      title="Map mentor to org"
      subtitle={data.mentorName ? 'Make ' + data.mentorName + ' available to one or more organisations.' : 'Pick the mentor first, then the orgs.'}
      icon={ICON_MAP.GitBranch}
      step={step}
      totalSteps={3}
      stepLabels={stepLabels}
      onClose={() => close(true)}
      onBack={() => { if (step === 0 || (target && step === 1)) close(true); else setStep(step - 1); }}
      onNext={next}
      nextLabel={step === 2 ? 'Map to ' + data.selectedOrgs.length + ' org' + (data.selectedOrgs.length === 1 ? '' : 's') : 'Continue'}
      nextDisabled={!stepValid()}
      width={680}
    >
      {/* STEP 0 — Pick mentor */}
      {step === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Pick which mentor to map.</div>
          <div style={{ maxHeight: 300, overflowY: 'auto' }} className="mu-scroll">
            {mentors.map((m) => {
              const isSel = data.mentorName === m.name;
              return (
                <button key={m.id} onClick={() => update({ mentorName: m.name })} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 10, marginBottom: 4,
                  background: isSel ? t.accent + '22' : 'transparent',
                  border: '1px solid ' + (isSel ? t.accent : 'transparent'),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <Avatar name={m.name} t={t} size={28} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{m.name}</div>
                    <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{m.tier} · MIS {m.mis || '—'} · {(m.mappedOrgs || []).length} mapping{(m.mappedOrgs || []).length === 1 ? '' : 's'}</div>
                  </div>
                  {isSel && <Check size={14} color={t.accent} />}
                </button>
              );
            })}
          </div>
        </div>
      )}
      {/* STEP 1 — Pick orgs */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Multi-select — mentor will be available to all picked orgs.</div>
          <div style={{ maxHeight: 260, overflowY: 'auto' }} className="mu-scroll">
            {orgs.map((o) => {
              const isSel = data.selectedOrgs.indexOf(o.name) >= 0;
              return (
                <button key={o.id} onClick={() => update({ selectedOrgs: isSel ? data.selectedOrgs.filter((x) => x !== o.name) : data.selectedOrgs.concat([o.name]) })} style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: 10, marginBottom: 4,
                  background: isSel ? t.accent + '22' : 'transparent',
                  border: '1px solid ' + (isSel ? t.accent : 'transparent'),
                  borderRadius: 8, cursor: 'pointer', textAlign: 'left',
                }}>
                  <span style={{ width: 14, height: 14, borderRadius: 3, border: '1.5px solid ' + (isSel ? t.accent : t.borderSoft), background: isSel ? t.accent : 'transparent', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {isSel && <Check size={9} color="#0a1f28" />}
                  </span>
                  <Building2 size={12} color={isSel ? t.accent : t.textMuted} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{o.name}</div>
                    <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{o.plan || 'Growth'} · {(o.mentees || 0)} mentees</div>
                  </div>
                </button>
              );
            })}
          </div>
          <FlowField t={t} label="Specific programme(s) within these orgs (optional, comma-separated)" value={data.programmes} onChange={(v) => update({ programmes: v })} placeholder="e.g. Cohort Alpha, Leadership Sprint" />
          <FlowSelectField t={t} label="Visibility within mapped orgs" value={data.visibility} onChange={(v) => update({ visibility: v })}
            options={[
              { v: 'visible', l: 'Visible — discoverable in marketplace' },
              { v: 'featured', l: 'Featured — top of mentor list for these orgs' },
              { v: 'unlisted', l: 'Unlisted — direct-link bookings only' },
            ]} />
        </div>
      )}
      {/* STEP 2 — Confirm */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 12, color: t.textMuted }}>Review and confirm.</div>
          <div style={{ background: t.bgCardElev, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 14 }}>
            {[
              ['Mentor', data.mentorName],
              ['Mapping to', data.selectedOrgs.join(', ')],
              ['Programmes', data.programmes || '—'],
              ['Visibility', data.visibility],
            ].map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10, padding: '6px 0', borderBottom: '1px solid ' + t.borderSoft + '55', fontSize: 12 }}>
                <span style={{ color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, fontSize: 10 }}>{k}</span>
                <span style={{ color: t.text }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: 12, background: t.accent + '11', border: '1px dashed ' + t.accent + '55', borderRadius: 8, fontSize: 11, color: t.text, lineHeight: 1.6 }}>
            <strong style={{ color: t.accent }}>What happens on confirm:</strong>
            <ul style={{ margin: '6px 0 0 16px', padding: 0 }}>
              <li><strong>{data.mentorName}</strong> appears in {data.selectedOrgs.length} org marketplace{data.selectedOrgs.length === 1 ? '' : 's'}</li>
              <li>Org Admins of mapped orgs are notified</li>
              <li>One audit log entry per mapping ({data.selectedOrgs.length} entries)</li>
              <li>{data.programmes ? 'Mentor scoped to programmes: ' + data.programmes : 'No programme restriction — bookable in all programmes'}</li>
            </ul>
          </div>
        </div>
      )}
    </FlowShell>
  );
}

// Specific-user picker for FlowNudgeUser — searchable list with add/remove chips
function NudgeSpecificPicker({ t, ctx, data, update }) {
  const [activeKind, setActiveKind] = useState('mentee');
  const [searchQ, setSearchQ] = useState('');

  const pool = activeKind === 'mentee' ? ctx.stores.mentees
    : activeKind === 'mentor' ? ctx.stores.mentors
    : ctx.stores.orgs;
  const q = searchQ.toLowerCase().trim();
  const matches = q
    ? pool.filter((u) => (u.name || '').toLowerCase().indexOf(q) >= 0 || (u.email || '').toLowerCase().indexOf(q) >= 0).slice(0, 12)
    : pool.slice(0, 8);

  const isSelected = (u, kind) => data.selected.some((s) => s.id === u.id && s.kind === kind);
  const toggle = (u, kind) => {
    if (isSelected(u, kind)) {
      update({ selected: data.selected.filter((s) => !(s.id === u.id && s.kind === kind)) });
    } else {
      update({ selected: data.selected.concat([{ kind: kind, id: u.id, name: u.name, email: u.email || (u.name + '@example.com') }]) });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {/* User-type tabs */}
      <div style={{ display: 'flex', gap: 6 }}>
        {[{ v: 'mentee', l: 'Mentees' },{ v: 'mentor', l: 'Mentors' },{ v: 'org', l: 'Org admins' }].map((opt) => {
          const selected = activeKind === opt.v;
          return (
            <button key={opt.v} onClick={() => setActiveKind(opt.v)} style={{
              padding: '6px 14px', background: selected ? t.accent : 'transparent',
              color: selected ? '#0a1f28' : t.textMuted,
              border: '1px solid ' + (selected ? t.accent : t.border),
              borderRadius: 999, fontSize: 11, cursor: 'pointer', fontWeight: selected ? 700 : 500, fontFamily: FONT_BODY,
            }}>{opt.l}</button>
          );
        })}
      </div>
      {/* Search */}
      <div style={{ position: 'relative' }}>
        <Search size={13} color={t.textMuted} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)' }} />
        <input value={searchQ} onChange={(e) => setSearchQ(e.target.value)} placeholder={'Search ' + activeKind + 's by name or email…'}
          style={{ width: '100%', padding: '8px 10px 8px 30px', background: t.bgInput, border: '1px solid ' + t.border, borderRadius: 8, color: t.text, fontSize: 12, fontFamily: FONT_BODY }} />
      </div>
      {/* Match list */}
      <div style={{ maxHeight: 200, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 4, padding: 4, background: t.bgCardElev, borderRadius: 8, border: '1px solid ' + t.borderSoft }} className="mu-scroll">
        {matches.length === 0 && (
          <div style={{ padding: 14, textAlign: 'center', fontSize: 11, color: t.textDim }}>No matches{searchQ ? ' for "' + searchQ + '"' : ''}.</div>
        )}
        {matches.map((u) => {
          const selected = isSelected(u, activeKind);
          return (
            <button key={u.id} onClick={() => toggle(u, activeKind)} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              background: selected ? t.accent + '22' : 'transparent', border: 'none', borderRadius: 6,
              cursor: 'pointer', textAlign: 'left',
            }} onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = t.bgInput; }}
              onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = 'transparent'; }}>
              <Avatar name={u.name} size={22} t={t} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: t.text, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                <div style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{u.email || (u.name + '@example.com')}</div>
              </div>
              {selected ? <Check size={14} color={t.accent} /> : <Plus size={12} color={t.textDim} />}
            </button>
          );
        })}
      </div>
      {/* Selected chips */}
      {data.selected.length > 0 && (
        <div>
          <div style={{ fontSize: 10, color: t.textDim, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>Selected · {data.selected.length}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {data.selected.map((s) => (
              <span key={s.kind + ':' + s.id} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px 3px 4px', background: t.accent + '22', color: t.accent, borderRadius: 999, fontSize: 11, fontWeight: 500 }}>
                <span style={{ padding: '0 4px', background: t.accent, color: '#0a1f28', borderRadius: 999, fontSize: 8, fontWeight: 700, textTransform: 'uppercase' }}>{s.kind}</span>
                {s.name}
                <button onClick={() => update({ selected: data.selected.filter((x) => !(x.id === s.id && x.kind === s.kind)) })} style={{ background: 'transparent', border: 'none', color: t.accent, cursor: 'pointer', padding: 0, marginLeft: 2, lineHeight: 0 }}><X size={11} /></button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---- Toast + Action Log Drawer ---- */

function ToastHost({ t }) {
  const ctx = React.useContext(ActionContext);
  if (!ctx || !ctx.toast) return null;
  const tone = ctx.toast.tone;
  const bg = tone === 'bad' ? t.red : tone === 'warn' ? t.yellow : tone === 'good' ? t.green : t.accent;
  const fg = tone === 'bad' || tone === 'warn' ? '#fff' : '#0a1f28';
  return (
    <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 100, background: bg, color: fg, padding: '10px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', animation: 'mu-fade-in 200ms ease', maxWidth: 360 }}>
      {ctx.toast.msg}
    </div>
  );
}

function ActionLogDrawer({ t }) {
  const ctx = React.useContext(ActionContext);
  if (!ctx) return null;
  const open = ctx.actionLogOpen;
  return (
    <>
      {/* Floating trigger always visible */}
      <button onClick={() => ctx.setActionLogOpen(true)} title="Action log" style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 70, width: 44, height: 44, borderRadius: 999, background: t.accent, color: '#0a1f28', border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <ClipboardList size={18} />
        {ctx.actionLog.length > 0 && (
          <span style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 999, background: t.red, color: '#fff', fontSize: 10, fontWeight: 700, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{ctx.actionLog.length}</span>
        )}
      </button>
      {open && (
        <div onClick={() => ctx.setActionLogOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', zIndex: 75 }}>
          <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 460, background: t.bgPanel, borderLeft: '1px solid ' + t.border, padding: 18, overflow: 'auto', display: 'flex', flexDirection: 'column' }} className="mu-scroll">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <div>
                <div className="mu-display" style={{ fontSize: 22, color: t.text }}>Action log</div>
                <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2 }}>Audit trail · session-scoped · {ctx.actionLog.length} {ctx.actionLog.length === 1 ? 'entry' : 'entries'}</div>
              </div>
              <button onClick={() => ctx.setActionLogOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={18} /></button>
            </div>
            {ctx.actionLog.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: t.textDim, gap: 10 }}>
                <ClipboardList size={32} />
                <div style={{ fontSize: 12 }}>No actions yet this session.</div>
                <div style={{ fontSize: 10, textAlign: 'center', maxWidth: 240 }}>Click any action button (Create, Add, Approve, etc.) and it will appear here with full context.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ctx.actionLog.map((e) => {
                  const a = ACTION_REGISTRY[e.actionId];
                  const Icon = a ? (ICON_MAP[a.icon] || ChevronRight) : ChevronRight;
                  const personaR = ROLE_ARCHITECTURE.find((r) => r.key === e.persona);
                  const tone = e.result === 'Cancelled' ? t.textDim : e.destructive ? t.red : t.green;
                  return (
                    <div key={e.id} style={{ display: 'flex', gap: 10, padding: 10, background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 8 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: tone + '22', color: tone, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Icon size={12} /></div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <span style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>{e.label}</span>
                          <StatusPill t={t} tone={e.result === 'Cancelled' ? 'neutral' : e.destructive ? 'bad' : 'good'}>{e.result}</StatusPill>
                        </div>
                        {e.target && <div style={{ fontSize: 10, color: t.accent, fontFamily: FONT_MONO, marginBottom: 2 }}>target: {e.target}</div>}
                        {e.payload && Object.keys(e.payload).length > 0 && (
                          <div style={{ fontSize: 10, color: t.textMuted, fontFamily: FONT_MONO, lineHeight: 1.4 }}>
                            {Object.keys(e.payload).slice(0, 3).map((k) => k + '=' + String(e.payload[k]).slice(0, 30)).join(' · ')}
                          </div>
                        )}
                        <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, marginTop: 4 }}>
                          {(personaR ? personaR.role : e.persona)} · {new Date(e.ts).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* Resolves a free-text rail label like "Create org" or "Adjust credits" into a
   canonical ACTION_REGISTRY id. Keyword-based; falls back to null if no match. */
function resolveLabelToActionId(label) {
  if (!label) return null;
  const l = label.toLowerCase();
  if (/(^|\s)(create|\+ create|new|onboard) org/.test(l)) return 'org.create';
  if (/suspend.*reactivate|suspend\s*\/\s*reactivate/.test(l) || (/^suspend\b/.test(l) && !/user|account/i.test(l))) return 'org.suspend';
  if (/^reactivate\b/.test(l) && !/user/.test(l)) return 'org.reactivate';
  if (/inspect/.test(l)) return 'org.inspect';
  if (/assign\s+admin|assign owner/.test(l)) return 'org.assign_admin';
  if (/(adjust|add|top.?up).*credit|^allocate\b/.test(l)) {
    if (/allocate/.test(l)) return 'credits.allocate';
    return 'credits.add';
  }
  if (/approve refund/.test(l)) return 'credits.refund_approve';
  if (/refund.*request|request.*refund|raise refund/.test(l)) return 'credits.refund_request';
  if (/raise invoice|create invoice|new invoice/.test(l)) return 'credits.invoice_raise';
  if (/(invite|add)\s+(user|admin|mentee)/.test(l)) return 'user.invite';
  if (/^invite\b/.test(l)) return 'user.invite';
  if (/suspend.*user|^suspend$/.test(l)) return 'user.suspend';
  if (/impersonate/.test(l)) return 'user.impersonate';
  if (/reset access/.test(l)) return 'user.reset_access';
  if (/add mentor|new mentor/.test(l)) return 'mentor.add';
  if (/approve.*onboard|approve setup|approve mentor/.test(l)) return 'mentor.approve_onboarding';
  if (/reject.*onboard|reject mentor|^reject\b/.test(l)) return 'mentor.reject_onboarding';
  if (/^map\b|map.*org|map mentor/.test(l)) return 'mentor.map_to_org';
  if (/visibility|hide.*show|show.*hide|override visibility/.test(l)) return 'mentor.set_visibility';
  if (/slot caps|set cap|adjust cap|set floor/.test(l)) return 'mentor.set_caps';
  if (/^book\b|book.*session/.test(l)) return 'session.book';
  if (/cancel.*session|^cancel\b/.test(l) && !/cancel.*request/.test(l)) return 'session.cancel';
  if (/reschedule/.test(l)) return 'session.reschedule';
  if (/raise.*ticket|new ticket|raise support/.test(l)) return 'ticket.raise';
  if (/^resolve\b/.test(l)) return 'ticket.resolve';
  if (/^escalate\b|escalate ticket/.test(l)) return 'ticket.escalate';
  if (/review escalation|escalation/.test(l)) return 'escalation.review';
  if (/^assign\b/.test(l) && !/admin|owner/.test(l)) return 'ticket.assign';
  if (/^publish\b/.test(l) && !/role|version|brand/.test(l)) return 'policy.publish';
  if (/simulate/.test(l)) return 'policy.simulate';
  if (/rollback/.test(l)) return 'policy.rollback';
  if (/request.*polic|change.*polic/.test(l)) return 'policy.request_change';
  if (/^pause\b/.test(l)) return 'controller.pause';
  if (/^resume\b/.test(l)) return 'controller.resume';
  if (/create role/.test(l)) return 'role.create';
  if (/copy role/.test(l)) return 'role.copy';
  if (/publish.*role|publish version/.test(l)) return 'role.publish';
  if (/request access|time.?box.*access/.test(l)) return 'access.request';
  if (/^approve\b/.test(l)) return 'access.approve';
  if (/^deny\b/.test(l)) return 'access.deny';
  if (/open filtered table|open filter|filtered table/.test(l)) return 'report.open_filtered';
  if (/open report|open drill|open profile|open invoice|open checklist|open settings|open journey|open rules|open full/.test(l)) return 'report.open';
  if (/^export\b/.test(l)) return 'report.export';
  if (/schedule/.test(l)) return 'report.schedule';
  if (/bulk.*comm|send.*blast|bulk message|nudge org/.test(l)) return 'comm.send_bulk';
  if (/^nudge\b/.test(l)) return 'comm.nudge';
  if (/save mentor/.test(l)) return 'mentee.save_mentor';
  if (/add milestone|add reflection/.test(l)) return 'mentee.add_milestone';
  // Settings / profile saves
  if (/save (org )?profile|save changes/.test(l)) return 'profile.save';
  if (/upload photo|upload picture|change photo/.test(l)) return 'profile.upload_photo';
  if (/save preferences|save notif/.test(l)) return 'preferences.save';
  if (/save branding|publish branding|update branding/.test(l)) return 'org.save_branding';
  if (/save polic/.test(l)) return 'org.save_policies';
  if (/save guardrail|save spend cap/.test(l)) return 'org.save_guardrails';
  if (/^save\b/.test(l) && !/search/.test(l)) return 'profile.save'; // generic Save
  // Programmes
  if (/create programme|create cohort|new programme|new cohort|add programme/.test(l)) return 'programme.create';
  if (/edit programme|edit cohort/.test(l)) return 'programme.edit';
  // Pipeline
  if (/^approve\b/.test(l) && /(pipeline|onboarding|application)/.test(l)) return 'pipeline.approve';
  // Sessions inline
  if (/block slot|^block\b/.test(l)) return 'session.block_slot';
  if (/join session|join now|join meeting/.test(l)) return 'session.join';
  if (/confirm booking/.test(l)) return 'mentee.confirm_booking';
  if (/top.?up|buy credit|purchase credit/.test(l)) return 'mentee.top_up';
  if (/share report|share insight/.test(l)) return 'report.share';
  // Chatbot
  if (/(open|start) chatbot|chatbot help|ask chatbot/.test(l)) return 'chatbot.open';

  // ----------------------------------------------------------------------
  // GENERIC VERB FALLTHROUGHS — match any rail label by leading verb
  // These catch the long tail of "Open programme", "Edit milestone",
  // "Clone cohort", "Notify lead" etc. that don't have specific actions.
  // Order matters: more-specific patterns should be above this section.
  // ----------------------------------------------------------------------
  if (/^clone\b|^duplicate\b/.test(l)) return 'generic.clone';
  if (/^compare\b/.test(l)) return 'generic.compare';
  if (/^acknowledge\b|^ack\b|^mark (paid|blocker|false positive|highlight)\b|^tag highlight\b/.test(l)) return 'generic.acknowledge';
  if (/^notify\b/.test(l)) return 'generic.notify';
  if (/^pin\b|^feature\b|featured mentor|^pin entry|pin featured/.test(l)) return 'generic.feature';
  if (/^override\b/.test(l)) return 'generic.override';
  if (/^send reminder\b|send reminder|^send if allowed\b|send.*reminder/.test(l)) return 'generic.send_reminder';
  if (/^retry\b|re-?run|re-?trigger|retry job|retry payment|retry webhook/.test(l)) return 'generic.retry';
  if (/^preview\b/.test(l)) return 'generic.preview';
  if (/^flag\b/.test(l)) return 'generic.flag';
  if (/^archive\b/.test(l)) return 'generic.archive';
  if (/^publish\b/.test(l)) return 'generic.publish';
  if (/^take over\b|^takeover\b|^take action\b/.test(l)) return 'generic.takeover';
  if (/^reverse\b|reverse\/freeze|^freeze\b/.test(l)) return 'generic.reverse';
  if (/^send test\b|^test\b/.test(l)) return 'generic.test';
  if (/^edit\b/.test(l)) return 'generic.edit'; // catches Edit profile, Edit milestone, Edit logic, Edit access, Edit rate, etc.
  if (/^open\b/.test(l)) return 'generic.open'; // catches Open programme, Open cohort, Open user, Open MIS-lite, Open case, Open history, Open incident, Open logs, Open payout table, Open detailed trends, Open journey, Open cohort drill-down, etc.

  return null;
}

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [persona, setPersona] = useState('super_admin');
  const [module, setModule] = useState('overview');
  const [tab, setTab] = useState('executive');
  const [drillRow, setDrillRow] = useState(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [modal, setModal] = useState(null);
  const [filterValues, setFilterValues] = useState({});
  const [toast, setToast] = useState(null);
  const [iaMapOpen, setIaMapOpen] = useState(false);

  const t = THEME[theme];
  // Persona-aware IA: SA uses IA, OA uses ORG_ADMIN_IA, Sub-Admin uses SUB_ADMIN_IA, Mentor uses MENTOR_IA, Mentee uses MENTEE_IA
  const activeIA = persona === 'org_admin' ? ORG_ADMIN_IA
    : persona === 'sub_admin' ? SUB_ADMIN_IA
    : persona === 'mentor' ? MENTOR_IA
    : persona === 'mentee' ? MENTEE_IA
    : IA;
  const moduleConf = activeIA.find((m) => m.key === module) || activeIA[0];
  const tabConf = moduleConf.tabs.find((x) => x.key === tab) || moduleConf.tabs[0];

  // when module changes, default to its first tab
  useEffect(() => {
    const m = activeIA.find((m) => m.key === module);
    if (m && !m.tabs.find((x) => x.key === tab)) {
      setTab(m.tabs[0].key);
    }
  }, [module, persona]);

  // when persona changes, reset to first module/tab of that persona's IA
  useEffect(() => {
    if (persona === 'super_admin') { setModule('overview'); setTab('executive'); }
    else if (persona === 'org_admin') { setModule('overview'); setTab('health'); }
    else if (persona === 'sub_admin') { setModule('overview'); setTab('pulse'); }
    else if (persona === 'mentor') { setModule('home'); setTab('today'); }
    else if (persona === 'mentee') { setModule('home'); setTab('next'); }
  }, [persona]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleAction = (label) => {
    if (label === 'Onboard Organization' || label === 'Create Organization' || label === 'Create Org' || label === '+ Create Org') {
      setModal({ type: 'confirm', title: 'Onboard new organization', body: 'This will start the organization onboarding flow. The org admin will receive an invite email.', confirmLabel: 'Start onboarding', danger: false, onConfirm: () => { setModal(null); showToast('Organization onboarding started'); } });
      return;
    }
    if (label.toLowerCase().includes('suspend')) {
      setModal({ type: 'confirm', title: 'Suspend account', body: 'This will pause access for the selected entity. All sessions will end and bookings will be frozen until reactivated.', confirmLabel: 'Suspend', danger: true, onConfirm: () => { setModal(null); showToast('Account suspended'); } });
      return;
    }
    if (label.toLowerCase().includes('export')) {
      showToast('Export queued — you will get an email when ready');
      return;
    }
    showToast('Action: ' + label);
  };

  const handleFilters = () => setFilterOpen(true);
  const handleSaveSearch = () => setSaveSearchOpen(true);

  // tabSpec: lookup is persona-aware
  const tabSpec = persona === 'org_admin' ? getOrgAdminTabSpec(module, tab)
    : persona === 'sub_admin' ? getSubAdminTabSpec(module, tab)
    : persona === 'mentor' ? getMentorTabSpec(module, tab)
    : persona === 'mentee' ? getMenteeTabSpec(module, tab)
    : getTabSpec(module, tab);
  const filters = (tabConf.config && tabConf.config.filters) || ['Status','Owner','Date'];
  const railItems = (tabSpec && tabSpec.rail) || (tabConf.config && tabConf.config.rail) || ['Action 1','Action 2','Action 3'];

  // All personas now get the full sidebar+tabs chrome.
  const isFullChrome = true;
  const inPersonaPreview = persona !== 'super_admin';
  const personaConf = ROLE_ARCHITECTURE.find((r) => r.key === persona);
  const orgName = (persona === 'org_admin' || persona === 'sub_admin') ? 'IIM Bengaluru' : null;
  const scopeLabel = persona === 'sub_admin' ? 'Cohort Alpha + Leadership Sprint' : orgName;

  // Action engine — runtime for ACTION_REGISTRY (mutations + log + toast + bespoke flows)
  const actionEngine = useActionEngine(persona);

  // Register the navigator so flows can navigate to a tab with pre-set filters
  actionEngine.navigatorRef.current = (target) => {
    if (target.module) setModule(target.module);
    if (target.tab) setTab(target.tab);
    if (target.filters) setFilterValues(target.filters);
  };

  return (
    <ActionContext.Provider value={actionEngine}>
    <div className="mu-app" style={{ minHeight: '100vh', background: t.bg, color: t.text, display: 'flex', overflow: 'hidden' }}>
      <FontStyles />
      {isFullChrome && (
        <Sidebar
          t={t} currentModule={module} onSelectModule={setModule}
          collapsed={collapsed} onToggleCollapse={() => setCollapsed(!collapsed)}
          ia={activeIA}
          brandSubLabel={
            persona === 'sub_admin' ? 'Sub-admin · ' + orgName
            : persona === 'org_admin' ? orgName
            : persona === 'mentor' ? 'Mentor'
            : persona === 'mentee' ? 'Mentee · ' + (orgName || 'IIM Bengaluru')
            : null
          }
        />
      )}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header t={t} currentTabLabel={tabConf.label} theme={theme} onToggleTheme={() => setTheme(theme === 'dark' ? 'light' : 'dark')} persona={persona} onChangePersona={setPersona} />
        {inPersonaPreview && <PersonaBanner persona={persona} onReturn={() => setPersona('super_admin')} t={t} />}
        {isFullChrome && <SecondaryTabs t={t} module={module} currentTab={tab} onSelectTab={setTab} ia={activeIA} />}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <div className="mu-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 24px 40px', minWidth: 0 }}>
            {(
              <>
                {/* Action rail (hidden on Executive Summary; that page has its own composition) */}
                {tabConf.archetype !== 'executive' && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16, gap: 16 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: t.textMuted, marginBottom: 4 }}>
                        {persona === 'org_admin' && <span style={{ color: t.accent, fontWeight: 600 }}>Org Admin</span>}
                        {persona === 'sub_admin' && <span style={{ color: t.accent, fontWeight: 600 }}>Sub-Admin</span>}
                        {persona === 'mentor' && <span style={{ color: t.accent, fontWeight: 600 }}>Mentor</span>}
                        {persona === 'mentee' && <span style={{ color: t.accent, fontWeight: 600 }}>Mentee</span>}
                        {(persona === 'org_admin' || persona === 'sub_admin' || persona === 'mentor' || persona === 'mentee') && <ChevronRight size={10} />}
                        <span>{moduleConf.label}</span>
                        <ChevronRight size={10} />
                        <span style={{ color: t.text }}>{tabConf.label}</span>
                      </div>
                      <h1 className="mu-display" style={{ fontSize: 30, color: t.text, margin: 0, lineHeight: 1.1 }}>
                        {persona === 'org_admin' && tabConf.archetype === 'oa_overview' ? 'Org Admin Control Suite'
                          : persona === 'sub_admin' && tabConf.archetype === 'sa_pulse' ? 'My workbench'
                          : persona === 'mentor' && tabConf.archetype === 'm_today' ? 'My mentorship'
                          : persona === 'mentee' && tabConf.archetype === 'me_next' ? 'Hi Aarav 👋'
                          : tabConf.label}
                      </h1>
                      {tabSpec && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: 12, color: t.textMuted, lineHeight: 1.5 }}>{tabSpec.what}</span>
                          {(persona === 'org_admin' || persona === 'sub_admin') && <ScopeChip label={scopeLabel} t={t} />}
                          <span title={'Default widgets: ' + tabSpec.widgets} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9, color: t.textDim, fontFamily: FONT_MONO, padding: '2px 6px', background: t.bgInput, border: '1px solid ' + t.borderSoft, borderRadius: 4, cursor: 'help' }}>
                            <Info size={9} /> widgets
                          </span>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                      {(() => {
                        const renderedActionIds = [];
                        const railButtons = railItems.slice(0, 3).map((label, i) => {
                          // Resolve rail label → action registry id
                          const aid = resolveLabelToActionId(label);
                          if (aid && actionEngine.canDo(aid)) {
                            renderedActionIds.push(aid);
                            return <ActionButton key={i} actionId={aid} t={t} primary={i === 0} soft={i !== 0} customLabel={label} target={{ contextLabel: label }} />;
                          }
                          // If the label resolved to an action but persona can't do it → hide entirely (Strict)
                          if (aid && !actionEngine.canDo(aid)) return null;
                          // Unmapped: heuristic gating before showing fallback
                          if (isAdminVerb(label) && (persona === 'mentor' || persona === 'mentee')) return null;
                          if (isPlatformOnlyVerb(label) && persona !== 'super_admin') return null;
                          // Fallback for unmapped labels: orange request CTA for OA/SA/Mentee on request/raise/escalate verbs
                          if ((persona === 'org_admin' || persona === 'sub_admin' || persona === 'mentee') && /request|raise|escalate/i.test(label)) {
                            return (
                              <button key={i} onClick={() => actionEngine.setActiveAction({ actionId: 'access.request', target: { name: label, contextLabel: label } })} style={{
                                padding: '8px 14px', background: t.orange + '22', color: t.orange,
                                border: '1px solid ' + t.orange, borderRadius: 8, fontSize: 12,
                                cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6, fontWeight: 600,
                              }}><Send size={12} /> {label}</button>
                            );
                          }
                          // Generic decorative fallback — toast + log so even unmapped buttons feel responsive
                          return <IconButton key={i} t={t} icon={i === 0 ? Plus : i === 1 ? Edit3 : Send} soft={i !== 0} primary={i === 0} label={label} onClick={() => { actionEngine.appendLog({ actionId: 'misc.' + label.toLowerCase().replace(/\s+/g,'_'), label: label, payload: null, result: 'Completed', destructive: /suspend|delete|remove|reject|deny/i.test(label) }); actionEngine.showToast(label + ' · done'); }} />;
                        }).filter(Boolean);
                        const exportAlreadyRendered = renderedActionIds.indexOf('report.export') >= 0;
                        return (
                          <>
                            {railButtons}
                            <IconButton t={t} icon={Filter} soft label="Filters" onClick={handleFilters} />
                            <SavedSearchesPicker t={t} scope={tab} onApply={(s) => { setFilterValues(s.filters || {}); actionEngine.appendLog({ actionId: 'search.apply', label: 'Apply saved search', target: s.name, payload: { filters: s.filters }, result: 'Completed', destructive: false }); actionEngine.showToast('Applied · ' + s.name); }} />
                            <IconButton t={t} icon={Bookmark} soft label="Save Search" onClick={handleSaveSearch} />
                            {!exportAlreadyRendered && (
                              actionEngine.canDo('report.export')
                                ? <ActionButton actionId="report.export" t={t} soft />
                                : <IconButton t={t} icon={Download} soft label="Export" onClick={() => { actionEngine.appendLog({ actionId: 'report.export', label: 'Export', payload: null, result: 'Completed', destructive: false }); actionEngine.showToast('Export queued'); }} />
                            )}
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
                {persona === 'super_admin' ? <PageRouter tabConfig={tabConf} t={t} openDrillFor={(row) => setDrillRow(row)} onAction={handleAction} />
                  : persona === 'org_admin' ? <OrgAdminPageRouter moduleKey={module} tabKey={tab} t={t} openDrillFor={(row) => setDrillRow(row)} />
                  : persona === 'sub_admin' ? <SubAdminPageRouter moduleKey={module} tabKey={tab} t={t} openDrillFor={(row) => setDrillRow(row)} />
                  : persona === 'mentor' ? <MentorPageRouter moduleKey={module} tabKey={tab} t={t} openDrillFor={(row) => setDrillRow(row)} />
                  : <MenteePageRouter moduleKey={module} tabKey={tab} t={t} />
                }
              </>
            )}
            <div style={{ marginTop: 32, padding: '16px 0', fontSize: 10, color: t.textDim, fontFamily: FONT_MONO, borderTop: '1px solid ' + t.borderSoft, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>MentorUnion · {persona === 'org_admin' ? 'Org Admin v2.0' : persona === 'sub_admin' ? 'Sub-Admin v2.0' : persona === 'mentor' ? 'Mentor v2.0' : persona === 'mentee' ? 'Mentee v2.0' : (inPersonaPreview ? personaConf.role + ' preview' : 'Super Admin v2.0')}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {persona === 'super_admin' && (
                  <button onClick={() => setIaMapOpen(true)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer', fontFamily: FONT_MONO, fontSize: 10, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <Workflow size={11} /> IA Map
                  </button>
                )}
                <span>{actionEngine.dbStatus === 'connected' ? '● MongoDB connected' : actionEngine.dbStatus === 'offline' ? '○ DB offline (using seed data)' : '… connecting to DB'} · IST 14:32</span>
              </div>
            </div>
          </div>
          {/* Right action panels: Super Admin executive uses ActionCenter; Org Admin overview uses OrgAdminActionPanel */}
          {persona === 'super_admin' && module === 'overview' && tab === 'executive' && (
            <ActionCenter t={t} onAction={handleAction} />
          )}
          {persona === 'org_admin' && module === 'overview' && (
            <OrgAdminActionPanel t={t} />
          )}
        </div>
      </div>

      <DrillDrawer row={drillRow} onClose={() => setDrillRow(null)} t={t} kind={tabConf.label} drawerHint={tabSpec ? tabSpec.drawerHint : null} />
      <FilterPanel
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        t={t}
        filters={filters}
        values={filterValues}
        onChange={(k, v) => setFilterValues({ ...filterValues, [k]: v })}
        onApply={() => { setFilterOpen(false); showToast('Filters applied'); }}
        onReset={() => { setFilterValues({}); }}
      />
      <SaveSearchModal
        open={saveSearchOpen}
        onClose={() => setSaveSearchOpen(false)}
        t={t}
        scope={tab}
        currentFilters={filterValues}
      />
      {modal && modal.type === 'confirm' && (
        <ConfirmModal
          open={true}
          title={modal.title}
          body={modal.body}
          danger={modal.danger}
          onClose={() => setModal(null)}
          onConfirm={modal.onConfirm}
          t={t}
        />
      )}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 100, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 999, padding: '10px 18px', color: t.text, fontSize: 13, boxShadow: '0 8px 28px rgba(0,0,0,0.4)', display: 'inline-flex', alignItems: 'center', gap: 8, animation: 'mu-fade-in 220ms ease' }}>
          <CheckCircle2 size={14} color={t.accent} /> {toast}
        </div>
      )}
      <ChatbotWidget t={t} />
      {iaMapOpen && <IAMapModal t={t} onClose={() => setIaMapOpen(false)} onJump={(mk, tk) => { setModule(mk); setTab(tk); setIaMapOpen(false); }} />}
      {/* Action infrastructure overlays */}
      <ActionModal t={t} />
      <ToastHost t={t} />
      <ActionLogDrawer t={t} />
    </div>
    </ActionContext.Provider>
  );
}

function IAMapModal({ t, onClose, onJump }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 95, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 30 }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: '100%', maxWidth: 1200, maxHeight: '92vh', overflow: 'hidden',
        background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14,
        display: 'flex', flexDirection: 'column', animation: 'mu-fade-in 220ms ease',
      }}>
        <div style={{ padding: 20, borderBottom: '1px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div className="mu-display" style={{ fontSize: 26, color: t.text }}>Super Admin Information Architecture</div>
            <div style={{ fontSize: 12, color: t.textMuted, marginTop: 4 }}>8 modules · 40 tabs · primary nav locked. Click any tab to jump.</div>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={20} /></button>
        </div>
        <div className="mu-scroll" style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
          {IA.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <div key={mod.key} style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: t.accent + '22', color: t.accent, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}><ModIcon size={16} /></div>
                  <div className="mu-display" style={{ fontSize: 18, color: t.text }}>{mod.label}</div>
                  <span style={{ fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>{mod.tabs.length} tabs</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 8 }}>
                  {mod.tabs.map((tb) => {
                    const spec = TAB_SPEC[mod.key + ':' + tb.key];
                    return (
                      <div key={tb.key} onClick={() => onJump(mod.key, tb.key)} style={{
                        background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 10,
                        padding: 12, cursor: 'pointer', transition: 'all 150ms',
                      }}
                        onMouseEnter={(e) => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.background = t.bgCardElev; }}
                        onMouseLeave={(e) => { e.currentTarget.style.borderColor = t.borderSoft; e.currentTarget.style.background = t.bgCard; }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                          <span style={{ fontSize: 13, color: t.text, fontWeight: 600 }}>{tb.label}</span>
                          <ArrowUpRight size={12} color={t.textDim} />
                        </div>
                        {spec && <div style={{ fontSize: 11, color: t.textMuted, marginBottom: 8 }}>{spec.what}</div>}
                        {spec && (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 10, color: t.textDim, fontFamily: FONT_MONO }}>
                            <div><span style={{ color: t.accent }}>widgets:</span> {spec.widgets}</div>
                            <div><span style={{ color: t.purple }}>rail:</span> {spec.rail.join(' · ')}</div>
                            <div><span style={{ color: t.blue }}>drill:</span> {spec.drawerHint}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ChatbotWidget({ t }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState('greeting');
  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={{
        position: 'fixed', bottom: 24, right: 24, zIndex: 90,
        width: 52, height: 52, borderRadius: 999, border: 'none', cursor: 'pointer',
        background: 'linear-gradient(135deg, ' + t.accent + ' 0%, ' + t.blue + ' 100%)',
        color: '#0a1f28', display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 10px 28px ' + t.accent + '55',
      }}>
        <MessageSquare size={20} />
      </button>
    );
  }
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 90,
      width: 320, background: t.bgPanel, border: '1px solid ' + t.border, borderRadius: 14,
      boxShadow: '0 16px 48px rgba(0,0,0,0.45)', overflow: 'hidden',
      animation: 'mu-fade-in 200ms ease',
    }}>
      <div style={{ padding: '12px 14px', borderBottom: '1px solid ' + t.border, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: 'linear-gradient(135deg, ' + t.accent + ', ' + t.blue + ')', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#0a1f28' }}><Sparkles size={13} /></div>
          <div>
            <div style={{ fontSize: 12, color: t.text, fontWeight: 600 }}>Mentora · Help</div>
            <div style={{ fontSize: 9, color: t.textDim, fontFamily: FONT_MONO }}>Chatbot Router · escalates if confidence &lt; 60%</div>
          </div>
        </div>
        <button onClick={() => setOpen(false)} style={{ background: 'transparent', border: 'none', color: t.textMuted, cursor: 'pointer' }}><X size={14} /></button>
      </div>
      <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10, minHeight: 220, maxHeight: 360, overflowY: 'auto' }} className="mu-scroll">
        <div style={{ background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 10, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
          Hey — I can answer questions about <em>credits, policies, escalations, RBAC,</em> and platform automations. Ask anything, or pick a quick option.
        </div>
        {step === 'greeting' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {['Why was a refund denied?','Show top exceptions today','How do I time-box access?','Hand me to a human agent'].map((q, i) => (
              <button key={i} onClick={() => setStep(i === 3 ? 'human' : 'answer')} style={{ textAlign: 'left', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, color: t.text, borderRadius: 8, fontSize: 12, cursor: 'pointer', fontFamily: FONT_BODY }}>
                {q}
              </button>
            ))}
          </div>
        )}
        {step === 'answer' && (
          <div style={{ background: t.bgCard, border: '1px solid ' + t.borderSoft, borderRadius: 10, padding: 10, fontSize: 12, color: t.text, lineHeight: 1.5 }}>
            Refund denials are governed by <strong>Refund Policy v3.2</strong>. The most common reasons are: outside cancellation window, repeat-offender flag, or org-level exception. Want the audit trail for a specific case, or shall I escalate?
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              <button onClick={() => setStep('human')} style={{ padding: '6px 10px', background: t.accent, color: '#0a1f28', border: 'none', borderRadius: 6, fontSize: 11, cursor: 'pointer', fontWeight: 600 }}>Hand to human</button>
              <button onClick={() => setStep('greeting')} style={{ padding: '6px 10px', background: 'transparent', color: t.textMuted, border: '1px solid ' + t.border, borderRadius: 6, fontSize: 11, cursor: 'pointer' }}>Back</button>
            </div>
          </div>
        )}
        {step === 'human' && (
          <div style={{ background: t.yellowSoft + '44', border: '1px dashed ' + t.yellow, borderRadius: 10, padding: 10, fontSize: 12, color: t.text }}>
            Escalating with full transcript and intent confidence to <strong>L2 Support</strong>. ETA 4–6 minutes.
          </div>
        )}
      </div>
      <div style={{ padding: 10, borderTop: '1px solid ' + t.border }}>
        <input placeholder="Ask anything..." style={{ width: '100%', padding: '8px 10px', background: t.bgInput, border: '1px solid ' + t.border, color: t.text, borderRadius: 8, fontSize: 12, fontFamily: FONT_BODY }} />
      </div>
    </div>
  );
}

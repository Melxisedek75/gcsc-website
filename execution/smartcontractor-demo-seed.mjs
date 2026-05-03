const baseUrl = process.env.SMARTCONTRACTOR_BASE_URL || 'http://localhost:3002';
const stamp = Date.now();

async function api(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const body = await response.json();
  if (!response.ok) {
    throw new Error(`${path}: ${body.error || response.statusText}`);
  }
  return body;
}

async function post(path, body) {
  return api(path, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

const ownerProfile = await post('/api/smartcontractor/profiles', {
  role: 'homeowner',
  email: `demo-owner+${stamp}@xprnet.org`,
  full_name: 'Demo Homeowner',
  xpr_account: `owner${String(stamp).slice(-6)}`,
});

const homeowner = await post('/api/smartcontractor/homeowners', {
  profile_id: ownerProfile.profile.id,
  display_name: 'Demo Homeowner',
  default_zip: '98101',
  subscription_tier: 'basic',
});

const job = await post('/api/smartcontractor/jobs', {
  homeowner_id: homeowner.homeowner.id,
  title: `Demo kitchen remodel ${stamp}`,
  description: 'Demo path: homeowner creates a kitchen remodel job for contractor bidding, loan, repayment, and dispute review.',
  trade: 'remodeling',
  location_city: 'Seattle',
  location_state: 'WA',
  location_zip: '98101',
  budget_min_usd: 5000,
  budget_max_usd: 12000,
});

const contractorProfile = await post('/api/smartcontractor/profiles', {
  role: 'contractor',
  email: `demo-contractor+${stamp}@xprnet.org`,
  full_name: 'Demo Construction LLC',
  xpr_account: `builder${String(stamp).slice(-6)}`,
});

const contractor = await post('/api/smartcontractor/contractors', {
  profile_id: contractorProfile.profile.id,
  business_name: 'Demo Construction LLC',
  ein: '88-1234567',
  license_number: 'DEMO123',
  license_state: 'WA',
  insurance_status: 'pending',
});

const bid = await post('/api/smartcontractor/bids', {
  job_id: job.job.id,
  contractor_id: contractor.contractor.id,
  amount_usd: 9800,
  timeline_days: 21,
  message: 'Licensed contractor available for this scope. Demo bid for SmartContractor MVP.',
});

const loan = await post('/api/smartcontractor/loans', {
  contractor_id: contractor.contractor.id,
  job_id: job.job.id,
  principal_usd: 3500,
  apr_percent: 2,
  risk_score: 87,
  purpose: 'Demo starter loan: materials and labor mobilization before first milestone payment.',
});

const repayment = await post(`/api/smartcontractor/loans/${loan.loan.id}/repayments`, {
  amount_usd: 1000,
  source: 'milestone_payment',
  payment_tx_hash: `demo-milestone-${stamp}`,
});

const dispute = await post('/api/smartcontractor/disputes', {
  job_id: job.job.id,
  homeowner_id: homeowner.homeowner.id,
  contractor_id: contractor.contractor.id,
  opened_by_role: 'homeowner',
  title: 'Demo milestone quality review',
  description: 'Homeowner requests peer contractor review before releasing the next milestone payment.',
});

const evidence = await post(`/api/smartcontractor/disputes/${dispute.dispute.id}/evidence`, {
  uploaded_by_profile_id: ownerProfile.profile.id,
  evidence_type: 'photo',
  evidence_url: 'https://xprnet.org/example-evidence-photo.jpg',
  notes: 'Demo evidence metadata for milestone review.',
});

const review = await post(`/api/smartcontractor/disputes/${dispute.dispute.id}/reviews`, {
  reviewer_contractor_id: contractor.contractor.id,
  review_type: 'remote',
  quality_score: 74,
  finding: 'Demo peer review: remote evidence suggests minor rework before full payment release.',
  recommendation: 'request_rework',
  token_reward_amount: 25,
  rating_points_awarded: 1,
  loan_score_points: 1,
});

console.log(JSON.stringify({
  baseUrl,
  homeowner_id: homeowner.homeowner.id,
  contractor_id: contractor.contractor.id,
  job_id: job.job.id,
  bid_id: bid.bid.id,
  loan_id: loan.loan.id,
  repayment_id: repayment.repayment.id,
  loan_status: repayment.loan.status,
  loan_outstanding_usd: repayment.loan.outstanding_usd,
  dispute_id: dispute.dispute.id,
  evidence_id: evidence.evidence.id,
  peer_review_id: review.review.id,
}, null, 2));

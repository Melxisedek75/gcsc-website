export type JobStatus = 'open' | 'bidding' | 'in_progress' | 'milestone_review' | 'completed';

export interface Job {
  id: string;
  title: string;
  location: string;
  budget: string;
  postedAgo: string;
  status: JobStatus;
  bids: number;
  description: string;
  category: string;
}

export interface Contractor {
  id: string;
  name: string;
  company: string;
  rating: number;
  jobs: number;
  yearsActive: number;
  verified: boolean;
  trades: string[];
  avatarColor: string;
}

export interface Bid {
  id: string;
  jobId: string;
  jobTitle: string;
  amount: string;
  timeline: string;
  status: 'submitted' | 'shortlisted' | 'won' | 'lost';
  submittedAgo: string;
}

export interface Milestone {
  id: string;
  jobTitle: string;
  step: string;
  percent: number;
  amount: string;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  photoCount: number;
}

export interface ChatThread {
  id: string;
  counterparty: string;
  jobTitle: string;
  lastMessage: string;
  lastAgo: string;
  unread: number;
}

export const mockJobs: Job[] = [
  {
    id: 'j-1',
    title: 'Bathroom remodel — second floor',
    location: 'Seattle, WA · 98103',
    budget: '$8,500 – $12,000',
    postedAgo: '2h',
    status: 'open',
    bids: 4,
    description: 'Full gut: tile, vanity, fixtures, lighting. Permits already pulled.',
    category: 'Renovation',
  },
  {
    id: 'j-2',
    title: 'Deck rebuild + composite boards',
    location: 'Bellevue, WA · 98004',
    budget: '$14,000 – $18,000',
    postedAgo: '5h',
    status: 'bidding',
    bids: 7,
    description: '320 sq ft deck, replace structure + Trex top.',
    category: 'Exterior',
  },
  {
    id: 'j-3',
    title: 'Kitchen cabinet refresh',
    location: 'Tacoma, WA · 98402',
    budget: '$4,200 – $6,000',
    postedAgo: '1d',
    status: 'in_progress',
    bids: 3,
    description: 'Refinish + new hardware, no structural change.',
    category: 'Renovation',
  },
  {
    id: 'j-4',
    title: 'Roof patch — leak above garage',
    location: 'Renton, WA · 98058',
    budget: '$1,200 – $2,500',
    postedAgo: '3d',
    status: 'milestone_review',
    bids: 2,
    description: 'Visible water damage after last storm. Asphalt shingle.',
    category: 'Repair',
  },
];

export const mockContractors: Contractor[] = [
  {
    id: 'c-1',
    name: 'Marcus Reilly',
    company: 'Reilly Build Co.',
    rating: 4.9,
    jobs: 127,
    yearsActive: 11,
    verified: true,
    trades: ['General', 'Renovation', 'Tile'],
    avatarColor: '#FF7A1A',
  },
  {
    id: 'c-2',
    name: 'Diana Cho',
    company: 'Cho Carpentry',
    rating: 4.8,
    jobs: 64,
    yearsActive: 7,
    verified: true,
    trades: ['Carpentry', 'Decks'],
    avatarColor: '#3DD9A6',
  },
  {
    id: 'c-3',
    name: 'Jared Vega',
    company: 'Vega Trades LLC',
    rating: 4.6,
    jobs: 41,
    yearsActive: 4,
    verified: false,
    trades: ['Plumbing', 'Roofing'],
    avatarColor: '#5B8DEF',
  },
];

export const mockBids: Bid[] = [
  { id: 'b-1', jobId: 'j-1', jobTitle: 'Bathroom remodel — second floor', amount: '$10,400', timeline: '14 days', status: 'shortlisted', submittedAgo: '1h' },
  { id: 'b-2', jobId: 'j-2', jobTitle: 'Deck rebuild + composite boards', amount: '$15,800', timeline: '9 days', status: 'submitted', submittedAgo: '4h' },
  { id: 'b-3', jobId: 'j-4', jobTitle: 'Roof patch — leak above garage', amount: '$1,950', timeline: '2 days', status: 'won', submittedAgo: '2d' },
];

export const mockMilestones: Milestone[] = [
  { id: 'm-1', jobTitle: 'Kitchen cabinet refresh', step: 'Demolition complete', percent: 25, amount: '$1,200', status: 'approved', photoCount: 6 },
  { id: 'm-2', jobTitle: 'Kitchen cabinet refresh', step: 'Refinish + prime', percent: 50, amount: '$1,500', status: 'submitted', photoCount: 8 },
  { id: 'm-3', jobTitle: 'Roof patch — leak above garage', step: 'Final inspection', percent: 100, amount: '$1,950', status: 'pending', photoCount: 0 },
];

export const mockThreads: ChatThread[] = [
  { id: 't-1', counterparty: 'Marcus Reilly', jobTitle: 'Bathroom remodel', lastMessage: 'Tile sample uploaded — take a look.', lastAgo: '12m', unread: 2 },
  { id: 't-2', counterparty: 'Diana Cho', jobTitle: 'Deck rebuild', lastMessage: 'Material list attached.', lastAgo: '1h', unread: 0 },
  { id: 't-3', counterparty: 'Jared Vega', jobTitle: 'Roof patch', lastMessage: 'Done — proof photos in.', lastAgo: 'yesterday', unread: 1 },
];

export const statusLabel: Record<JobStatus, string> = {
  open: 'Open for bids',
  bidding: 'Reviewing bids',
  in_progress: 'In progress',
  milestone_review: 'Milestone review',
  completed: 'Completed',
};

export const statusColor: Record<JobStatus, string> = {
  open: '#3DD9A6',
  bidding: '#FFB020',
  in_progress: '#5B8DEF',
  milestone_review: '#FF7A1A',
  completed: '#8A94A8',
};

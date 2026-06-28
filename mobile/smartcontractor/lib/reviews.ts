// Reviews data. Currently mock fixtures — until backend has /api/reviews,
// every contractor sees the same 4 sample reviews on their profile so the
// rating, distribution, and detail layout can be evaluated in design QA.

export interface Review {
  id: string;
  reviewer: string;
  jobTitle: string;
  rating: 1 | 2 | 3 | 4 | 5;
  body: string;
  daysAgo: number;
}

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r-1',
    reviewer: 'Sarah T.',
    jobTitle: 'Bathroom remodel',
    rating: 5,
    body: 'Showed up on time every day, milestones tracked exactly to the bid. Photo proof was clear. Would hire again for the kitchen next year.',
    daysAgo: 6,
  },
  {
    id: 'r-2',
    reviewer: 'Marcus L.',
    jobTitle: 'Roof patch above garage',
    rating: 5,
    body: 'Fast response, fair price, fixed the leak in one afternoon. Cleaned up everything. Communication was great.',
    daysAgo: 18,
  },
  {
    id: 'r-3',
    reviewer: 'Diana C.',
    jobTitle: 'Deck rebuild',
    rating: 4,
    body: 'Quality work. One milestone slipped a couple of days, but they communicated ahead of time. Final result is excellent.',
    daysAgo: 42,
  },
  {
    id: 'r-4',
    reviewer: 'Jared V.',
    jobTitle: 'Bathroom vanity',
    rating: 5,
    body: 'Quick turnaround, clean install, no surprises on cost. Highly recommended.',
    daysAgo: 71,
  },
];

export interface RatingSummary {
  count: number;
  average: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
}

export function summarize(reviews: Review[]): RatingSummary {
  if (reviews.length === 0) {
    return { count: 0, average: 0, distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } };
  }
  const distribution: Record<1 | 2 | 3 | 4 | 5, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let sum = 0;
  for (const r of reviews) {
    distribution[r.rating] += 1;
    sum += r.rating;
  }
  return {
    count: reviews.length,
    average: Math.round((sum / reviews.length) * 10) / 10,
    distribution,
  };
}

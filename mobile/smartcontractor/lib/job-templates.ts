// Curated job templates — common home renovation scopes a homeowner can
// pick to pre-fill the post-job form. Pure data, no AsyncStorage.

export interface JobTemplate {
  id: string;
  title: string;
  category: string;
  budget: string;
  description: string;
  scopeBullets: string[];
}

export const JOB_TEMPLATES: JobTemplate[] = [
  {
    id: 'kitchen-refresh',
    title: 'Kitchen cabinet refresh',
    category: 'Renovation',
    budget: '$3,000 – $6,000',
    description:
      'Refinish existing cabinet boxes and doors, replace hardware, paint interior of cabinets. No layout changes.',
    scopeBullets: [
      'Strip + sand existing cabinet surfaces',
      'Prime and apply 2 coats of finish (color TBD)',
      'Replace pulls and hinges',
      'Touch up trim and crown',
    ],
  },
  {
    id: 'bathroom-vanity',
    title: 'Bathroom vanity replacement',
    category: 'Renovation',
    budget: '$1,800 – $3,500',
    description:
      'Remove existing vanity and sink, install new vanity, faucet, and mirror. Connect to existing plumbing.',
    scopeBullets: [
      'Disconnect plumbing and remove old vanity',
      'Install new vanity (provided by homeowner)',
      'New faucet + drain assembly',
      'Caulk and seal',
    ],
  },
  {
    id: 'deck-rebuild',
    title: 'Deck rebuild',
    category: 'Exterior',
    budget: '$8,000 – $15,000',
    description:
      'Demolish existing deck, build new deck on same footprint using pressure-treated lumber and composite boards.',
    scopeBullets: [
      'Demo and haul away existing deck',
      'Inspect and repair joist hangers if needed',
      'Install composite decking + railing',
      'Final stain on exposed lumber',
    ],
  },
  {
    id: 'roof-patch',
    title: 'Roof leak patch',
    category: 'Repair',
    budget: '$400 – $1,200',
    description:
      'Locate and patch a roof leak above a specific room. Includes replacing damaged shingles and resealing.',
    scopeBullets: [
      'Inspect attic and roof to locate leak source',
      'Replace damaged shingles or flashing',
      'Reseal with roofing cement',
      'Photo proof before and after',
    ],
  },
  {
    id: 'tile-floor',
    title: 'Bathroom tile floor',
    category: 'Renovation',
    budget: '$1,500 – $3,000',
    description:
      'Remove existing flooring and install ceramic or porcelain tile. Includes underlayment and grouting.',
    scopeBullets: [
      'Remove existing flooring + cleanup',
      'Install cement board underlayment',
      'Lay tile (pattern TBD)',
      'Grout and seal',
    ],
  },
  {
    id: 'fence-install',
    title: 'Fence installation',
    category: 'Exterior',
    budget: '$2,500 – $6,000',
    description:
      'Install new fence around property perimeter. Cedar or composite. Includes posts, panels, and gate.',
    scopeBullets: [
      'Survey and mark fence line',
      'Install posts in concrete footings',
      'Mount panels',
      'Install gate with hardware',
    ],
  },
  {
    id: 'electrical-panel',
    title: 'Electrical panel upgrade',
    category: 'Electrical',
    budget: '$2,000 – $4,500',
    description:
      'Upgrade main electrical panel to 200 amps. Licensed electrician required. Includes permit and inspection.',
    scopeBullets: [
      'Pull permit with city',
      'Upgrade panel to 200A',
      'Test all existing circuits',
      'Schedule final inspection',
    ],
  },
  {
    id: 'plumbing-repipe',
    title: 'Repipe section (PEX)',
    category: 'Plumbing',
    budget: '$3,000 – $7,000',
    description:
      'Replace galvanized or copper pipes in one section of the house with PEX. Permit required.',
    scopeBullets: [
      'Drain existing system',
      'Cut and remove old pipe',
      'Run new PEX with manifold',
      'Pressure test and inspect',
    ],
  },
];

export function getTemplate(id: string): JobTemplate | null {
  return JOB_TEMPLATES.find((t) => t.id === id) ?? null;
}

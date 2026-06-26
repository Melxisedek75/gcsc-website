export const colors = {
  bg: '#0B0F17',
  surface: '#141A24',
  surfaceAlt: '#1C2433',
  border: '#27324A',
  text: '#F4F6FA',
  textMuted: '#8A94A8',
  textDim: '#5C6678',
  brand: '#FF7A1A',
  brandDark: '#E5660A',
  accent: '#3DD9A6',
  warning: '#FFB020',
  danger: '#FF5C5C',
  homeowner: '#5B8DEF',
  contractor: '#FF7A1A',
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const typography = {
  display: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  h1: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  h2: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  h3: { fontSize: 17, fontWeight: '600' as const, lineHeight: 24 },
  body: { fontSize: 15, fontWeight: '400' as const, lineHeight: 22 },
  bodyStrong: { fontSize: 15, fontWeight: '600' as const, lineHeight: 22 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  micro: { fontSize: 11, fontWeight: '500' as const, lineHeight: 14 },
} as const;

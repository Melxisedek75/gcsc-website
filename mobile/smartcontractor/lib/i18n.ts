// Minimal i18n. Keys live here as the source of truth; English fallback
// always returns the value. Spanish strings ship as the second locale —
// US market is en+es first. Wire `lib/settings.ts language` to pick the
// active locale at render time.

import { loadSettings } from './settings';

export type Locale = 'en' | 'es';

type Dictionary = Record<string, Record<Locale, string>>;

const DICT: Dictionary = {
  // App-level
  'app.tagline': {
    en: 'Trust infrastructure for construction. Milestone-based payments, verified contractors, on-chain proof.',
    es: 'Infraestructura de confianza para la construcción. Pagos por hitos, contratistas verificados, prueba on-chain.',
  },
  'app.haveAccount': {
    en: 'Already have an account? Sign in',
    es: '¿Ya tienes una cuenta? Iniciar sesión',
  },

  // Role help text
  'role.homeowner.help': {
    en: 'Post a job, hire verified contractors, approve milestones with photo proof.',
    es: 'Publica un trabajo, contrata profesionales verificados, aprueba hitos con foto.',
  },
  'role.contractor.help': {
    en: 'Find jobs, submit bids, upload milestone proof, get paid on approval.',
    es: 'Encuentra trabajos, envía ofertas, sube prueba de hitos, cobra al aprobar.',
  },

  // Onboarding
  'onboarding.skip': { en: 'Skip', es: 'Omitir' },
  'onboarding.next': { en: 'Next', es: 'Siguiente' },
  'onboarding.getStarted': { en: 'Get started', es: 'Empezar' },
  'onboarding.haveAccount': { en: 'I already have an account', es: 'Ya tengo una cuenta' },

  // Auth
  'auth.signIn': { en: 'Sign in', es: 'Iniciar sesión' },
  'auth.signUp': { en: 'Create account', es: 'Crear cuenta' },
  'auth.email': { en: 'Email', es: 'Correo electrónico' },
  'auth.password': { en: 'Password', es: 'Contraseña' },
  'auth.fullName': { en: 'Full name', es: 'Nombre completo' },

  // Common actions
  'action.cancel': { en: 'Cancel', es: 'Cancelar' },
  'action.save': { en: 'Save', es: 'Guardar' },
  'action.delete': { en: 'Delete', es: 'Eliminar' },
  'action.back': { en: 'Back', es: 'Atrás' },
  'action.continue': { en: 'Continue', es: 'Continuar' },
  'action.submit': { en: 'Submit', es: 'Enviar' },

  // Roles
  'role.homeowner': { en: "I'm a homeowner", es: 'Soy propietario' },
  'role.contractor': { en: "I'm a contractor", es: 'Soy contratista' },

  // Jobs
  'jobs.title': { en: 'My jobs', es: 'Mis trabajos' },
  'jobs.postNew': { en: '+ Post a new job', es: '+ Publicar un trabajo' },
  'jobs.viewBids': { en: 'View bids', es: 'Ver ofertas' },

  // Bids
  'bid.submit': { en: 'Submit a bid', es: 'Enviar oferta' },
  'bid.accept': { en: 'Accept this bid', es: 'Aceptar esta oferta' },

  // Milestones
  'milestone.approve': { en: 'Approve & release', es: 'Aprobar y liberar' },
  'milestone.uploadProof': { en: 'Upload photos', es: 'Subir fotos' },

  // Settings sections
  'settings.title': { en: 'Settings', es: 'Ajustes' },
  'settings.notifications': { en: 'Notifications', es: 'Notificaciones' },
  'settings.language': { en: 'Language', es: 'Idioma' },
  'settings.appearance': { en: 'Appearance', es: 'Apariencia' },
  'settings.reset': { en: 'Reset & data', es: 'Restablecer y datos' },
  'settings.signOut': { en: 'Sign out', es: 'Cerrar sesión' },

  // Disputes
  'dispute.report': { en: 'Report an issue', es: 'Reportar un problema' },
  'dispute.open': { en: 'Open dispute', es: 'Abrir disputa' },

  // Empty states
  'empty.noJobs': {
    en: 'No jobs yet. Post your first one to invite verified contractors.',
    es: 'Aún no hay trabajos. Publica el primero para invitar a contratistas verificados.',
  },
  'empty.noBids': {
    en: 'No bids yet. Browse Available jobs and submit your first bid.',
    es: 'Aún no hay ofertas. Explora trabajos disponibles y envía tu primera oferta.',
  },
  'empty.noActivity': {
    en: 'No activity yet. Post a job or submit a bid to get started.',
    es: 'Aún no hay actividad. Publica un trabajo o envía una oferta para empezar.',
  },
};

let cachedLocale: Locale = 'en';

export async function initI18n(): Promise<Locale> {
  const settings = await loadSettings();
  cachedLocale = settings.language;
  return cachedLocale;
}

export function setLocale(locale: Locale): void {
  cachedLocale = locale;
}

export function getLocale(): Locale {
  return cachedLocale;
}

export function t(key: string): string {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[cachedLocale] ?? entry.en;
}

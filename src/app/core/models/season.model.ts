export type SeasonStatus = 'upcoming' | 'active' | 'finished';
export type SeasonFormat = 'round-robin' | 'round-robin-playoffs';

export interface Season {
  id: string;
  /** e.g. "Season 2 — Sommer 2026". */
  name: string;
  /** ISO date (yyyy-MM-dd). */
  startDate: string;
  /** ISO date (yyyy-MM-dd). */
  endDate: string;
  status: SeasonStatus;
  format: SeasonFormat;
}

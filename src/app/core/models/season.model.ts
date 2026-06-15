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

/** The editable shape of a season (everything except the server-owned id). */
export type SeasonInput = Omit<Season, 'id'>;

export const SEASON_STATUS_LABELS: Record<SeasonStatus, string> = {
  upcoming: 'Geplant',
  active: 'Aktiv',
  finished: 'Beendet',
};

export const SEASON_FORMAT_LABELS: Record<SeasonFormat, string> = {
  'round-robin': 'Jeder gegen jeden',
  'round-robin-playoffs': 'Liga + Playoffs',
};

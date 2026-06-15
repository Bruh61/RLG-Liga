export interface Team {
  id: string;
  /** Full display name, e.g. "Berlin Boosters". */
  name: string;
  /** Short tag/abbreviation, max 5 chars, e.g. "BBO". */
  tag: string;
  logoUrl?: string;
  /** Hex color used by the team badge, e.g. "#D32F2F". */
  colorPrimary: string;
  /** ISO date (yyyy-MM-dd). */
  foundedAt: string;
}

/** The editable shape of a team (everything except the server-owned id). */
export type TeamInput = Omit<Team, 'id'>;

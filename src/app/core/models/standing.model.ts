/**
 * A single row of the league table. Derived (not persisted): computed from the
 * `finished` matches of a season — see `standings.service.ts` (Phase 5).
 */
export interface StandingRow {
  teamId: string;
  played: number;
  wins: number;
  losses: number;
  gamesWon: number;
  gamesLost: number;
  gameDiff: number;
  /** 3 points per win, 0 per loss. */
  points: number;
}

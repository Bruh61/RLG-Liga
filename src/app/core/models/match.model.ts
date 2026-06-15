export type MatchStatus = 'scheduled' | 'live' | 'finished';
export type MatchStage = 'regular' | 'playoff';
export type BestOf = 3 | 5 | 7;

export interface Match {
  id: string;
  seasonId: string;
  homeTeamId: string;
  awayTeamId: string;
  /** ISO date-time. */
  scheduledAt: string;
  status: MatchStatus;
  stage: MatchStage;
  bestOf: BestOf;
  /** Games won by the home team in the series. */
  homeScore: number;
  /** Games won by the away team in the series. */
  awayScore: number;
  /** Playoff round (1 = first round); only set for `stage: 'playoff'`. */
  round?: number;
}

/** The editable shape of a match (everything except the server-owned id). */
export type MatchInput = Omit<Match, 'id'>;

/** Games a team must win to take a best-of series. */
export function gamesToWin(bestOf: BestOf): number {
  return Math.ceil(bestOf / 2);
}

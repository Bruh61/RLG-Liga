import { Injectable, Signal, computed, inject } from '@angular/core';

import { Match, StandingRow } from '../../core/models';
import { MatchesService } from '../matches/matches.service';

/**
 * Pure league-table calculation: derives {@link StandingRow}s from a set of
 * matches (only `finished` ones count). 3 points per win; sorted by points,
 * then game difference, then games won. Kept pure so it is trivially testable.
 */
export function computeStandings(matches: Match[]): StandingRow[] {
  const rows = new Map<string, StandingRow>();
  const ensure = (teamId: string): StandingRow => {
    let row = rows.get(teamId);
    if (!row) {
      row = {
        teamId,
        played: 0,
        wins: 0,
        losses: 0,
        gamesWon: 0,
        gamesLost: 0,
        gameDiff: 0,
        points: 0,
      };
      rows.set(teamId, row);
    }
    return row;
  };

  for (const match of matches) {
    if (match.status !== 'finished') {
      continue;
    }
    const home = ensure(match.homeTeamId);
    const away = ensure(match.awayTeamId);
    home.played++;
    away.played++;
    home.gamesWon += match.homeScore;
    home.gamesLost += match.awayScore;
    away.gamesWon += match.awayScore;
    away.gamesLost += match.homeScore;
    if (match.homeScore > match.awayScore) {
      home.wins++;
      home.points += 3;
      away.losses++;
    } else if (match.awayScore > match.homeScore) {
      away.wins++;
      away.points += 3;
      home.losses++;
    }
  }

  for (const row of rows.values()) {
    row.gameDiff = row.gamesWon - row.gamesLost;
  }

  return [...rows.values()].sort(
    (a, b) => b.points - a.points || b.gameDiff - a.gameDiff || b.gamesWon - a.gamesWon,
  );
}

@Injectable({ providedIn: 'root' })
export class StandingsService {
  private readonly matchesService = inject(MatchesService);

  /** Live league table for a season — reactive over the matches resource. */
  forSeason(seasonId: () => string | null | undefined): Signal<StandingRow[]> {
    return computed(() =>
      computeStandings(
        this.matchesService.matches
          .value()
          .filter((m) => m.seasonId === seasonId() && m.stage === 'regular'),
      ),
    );
  }
}

import { computeStandings } from './standings.service';
import { Match, MatchStatus } from '../../core/models';

let counter = 0;
function match(
  homeTeamId: string,
  awayTeamId: string,
  homeScore: number,
  awayScore: number,
  status: MatchStatus = 'finished',
): Match {
  return {
    id: `m${counter++}`,
    seasonId: 's1',
    homeTeamId,
    awayTeamId,
    scheduledAt: '2026-01-01T18:00',
    status,
    stage: 'regular',
    bestOf: 5,
    homeScore,
    awayScore,
  };
}

describe('computeStandings', () => {
  it('awards 3 points per win and sorts by points then game difference', () => {
    const rows = computeStandings([
      match('t1', 't2', 3, 1),
      match('t1', 't3', 3, 0),
      match('t2', 't3', 3, 2),
    ]);

    expect(rows.map((r) => r.teamId)).toEqual(['t1', 't2', 't3']);

    const [first, second, third] = rows;
    expect(first.points).toBe(6);
    expect(first.wins).toBe(2);
    expect(first.gameDiff).toBe(5); // 6 won, 1 lost
    expect(second.points).toBe(3);
    expect(second.gameDiff).toBe(-1); // 4 won (1+3), 5 lost (3+2)
    expect(third.points).toBe(0);
    expect(third.played).toBe(2);
  });

  it('ignores matches that are not finished', () => {
    expect(computeStandings([match('t1', 't2', 0, 0, 'scheduled')])).toEqual([]);
  });
});

import { Component, computed, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeader } from '../../shared/components/page-header/page-header';
import { BarChart, BarDatum } from '../../shared/components/bar-chart/bar-chart';
import { TeamsService } from '../teams/teams.service';
import { PlayersService } from '../players/players.service';
import { MatchesService } from '../matches/matches.service';
import { SeasonsService } from '../seasons/seasons.service';
import { StandingsService } from '../standings/standings.service';

@Component({
  selector: 'app-dashboard',
  imports: [MatIconModule, MatProgressSpinnerModule, PageHeader, BarChart],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  private readonly teamsService = inject(TeamsService);
  private readonly playersService = inject(PlayersService);
  private readonly matchesService = inject(MatchesService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly standingsService = inject(StandingsService);
  private readonly teamsBy = this.teamsService.byId;

  private readonly activeSeasonId = computed(() => this.seasonsService.activeSeason()?.id ?? null);
  private readonly standings = this.standingsService.forSeason(this.activeSeasonId);

  protected readonly activeSeasonName = computed(
    () => this.seasonsService.activeSeason()?.name ?? 'keine aktive Saison',
  );

  protected readonly kpis = computed(() => {
    const matches = this.matchesService.matches.value();
    return [
      { icon: 'groups', label: 'Teams', value: this.teamsService.teams.value().length },
      { icon: 'person', label: 'Spieler', value: this.playersService.players.value().length },
      {
        icon: 'scoreboard',
        label: 'Gespielt',
        value: matches.filter((m) => m.status === 'finished').length,
      },
      {
        icon: 'event',
        label: 'Offen',
        value: matches.filter((m) => m.status === 'scheduled').length,
      },
    ];
  });

  protected readonly winsChart = computed<BarDatum[]>(() => this.toChart((r) => r.wins));
  protected readonly gamesWonChart = computed<BarDatum[]>(() => this.toChart((r) => r.gamesWon));

  private toChart(pick: (row: { wins: number; gamesWon: number }) => number): BarDatum[] {
    return this.standings().map((row) => {
      const team = this.teamsBy().get(row.teamId);
      return { label: team?.tag ?? '?', value: pick(row), color: team?.colorPrimary ?? '#888888' };
    });
  }
}

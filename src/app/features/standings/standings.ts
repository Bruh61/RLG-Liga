import { Component, computed, inject, linkedSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { PageHeader } from '../../shared/components/page-header/page-header';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { TeamBadge } from '../../shared/components/team-badge/team-badge';
import { Team } from '../../core/models';
import { StandingsService } from './standings.service';
import { SeasonsService } from '../seasons/seasons.service';
import { TeamsService } from '../teams/teams.service';
import { MatchesService } from '../matches/matches.service';

const PLAYOFF_SPOTS = 4;

@Component({
  selector: 'app-standings',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    TeamBadge,
  ],
  templateUrl: './standings.html',
  styleUrl: './standings.scss',
})
export class Standings {
  private readonly standingsService = inject(StandingsService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly teamsService = inject(TeamsService);
  private readonly matchesService = inject(MatchesService);

  protected readonly seasons = this.seasonsService.seasons;
  protected readonly matches = this.matchesService.matches;
  protected readonly playoffSpots = PLAYOFF_SPOTS;
  private readonly teamsBy = this.teamsService.byId;

  protected readonly displayedColumns = [
    'rank',
    'team',
    'played',
    'wins',
    'losses',
    'gameDiff',
    'points',
  ];

  protected readonly selectedSeasonId = linkedSignal(
    () => this.seasonsService.activeSeason()?.id ?? null,
  );

  private readonly rows = this.standingsService.forSeason(this.selectedSeasonId);

  /** Rows decorated with rank and playoff-spot flag for the template. */
  protected readonly rankedRows = computed(() =>
    this.rows().map((row, index) => ({ row, rank: index + 1, playoff: index < PLAYOFF_SPOTS })),
  );

  protected teamFor(teamId: string): Team | undefined {
    return this.teamsBy().get(teamId);
  }
}

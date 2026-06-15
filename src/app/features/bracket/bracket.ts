import { Component, computed, inject, linkedSignal, signal } from '@angular/core';
import {
  CdkDrag,
  CdkDragDrop,
  CdkDragHandle,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PageHeader } from '../../shared/components/page-header/page-header';
import { EmptyState } from '../../shared/components/empty-state/empty-state';
import { TeamBadge } from '../../shared/components/team-badge/team-badge';
import { Team } from '../../core/models';
import { SeasonsService } from '../seasons/seasons.service';
import { StandingsService } from '../standings/standings.service';
import { TeamsService } from '../teams/teams.service';

interface Matchup {
  key: 'sf1' | 'sf2' | 'final';
  a: string | null;
  b: string | null;
}

/** Single-elimination playoff bracket for the top 4 seeds, seeded via drag & drop. */
@Component({
  selector: 'app-bracket',
  imports: [
    CdkDropList,
    CdkDrag,
    CdkDragHandle,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatButtonModule,
    PageHeader,
    EmptyState,
    TeamBadge,
  ],
  templateUrl: './bracket.html',
  styleUrl: './bracket.scss',
})
export class Bracket {
  private readonly seasonsService = inject(SeasonsService);
  private readonly standingsService = inject(StandingsService);
  private readonly teamsService = inject(TeamsService);

  protected readonly seasons = this.seasonsService.seasons;
  private readonly teamsBy = this.teamsService.byId;

  protected readonly selectedSeasonId = linkedSignal(
    () => this.seasonsService.activeSeason()?.id ?? null,
  );

  private readonly standings = this.standingsService.forSeason(this.selectedSeasonId);

  /** Top 4 seeds from the standings (fall back to the first teams), user-reorderable. */
  protected readonly seeds = linkedSignal<string[]>(() => {
    const fromStandings = this.standings()
      .slice(0, 4)
      .map((r) => r.teamId);
    if (fromStandings.length >= 4) {
      return fromStandings;
    }
    return this.teamsService.teams
      .value()
      .slice(0, 4)
      .map((t) => t.id);
  });

  /** Winner per slot, chosen by clicking a team. */
  protected readonly winners = signal<Record<Matchup['key'], string | null>>({
    sf1: null,
    sf2: null,
    final: null,
  });

  protected readonly semifinals = computed<Matchup[]>(() => {
    const s = this.seeds();
    return [
      { key: 'sf1', a: s[0] ?? null, b: s[3] ?? null },
      { key: 'sf2', a: s[1] ?? null, b: s[2] ?? null },
    ];
  });

  protected readonly finalMatch = computed<Matchup>(() => {
    const w = this.winners();
    return { key: 'final', a: w.sf1, b: w.sf2 };
  });

  protected readonly champion = computed(() => this.winners().final);

  protected teamFor(teamId: string | null): Team | undefined {
    return teamId ? this.teamsBy().get(teamId) : undefined;
  }

  protected drop(event: CdkDragDrop<string[]>): void {
    this.seeds.update((seeds) => {
      const next = [...seeds];
      moveItemInArray(next, event.previousIndex, event.currentIndex);
      return next;
    });
    this.resetWinners();
  }

  protected selectSeason(seasonId: string): void {
    this.selectedSeasonId.set(seasonId);
    this.resetWinners();
  }

  protected advanceSemi(slot: Matchup['key'], teamId: string | null): void {
    if (!teamId) {
      return;
    }
    this.winners.update((w) => ({ ...w, [slot]: teamId, final: null }));
  }

  protected advanceFinal(teamId: string | null): void {
    if (!teamId) {
      return;
    }
    this.winners.update((w) => ({ ...w, final: teamId }));
  }

  private resetWinners(): void {
    this.winners.set({ sf1: null, sf2: null, final: null });
  }
}

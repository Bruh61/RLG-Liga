import { Component, computed, inject, linkedSignal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { TeamBadge } from '../../../shared/components/team-badge/team-badge';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import { Match, MatchStatus, Team } from '../../../core/models';
import { MatchesService } from '../matches.service';
import { SeasonsService } from '../../seasons/seasons.service';
import { TeamsService } from '../../teams/teams.service';
import { MatchForm, MatchFormData } from '../match-form/match-form';
import {
  MatchResultDialog,
  MatchResultDialogData,
} from '../match-result-dialog/match-result-dialog';

const STATUS_LABELS: Record<MatchStatus, string> = {
  scheduled: 'Geplant',
  live: 'Live',
  finished: 'Beendet',
};

@Component({
  selector: 'app-match-schedule',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    TeamBadge,
  ],
  templateUrl: './match-schedule.html',
  styleUrl: './match-schedule.scss',
})
export class MatchSchedule {
  private readonly matchesService = inject(MatchesService);
  private readonly seasonsService = inject(SeasonsService);
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);

  protected readonly matches = this.matchesService.matches;
  protected readonly seasons = this.seasonsService.seasons;
  private readonly teamsBy = this.teamsService.byId;
  protected readonly statusLabels = STATUS_LABELS;

  protected readonly displayedColumns = [
    'scheduledAt',
    'home',
    'score',
    'away',
    'bestOf',
    'status',
    'actions',
  ];

  // Defaults to the active season but stays user-overridable via the selector.
  protected readonly selectedSeasonId = linkedSignal(
    () => this.seasonsService.activeSeason()?.id ?? null,
  );

  protected readonly seasonMatches = computed(() => {
    const seasonId = this.selectedSeasonId();
    return this.matches
      .value()
      .filter((m) => m.seasonId === seasonId)
      .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  });

  protected teamFor(teamId: string): Team | undefined {
    return this.teamsBy().get(teamId);
  }

  protected statusLabel(status: MatchStatus): string {
    return this.statusLabels[status];
  }

  protected openCreate(): void {
    const seasonId = this.selectedSeasonId();
    if (!seasonId) {
      return;
    }
    this.dialog.open(MatchForm, {
      data: { seasonId } satisfies MatchFormData,
      autoFocus: 'first-tabbable',
    });
  }

  protected openEdit(match: Match): void {
    this.dialog.open(MatchForm, {
      data: { seasonId: match.seasonId, match } satisfies MatchFormData,
      autoFocus: 'first-tabbable',
    });
  }

  protected openResult(match: Match): void {
    this.dialog.open(MatchResultDialog, {
      data: { match } satisfies MatchResultDialogData,
      autoFocus: 'first-tabbable',
    });
  }

  protected async confirmDelete(match: Match): Promise<void> {
    const home = this.teamFor(match.homeTeamId)?.tag ?? '?';
    const away = this.teamFor(match.awayTeamId)?.tag ?? '?';
    const data: ConfirmDialogData = {
      title: 'Match löschen',
      message: `Match ${home} – ${away} wirklich löschen?`,
      confirmLabel: 'Löschen',
      destructive: true,
    };
    const confirmed = await firstValueFrom(this.dialog.open(ConfirmDialog, { data }).afterClosed());
    if (confirmed) {
      await this.matchesService.remove(match.id);
    }
  }
}

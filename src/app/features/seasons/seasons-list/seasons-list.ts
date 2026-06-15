import { Component, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import {
  ConfirmDialog,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog';
import {
  SEASON_FORMAT_LABELS,
  SEASON_STATUS_LABELS,
  Season,
  SeasonFormat,
  SeasonStatus,
} from '../../../core/models';
import { SeasonsService } from '../seasons.service';
import { SeasonForm, SeasonFormData } from '../season-form/season-form';

@Component({
  selector: 'app-seasons-list',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    RouterLink,
    PageHeader,
    EmptyState,
  ],
  templateUrl: './seasons-list.html',
  styleUrl: './seasons-list.scss',
})
export class SeasonsList {
  private readonly seasonsService = inject(SeasonsService);
  private readonly dialog = inject(MatDialog);

  protected readonly seasons = this.seasonsService.seasons;
  protected readonly statusLabels = SEASON_STATUS_LABELS;
  protected readonly formatLabels = SEASON_FORMAT_LABELS;
  protected readonly displayedColumns = ['name', 'period', 'status', 'format', 'actions'];

  protected statusLabel(status: SeasonStatus): string {
    return this.statusLabels[status];
  }

  protected formatLabel(format: SeasonFormat): string {
    return this.formatLabels[format];
  }

  protected openCreate(): void {
    this.dialog.open(SeasonForm, { autoFocus: 'first-tabbable' });
  }

  protected openEdit(season: Season): void {
    this.dialog.open(SeasonForm, {
      data: { season } satisfies SeasonFormData,
      autoFocus: 'first-tabbable',
    });
  }

  protected async confirmDelete(season: Season): Promise<void> {
    const data: ConfirmDialogData = {
      title: 'Saison löschen',
      message: `„${season.name}“ wirklich löschen? Zugehörige Matches bleiben bestehen.`,
      confirmLabel: 'Löschen',
      destructive: true,
    };
    const confirmed = await firstValueFrom(this.dialog.open(ConfirmDialog, { data }).afterClosed());
    if (confirmed) {
      await this.seasonsService.remove(season.id);
    }
  }
}

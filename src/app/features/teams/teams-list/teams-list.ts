import { Component, effect, inject, signal, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
import { Team } from '../../../core/models';
import { TeamsService } from '../teams.service';
import { TeamForm, TeamFormData } from '../team-form/team-form';

@Component({
  selector: 'app-teams-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    TeamBadge,
  ],
  templateUrl: './teams-list.html',
  styleUrl: './teams-list.scss',
})
export class TeamsList {
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);

  protected readonly teams = this.teamsService.teams;
  protected readonly filterValue = signal('');
  protected readonly displayedColumns = ['badge', 'name', 'tag', 'foundedAt', 'actions'];
  protected readonly dataSource = new MatTableDataSource<Team>([]);

  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    this.dataSource.filterPredicate = (team, filter) =>
      `${team.name} ${team.tag}`.toLowerCase().includes(filter);

    // Keep table data in sync with the resource.
    effect(() => {
      this.dataSource.data = this.teams.value();
    });

    // Wire sort/paginator once the table is in the DOM (only rendered when there are rows).
    effect(() => {
      const sort = this.sort();
      const paginator = this.paginator();
      if (sort) {
        this.dataSource.sort = sort;
      }
      if (paginator) {
        this.dataSource.paginator = paginator;
      }
    });
  }

  protected applyFilter(value: string): void {
    this.filterValue.set(value);
    this.dataSource.filter = value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  protected openCreate(): void {
    this.dialog.open(TeamForm, { autoFocus: 'first-tabbable' });
  }

  protected openEdit(team: Team): void {
    this.dialog.open(TeamForm, {
      data: { team } satisfies TeamFormData,
      autoFocus: 'first-tabbable',
    });
  }

  protected async confirmDelete(team: Team): Promise<void> {
    const data: ConfirmDialogData = {
      title: 'Team löschen',
      message: `„${team.name}“ wirklich löschen? Das kann nicht rückgängig gemacht werden.`,
      confirmLabel: 'Löschen',
      destructive: true,
    };
    const confirmed = await firstValueFrom(this.dialog.open(ConfirmDialog, { data }).afterClosed());
    if (confirmed) {
      await this.teamsService.remove(team.id);
    }
  }
}

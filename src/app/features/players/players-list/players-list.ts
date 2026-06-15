import { Component, computed, effect, inject, signal, viewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
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
import { PLATFORM_LABELS, Platform, Player, Team } from '../../../core/models';
import { PlayersService } from '../players.service';
import { TeamsService } from '../../teams/teams.service';
import { PlayerForm, PlayerFormData } from '../player-form/player-form';

@Component({
  selector: 'app-players-list',
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    PageHeader,
    EmptyState,
    TeamBadge,
  ],
  templateUrl: './players-list.html',
  styleUrl: './players-list.scss',
})
export class PlayersList {
  private readonly playersService = inject(PlayersService);
  private readonly teamsService = inject(TeamsService);
  private readonly dialog = inject(MatDialog);

  protected readonly players = this.playersService.players;
  protected readonly teams = this.teamsService.teams;
  private readonly teamsBy = this.teamsService.byId;

  protected readonly platformLabels = PLATFORM_LABELS;
  protected readonly platforms = Object.keys(PLATFORM_LABELS) as Platform[];

  protected readonly displayedColumns = [
    'gamertag',
    'realName',
    'team',
    'platform',
    'captain',
    'actions',
  ];
  protected readonly dataSource = new MatTableDataSource<Player>([]);

  protected readonly textFilter = signal('');
  protected readonly teamFilter = signal<string>('all'); // 'all' | 'free' | teamId
  protected readonly platformFilter = signal<Platform | 'all'>('all');

  private readonly filtered = computed(() => {
    const text = this.textFilter().trim().toLowerCase();
    const team = this.teamFilter();
    const platform = this.platformFilter();
    return this.players.value().filter((p) => {
      if (text && !`${p.gamertag} ${p.realName ?? ''}`.toLowerCase().includes(text)) {
        return false;
      }
      if (team === 'free' && p.teamId !== null) {
        return false;
      }
      if (team !== 'all' && team !== 'free' && p.teamId !== team) {
        return false;
      }
      if (platform !== 'all' && p.platform !== platform) {
        return false;
      }
      return true;
    });
  });

  private readonly sort = viewChild(MatSort);
  private readonly paginator = viewChild(MatPaginator);

  constructor() {
    this.dataSource.sortingDataAccessor = (player, column) => {
      switch (column) {
        case 'gamertag':
          return player.gamertag;
        case 'realName':
          return player.realName ?? '';
        case 'team':
          return this.teamsBy().get(player.teamId ?? '')?.name ?? '';
        case 'platform':
          return this.platformLabels[player.platform];
        case 'captain':
          return player.isCaptain ? 1 : 0;
        default:
          return '';
      }
    };

    effect(() => {
      this.dataSource.data = this.filtered();
      this.dataSource.paginator?.firstPage();
    });

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

  protected teamFor(teamId: string | null): Team | undefined {
    return teamId ? this.teamsBy().get(teamId) : undefined;
  }

  protected platformLabel(platform: Platform): string {
    return this.platformLabels[platform];
  }

  protected openCreate(): void {
    this.dialog.open(PlayerForm, { autoFocus: 'first-tabbable' });
  }

  protected openEdit(player: Player): void {
    this.dialog.open(PlayerForm, {
      data: { player } satisfies PlayerFormData,
      autoFocus: 'first-tabbable',
    });
  }

  protected async confirmDelete(player: Player): Promise<void> {
    const data: ConfirmDialogData = {
      title: 'Spieler löschen',
      message: `„${player.gamertag}“ wirklich löschen?`,
      confirmLabel: 'Löschen',
      destructive: true,
    };
    const confirmed = await firstValueFrom(this.dialog.open(ConfirmDialog, { data }).afterClosed());
    if (confirmed) {
      await this.playersService.remove(player.id);
    }
  }
}

import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { FormField, form, required, maxLength, validate, submit } from '@angular/forms/signals';

import { PLATFORM_LABELS, Platform, Player, PlayerInput } from '../../../core/models';
import { PlayersService } from '../players.service';
import { TeamsService } from '../../teams/teams.service';

export interface PlayerFormData {
  player?: Player;
}

/** Working model — `realName` kept as a non-optional string for clean field binding. */
interface PlayerFormModel {
  gamertag: string;
  realName: string;
  platform: Platform;
  teamId: string | null;
  isCaptain: boolean;
  joinedAt: string;
}

/** Reads just the bits of a field state needed to surface its first error message. */
interface FieldErrorState {
  touched(): boolean;
  dirty(): boolean;
  errors(): readonly { message?: string }[];
}

/** Create/edit a player with Signal Forms, including the "max one captain per team" rule. */
@Component({
  selector: 'app-player-form',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    FormField,
  ],
  templateUrl: './player-form.html',
  styleUrl: './player-form.scss',
})
export class PlayerForm {
  private readonly dialogRef = inject<MatDialogRef<PlayerForm, boolean>>(MatDialogRef);
  private readonly data = inject<PlayerFormData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly playersService = inject(PlayersService);
  private readonly teamsService = inject(TeamsService);

  protected readonly teams = this.teamsService.teams;
  private readonly allPlayers = this.playersService.players.value;
  private readonly editingId = this.data?.player?.id ?? null;

  protected readonly platforms = (Object.keys(PLATFORM_LABELS) as Platform[]).map((value) => ({
    value,
    label: PLATFORM_LABELS[value],
  }));

  protected readonly isEdit = !!this.data?.player;
  protected readonly title = this.isEdit ? 'Spieler bearbeiten' : 'Neuer Spieler';
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly model = signal<PlayerFormModel>(
    this.data?.player
      ? {
          gamertag: this.data.player.gamertag,
          realName: this.data.player.realName ?? '',
          platform: this.data.player.platform,
          teamId: this.data.player.teamId,
          isCaptain: this.data.player.isCaptain,
          joinedAt: this.data.player.joinedAt,
        }
      : {
          gamertag: '',
          realName: '',
          platform: 'epic',
          teamId: null,
          isCaptain: false,
          joinedAt: this.today(),
        },
  );

  protected readonly form = form(this.model, (path) => {
    required(path.gamertag, { message: 'Gamertag ist erforderlich.' });
    maxLength(path.gamertag, 20, { message: 'Höchstens 20 Zeichen.' });
    required(path.platform, { message: 'Plattform ist erforderlich.' });
    required(path.joinedAt, { message: 'Beitrittsdatum ist erforderlich.' });

    // A team may have at most one captain.
    validate(path.isCaptain, ({ valueOf }) => {
      if (!valueOf(path.isCaptain)) {
        return null;
      }
      const teamId = valueOf(path.teamId);
      if (!teamId) {
        return { kind: 'captainNoTeam', message: 'Nur Spieler mit Team können Captain sein.' };
      }
      const clash = this.allPlayers().find(
        (p) => p.teamId === teamId && p.isCaptain && p.id !== this.editingId,
      );
      return clash
        ? { kind: 'captainTaken', message: `${clash.gamertag} ist bereits Captain dieses Teams.` }
        : null;
    });
  });

  protected firstError(state: FieldErrorState): string | null {
    if (!state.touched() && !state.dirty()) {
      return null;
    }
    return state.errors()[0]?.message ?? null;
  }

  protected setPlatform(platform: Platform): void {
    this.model.update((m) => ({ ...m, platform }));
  }

  protected setTeam(teamId: string | null): void {
    this.model.update((m) => ({ ...m, teamId }));
  }

  protected setCaptain(isCaptain: boolean): void {
    this.model.update((m) => ({ ...m, isCaptain }));
  }

  protected async save(): Promise<void> {
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const ok = await submit(this.form, async () => {
        const m = this.model();
        const value: PlayerInput = {
          gamertag: m.gamertag,
          realName: m.realName.trim() || undefined,
          platform: m.platform,
          teamId: m.teamId,
          isCaptain: m.isCaptain,
          joinedAt: m.joinedAt,
        };
        if (this.isEdit && this.data?.player) {
          await this.playersService.update(this.data.player.id, value);
        } else {
          await this.playersService.create(value);
        }
        return null;
      });
      if (ok) {
        this.dialogRef.close(true);
      }
    } catch {
      this.saveError.set('Speichern fehlgeschlagen. Läuft die Mock-API (npm run api)?');
    } finally {
      this.saving.set(false);
    }
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }
}

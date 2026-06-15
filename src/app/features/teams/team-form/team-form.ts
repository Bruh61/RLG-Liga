import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  FormField,
  form,
  required,
  maxLength,
  submit,
  type FieldState,
} from '@angular/forms/signals';

import { Team, TeamInput } from '../../../core/models';
import { TeamsService } from '../teams.service';

export interface TeamFormData {
  team?: Team;
}

/** Create/edit a team with Signal Forms. Closes with `true` after a successful save. */
@Component({
  selector: 'app-team-form',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormField],
  templateUrl: './team-form.html',
  styleUrl: './team-form.scss',
})
export class TeamForm {
  private readonly dialogRef = inject<MatDialogRef<TeamForm, boolean>>(MatDialogRef);
  private readonly data = inject<TeamFormData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly teamsService = inject(TeamsService);

  protected readonly isEdit = !!this.data?.team;
  protected readonly title = this.isEdit ? 'Team bearbeiten' : 'Neues Team';
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly model = signal<TeamInput>(
    this.data?.team
      ? {
          name: this.data.team.name,
          tag: this.data.team.tag,
          colorPrimary: this.data.team.colorPrimary,
          foundedAt: this.data.team.foundedAt,
          logoUrl: this.data.team.logoUrl,
        }
      : { name: '', tag: '', colorPrimary: '#D32F2F', foundedAt: this.today() },
  );

  protected readonly form = form(this.model, (path) => {
    required(path.name, { message: 'Name ist erforderlich.' });
    maxLength(path.name, 40, { message: 'Höchstens 40 Zeichen.' });
    required(path.tag, { message: 'Tag ist erforderlich.' });
    maxLength(path.tag, 5, { message: 'Höchstens 5 Zeichen.' });
    required(path.colorPrimary, { message: 'Farbe ist erforderlich.' });
    required(path.foundedAt, { message: 'Gründungsdatum ist erforderlich.' });
  });

  /** First validation message for a field, once the user has interacted with it. */
  protected firstError(state: FieldState<string>): string | null {
    if (!state.touched() && !state.dirty()) {
      return null;
    }
    return state.errors()[0]?.message ?? null;
  }

  protected setColor(value: string): void {
    this.model.update((current) => ({ ...current, colorPrimary: value }));
  }

  protected async save(): Promise<void> {
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const ok = await submit(this.form, async () => {
        const value = this.model();
        if (this.isEdit && this.data?.team) {
          await this.teamsService.update(this.data.team.id, value);
        } else {
          await this.teamsService.create(value);
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

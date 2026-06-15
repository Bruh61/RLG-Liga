import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormField, form, required, validate, submit } from '@angular/forms/signals';

import { BestOf, Match, MatchInput, MatchStage } from '../../../core/models';
import { firstError } from '../../../shared/forms/field-error';
import { MatchesService } from '../matches.service';
import { TeamsService } from '../../teams/teams.service';

export interface MatchFormData {
  seasonId: string;
  match?: Match;
}

interface MatchFormModel {
  homeTeamId: string;
  awayTeamId: string;
  scheduledAt: string;
  bestOf: BestOf;
  stage: MatchStage;
}

const STAGE_LABELS: Record<MatchStage, string> = { regular: 'Liga', playoff: 'Playoff' };

@Component({
  selector: 'app-match-form',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormField,
  ],
  template: `
    <h2 mat-dialog-title>{{ title }}</h2>
    <form (submit)="$event.preventDefault(); save()">
      <mat-dialog-content class="match-form">
        <mat-form-field appearance="outline">
          <mat-label>Heim-Team</mat-label>
          <mat-select [value]="model().homeTeamId" (selectionChange)="setHome($event.value)">
            @for (team of teams.value(); track team.id) {
              <mat-option [value]="team.id">{{ team.name }}</mat-option>
            }
          </mat-select>
          @if (firstError(form.homeTeamId()); as err) {
            <mat-hint class="match-form__error" role="alert">{{ err }}</mat-hint>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Auswärts-Team</mat-label>
          <mat-select [value]="model().awayTeamId" (selectionChange)="setAway($event.value)">
            @for (team of teams.value(); track team.id) {
              <mat-option [value]="team.id">{{ team.name }}</mat-option>
            }
          </mat-select>
          @if (firstError(form.awayTeamId()); as err) {
            <mat-hint class="match-form__error" role="alert">{{ err }}</mat-hint>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Termin</mat-label>
          <input matInput type="datetime-local" [formField]="form.scheduledAt" />
          @if (firstError(form.scheduledAt()); as err) {
            <mat-hint class="match-form__error" role="alert">{{ err }}</mat-hint>
          }
        </mat-form-field>

        <div class="match-form__row">
          <mat-form-field appearance="outline">
            <mat-label>Modus</mat-label>
            <mat-select [value]="model().bestOf" (selectionChange)="setBestOf($event.value)">
              @for (b of bestOfOptions; track b) {
                <mat-option [value]="b">Best of {{ b }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Phase</mat-label>
            <mat-select [value]="model().stage" (selectionChange)="setStage($event.value)">
              @for (s of stages; track s) {
                <mat-option [value]="s">{{ stageLabels[s] }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </div>

        @if (saveError(); as err) {
          <p class="match-form__error" role="alert">{{ err }}</p>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="false">Abbrechen</button>
        <button mat-flat-button type="submit" [disabled]="form().invalid() || saving()">
          {{ isEdit ? 'Speichern' : 'Anlegen' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .match-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: min(460px, 80vw);
      padding-top: 0.5rem;
    }
    .match-form__row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .match-form__row mat-form-field {
      flex: 1 1 160px;
    }
    .match-form__error {
      color: var(--mat-sys-error);
    }
  `,
})
export class MatchForm {
  private readonly dialogRef = inject<MatDialogRef<MatchForm, boolean>>(MatDialogRef);
  private readonly data = inject<MatchFormData>(MAT_DIALOG_DATA);
  private readonly matchesService = inject(MatchesService);
  private readonly teamsService = inject(TeamsService);

  protected readonly firstError = firstError;
  protected readonly teams = this.teamsService.teams;
  protected readonly bestOfOptions: BestOf[] = [3, 5, 7];
  protected readonly stages = Object.keys(STAGE_LABELS) as MatchStage[];
  protected readonly stageLabels = STAGE_LABELS;

  protected readonly isEdit = !!this.data.match;
  protected readonly title = this.isEdit ? 'Match bearbeiten' : 'Neues Match';
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly model = signal<MatchFormModel>(
    this.data.match
      ? {
          homeTeamId: this.data.match.homeTeamId,
          awayTeamId: this.data.match.awayTeamId,
          scheduledAt: this.data.match.scheduledAt.slice(0, 16),
          bestOf: this.data.match.bestOf,
          stage: this.data.match.stage,
        }
      : {
          homeTeamId: '',
          awayTeamId: '',
          scheduledAt: this.defaultDateTime(),
          bestOf: 5,
          stage: 'regular',
        },
  );

  protected readonly form = form(this.model, (path) => {
    required(path.homeTeamId, { message: 'Heim-Team ist erforderlich.' });
    required(path.awayTeamId, { message: 'Auswärts-Team ist erforderlich.' });
    required(path.scheduledAt, { message: 'Termin ist erforderlich.' });
    validate(path.awayTeamId, ({ valueOf }) =>
      valueOf(path.homeTeamId) && valueOf(path.homeTeamId) === valueOf(path.awayTeamId)
        ? { kind: 'sameTeam', message: 'Heim- und Auswärts-Team müssen verschieden sein.' }
        : null,
    );
  });

  protected setHome(homeTeamId: string): void {
    this.model.update((m) => ({ ...m, homeTeamId }));
  }
  protected setAway(awayTeamId: string): void {
    this.model.update((m) => ({ ...m, awayTeamId }));
  }
  protected setBestOf(bestOf: BestOf): void {
    this.model.update((m) => ({ ...m, bestOf }));
  }
  protected setStage(stage: MatchStage): void {
    this.model.update((m) => ({ ...m, stage }));
  }

  protected async save(): Promise<void> {
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const ok = await submit(this.form, async () => {
        const m = this.model();
        const existing = this.data.match;
        const value: MatchInput = {
          seasonId: this.data.seasonId,
          homeTeamId: m.homeTeamId,
          awayTeamId: m.awayTeamId,
          scheduledAt: m.scheduledAt,
          status: existing?.status ?? 'scheduled',
          stage: m.stage,
          bestOf: m.bestOf,
          homeScore: existing?.homeScore ?? 0,
          awayScore: existing?.awayScore ?? 0,
          round: existing?.round,
        };
        if (existing) {
          await this.matchesService.update(existing.id, value);
        } else {
          await this.matchesService.create(value);
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

  private defaultDateTime(): string {
    return `${new Date().toISOString().slice(0, 10)}T18:00`;
  }
}

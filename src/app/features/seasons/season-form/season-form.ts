import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormField, form, required, validate, submit } from '@angular/forms/signals';

import {
  SEASON_FORMAT_LABELS,
  SEASON_STATUS_LABELS,
  Season,
  SeasonFormat,
  SeasonInput,
  SeasonStatus,
} from '../../../core/models';
import { firstError } from '../../../shared/forms/field-error';
import { SeasonsService } from '../seasons.service';

export interface SeasonFormData {
  season?: Season;
}

@Component({
  selector: 'app-season-form',
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
      <mat-dialog-content class="season-form">
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [formField]="form.name" autocomplete="off" />
          @if (firstError(form.name()); as err) {
            <mat-hint class="season-form__error" role="alert">{{ err }}</mat-hint>
          }
        </mat-form-field>

        <div class="season-form__row">
          <mat-form-field appearance="outline">
            <mat-label>Beginn</mat-label>
            <input matInput type="date" [formField]="form.startDate" />
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Ende</mat-label>
            <input matInput type="date" [formField]="form.endDate" />
            @if (firstError(form.endDate()); as err) {
              <mat-hint class="season-form__error" role="alert">{{ err }}</mat-hint>
            }
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline">
          <mat-label>Status</mat-label>
          <mat-select [value]="model().status" (selectionChange)="setStatus($event.value)">
            @for (s of statuses; track s) {
              <mat-option [value]="s">{{ statusLabels[s] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Format</mat-label>
          <mat-select [value]="model().format" (selectionChange)="setFormat($event.value)">
            @for (f of formats; track f) {
              <mat-option [value]="f">{{ formatLabels[f] }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        @if (saveError(); as err) {
          <p class="season-form__error" role="alert">{{ err }}</p>
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
    .season-form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      min-width: min(460px, 80vw);
      padding-top: 0.5rem;
    }
    .season-form__row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }
    .season-form__row mat-form-field {
      flex: 1 1 160px;
    }
    .season-form__error {
      color: var(--mat-sys-error);
    }
  `,
})
export class SeasonForm {
  private readonly dialogRef = inject<MatDialogRef<SeasonForm, boolean>>(MatDialogRef);
  private readonly data = inject<SeasonFormData | null>(MAT_DIALOG_DATA, { optional: true });
  private readonly seasonsService = inject(SeasonsService);

  protected readonly firstError = firstError;
  protected readonly statusLabels = SEASON_STATUS_LABELS;
  protected readonly formatLabels = SEASON_FORMAT_LABELS;
  protected readonly statuses = Object.keys(SEASON_STATUS_LABELS) as SeasonStatus[];
  protected readonly formats = Object.keys(SEASON_FORMAT_LABELS) as SeasonFormat[];

  protected readonly isEdit = !!this.data?.season;
  protected readonly title = this.isEdit ? 'Saison bearbeiten' : 'Neue Saison';
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly model = signal<SeasonInput>(
    this.data?.season
      ? { ...this.data.season }
      : {
          name: '',
          startDate: this.today(),
          endDate: this.today(),
          status: 'upcoming',
          format: 'round-robin-playoffs',
        },
  );

  protected readonly form = form(this.model, (path) => {
    required(path.name, { message: 'Name ist erforderlich.' });
    required(path.startDate, { message: 'Beginn ist erforderlich.' });
    required(path.endDate, { message: 'Ende ist erforderlich.' });
    validate(path.endDate, ({ valueOf }) => {
      const start = valueOf(path.startDate);
      const end = valueOf(path.endDate);
      return start && end && end < start
        ? { kind: 'range', message: 'Ende muss nach dem Beginn liegen.' }
        : null;
    });
  });

  protected setStatus(status: SeasonStatus): void {
    this.model.update((m) => ({ ...m, status }));
  }

  protected setFormat(format: SeasonFormat): void {
    this.model.update((m) => ({ ...m, format }));
  }

  protected async save(): Promise<void> {
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const ok = await submit(this.form, async () => {
        if (this.isEdit && this.data?.season) {
          await this.seasonsService.update(this.data.season.id, this.model());
        } else {
          await this.seasonsService.create(this.model());
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

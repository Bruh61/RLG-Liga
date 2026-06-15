import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { form, validate, submit } from '@angular/forms/signals';

import { Match, MatchInput, gamesToWin } from '../../../core/models';
import { firstError } from '../../../shared/forms/field-error';
import { MatchesService } from '../matches.service';
import { TeamsService } from '../../teams/teams.service';

export interface MatchResultDialogData {
  match: Match;
}

interface ResultModel {
  homeScore: number;
  awayScore: number;
}

/** Records a finished series result, validating it against the best-of format. */
@Component({
  selector: 'app-match-result-dialog',
  imports: [MatDialogModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Ergebnis eintragen</h2>
    <form (submit)="$event.preventDefault(); save()">
      <mat-dialog-content class="result-form">
        <p class="result-form__hint">
          Best of {{ match.bestOf }} — der Sieger braucht {{ win }} Spiele.
        </p>

        <div class="result-form__scores">
          <div class="result-form__side">
            <span class="result-form__team">{{ teamName(match.homeTeamId) }}</span>
            <mat-form-field appearance="outline">
              <mat-label>Heim</mat-label>
              <input
                matInput
                #homeIn
                type="number"
                min="0"
                [max]="win"
                [value]="model().homeScore"
                (input)="setHome(homeIn.valueAsNumber)"
              />
            </mat-form-field>
          </div>

          <span class="result-form__colon">:</span>

          <div class="result-form__side">
            <span class="result-form__team">{{ teamName(match.awayTeamId) }}</span>
            <mat-form-field appearance="outline">
              <mat-label>Auswärts</mat-label>
              <input
                matInput
                #awayIn
                type="number"
                min="0"
                [max]="win"
                [value]="model().awayScore"
                (input)="setAway(awayIn.valueAsNumber)"
              />
            </mat-form-field>
          </div>
        </div>

        @if (firstError(form.homeScore()); as err) {
          <p class="result-form__error" role="alert">{{ err }}</p>
        }
        @if (saveError(); as err) {
          <p class="result-form__error" role="alert">{{ err }}</p>
        }
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" [mat-dialog-close]="false">Abbrechen</button>
        <button mat-flat-button type="submit" [disabled]="form().invalid() || saving()">
          Speichern
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: `
    .result-form {
      min-width: min(420px, 80vw);
      padding-top: 0.5rem;
    }
    .result-form__hint {
      margin: 0 0 0.75rem;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
    .result-form__scores {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .result-form__side {
      display: flex;
      flex-direction: column;
      flex: 1;
      gap: 0.25rem;
    }
    .result-form__team {
      font: var(--mat-sys-label-large);
    }
    .result-form__colon {
      font: var(--mat-sys-headline-small);
      padding-top: 1.25rem;
    }
    .result-form__error {
      margin: 0.25rem 0 0;
      color: var(--mat-sys-error);
      font: var(--mat-sys-body-small);
    }
  `,
})
export class MatchResultDialog {
  private readonly dialogRef = inject<MatDialogRef<MatchResultDialog, boolean>>(MatDialogRef);
  private readonly data = inject<MatchResultDialogData>(MAT_DIALOG_DATA);
  private readonly matchesService = inject(MatchesService);
  private readonly teamsService = inject(TeamsService);

  protected readonly firstError = firstError;
  protected readonly match = this.data.match;
  protected readonly win = gamesToWin(this.match.bestOf);
  protected readonly saving = signal(false);
  protected readonly saveError = signal<string | null>(null);

  protected readonly model = signal<ResultModel>({
    homeScore: this.match.homeScore,
    awayScore: this.match.awayScore,
  });

  protected readonly form = form(this.model, (path) => {
    validate(path.homeScore, ({ valueOf }) =>
      this.validSeries(valueOf(path.homeScore), valueOf(path.awayScore))
        ? null
        : {
            kind: 'series',
            message: `Ungültiges Ergebnis: Der Sieger muss genau ${this.win} Spiele gewinnen.`,
          },
    );
  });

  protected teamName(teamId: string): string {
    return this.teamsService.byId().get(teamId)?.name ?? teamId;
  }

  protected setHome(value: number): void {
    this.model.update((m) => ({ ...m, homeScore: this.clamp(value) }));
  }

  protected setAway(value: number): void {
    this.model.update((m) => ({ ...m, awayScore: this.clamp(value) }));
  }

  protected async save(): Promise<void> {
    this.saveError.set(null);
    this.saving.set(true);
    try {
      const ok = await submit(this.form, async () => {
        const m = this.model();
        const value: MatchInput = {
          seasonId: this.match.seasonId,
          homeTeamId: this.match.homeTeamId,
          awayTeamId: this.match.awayTeamId,
          scheduledAt: this.match.scheduledAt,
          status: 'finished',
          stage: this.match.stage,
          bestOf: this.match.bestOf,
          homeScore: m.homeScore,
          awayScore: m.awayScore,
          round: this.match.round,
        };
        await this.matchesService.update(this.match.id, value);
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

  private validSeries(home: number, away: number): boolean {
    if (home === away) {
      return false;
    }
    const hi = Math.max(home, away);
    const lo = Math.min(home, away);
    return hi === this.win && lo >= 0 && lo < this.win;
  }

  private clamp(value: number): number {
    if (Number.isNaN(value)) {
      return 0;
    }
    return Math.max(0, Math.min(this.win, Math.trunc(value)));
  }
}

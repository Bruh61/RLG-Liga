import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { MatchResultDialog } from './match-result-dialog';
import { Match } from '../../../core/models';

interface ResultInternals {
  model: { set(value: { homeScore: number; awayScore: number }): void };
  form: () => { valid: () => boolean };
}

const bo5Match: Match = {
  id: 'm1',
  seasonId: 's2',
  homeTeamId: 't1',
  awayTeamId: 't2',
  scheduledAt: '2026-05-16T18:00',
  status: 'scheduled',
  stage: 'regular',
  bestOf: 5,
  homeScore: 0,
  awayScore: 0,
};

function setup(): ResultInternals {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MatDialogRef, useValue: { close: () => undefined } },
      { provide: MAT_DIALOG_DATA, useValue: { match: bo5Match } },
    ],
  });
  return TestBed.createComponent(MatchResultDialog).componentInstance as unknown as ResultInternals;
}

describe('MatchResultDialog (best-of validation)', () => {
  it('accepts a valid Best-of-5 result (winner reaches 3)', () => {
    const cmp = setup();
    cmp.model.set({ homeScore: 3, awayScore: 1 });
    expect(cmp.form().valid()).toBe(true);
  });

  it('rejects a draw and an unfinished series', () => {
    const cmp = setup();
    cmp.model.set({ homeScore: 3, awayScore: 3 });
    expect(cmp.form().valid()).toBe(false);
    cmp.model.set({ homeScore: 2, awayScore: 1 });
    expect(cmp.form().valid()).toBe(false);
  });
});

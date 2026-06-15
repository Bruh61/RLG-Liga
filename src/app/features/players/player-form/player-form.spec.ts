import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PlayerForm } from './player-form';
import { Player } from '../../../core/models';

interface PlayerFormInternals {
  model: {
    set(value: {
      gamertag: string;
      realName: string;
      platform: string;
      teamId: string | null;
      isCaptain: boolean;
      joinedAt: string;
    }): void;
  };
  form: () => { valid: () => boolean };
}

function setup(existingPlayers: Player[]): PlayerFormInternals {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MatDialogRef, useValue: { close: () => undefined } },
      { provide: MAT_DIALOG_DATA, useValue: null },
    ],
  });
  const fixture = TestBed.createComponent(PlayerForm);
  const httpMock = TestBed.inject(HttpTestingController);
  fixture.detectChanges();
  // Resolve the eager players/teams reads (players gets the captain fixture).
  httpMock
    .match((r) => r.method === 'GET')
    .forEach((r) => r.flush(r.request.url.includes('/players') ? existingPlayers : []));
  return fixture.componentInstance as unknown as PlayerFormInternals;
}

describe('PlayerForm (Signal Forms validation)', () => {
  it('requires a gamertag', () => {
    const cmp = setup([]);
    cmp.model.set({
      gamertag: '',
      realName: '',
      platform: 'epic',
      teamId: null,
      isCaptain: false,
      joinedAt: '2026-01-01',
    });
    expect(cmp.form().valid()).toBe(false);
  });

  it('enforces at most one captain per team', async () => {
    const existing: Player[] = [
      {
        id: 'p1',
        gamertag: 'Cap',
        platform: 'epic',
        teamId: 't1',
        isCaptain: true,
        joinedAt: '2025-01-01',
      },
    ];
    const cmp = setup(existing);
    await Promise.resolve();

    // New captain on a team that already has one → invalid.
    cmp.model.set({
      gamertag: 'Rookie',
      realName: '',
      platform: 'epic',
      teamId: 't1',
      isCaptain: true,
      joinedAt: '2026-01-01',
    });
    expect(cmp.form().valid()).toBe(false);

    // Same player, not captain → valid.
    cmp.model.set({
      gamertag: 'Rookie',
      realName: '',
      platform: 'epic',
      teamId: 't1',
      isCaptain: false,
      joinedAt: '2026-01-01',
    });
    expect(cmp.form().valid()).toBe(true);
  });
});

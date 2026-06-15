import { TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { TeamForm } from './team-form';
import { TeamInput } from '../../../core/models';

// Minimal view of the component internals we assert on (avoids `any`).
interface TeamFormInternals {
  model: { set(value: TeamInput): void };
  form: () => { valid: () => boolean; invalid: () => boolean };
}

function createForm(): TeamFormInternals {
  TestBed.configureTestingModule({
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: MatDialogRef, useValue: { close: () => undefined } },
      { provide: MAT_DIALOG_DATA, useValue: null },
    ],
  });
  return TestBed.createComponent(TeamForm).componentInstance as unknown as TeamFormInternals;
}

describe('TeamForm (Signal Forms validation)', () => {
  it('is invalid while required fields are empty', () => {
    const cmp = createForm();
    expect(cmp.form().invalid()).toBe(true);
  });

  it('is valid with proper values and rejects an overlong tag', () => {
    const cmp = createForm();

    cmp.model.set({ name: 'Aces', tag: 'ACE', colorPrimary: '#ffffff', foundedAt: '2026-01-01' });
    expect(cmp.form().valid()).toBe(true);

    cmp.model.set({
      name: 'Aces',
      tag: 'TOOLONG',
      colorPrimary: '#ffffff',
      foundedAt: '2026-01-01',
    });
    expect(cmp.form().valid()).toBe(false);
  });
});

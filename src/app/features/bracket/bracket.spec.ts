import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Bracket } from './bracket';
import { Season, Team } from '../../core/models';

interface BracketInternals {
  seeds: () => string[];
  semifinals: () => { key: string; a: string | null; b: string | null }[];
  finalMatch: () => { a: string | null; b: string | null };
  champion: () => string | null;
  advanceSemi: (slot: string, teamId: string | null) => void;
  advanceFinal: (teamId: string | null) => void;
}

describe('Bracket', () => {
  it('seeds the top 4 teams, pairs 1v4 / 2v3, and advances winners to the final', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    const fixture = TestBed.createComponent(Bracket);
    const httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const teams: Team[] = ['t1', 't2', 't3', 't4', 't5'].map((id) => ({
      id,
      name: `Team ${id}`,
      tag: id.toUpperCase(),
      colorPrimary: '#101010',
      foundedAt: '2025-01-01',
    }));
    const seasons: Season[] = [
      {
        id: 's2',
        name: 'Sommer 2026',
        startDate: '2026-05-15',
        endDate: '2026-08-15',
        status: 'active',
        format: 'round-robin-playoffs',
      },
    ];
    httpMock
      .match((r) => r.method === 'GET')
      .forEach((req) => {
        if (req.request.url.includes('/teams')) {
          req.flush(teams);
        } else if (req.request.url.includes('/seasons')) {
          req.flush(seasons);
        } else {
          req.flush([]);
        }
      });
    await Promise.resolve();
    fixture.detectChanges();

    const cmp = fixture.componentInstance as unknown as BracketInternals;
    expect(cmp.seeds()).toEqual(['t1', 't2', 't3', 't4']);

    const [sf1, sf2] = cmp.semifinals();
    expect([sf1.a, sf1.b]).toEqual(['t1', 't4']);
    expect([sf2.a, sf2.b]).toEqual(['t2', 't3']);

    cmp.advanceSemi('sf1', 't1');
    cmp.advanceSemi('sf2', 't2');
    expect([cmp.finalMatch().a, cmp.finalMatch().b]).toEqual(['t1', 't2']);

    cmp.advanceFinal('t1');
    expect(cmp.champion()).toBe('t1');
  });
});

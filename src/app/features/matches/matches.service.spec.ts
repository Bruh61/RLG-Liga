import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { MatchesService } from './matches.service';
import { Match } from '../../core/models';
import { environment } from '../../../environments/environment';

describe('MatchesService', () => {
  let service: MatchesService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/matches`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(MatchesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('update() PUTs the match with its id (used to record results)', async () => {
    const updating = service.update('m1', {
      seasonId: 's2',
      homeTeamId: 't1',
      awayTeamId: 't2',
      scheduledAt: '2026-05-16T18:00',
      status: 'finished',
      stage: 'regular',
      bestOf: 5,
      homeScore: 3,
      awayScore: 1,
    });
    const req = httpMock.expectOne((r) => r.method === 'PUT' && r.url === `${base}/m1`);
    expect((req.request.body as Match).status).toBe('finished');
    req.flush(req.request.body);
    await updating;
    httpMock.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
  });
});

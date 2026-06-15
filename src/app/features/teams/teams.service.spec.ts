import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TeamsService } from './teams.service';
import { Team } from '../../core/models';
import { environment } from '../../../environments/environment';

describe('TeamsService', () => {
  let service: TeamsService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/teams`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(TeamsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // The read resource loads eagerly; drain any GETs we don't assert on.
  function drainGets(): void {
    httpMock.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
  }

  it('create() posts a new team with a client-generated string id', async () => {
    const promise = service.create({
      name: 'Aces',
      tag: 'ACE',
      colorPrimary: '#ffffff',
      foundedAt: '2026-01-01',
    });

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === base);
    const body = req.request.body as Team;
    expect(typeof body.id).toBe('string');
    expect(body.id.length).toBeGreaterThan(0);
    expect(body.name).toBe('Aces');

    req.flush(body);
    await promise;
    drainGets();
  });

  it('update() PUTs to the team url and remove() DELETEs it', async () => {
    const updating = service.update('t1', {
      name: 'Neu',
      tag: 'NEU',
      colorPrimary: '#000000',
      foundedAt: '2026-01-01',
    });
    const put = httpMock.expectOne((r) => r.method === 'PUT' && r.url === `${base}/t1`);
    expect((put.request.body as Team).id).toBe('t1');
    put.flush(put.request.body);
    await updating;

    const removing = service.remove('t1');
    const del = httpMock.expectOne((r) => r.method === 'DELETE' && r.url === `${base}/t1`);
    del.flush(null);
    await removing;

    drainGets();
  });
});

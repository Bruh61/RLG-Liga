import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { PlayersService } from './players.service';
import { Player } from '../../core/models';
import { environment } from '../../../environments/environment';

describe('PlayersService', () => {
  let service: PlayersService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/players`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(PlayersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  function drainGets(): void {
    httpMock.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
  }

  it('create() posts a player with a generated id and the free-agent team kept null', async () => {
    const promise = service.create({
      gamertag: 'Rookie',
      platform: 'steam',
      teamId: null,
      isCaptain: false,
      joinedAt: '2026-01-01',
    });

    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === base);
    const body = req.request.body as Player;
    expect(typeof body.id).toBe('string');
    expect(body.teamId).toBeNull();
    req.flush(body);
    await promise;
    drainGets();
  });

  it('remove() DELETEs the player url', async () => {
    const removing = service.remove('p1');
    const del = httpMock.expectOne((r) => r.method === 'DELETE' && r.url === `${base}/p1`);
    del.flush(null);
    await removing;
    drainGets();
  });
});

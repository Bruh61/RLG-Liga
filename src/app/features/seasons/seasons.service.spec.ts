import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SeasonsService } from './seasons.service';
import { Season } from '../../core/models';
import { environment } from '../../../environments/environment';

describe('SeasonsService', () => {
  let service: SeasonsService;
  let httpMock: HttpTestingController;
  const base = `${environment.apiBaseUrl}/seasons`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(SeasonsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('create() posts a season with a generated id', async () => {
    const promise = service.create({
      name: 'Season X',
      startDate: '2026-01-01',
      endDate: '2026-03-01',
      status: 'upcoming',
      format: 'round-robin',
    });
    const req = httpMock.expectOne((r) => r.method === 'POST' && r.url === base);
    expect(typeof (req.request.body as Season).id).toBe('string');
    req.flush(req.request.body);
    await promise;
    httpMock.match((r) => r.method === 'GET').forEach((r) => r.flush([]));
  });
});

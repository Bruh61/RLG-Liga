import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { TeamsList } from './teams-list';
import { Team } from '../../../core/models';
import { environment } from '../../../../environments/environment';

describe('TeamsList', () => {
  it('renders one table row per loaded team', async () => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    const fixture = TestBed.createComponent(TeamsList);
    const httpMock = TestBed.inject(HttpTestingController);

    // First CD runs the resource effect, which issues the GET.
    fixture.detectChanges();
    const teams: Team[] = [
      {
        id: 't1',
        name: 'Berlin Boosters',
        tag: 'BBO',
        colorPrimary: '#D32F2F',
        foundedAt: '2024-09-01',
      },
      {
        id: 't2',
        name: 'München Mavericks',
        tag: 'MUC',
        colorPrimary: '#1565C0',
        foundedAt: '2024-09-03',
      },
    ];
    httpMock.expectOne(`${environment.apiBaseUrl}/teams`).flush(teams);

    // Let the resource propagate its value, then re-render.
    await Promise.resolve();
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('tr[mat-row]').length).toBe(2);
    expect(el.textContent).toContain('Berlin Boosters');
    expect(el.textContent).toContain('MUC');

    httpMock.verify();
  });
});

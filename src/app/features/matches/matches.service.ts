import { Injectable, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Match, MatchInput } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class MatchesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/matches`;

  readonly matches = httpResource<Match[]>(() => this.baseUrl, { defaultValue: [] });
  readonly isLoading = this.matches.isLoading;
  readonly error = this.matches.error;

  async create(input: MatchInput): Promise<Match> {
    const match: Match = { ...input, id: crypto.randomUUID() };
    const created = await firstValueFrom(this.http.post<Match>(this.baseUrl, match));
    this.matches.reload();
    return created;
  }

  async update(id: string, input: MatchInput): Promise<Match> {
    const updated = await firstValueFrom(
      this.http.put<Match>(`${this.baseUrl}/${id}`, { ...input, id }),
    );
    this.matches.reload();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
    this.matches.reload();
  }
}

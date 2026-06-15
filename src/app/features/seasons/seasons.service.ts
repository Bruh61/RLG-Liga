import { Injectable, computed, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Season, SeasonInput } from '../../core/models';

@Injectable({ providedIn: 'root' })
export class SeasonsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/seasons`;

  readonly seasons = httpResource<Season[]>(() => this.baseUrl, { defaultValue: [] });
  readonly isLoading = this.seasons.isLoading;
  readonly error = this.seasons.error;

  readonly byId = computed(() => new Map(this.seasons.value().map((s) => [s.id, s])));

  /** The active season if there is one, otherwise the most recent entry. */
  readonly activeSeason = computed(() => {
    const list = this.seasons.value();
    return list.find((s) => s.status === 'active') ?? list[0];
  });

  async create(input: SeasonInput): Promise<Season> {
    const season: Season = { ...input, id: crypto.randomUUID() };
    const created = await firstValueFrom(this.http.post<Season>(this.baseUrl, season));
    this.seasons.reload();
    return created;
  }

  async update(id: string, input: SeasonInput): Promise<Season> {
    const updated = await firstValueFrom(
      this.http.put<Season>(`${this.baseUrl}/${id}`, { ...input, id }),
    );
    this.seasons.reload();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
    this.seasons.reload();
  }
}

import { Injectable, computed, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Team, TeamInput } from '../../core/models';

/**
 * Teams domain service — the CRUD reference for the app.
 * Reads via `httpResource` (reactive, reloadable); writes via `HttpClient`
 * (httpResource is read-only by design) and then reload the read.
 */
@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/teams`;

  /** Reactive list of all teams; mutations below call `.reload()`. */
  readonly teams = httpResource<Team[]>(() => this.baseUrl, { defaultValue: [] });

  readonly isLoading = this.teams.isLoading;
  readonly error = this.teams.error;

  /** id → Team lookup, reused by badges, players and standings. */
  readonly byId = computed(() => new Map(this.teams.value().map((team) => [team.id, team])));

  async create(input: TeamInput): Promise<Team> {
    // Generate the id client-side so behaviour is independent of the mock backend.
    const team: Team = { ...input, id: crypto.randomUUID() };
    const created = await firstValueFrom(this.http.post<Team>(this.baseUrl, team));
    this.teams.reload();
    return created;
  }

  async update(id: string, input: TeamInput): Promise<Team> {
    const updated = await firstValueFrom(
      this.http.put<Team>(`${this.baseUrl}/${id}`, { ...input, id }),
    );
    this.teams.reload();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
    this.teams.reload();
  }
}

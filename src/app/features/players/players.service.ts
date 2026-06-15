import { Injectable, computed, inject } from '@angular/core';
import { HttpClient, httpResource } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Player, PlayerInput } from '../../core/models';

/** Players domain service — mirrors {@link TeamsService} (the CRUD blueprint). */
@Injectable({ providedIn: 'root' })
export class PlayersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/players`;

  readonly players = httpResource<Player[]>(() => this.baseUrl, { defaultValue: [] });
  readonly isLoading = this.players.isLoading;
  readonly error = this.players.error;

  readonly byId = computed(
    () => new Map(this.players.value().map((player) => [player.id, player])),
  );

  async create(input: PlayerInput): Promise<Player> {
    const player: Player = { ...input, id: crypto.randomUUID() };
    const created = await firstValueFrom(this.http.post<Player>(this.baseUrl, player));
    this.players.reload();
    return created;
  }

  async update(id: string, input: PlayerInput): Promise<Player> {
    const updated = await firstValueFrom(
      this.http.put<Player>(`${this.baseUrl}/${id}`, { ...input, id }),
    );
    this.players.reload();
    return updated;
  }

  async remove(id: string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${id}`));
    this.players.reload();
  }
}

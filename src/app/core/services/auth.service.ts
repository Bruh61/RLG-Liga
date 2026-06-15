import { Injectable, computed, signal } from '@angular/core';

export interface AuthUser {
  name: string;
}

const STORAGE_KEY = 'rlg-auth';

/**
 * Minimal demo auth: any credentials log in and the session is persisted to
 * localStorage. Real apps would call a backend; here it showcases the
 * signal-based auth state + guard + interceptor wiring.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _user = signal<AuthUser | null>(this.readStored());

  readonly user = this._user.asReadonly();
  readonly isAuthenticated = computed(() => this._user() !== null);

  /** Fake bearer token derived from the session, attached by the auth interceptor. */
  get token(): string | null {
    const user = this._user();
    return user ? `demo-token-${user.name}` : null;
  }

  login(username: string): void {
    const user: AuthUser = { name: username };
    this._user.set(user);
    this.persist(user);
  }

  logout(): void {
    this._user.set(null);
    this.persist(null);
  }

  private persist(user: AuthUser | null): void {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // localStorage may be unavailable — non-critical.
    }
  }

  private readStored(): AuthUser | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  }
}

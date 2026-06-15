import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('starts logged out and logs in/out, exposing a token while authenticated', () => {
    const auth = TestBed.inject(AuthService);
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.token).toBeNull();

    auth.login('emre');
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()?.name).toBe('emre');
    expect(auth.token).toContain('emre');

    auth.logout();
    expect(auth.isAuthenticated()).toBe(false);
    expect(auth.token).toBeNull();
  });

  it('restores a persisted session', () => {
    localStorage.setItem('rlg-auth', JSON.stringify({ name: 'persisted' }));
    const auth = TestBed.inject(AuthService);
    expect(auth.isAuthenticated()).toBe(true);
    expect(auth.user()?.name).toBe('persisted');
  });
});

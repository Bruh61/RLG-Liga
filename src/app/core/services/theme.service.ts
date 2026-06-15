import { Injectable, computed, signal } from '@angular/core';

export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'rlg-theme';

/**
 * App-wide light/dark theme state. Dark is the default brand look; the chosen
 * mode is persisted and reflected on `<body>` via the `light-mode` class, which
 * flips the M3 `color-scheme` (see `styles/_theme.scss`).
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _mode = signal<ThemeMode>(this.readInitial());

  readonly mode = this._mode.asReadonly();
  readonly isDark = computed(() => this._mode() === 'dark');

  constructor() {
    this.apply(this._mode());
  }

  toggle(): void {
    this.set(this._mode() === 'dark' ? 'light' : 'dark');
  }

  set(mode: ThemeMode): void {
    this._mode.set(mode);
    this.apply(mode);
  }

  private apply(mode: ThemeMode): void {
    document.body.classList.toggle('light-mode', mode === 'light');
    try {
      localStorage.setItem(STORAGE_KEY, mode);
    } catch {
      // localStorage may be unavailable (private mode etc.) — non-critical.
    }
  }

  private readInitial(): ThemeMode {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  }
}

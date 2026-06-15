import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.body.classList.remove('light-mode');
    TestBed.configureTestingModule({});
  });

  it('defaults to dark mode', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('dark');
    expect(service.isDark()).toBe(true);
    expect(document.body.classList.contains('light-mode')).toBe(false);
  });

  it('toggles between dark and light, syncing the body class and storage', () => {
    const service = TestBed.inject(ThemeService);

    service.toggle();
    expect(service.mode()).toBe('light');
    expect(service.isDark()).toBe(false);
    expect(document.body.classList.contains('light-mode')).toBe(true);
    expect(localStorage.getItem('rlg-theme')).toBe('light');

    service.toggle();
    expect(service.isDark()).toBe(true);
    expect(document.body.classList.contains('light-mode')).toBe(false);
  });
});

import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'login',
    title: 'Anmelden · RLG Liga',
    loadComponent: () => import('./features/auth/login/login').then((m) => m.Login),
  },

  // Public read-only views.
  {
    path: 'dashboard',
    title: 'Dashboard · RLG Liga',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'standings',
    title: 'Tabelle · RLG Liga',
    loadComponent: () => import('./features/standings/standings').then((m) => m.Standings),
  },

  // Admin area — requires sign-in (auth guard).
  {
    path: 'teams',
    title: 'Teams · RLG Liga',
    canActivate: [authGuard],
    loadComponent: () => import('./features/teams/teams-list/teams-list').then((m) => m.TeamsList),
  },
  {
    path: 'players',
    title: 'Spieler · RLG Liga',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/players/players-list/players-list').then((m) => m.PlayersList),
  },
  {
    path: 'seasons',
    title: 'Saisons · RLG Liga',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/seasons/seasons-list/seasons-list').then((m) => m.SeasonsList),
  },
  {
    path: 'matches',
    title: 'Matches · RLG Liga',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/matches/match-schedule/match-schedule').then((m) => m.MatchSchedule),
  },
  {
    path: 'bracket',
    title: 'Playoffs · RLG Liga',
    canActivate: [authGuard],
    loadComponent: () => import('./features/bracket/bracket').then((m) => m.Bracket),
  },

  { path: '**', redirectTo: 'dashboard' },
];

import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  {
    path: 'dashboard',
    title: 'Dashboard · RLG Liga',
    loadComponent: () => import('./features/dashboard/dashboard').then((m) => m.Dashboard),
  },
  {
    path: 'teams',
    title: 'Teams · RLG Liga',
    loadComponent: () => import('./features/teams/teams-list/teams-list').then((m) => m.TeamsList),
  },
  {
    path: 'players',
    title: 'Spieler · RLG Liga',
    loadComponent: () =>
      import('./features/players/players-list/players-list').then((m) => m.PlayersList),
  },
  {
    path: 'seasons',
    title: 'Saisons · RLG Liga',
    loadComponent: () =>
      import('./features/seasons/seasons-list/seasons-list').then((m) => m.SeasonsList),
  },
  {
    path: 'matches',
    title: 'Matches · RLG Liga',
    loadComponent: () =>
      import('./features/matches/match-schedule/match-schedule').then((m) => m.MatchSchedule),
  },
  {
    path: 'standings',
    title: 'Tabelle · RLG Liga',
    loadComponent: () => import('./features/standings/standings').then((m) => m.Standings),
  },
  {
    path: 'bracket',
    title: 'Playoffs · RLG Liga',
    loadComponent: () => import('./features/bracket/bracket').then((m) => m.Bracket),
  },
  { path: '**', redirectTo: 'dashboard' },
];

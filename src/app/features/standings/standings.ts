import { Component } from '@angular/core';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-standings',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Tabelle" subtitle="Berechnet aus den Match-Ergebnissen" />
    <app-empty-state icon="leaderboard" message="Die Liga-Tabelle folgt in Phase 5." />
  `,
})
export class Standings {}

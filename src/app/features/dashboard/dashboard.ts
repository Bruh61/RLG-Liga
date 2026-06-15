import { Component } from '@angular/core';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-dashboard',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Dashboard" subtitle="Übersicht über Teams, Spieler und Matches" />
    <app-empty-state
      icon="insights"
      message="Das Dashboard mit Kennzahlen und Charts folgt in Phase 7."
    />
  `,
})
export class Dashboard {}

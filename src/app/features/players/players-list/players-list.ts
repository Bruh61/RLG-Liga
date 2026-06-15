import { Component } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-players-list',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Spieler" subtitle="Verwalte Spieler und Team-Zuordnungen" />
    <app-empty-state icon="person" message="Die Spieler-Verwaltung folgt in Phase 3." />
  `,
})
export class PlayersList {}

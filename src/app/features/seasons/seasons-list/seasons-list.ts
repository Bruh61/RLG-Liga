import { Component } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-seasons-list',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Saisons" subtitle="Plane Saisons und ihren Verlauf" />
    <app-empty-state icon="calendar_month" message="Die Saison-Verwaltung folgt in Phase 4." />
  `,
})
export class SeasonsList {}

import { Component } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-teams-list',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Teams" subtitle="Verwalte die Teams der Liga" />
    <app-empty-state icon="groups" message="Die Team-Verwaltung folgt in Phase 2." />
  `,
})
export class TeamsList {}

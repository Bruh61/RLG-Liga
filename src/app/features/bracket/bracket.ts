import { Component } from '@angular/core';
import { PageHeader } from '../../shared/components/page-header/page-header';
import { EmptyState } from '../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-bracket',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Playoffs" subtitle="Bracket & Seeding" />
    <app-empty-state icon="account_tree" message="Das Playoff-Bracket folgt in Phase 6." />
  `,
})
export class Bracket {}

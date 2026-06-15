import { Component } from '@angular/core';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-match-schedule',
  imports: [PageHeader, EmptyState],
  template: `
    <app-page-header title="Matches" subtitle="Plane und verwalte die Spiele einer Saison" />
    <app-empty-state icon="sports_esports" message="Die Match-Planung folgt in Phase 4." />
  `,
})
export class MatchSchedule {}

import { Component, input } from '@angular/core';

/**
 * Presentational page heading: title + optional subtitle, with a projection
 * slot on the right for page-level actions (e.g. a "New team" button).
 */
@Component({
  selector: 'app-page-header',
  template: `
    <header class="page-header">
      <div class="page-header__text">
        <h1 class="page-header__title">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="page-header__subtitle">{{ subtitle() }}</p>
        }
      </div>
      <div class="page-header__actions">
        <ng-content />
      </div>
    </header>
  `,
  styles: `
    .page-header {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      align-items: flex-start;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    .page-header__title {
      margin: 0;
      font: var(--mat-sys-headline-medium);
      color: var(--mat-sys-on-surface);
    }
    .page-header__subtitle {
      margin: 0.25rem 0 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-medium);
    }
    .page-header__actions {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
  `,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input<string>();
}

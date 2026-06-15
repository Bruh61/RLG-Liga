import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

/** Reusable empty/placeholder state with an icon, a message and an optional action slot. */
@Component({
  selector: 'app-empty-state',
  imports: [MatIconModule],
  template: `
    <div class="empty-state" role="status">
      <mat-icon class="empty-state__icon" aria-hidden="true">{{ icon() }}</mat-icon>
      <p class="empty-state__message">{{ message() }}</p>
      <ng-content />
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      padding: 3rem 1.5rem;
      text-align: center;
      color: var(--mat-sys-on-surface-variant);
    }
    .empty-state__icon {
      width: 48px;
      height: 48px;
      font-size: 48px;
      line-height: 48px;
      color: var(--mat-sys-outline);
    }
    .empty-state__message {
      margin: 0;
      font: var(--mat-sys-body-large);
    }
  `,
})
export class EmptyState {
  readonly icon = input('inbox');
  readonly message = input.required<string>();
}

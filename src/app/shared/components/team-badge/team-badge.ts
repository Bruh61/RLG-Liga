import { Component, computed, input } from '@angular/core';
import { Team } from '../../../core/models';

/** Colored tag chip for a team, with an optional team name beside it. */
@Component({
  selector: 'app-team-badge',
  template: `
    <span class="team-badge">
      <span
        class="team-badge__tag"
        [style.background]="team().colorPrimary"
        [style.color]="textColor()"
      >
        {{ team().tag }}
      </span>
      @if (showName()) {
        <span class="team-badge__name">{{ team().name }}</span>
      }
    </span>
  `,
  styles: `
    .team-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .team-badge__tag {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.75rem;
      padding: 0.15rem 0.5rem;
      border-radius: 6px;
      font: var(--mat-sys-label-medium);
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .team-badge__name {
      font: var(--mat-sys-body-medium);
    }
  `,
})
export class TeamBadge {
  readonly team = input.required<Team>();
  readonly showName = input(false);

  /** Pick black/white text for legible contrast on the team color. */
  protected readonly textColor = computed(() =>
    this.isLight(this.team().colorPrimary) ? '#000' : '#fff',
  );

  private isLight(hex: string): boolean {
    const c = hex.replace('#', '');
    if (c.length < 6) {
      return false;
    }
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    // Perceived luminance (ITU-R BT.601).
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.6;
  }
}

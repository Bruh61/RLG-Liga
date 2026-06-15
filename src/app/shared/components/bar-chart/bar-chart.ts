import { Component, computed, input } from '@angular/core';

export interface BarDatum {
  label: string;
  value: number;
  color: string;
}

/** Dependency-free horizontal bar chart. Bars are scaled to the largest value. */
@Component({
  selector: 'app-bar-chart',
  template: `
    <figure class="bar-chart">
      <figcaption class="bar-chart__title">{{ title() }}</figcaption>
      @for (item of scaled(); track item.label) {
        <div class="bar-chart__row">
          <span class="bar-chart__label">{{ item.label }}</span>
          <div class="bar-chart__track">
            <div
              class="bar-chart__bar"
              [style.width.%]="item.pct"
              [style.background]="item.color"
            ></div>
          </div>
          <span class="bar-chart__value">{{ item.value }}</span>
        </div>
      } @empty {
        <p class="bar-chart__empty">Keine Daten.</p>
      }
    </figure>
  `,
  styles: `
    .bar-chart {
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .bar-chart__title {
      font: var(--mat-sys-title-small);
      color: var(--mat-sys-on-surface-variant);
      margin-bottom: 0.25rem;
    }
    .bar-chart__row {
      display: grid;
      grid-template-columns: 3rem 1fr 2rem;
      align-items: center;
      gap: 0.5rem;
    }
    .bar-chart__label {
      font: var(--mat-sys-label-medium);
      font-weight: 600;
    }
    .bar-chart__track {
      background: var(--mat-sys-surface-container-highest);
      border-radius: 999px;
      overflow: hidden;
    }
    .bar-chart__bar {
      height: 0.8rem;
      border-radius: 999px;
      min-width: 2px;
      transition: width 300ms ease;
    }
    .bar-chart__value {
      text-align: right;
      font-variant-numeric: tabular-nums;
      font: var(--mat-sys-body-small);
    }
    .bar-chart__empty {
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
  `,
})
export class BarChart {
  readonly title = input.required<string>();
  readonly data = input.required<readonly BarDatum[]>();

  protected readonly scaled = computed(() => {
    const max = Math.max(1, ...this.data().map((d) => d.value));
    return this.data().map((d) => ({ ...d, pct: Math.round((d.value / max) * 100) }));
  });
}

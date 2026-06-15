import { Component, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

/** Primary navigation list. Emits `navigated` so the shell can close the drawer on mobile. */
@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  template: `
    <mat-nav-list>
      @for (item of items; track item.path) {
        <a
          mat-list-item
          [routerLink]="item.path"
          routerLinkActive
          #rla="routerLinkActive"
          [activated]="rla.isActive"
          (click)="navigated.emit()"
        >
          <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
          <span matListItemTitle>{{ item.label }}</span>
        </a>
      }
    </mat-nav-list>
  `,
})
export class Nav {
  readonly navigated = output<void>();

  protected readonly items: readonly NavItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Teams', path: '/teams', icon: 'groups' },
    { label: 'Spieler', path: '/players', icon: 'person' },
    { label: 'Saisons', path: '/seasons', icon: 'calendar_month' },
    { label: 'Matches', path: '/matches', icon: 'sports_esports' },
    { label: 'Tabelle', path: '/standings', icon: 'leaderboard' },
    { label: 'Playoffs', path: '/bracket', icon: 'account_tree' },
  ];
}

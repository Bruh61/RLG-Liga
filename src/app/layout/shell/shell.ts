import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

import { Nav } from '../nav/nav';
import { ThemeService } from '../../core/services/theme.service';

/** App shell: responsive sidenav drawer + toolbar wrapping the routed content. */
@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, MatSidenavModule, MatToolbarModule, MatButtonModule, MatIconModule, Nav],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  private readonly breakpoints = inject(BreakpointObserver);
  protected readonly theme = inject(ThemeService);

  /** True on phones/small tablets → the drawer becomes an overlay. */
  protected readonly isHandset = toSignal(
    this.breakpoints
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait])
      .pipe(map((result) => result.matches)),
    { initialValue: false },
  );

  protected closeOnHandset(sidenav: MatSidenav): void {
    if (this.isHandset()) {
      sidenav.close();
    }
  }
}

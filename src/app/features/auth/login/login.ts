import { Component, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormField, form, required, submit } from '@angular/forms/signals';

import { firstError } from '../../../shared/forms/field-error';
import { AuthService } from '../../../core/services/auth.service';

interface LoginModel {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    FormField,
  ],
  template: `
    <div class="login">
      <mat-card class="login__card" appearance="outlined">
        <div class="login__brand">
          <span class="login__brand-mark">RLG</span><span class="login__brand-text">Liga</span>
        </div>
        <p class="login__lead">Melde dich an, um den Admin-Bereich zu verwalten.</p>

        <form (submit)="$event.preventDefault(); onSubmit()">
          <mat-form-field appearance="outline">
            <mat-label>Benutzername</mat-label>
            <input matInput [formField]="form.username" autocomplete="username" />
            @if (firstError(form.username()); as err) {
              <mat-hint class="login__error" role="alert">{{ err }}</mat-hint>
            }
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Passwort</mat-label>
            <input
              matInput
              type="password"
              [formField]="form.password"
              autocomplete="current-password"
            />
            @if (firstError(form.password()); as err) {
              <mat-hint class="login__error" role="alert">{{ err }}</mat-hint>
            }
          </mat-form-field>

          <button mat-flat-button type="submit" class="login__submit" [disabled]="form().invalid()">
            <mat-icon>login</mat-icon>
            Anmelden
          </button>
        </form>

        <p class="login__hint">Demo: beliebige Zugangsdaten funktionieren.</p>
      </mat-card>
    </div>
  `,
  styles: `
    .login {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 70vh;
      padding: 1.5rem;
    }
    .login__card {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: min(380px, 100%);
      padding: 2rem;
    }
    .login__brand {
      display: flex;
      align-items: baseline;
      gap: 0.4rem;
      font: var(--mat-sys-headline-small);
    }
    .login__brand-mark {
      font-weight: 800;
      letter-spacing: 0.06em;
      color: var(--mat-sys-primary);
    }
    .login__lead {
      margin: 0 0 1rem;
      color: var(--mat-sys-on-surface-variant);
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .login__submit {
      margin-top: 0.5rem;
    }
    .login__error {
      color: var(--mat-sys-error);
    }
    .login__hint {
      margin: 1rem 0 0;
      color: var(--mat-sys-on-surface-variant);
      font: var(--mat-sys-body-small);
    }
  `,
})
export class Login {
  /** Bound from the `returnUrl` query param via `withComponentInputBinding()`. */
  readonly returnUrl = input('/dashboard');

  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly firstError = firstError;
  protected readonly model = signal<LoginModel>({ username: '', password: '' });

  protected readonly form = form(this.model, (path) => {
    required(path.username, { message: 'Benutzername ist erforderlich.' });
    required(path.password, { message: 'Passwort ist erforderlich.' });
  });

  protected async onSubmit(): Promise<void> {
    await submit(this.form, async () => {
      this.auth.login(this.model().username);
      await this.router.navigateByUrl(this.returnUrl());
      return null;
    });
  }
}

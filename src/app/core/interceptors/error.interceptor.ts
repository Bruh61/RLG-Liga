import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

/** Surfaces HTTP failures to the user via a snackbar, then rethrows for local handling. */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((error: unknown) => {
      const message =
        error instanceof HttpErrorResponse
          ? error.status === 0
            ? 'Keine Verbindung zur API. Läuft „npm run api“?'
            : `Fehler ${error.status}: ${error.statusText || 'Anfrage fehlgeschlagen'}`
          : 'Ein unerwarteter Fehler ist aufgetreten.';
      snackBar.open(message, 'OK', { duration: 5000 });
      return throwError(() => error);
    }),
  );
};

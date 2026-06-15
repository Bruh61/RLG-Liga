import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

/**
 * Central HTTP error handling. Phase 7 surfaces failures via `MatSnackBar`;
 * for now we log and rethrow so callers still see the error.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: unknown) => {
      console.error('[HTTP error]', req.method, req.url, error);
      return throwError(() => error);
    }),
  );
};

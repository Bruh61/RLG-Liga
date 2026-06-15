import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Attaches the auth token to outgoing requests. The real token comes from
 * `AuthService` in Phase 7; for now this is a pass-through placeholder so the
 * interceptor chain is wired up from the start.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Phase 7: const token = inject(AuthService).token();
  // if (token) req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  return next(req);
};

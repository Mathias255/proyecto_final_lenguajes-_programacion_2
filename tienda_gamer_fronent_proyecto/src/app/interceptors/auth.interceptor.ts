import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  let authReq = req;
  console.log(`INTERCEPTOR: ${req.method} a ${req.url}`);
  
  // Enviamos el token en TODAS las peticiones excepto login y registro
  if (token && !req.url.includes('/login') && !req.url.includes('/usuarios')) {
    console.log('INTERCEPTOR: Inyectando Token...');
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  } else {
    console.log('INTERCEPTOR: No se inyectó token (Ruta pública)');
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado o inválido
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};

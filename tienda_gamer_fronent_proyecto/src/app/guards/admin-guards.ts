import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.esAdmin()) {
    return true;
  }

  // Si no es admin, lo rebota al catálogo
  router.navigate(['/catalogo']);
  return false;
};
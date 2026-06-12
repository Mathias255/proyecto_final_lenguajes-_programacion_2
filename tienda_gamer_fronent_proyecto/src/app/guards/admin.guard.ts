import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.hasRole('ADMIN')) {
    return true;
  }

  // Si no es admin, mostrar alerta y redirigir
  alert('Acceso Denegado: No tienes permisos de administrador.');
  router.navigate(['/catalogo']);
  return false;
};

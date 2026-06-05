import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'registro',
    renderMode: RenderMode.Client // 🚀 OBLIGA a que la página de registro corra 100% en el navegador
  },
  {
    path: 'login',
    renderMode: RenderMode.Client // 🚀 OBLIGA a que la página de login corra 100% en el navegador
  },
  {
    path: '**',
    renderMode: RenderMode.Client // Para desarrollo, fuerza todo en modo cliente y evita dolores de cabeza con SSR
  }
];
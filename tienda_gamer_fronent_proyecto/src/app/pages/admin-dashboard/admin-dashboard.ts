import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, AnimeDirective],
  template: `
    <app-navbar></app-navbar>
    <div class="dashboard-container">
      <header class="dash-header" [appAnime]="{ translateY: [-30, 0], opacity: [0, 1] }">
        <h1>🛠️ Panel de Control Administrador</h1>
        <p>Bienvenido, {{ authService.currentUser()?.nombre }}. Gestiona tu tienda gamer desde aquí.</p>
      </header>

      <div class="stats-grid">
        <div class="stat-card" [appAnime]="{ scale: [0.9, 1], opacity: [0, 1], delay: 200 }">
          <i class="fas fa-shopping-cart"></i>
          <h3>Ventas Totales</h3>
          <p class="value">Ver historial</p>
          <button routerLink="/admin/compras" class="btn-dash">Gestionar Compras</button>
        </div>

        <div class="stat-card" [appAnime]="{ scale: [0.9, 1], opacity: [0, 1], delay: 400 }">
          <i class="fas fa-box"></i>
          <h3>Productos</h3>
          <p class="value">Catálogo Maestro</p>
          <button routerLink="/catalogo" class="btn-dash">Ir al Inventario</button>
        </div>

        <div class="stat-card" [appAnime]="{ scale: [0.9, 1], opacity: [0, 1], delay: 500 }">
          <i class="fas fa-users"></i>
          <h3>Clientes</h3>
          <p class="value">Usuarios Registrados</p>
          <button routerLink="/admin/clientes" class="btn-dash">Sección Clientes</button>
        </div>

        <div class="stat-card warning" [appAnime]="{ scale: [0.9, 1], opacity: [0, 1], delay: 600 }">
          <i class="fas fa-user-shield"></i>
          <h3>Seguridad</h3>
          <p class="value">Auditoría JAAS</p>
          <button routerLink="/admin/auditoria" class="btn-dash">Ver Accesos</button>
        </div>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .dashboard-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
      min-height: 70vh;
    }
    .dash-header {
      text-align: center;
      margin-bottom: 50px;
      h1 { font-family: 'Orbitron', sans-serif; color: var(--primary); text-shadow: 0 0 15px rgba(0, 242, 255, 0.4); }
      p { color: #888; font-size: 1.1rem; }
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
    }
    .stat-card {
      background: rgba(22, 22, 26, 0.8);
      border: 1px solid #333;
      padding: 40px;
      border-radius: 20px;
      text-align: center;
      transition: 0.3s;
      i { font-size: 3rem; color: var(--primary); margin-bottom: 20px; }
      h3 { font-size: 1.5rem; margin-bottom: 10px; }
      .value { color: #888; margin-bottom: 25px; }
      &:hover { border-color: var(--primary); transform: translateY(-10px); }
    }
    .stat-card.warning i { color: var(--accent); }
    .btn-dash {
      background: linear-gradient(45deg, var(--secondary), var(--primary));
      color: white;
      padding: 12px 25px;
      border-radius: 10px;
      font-weight: bold;
      width: 100%;
    }
  `]
})
export class AdminDashboardComponent {
  public authService = inject(AuthService);
}

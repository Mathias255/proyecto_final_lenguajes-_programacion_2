import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-admin-clientes',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent, AnimeDirective],
  template: `
    <app-navbar></app-navbar>
    <div class="admin-container">
      <header class="page-header" [appAnime]="{ translateY: [-20, 0], opacity: [0, 1] }">
        <h1>👥 Gestión de Clientes</h1>
        <p>Visualiza y administra los usuarios registrados en la plataforma.</p>
      </header>

      <div class="main-layout">
        <main class="table-card" [appAnime]="{ scale: [0.95, 1], opacity: [0, 1], delay: 200 }">
          <table class="gamer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              @for (user of usuarios(); track user.id) {
                <tr>
                  <td>#{{ user.id }}</td>
                  <td>
                    <div class="user-info">
                      <strong>{{ user.nombre }} {{ user.apellido }}</strong>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="role-badge" [class.admin]="user.rol === 'ADMIN' || user.rol === 'Administrador'">
                      {{ user.rol }}
                    </span>
                  </td>
                  <td><span class="status-active">Activo</span></td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="no-data">No hay usuarios registrados.</td>
                </tr>
              }
            </tbody>
          </table>
        </main>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .admin-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; min-height: 75vh; }
    .page-header { text-align: center; margin-bottom: 40px; h1 { color: var(--primary); font-family: 'Orbitron', sans-serif; } }
    
    .table-card { 
      background: rgba(22, 22, 26, 0.8); 
      border: 1px solid #333; 
      border-radius: 15px; 
      padding: 25px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    .gamer-table {
      width: 100%;
      border-collapse: collapse;
      th { text-align: left; padding: 15px; border-bottom: 2px solid #444; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; }
      td { padding: 15px; border-bottom: 1px solid #222; color: #eee; }
    }

    .role-badge {
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: bold;
      background: #333;
      color: #aaa;
      &.admin {
        background: rgba(0, 242, 255, 0.1);
        color: var(--primary);
        border: 1px solid var(--primary);
      }
    }

    .status-active {
      color: #00ff88;
      font-size: 0.85rem;
      &::before { content: '● '; }
    }

    .no-data { text-align: center; padding: 40px; color: #666; }
  `]
})
export class AdminClientesComponent implements OnInit {
  private usuarioService = inject(UsuarioService);
  usuarios = signal<Usuario[]>([]);

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.getUsuarios().subscribe({
      next: (data) => this.usuarios.set(data),
      error: (err) => console.error('Error cargando usuarios', err)
    });
  }
}

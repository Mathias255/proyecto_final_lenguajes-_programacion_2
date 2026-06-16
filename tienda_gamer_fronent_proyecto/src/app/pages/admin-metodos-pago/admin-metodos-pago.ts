import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MetodoPagoService } from '../../services/metodo-pago.service';
import { MetodoPago } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimeDirective } from '../../directives/anime.directive';
import { NotificationService } from '../../services/notification.service';
import { MetodoPagoFormComponent } from '../../components/metodo-pago-form/metodo-pago-form';

@Component({
  selector: 'app-admin-metodos-pago',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, AnimeDirective, MetodoPagoFormComponent],
  template: `
    <app-navbar></app-navbar>

    <div class="admin-container">
      <header class="page-header" [appAnime]="{ translateY: [-20, 0], opacity: [0, 1] }">
        <h1>💳 Métodos de Pago</h1>
        <p>Configura los métodos que tus clientes podrán usar para pagar.</p>
        <button class="btn-primary mt-4" (click)="abrirModalCrear()">+ Nuevo Método</button>
      </header>

      <div class="main-layout">
        <div class="search-bar" [appAnime]="{ scale: [0.95, 1], opacity: [0, 1], delay: 100 }">
          <input type="text" [(ngModel)]="busqueda" placeholder="Buscar método por nombre o tipo...">
        </div>

        <main class="table-card" [appAnime]="{ scale: [0.95, 1], opacity: [0, 1], delay: 200 }">
          <table class="gamer-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Comisión</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let m of metodosFiltrados">
                <td>
                  <strong>{{ m.nombre }}</strong><br>
                  <small>{{ m.descripcion }}</small>
                </td>
                <td><span class="badge-type">{{ m.tipo }}</span></td>
                <td>{{ m.comisionPorcentaje }}%</td>
                <td>
                  <span class="status" [class.active]="m.activo">
                    {{ m.activo ? 'Habilitado' : 'Deshabilitado' }}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button class="btn-edit" (click)="abrirModalEditar(m)" title="Editar">✏️</button>
                    <button class="btn-delete" (click)="eliminar(m.id)" title="Eliminar">🗑️</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="metodosFiltrados.length === 0">
                <td colspan="5" class="no-data">No hay métodos de pago registrados.</td>
              </tr>
            </tbody>
          </table>
        </main>
      </div>
    </div>

    <app-metodo-pago-form 
      *ngIf="mostrarModal" 
      [metodo]="metodoEditar" 
      (alCerrar)="cerrarModal($event)">
    </app-metodo-pago-form>

    <app-footer></app-footer>
  `,
  styles: [`
    .admin-container { max-width: 1200px; margin: 40px auto; padding: 0 20px; min-height: 70vh; }
    .page-header { margin-bottom: 40px; h1 { font-family: 'Orbitron', sans-serif; color: var(--primary); } p { color: #888; } }
    .btn-primary { background: var(--primary); color: #000; border: none; padding: 12px 25px; border-radius: 10px; font-weight: bold; cursor: pointer; }
    .search-bar { margin-bottom: 20px; input { width: 100%; background: #1a1a1e; border: 1px solid #333; color: white; padding: 12px 20px; border-radius: 10px; outline: none; &:focus { border-color: var(--primary); } } }
    .table-card { background: rgba(22, 22, 26, 0.8); border: 1px solid #333; border-radius: 20px; overflow: hidden; }
    .gamer-table { width: 100%; border-collapse: collapse; th, td { padding: 20px; text-align: left; border-bottom: 1px solid #333; } th { color: var(--primary); text-transform: uppercase; font-size: 0.8rem; letter-spacing: 1px; } }
    .badge-type { background: #333; padding: 4px 10px; border-radius: 5px; font-size: 0.75rem; color: #aaa; }
    .status { font-size: 0.8rem; font-weight: bold; padding: 4px 8px; border-radius: 5px; background: #442222; color: #ff5555; }
    .status.active { background: #224422; color: #55ff55; }
    .action-btns { display: flex; gap: 10px; }
    .btn-edit, .btn-delete { background: #333; border: none; padding: 8px; border-radius: 5px; cursor: pointer; transition: 0.2s; &:hover { transform: scale(1.1); } }
    .btn-edit:hover { background: #444; }
    .btn-delete:hover { background: #552222; }
    .no-data { text-align: center; color: #888; padding: 40px; }
    .mt-4 { margin-top: 1rem; }
  `]
})
export class AdminMetodosPagoComponent implements OnInit {
  private metodoPagoService = inject(MetodoPagoService);
  private notificationService = inject(NotificationService);

  metodos = signal<MetodoPago[]>([]);
  mostrarModal = false;
  metodoEditar: MetodoPago | null = null;
  busqueda = '';

  ngOnInit() {
    this.cargarMetodos();
  }

  get metodosFiltrados(): MetodoPago[] {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.metodos();
    return this.metodos().filter(m =>
      m.nombre.toLowerCase().includes(q) ||
      m.tipo.toLowerCase().includes(q)
    );
  }

  cargarMetodos() {
    this.metodoPagoService.getMetodosPago().subscribe(data => {
      this.metodos.set(data);
    });
  }

  abrirModalCrear() {
    this.metodoEditar = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(m: MetodoPago) {
    this.metodoEditar = m;
    this.mostrarModal = true;
  }

  cerrarModal(m: MetodoPago | null) {
    this.mostrarModal = false;
    this.metodoEditar = null;
    if (m) {
      this.notificationService.show('Cambios guardados con éxito ✅', 'success');
      this.cargarMetodos();
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Estás seguro de eliminar este método de pago?')) {
      this.metodoPagoService.eliminarMetodoPago(id).subscribe(() => {
        this.notificationService.show('Método eliminado', 'info');
        this.cargarMetodos();
      });
    }
  }
}

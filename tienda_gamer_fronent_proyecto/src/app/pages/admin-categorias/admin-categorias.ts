import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { NotificationService } from '../../services/notification.service';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, FooterComponent, AnimeDirective],
  template: `
    <app-navbar></app-navbar>
    <div class="admin-container">
      <header class="page-header" [appAnime]="{ translateY: [-20, 0], opacity: [0, 1] }">
        <h1>📁 Gestión de Categorías</h1>
        <p>Administra las familias de productos de la tienda.</p>
      </header>

      <div class="main-layout">
        <!-- Formulario lateral -->
        <aside class="form-card" [appAnime]="{ translateX: [-30, 0], opacity: [0, 1], delay: 200 }">
          <h3>{{ editando ? 'Editar' : 'Nueva' }} Categoría</h3>
          <form (ngSubmit)="guardar()">
            <div class="input-group">
              <label>Nombre</label>
              <input type="text" [(ngModel)]="categoriaForm.nombre" name="nombre" required placeholder="Ej: Tarjetas de Video">
            </div>
            <div class="input-group">
              <label>Descripción</label>
              <textarea [(ngModel)]="categoriaForm.descripcion" name="descripcion" placeholder="Opcional..."></textarea>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-save">
                {{ editando ? 'Actualizar 🔄' : 'Crear Categoría ➕' }}
              </button>
              <button type="button" *ngIf="editando" (click)="cancelarEdicion()" class="btn-cancel">Cancelar</button>
            </div>
          </form>
        </aside>

        <!-- Tabla de datos -->
        <main class="table-card" [appAnime]="{ translateX: [30, 0], opacity: [0, 1], delay: 400 }">
          <table class="gamer-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              @for (cat of categorias(); track cat.id) {
                <tr>
                  <td>#{{ cat.id }}</td>
                  <td><strong>{{ cat.nombre }}</strong></td>
                  <td>{{ cat.descripcion || 'Sin descripción' }}</td>
                  <td class="actions">
                    <button class="btn-edit" (click)="editar(cat)">✏️</button>
                    <button class="btn-delete" (click)="eliminar(cat.id)">🗑️</button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="4" class="no-data">No hay categorías registradas.</td>
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
    
    .main-layout { display: grid; grid-template-columns: 350px 1fr; gap: 30px; }
    @media (max-width: 900px) { .main-layout { grid-template-columns: 1fr; } }

    .form-card, .table-card { 
      background: rgba(22, 22, 26, 0.8); 
      border: 1px solid #333; 
      border-radius: 15px; 
      padding: 25px; 
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }

    h3 { margin-bottom: 20px; color: #fff; font-size: 1.2rem; }

    .input-group { 
      margin-bottom: 20px; 
      label { display: block; margin-bottom: 8px; color: #aaa; font-size: 0.9rem; }
      input, textarea { width: 100%; padding: 12px; border-radius: 8px; background: #1a1a1e; border: 1px solid #444; color: #fff; }
    }

    .form-actions { display: flex; flex-direction: column; gap: 10px; }
    .btn-save { background: linear-gradient(45deg, var(--secondary), var(--primary)); color: white; padding: 12px; font-weight: bold; border-radius: 8px; }
    .btn-cancel { background: #333; color: #fff; padding: 8px; border-radius: 8px; font-size: 0.85rem; }

    .gamer-table {
      width: 100%;
      border-collapse: collapse;
      th { text-align: left; padding: 15px; border-bottom: 2px solid #444; color: var(--primary); text-transform: uppercase; font-size: 0.8rem; }
      td { padding: 15px; border-bottom: 1px solid #222; color: #eee; }
    }

    .actions { display: flex; gap: 10px; }
    .btn-edit { background: #2a2a2e; padding: 8px; border-radius: 6px; border: 1px solid #444; }
    .btn-delete { background: rgba(255, 0, 85, 0.1); padding: 8px; border-radius: 6px; border: 1px solid rgba(255, 0, 85, 0.2); }
    .no-data { text-align: center; padding: 40px; color: #666; }
  `]
})
export class AdminCategoriasComponent implements OnInit {
  private categoriaService = inject(CategoriaService);
  private notificationService = inject(NotificationService);

  categorias = signal<Categoria[]>([]);
  categoriaForm: Categoria = { id: 0, nombre: '', descripcion: '' };
  editando = false;

  ngOnInit() {
    this.cargarCategorias();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(data => this.categorias.set(data));
  }

  editar(cat: Categoria) {
    this.categoriaForm = { ...cat };
    this.editando = true;
  }

  cancelarEdicion() {
    this.categoriaForm = { id: 0, nombre: '', descripcion: '' };
    this.editando = false;
  }

  guardar() {
    if (!this.categoriaForm.nombre) {
      this.notificationService.show('El nombre es obligatorio', 'warning');
      return;
    }

    if (this.editando) {
      this.categoriaService.actualizarCategoria(this.categoriaForm.id, this.categoriaForm).subscribe(() => {
        this.notificationService.show('Categoría actualizada', 'success');
        this.reset();
      });
    } else {
      this.categoriaService.crearCategoria(this.categoriaForm).subscribe(() => {
        this.notificationService.show('Categoría creada', 'success');
        this.reset();
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Eliminar esta categoría? Los productos asociados podrían quedar sin categoría.')) {
      this.categoriaService.eliminarCategoria(id).subscribe(() => {
        this.notificationService.show('Categoría eliminada', 'info');
        this.cargarCategorias();
      });
    }
  }

  private reset() {
    this.cargarCategorias();
    this.cancelarEdicion();
  }
}

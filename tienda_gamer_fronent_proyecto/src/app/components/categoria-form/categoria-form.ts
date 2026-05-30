import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Categoria } from '../../models/interfaces';

@Component({
  selector: 'app-categoria-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="backdrop">
      <div class="modal">
        <h3>Nueva Línea de Hardware</h3>
        <form (ngSubmit)="guardar()">
          <div class="group">
            <label>Nombre de la Categoría</label>
            <input [(ngModel)]="nombre" name="nombre" type="text" placeholder="Ej: Tarjetas de Video" required>
          </div>
          <div class="group">
            <label>Descripción (Opcional)</label>
            <textarea [(ngModel)]="descripcion" name="descripcion" rows="2"></textarea>
          </div>
          <div class="btns">
            <button type="button" (click)="alCerrar.emit(null)" class="btn-c">Cancelar</button>
            <button type="submit" class="btn-g">Guardar Categoría</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../../pages/producto-form/producto-form.css'] // Reutilizamos estilos
})
export class CategoriaFormComponent {
  nombre = '';
  descripcion = '';
  @Output() alCerrar = new EventEmitter<Categoria | null>();

  guardar() {
    if (this.nombre.trim()) {
      this.alCerrar.emit({ id: 0, nombre: this.nombre, descripcion: this.descripcion });
    }
  }
}
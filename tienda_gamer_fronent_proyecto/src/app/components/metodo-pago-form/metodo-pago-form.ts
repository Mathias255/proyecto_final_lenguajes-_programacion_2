import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MetodoPago } from '../../models/interfaces';
import { MetodoPagoService } from '../../services/metodo-pago.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-metodo-pago-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="backdrop">
      <div class="modal">
        <h3>{{ metodo ? 'Editar Método de Pago' : 'Nuevo Método de Pago' }}</h3>
        
        <form (ngSubmit)="guardar()">
          <div class="group">
            <label>Nombre del Método</label>
            <input [(ngModel)]="formMetodo.nombre" name="nombre" type="text" required placeholder="Ej: Tarjeta de Crédito">
          </div>

          <div class="group">
            <label>Descripción</label>
            <textarea [(ngModel)]="formMetodo.descripcion" name="descripcion" rows="2" required placeholder="Instrucciones para el cliente..."></textarea>
          </div>

          <div class="row">
            <div class="group flex">
              <label>Tipo</label>
              <select [(ngModel)]="formMetodo.tipo" name="tipo" required>
                <option value="TARJETA">Tarjeta</option>
                <option value="TRANSFERENCIA">Transferencia</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="BILLETERA_DIGITAL">Billetera Digital</option>
              </select>
            </div>
            <div class="group flex">
              <label>Comisión (%)</label>
              <input [(ngModel)]="formMetodo.comisionPorcentaje" name="comision" type="number" step="0.01" min="0">
            </div>
          </div>

          <div class="group-check">
            <input type="checkbox" [(ngModel)]="formMetodo.activo" name="activo" id="activo">
            <label for="activo">Método Habilitado</label>
          </div>

          <div class="btns">
            <button type="button" (click)="cancelar()" class="btn-c">Cancelar</button>
            <button type="submit" class="btn-g">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .backdrop {
      position: fixed; top:0; left:0; width:100%; height:100%;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(5px);
      display: flex; align-items: center; justify-content: center; z-index: 2000;
    }
    .modal {
      background: #1a1a1e; border: 1px solid #333; padding: 30px;
      border-radius: 15px; width: 500px; max-width: 90%;
      box-shadow: 0 0 30px rgba(0,242,255,0.2);
    }
    h3 { margin-top:0; color: var(--primary); font-family: 'Orbitron', sans-serif; margin-bottom: 20px;}
    .group { margin-bottom: 15px; display: flex; flex-direction: column; }
    .group-check { margin-bottom: 15px; display: flex; align-items: center; gap: 10px; }
    label { color: #888; font-size: 0.85rem; margin-bottom: 5px; }
    .group-check label { margin-bottom: 0; cursor: pointer; }
    input, select, textarea {
      background: #000; border: 1px solid #444; color: white;
      padding: 10px; border-radius: 5px; outline: none;
    }
    input[type="checkbox"] { width: 18px; height: 18px; cursor: pointer; }
    .row { display: flex; gap: 15px; }
    .flex { flex: 1; }
    .btns { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .btn-c { background: transparent; color: #888; border: 1px solid #444; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
    .btn-g { background: var(--primary); color: #000; font-weight: bold; border: none; padding: 10px 25px; border-radius: 5px; cursor: pointer; }
  `]
})
export class MetodoPagoFormComponent implements OnInit {
  private metodoPagoService = inject(MetodoPagoService);
  private notificationService = inject(NotificationService);

  @Input() metodo: MetodoPago | null = null;
  @Output() alCerrar = new EventEmitter<MetodoPago | null>();

  formMetodo: MetodoPago = {
    nombre: '',
    descripcion: '',
    tipo: 'TARJETA',
    comisionPorcentaje: 0,
    activo: true
  };

  ngOnInit() {
    if (this.metodo) {
      this.formMetodo = { ...this.metodo };
    }
  }

  guardar() {
    if (!this.formMetodo.nombre.trim()) {
      this.notificationService.show('El nombre es obligatorio', 'warning');
      return;
    }

    if (this.formMetodo.id) {
      this.metodoPagoService.actualizarMetodoPago(this.formMetodo.id, this.formMetodo).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al actualizar el método', 'error');
          console.error(err);
        }
      });
    } else {
      this.metodoPagoService.crearMetodoPago(this.formMetodo).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al crear el método', 'error');
          console.error(err);
        }
      });
    }
  }

  cancelar() {
    this.alCerrar.emit(null);
  }
}

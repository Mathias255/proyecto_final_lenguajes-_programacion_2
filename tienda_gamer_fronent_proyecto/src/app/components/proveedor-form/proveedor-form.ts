import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Proveedor } from '../../models/interfaces';
import { ProveedorService } from '../../services/proveedor.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-proveedor-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="backdrop">
      <div class="modal">
        <h3>{{ proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor' }}</h3>
        
        <form (ngSubmit)="guardar()">
          <div class="group">
            <label>Nombre de Empresa</label>
            <input [(ngModel)]="formProveedor.nombre" name="nombre" type="text" required>
          </div>

          <div class="row">
            <div class="group flex">
              <label>Contacto</label>
              <input [(ngModel)]="formProveedor.contacto" name="contacto" type="text" required>
            </div>
            <div class="group flex">
              <label>Email</label>
              <input [(ngModel)]="formProveedor.email" name="email" type="email" required>
            </div>
          </div>

          <div class="row">
            <div class="group flex">
              <label>Teléfono</label>
              <input [(ngModel)]="formProveedor.telefono" name="telefono" type="text">
            </div>
            <div class="group flex">
              <label>Dirección</label>
              <input [(ngModel)]="formProveedor.direccion" name="direccion" type="text" required>
            </div>
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
    label { color: #888; font-size: 0.85rem; margin-bottom: 5px; }
    input, select, textarea {
      background: #000; border: 1px solid #444; color: white;
      padding: 10px; border-radius: 5px; outline: none;
    }
    .row { display: flex; gap: 15px; }
    .flex { flex: 1; }
    .btns { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
    .btn-c { background: transparent; color: #888; border: 1px solid #444; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
    .btn-g { background: var(--primary); color: #000; font-weight: bold; border: none; padding: 10px 25px; border-radius: 5px; cursor: pointer; }
  `]
})
export class ProveedorFormComponent implements OnInit {
  private proveedorService = inject(ProveedorService);
  private notificationService = inject(NotificationService);

  @Input() proveedor: Proveedor | null = null;
  @Output() alCerrar = new EventEmitter<Proveedor | null>();

  formProveedor: Proveedor = {
    nombre: '',
    contacto: '',
    email: '',
    telefono: '',
    direccion: ''
  };

  ngOnInit() {
    if (this.proveedor) {
      this.formProveedor = { ...this.proveedor };
    }
  }

  guardar() {
    if (!this.formProveedor.nombre.trim()) {
      this.notificationService.show('El nombre es obligatorio', 'warning');
      return;
    }

    if (this.formProveedor.id) {
      this.proveedorService.actualizarProveedor(this.formProveedor.id, this.formProveedor).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al actualizar proveedor', 'error');
          console.error(err);
        }
      });
    } else {
      this.proveedorService.crearProveedor(this.formProveedor).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al crear proveedor', 'error');
          console.error(err);
        }
      });
    }
  }

  cancelar() {
    this.alCerrar.emit(null);
  }
}

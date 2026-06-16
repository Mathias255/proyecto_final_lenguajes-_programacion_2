import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProveedorService } from '../../services/proveedor.service';
import { Proveedor } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimeDirective } from '../../directives/anime.directive';
import { NotificationService } from '../../services/notification.service';
import { ProveedorFormComponent } from '../../components/proveedor-form/proveedor-form';

@Component({
  selector: 'app-admin-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent, AnimeDirective, ProveedorFormComponent],
  templateUrl: './admin-proveedores.html',
  styleUrls: ['./admin-proveedores.css']
})
export class AdminProveedoresComponent implements OnInit {
  private proveedorService = inject(ProveedorService);
  private notificationService = inject(NotificationService);

  proveedores = signal<Proveedor[]>([]);
  mostrarModal = false;
  proveedorEditar: Proveedor | null = null;
  busqueda = '';

  ngOnInit() {
    this.cargarProveedores();
  }

  get proveedoresFiltrados(): Proveedor[] {
    const q = this.busqueda.toLowerCase();
    if (!q) return this.proveedores();
    return this.proveedores().filter(p =>
      p.nombre.toLowerCase().includes(q) ||
      p.direccion.toLowerCase().includes(q) ||
      p.contacto.toLowerCase().includes(q)
    );
  }

  cargarProveedores() {
    this.proveedorService.getProveedoresList().subscribe(data => {
      this.proveedores.set(data);
    });
  }

  abrirModalCrear() {
    this.proveedorEditar = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(p: Proveedor) {
    this.proveedorEditar = p;
    this.mostrarModal = true;
  }

  cerrarModal(p: Proveedor | null) {
    this.mostrarModal = false;
    this.proveedorEditar = null;
    if (p) {
      this.notificationService.show(p.id ? 'Proveedor actualizado ✅' : 'Proveedor creado ✅', 'success');
      this.cargarProveedores();
    }
  }

  eliminar(id: number | undefined) {
    if (!id) return;
    if (confirm('¿Eliminar este proveedor?')) {
      this.proveedorService.eliminarProveedor(id).subscribe(() => {
        this.notificationService.show('Proveedor eliminado', 'info');
        this.cargarProveedores();
      });
    }
  }
}

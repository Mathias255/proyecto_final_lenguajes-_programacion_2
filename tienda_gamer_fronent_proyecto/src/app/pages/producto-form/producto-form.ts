import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Categoria, Proveedor } from '../../models/interfaces';
import { ProductoService } from '../../services/producto.service';
import { ProveedorService } from '../../services/proveedor.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
  private productoService = inject(ProductoService);
  private proveedorService = inject(ProveedorService);
  private notificationService = inject(NotificationService);

  @Input() producto: Producto | null = null;
  @Input() categorias: Categoria[] = [];
  @Output() alCerrar = new EventEmitter<Producto | null>();

  proveedores: Proveedor[] = [];

  formProducto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoria: { id: 0, nombre: '' }
  };

  categoriaIdSeleccionada: number = 0;
  proveedorIdSeleccionado: number = 0;

  ngOnInit() {
    this.cargarProveedores();
    if (this.producto) {
      this.formProducto = { ...this.producto };
      this.categoriaIdSeleccionada = this.producto.categoria?.id ?? this.producto.categoriaId ?? 0;
      this.proveedorIdSeleccionado = this.producto.proveedor?.id ?? this.producto.proveedorId ?? 0;
    } else {
      if (this.categorias.length > 0) this.categoriaIdSeleccionada = this.categorias[0].id;
    }
  }

  cargarProveedores() {
    this.proveedorService.getProveedoresList().subscribe(data => {
      this.proveedores = data;
      if (!this.producto && this.proveedores.length > 0) {
        this.proveedorIdSeleccionado = this.proveedores[0].id ?? 0;
      }
    });
  }

  guardar() {
    const cat = this.categorias.find(c => c.id == this.categoriaIdSeleccionada);
    if (cat) {
      this.formProducto.categoria = cat;
      this.formProducto.categoriaId = cat.id;
    }

    const prov = this.proveedores.find(p => p.id == this.proveedorIdSeleccionado);
    if (prov) {
      this.formProducto.proveedor = prov;
      this.formProducto.proveedorId = prov.id;
    }

    if (this.formProducto.id) {
      this.productoService.actualizarProducto(this.formProducto.id, this.formProducto).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al actualizar producto', 'error');
          console.error(err);
        }
      });
    } else {
      this.productoService.crearProducto(this.formProducto).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => {
          this.notificationService.show('Error al crear producto', 'error');
          console.error(err);
        }
      });
    }
  }

  cancelar() {
    this.alCerrar.emit(null);
  }
}
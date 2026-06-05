import { Component, Input, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Categoria } from '../../models/interfaces';
import { ProductoService } from '../../services/producto.service';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
  private productoService = inject(ProductoService);

  @Input() producto: Producto | null = null;
  @Input() categorias: Categoria[] = [];
  @Output() alCerrar = new EventEmitter<Producto | null>();

  formProducto: Producto = {
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagenUrl: '',
    categoria: { id: 0, nombre: '' }
  };

  categoriaIdSeleccionada: number = 0;

  ngOnInit() {
    if (this.producto) {
      this.formProducto = { ...this.producto };
      this.categoriaIdSeleccionada = this.producto.categoria.id;
    } else if (this.categorias.length > 0) {
      this.categoriaIdSeleccionada = this.categorias[0].id;
    }
  }

  guardar() {
    const cat = this.categorias.find(c => c.id == this.categoriaIdSeleccionada);
    if (cat) {
      this.formProducto.categoria = cat;
    }

    if (this.formProducto.id) {
      this.productoService.actualizarProducto(this.formProducto.id, this.formProducto).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => console.error('Error al actualizar producto', err)
      });
    } else {
      this.productoService.crearProducto(this.formProducto).subscribe({
        next: (res) => this.alCerrar.emit(res),
        error: (err) => console.error('Error al crear producto', err)
      });
    }
  }

  cancelar() {
    this.alCerrar.emit(null);
  }
}
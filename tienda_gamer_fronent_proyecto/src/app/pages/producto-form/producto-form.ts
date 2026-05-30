import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Producto, Categoria } from '../../models/interfaces';

@Component({
  selector: 'app-producto-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './producto-form.html',
  styleUrls: ['./producto-form.css']
})
export class ProductoFormComponent implements OnInit {
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
    this.alCerrar.emit(this.formProducto);
  }

  cancelar() {
    this.alCerrar.emit(null);
  }
}
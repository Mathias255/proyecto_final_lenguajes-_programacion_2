import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ProductoFormComponent } from '../producto-form/producto-form';
import { CategoriaFormComponent } from '../../components/categoria-form/categoria-form';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { Producto, Categoria } from '../../models/interfaces';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, ProductoFormComponent, CategoriaFormComponent, AnimeDirective],
  templateUrl: './catalogo.html',
  styleUrls: ['./catalogo.css']
})
export class CatalogoComponent implements OnInit {
  private apiService = inject(ApiService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionadaId: number | null = null;
  esAdmin = false;
  
  mostrarModal = false;
  mostrarModalCat = false;
  productoEditar: Producto | null = null;

  ngOnInit() {
    this.esAdmin = this.authService.esAdmin();
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.apiService.getCategorias().subscribe(cats => this.categorias = cats);
  }

  cargarProductos() {
    if (this.categoriaSeleccionadaId) {
      this.apiService.getProductosPorCategoria(this.categoriaSeleccionadaId).subscribe(prods => this.productos = prods);
    } else {
      this.apiService.getProductos().subscribe(prods => this.productos = prods);
    }
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
    this.cargarProductos();
  }

  agregarAlCarrito(prod: Producto, event: Event) {
    event.stopPropagation();
    this.cartService.agregarProducto(prod);
  }

  abrirModalCrear() {
    this.productoEditar = null;
    this.mostrarModal = true;
  }

  abrirModalEditar(prod: Producto, event: Event) {
    event.stopPropagation();
    this.productoEditar = prod;
    this.mostrarModal = true;
  }

  cerrarModal(producto: Producto | null) {
    this.mostrarModal = false;
    if (producto) {
      if (producto.id) {
        this.apiService.actualizarProducto(producto.id, producto).subscribe(() => this.cargarProductos());
      } else {
        this.apiService.crearProducto(producto).subscribe(() => this.cargarProductos());
      }
    }
  }

  cerrarModalCat(cat: Categoria | null) {
    this.mostrarModalCat = false;
    if (cat) {
      this.apiService.crearCategoria(cat).subscribe(() => this.cargarCategorias());
    }
  }

  eliminarProducto(id: number | undefined, event: Event) {
    event.stopPropagation();
    if (id && confirm('¿Estás seguro de eliminar este producto?')) {
      this.apiService.deleteProducto(id).subscribe(() => this.cargarProductos());
    }
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ProductoFormComponent } from '../producto-form/producto-form';
import { CategoriaFormComponent } from '../../components/categoria-form/categoria-form';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
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
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  productos: Producto[] = [];
  categorias: Categoria[] = [];
  categoriaSeleccionadaId: number | null = null;
  esAdmin = false;
  
  mostrarModal = false;
  mostrarModalCat = false;
  productoEditar: Producto | null = null;

  productosFiltrados: Producto[] = [];

  ngOnInit() {
    this.esAdmin = this.authService.esAdmin();
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(cats => this.categorias = cats);
  }

  cargarProductos() {
    this.productoService.getProductos().subscribe(prods => {
      this.productos = prods;
      this.aplicarFiltro();
    });
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    if (this.categoriaSeleccionadaId) {
      this.productosFiltrados = this.productos.filter(p => 
        p.categoriaId === this.categoriaSeleccionadaId || 
        p.categoria?.id === this.categoriaSeleccionadaId
      );
    } else {
      this.productosFiltrados = [...this.productos];
    }
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
      this.notificationService.show(this.productoEditar ? 'Producto actualizado' : 'Producto creado', 'success');
      this.cargarProductos();
    }
  }

  cerrarModalCat(cat: Categoria | null) {
    this.mostrarModalCat = false;
    if (cat) {
      this.notificationService.show('Categoría creada', 'success');
      this.cargarCategorias();
    }
  }

  eliminarProducto(id: number | undefined, event: Event) {
    event.stopPropagation();
    if (id && confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.notificationService.show('Producto eliminado', 'info');
          this.cargarProductos();
        },
        error: () => this.notificationService.show('Error al eliminar', 'error')
      });
    }
  }
}
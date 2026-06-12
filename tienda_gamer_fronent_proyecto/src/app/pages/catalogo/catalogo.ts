import { Component, OnInit, inject, computed } from '@angular/core';
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
  
  // Usamos signals/computed para reactividad
  usuarioLogueado = this.authService.currentUser;
  esAdmin = computed(() => this.authService.hasRole('ADMIN'));
  
  mostrarModal = false;
  mostrarModalCat = false;
  mostrarModalDetalle = false; // Nuevo modal de vista rápida
  productoEditar: Producto | null = null;
  productoVer: Producto | null = null; // Producto para vista rápida

  productosFiltrados: Producto[] = [];
  
  // Nuevos filtros
  filtroNombre = '';
  ordenSeleccionado = 'default';

  ngOnInit() {
    this.cargarCategorias();
    this.cargarProductos();
  }

  cargarCategorias() {
    this.categoriaService.getCategorias().subscribe(cats => this.categorias = cats);
  }

  cargarProductos() {
    console.log('Cargando productos desde:', this.productoService.getProductos());
    this.productoService.getProductos().subscribe(prods => {
      console.log('PRODUCTOS RECIBIDOS:', prods);
      this.productos = prods;
      this.aplicarFiltros();
      console.log('PRODUCTOS FILTRADOS:', this.productosFiltrados);
    });
  }

  seleccionarCategoria(id: number | null) {
    this.categoriaSeleccionadaId = id;
    this.aplicarFiltros();
  }

  buscar(event: any) {
    this.filtroNombre = event.target.value;
    this.aplicarFiltros();
  }

  cambiarOrden(event: any) {
    this.ordenSeleccionado = event.target.value;
    this.aplicarFiltros();
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    // Filtro por categoría
    if (this.categoriaSeleccionadaId) {
      resultado = resultado.filter(p => 
        p.categoriaId === this.categoriaSeleccionadaId || 
        p.categoria?.id === this.categoriaSeleccionadaId
      );
    }

    // Filtro por nombre
    if (this.filtroNombre) {
      const busqueda = this.filtroNombre.toLowerCase();
      resultado = resultado.filter(p => 
        p.nombre.toLowerCase().includes(busqueda) || 
        p.descripcion.toLowerCase().includes(busqueda)
      );
    }

    // Ordenamiento
    switch (this.ordenSeleccionado) {
      case 'precio-asc':
        resultado.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        resultado.sort((a, b) => b.precio - a.precio);
        break;
      case 'nombre-asc':
        resultado.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'nombre-desc':
        resultado.sort((a, b) => b.nombre.localeCompare(a.nombre));
        break;
    }

    this.productosFiltrados = resultado;
  }

  agregarAlCarrito(prod: Producto, event: Event) {
    event.stopPropagation();
    if (!this.usuarioLogueado()) {
      this.notificationService.show('¡Inicia sesión o regístrate para comprar! 🎮', 'warning');
      return;
    }
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

  abrirQuickView(prod: Producto, event: Event) {
    event.stopPropagation();
    this.productoVer = prod;
    this.mostrarModalDetalle = true;
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

  cerrarQuickView() {
    this.mostrarModalDetalle = false;
    this.productoVer = null;
  }

  eliminarProducto(id: number | undefined, event: Event) {
    event.stopPropagation();
    if (id && confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe({
        next: () => {
          this.notificationService.show('Producto eliminado', 'info');
          this.cargarProductos();
        },
        error: (err) => {
          const msg = err.error?.error || 'El producto está asociado a una compra y no se puede borrar.';
          this.notificationService.show(msg, 'error');
          console.error('Error al eliminar:', err);
        }
      });
    }
  }
}
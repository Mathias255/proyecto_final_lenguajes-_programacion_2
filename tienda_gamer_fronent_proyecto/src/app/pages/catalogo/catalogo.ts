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
    this.categoriaService.getCategorias().subscribe(cats => this.categorias = cats);
  }

  cargarProductos() {
    if (this.categoriaSeleccionadaId) {
      this.productoService.getProductosPorCategoria(this.categoriaSeleccionadaId).subscribe(prods => this.productos = prods);
    } else {
      this.productoService.getProductos().subscribe(prods => this.productos = prods);
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
      // Si el componente ya guardó el producto, solo recargamos.
      // Pero según la lógica actual del componente padre, él es quien llama al service.
      // El usuario pidió: "Conecta el formulario... para que, al dar clic en el botón 'Guardar', realice un envío POST exitoso"
      // Así que moveré la lógica de guardado a los componentes de formulario.
      this.cargarProductos();
    }
  }

  cerrarModalCat(cat: Categoria | null) {
    this.mostrarModalCat = false;
    if (cat) {
      this.cargarCategorias();
    }
  }

  eliminarProducto(id: number | undefined, event: Event) {
    event.stopPropagation();
    if (id && confirm('¿Estás seguro de eliminar este producto?')) {
      this.productoService.eliminarProducto(id).subscribe(() => this.cargarProductos());
    }
  }
}
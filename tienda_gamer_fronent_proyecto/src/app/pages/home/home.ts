import { Component, OnInit, inject, signal, computed, afterNextRender } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { NotificationService } from '../../services/notification.service';
import { AnimeDirective } from '../../directives/anime.directive';
import { Producto, Categoria } from '../../models/interfaces';
import { animate, stagger } from 'animejs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, AnimeDirective],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class HomeComponent implements OnInit {
  private productoService = inject(ProductoService);
  private categoriaService = inject(CategoriaService);
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private notificationService = inject(NotificationService);

  categorias = signal<Categoria[]>([]);
  productosDestacados = signal<Producto[]>([]);
  usuarioLogueado = this.authService.currentUser;
  esAdmin = computed(() => this.authService.hasRole('ADMIN'));

  marcas = ['ASUS ROG', 'NVIDIA', 'AMD', 'RAZER', 'LOGITECH', 'CORSAIR', 'MSI', 'HYPERX'];

  private categoryIcons: Record<string, string> = {
    periferico: 'fa-keyboard',
    monitor: 'fa-desktop',
    componente: 'fa-microchip',
    audio: 'fa-headphones',
    gpu: 'fa-memory',
    procesador: 'fa-microchip',
    teclado: 'fa-keyboard',
    mouse: 'fa-mouse',
  };

  constructor() {
    afterNextRender(() => {
      animate('.hero-content', {
        translateY: [40, 0],
        opacity: [0, 1],
        delay: 200,
        duration: 1000,
        ease: 'outExpo'
      });

      animate('.btn-hero', {
        scale: [0.9, 1],
        opacity: [0, 1],
        delay: stagger(150, { start: 700 }),
        duration: 700,
        ease: 'outBack'
      });

      animate('.stat-item', {
        translateY: [24, 0],
        opacity: [0, 1],
        delay: stagger(100, { start: 1000 }),
        duration: 700,
        ease: 'outQuad'
      });
    });
  }

  ngOnInit() {
    this.categoriaService.getCategorias().subscribe(cats => this.categorias.set(cats));
    this.productoService.getProductos().subscribe(prods => {
      const destacados = [...prods]
        .sort((a, b) => b.precio - a.precio)
        .slice(0, 4);
      this.productosDestacados.set(destacados);
    });
  }

  getCategoryIcon(nombre: string): string {
    const key = nombre.toLowerCase();
    for (const [pattern, icon] of Object.entries(this.categoryIcons)) {
      if (key.includes(pattern)) return icon;
    }
    return 'fa-gamepad';
  }

  agregarAlCarrito(producto: Producto, event: Event) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.usuarioLogueado()) {
      this.notificationService.show('Inicia sesión para añadir al carrito', 'warning');
      return;
    }
    this.cartService.agregarProducto(producto);
    this.notificationService.show(`${producto.nombre} añadido al carrito`, 'success');
  }
}

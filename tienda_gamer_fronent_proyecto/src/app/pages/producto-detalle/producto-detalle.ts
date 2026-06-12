import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { Producto } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './producto-detalle.html',
  styleUrls: ['./producto-detalle.css']
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  producto: Producto | null = null;
  
  // Usamos signals/computed para reactividad
  usuarioLogueado = this.authService.currentUser;
  esAdmin = computed(() => this.authService.hasRole('ADMIN'));

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.getProducto(id).subscribe({
        next: (p) => this.producto = p,
        error: (err) => console.error('Error al cargar producto', err)
      });
    }
  }

  agregarAlCarrito() {
    if (!this.usuarioLogueado()) {
      this.notificationService.show('¡Inicia sesión para añadir al carrito! 🎮', 'warning');
      return;
    }
    if (this.producto) {
      this.cartService.agregarProducto(this.producto);
    }
  }
}

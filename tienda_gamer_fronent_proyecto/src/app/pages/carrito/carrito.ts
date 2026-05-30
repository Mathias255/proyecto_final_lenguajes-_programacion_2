import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent {
  private cartService = inject(CartService);

  items = this.cartService.items;
  total = this.cartService.totalPrecio;

  aumentar(id: number | undefined, actual: number) {
    if (id) this.cartService.actualizarCantidad(id, actual + 1);
  }

  disminuir(id: number | undefined, actual: number) {
    if (id) this.cartService.actualizarCantidad(id, actual - 1);
  }

  eliminar(id: number | undefined) {
    if (id) this.cartService.quitarProducto(id);
  }

  vaciar() {
    this.cartService.limpiarCarrito();
  }
}
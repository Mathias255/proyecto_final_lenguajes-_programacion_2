import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { CompraService } from '../../services/compra.service';
import { UsuarioService } from '../../services/usuario.service';
import { MetodoPagoService } from '../../services/metodo-pago.service';
import { NotificationService } from '../../services/notification.service';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { Compra, DetalleCompra, Usuario, MetodoPago } from '../../models/interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, FormsModule],
  templateUrl: './carrito.html',
  styleUrls: ['./carrito.css']
})
export class CarritoComponent implements OnInit {
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private compraService = inject(CompraService);
  private usuarioService = inject(UsuarioService);
  private metodoPagoService = inject(MetodoPagoService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);

  items = this.cartService.items;
  total = this.cartService.totalPrecio;

  metodosPago = signal<MetodoPago[]>([]);
  metodoPagoIdSeleccionado: number | null = null;

  ngOnInit() {
    this.cargarMetodosPago();
  }

  cargarMetodosPago() {
    this.metodoPagoService.getMetodosPagoActivos().subscribe(data => {
      this.metodosPago.set(data);
      if (data.length > 0) {
        this.metodoPagoIdSeleccionado = data[0].id ?? null;
      }
    });
  }

  finalizarCompra() {
    if (!this.metodoPagoIdSeleccionado) {
      this.notificationService.show('Por favor, selecciona un método de pago.', 'warning');
      return;
    }

    let usuario = this.authService.currentUserValue;
    if (!usuario) {
      this.notificationService.show('Debes iniciar sesión para realizar la compra.', 'warning');
      this.router.navigate(['/login']);
      return;
    }

    // Si el usuario no tiene ID, intentamos recuperarlo buscando en la lista completa
    if (!usuario.id) {
      console.warn('Usuario sin ID detectado, buscando en la lista completa de usuarios...');
      this.notificationService.show('Verificando identidad...', 'info');
      this.usuarioService.getUsuarios().subscribe({
        next: (usuarios) => {
          const encontrado = usuarios.find(u => u.email === usuario?.email);
          if (encontrado && encontrado.id) {
            this.authService.updateUser(encontrado);
            this.procesarEnvioCompra(encontrado);
          } else {
            this.notificationService.show('No se pudo recuperar tu ID de usuario.', 'error');
          }
        },
        error: (err) => {
          this.notificationService.show('Error de conexión al recuperar identidad.', 'error');
        }
      });
    } else {
      this.procesarEnvioCompra(usuario);
    }
  }

  private procesarEnvioCompra(usuario: Usuario) {
    if (this.items().length === 0) {
      this.notificationService.show('Tu carrito está vacío.', 'warning');
      return;
    }

    const detalles = this.items().map(item => ({
      productoId: item.id,
      cantidad: item.cantidad,
      precioUnitario: item.precio
    }));

    const nuevaCompra: any = {
      usuario: { id: usuario.id },
      usuarioId: usuario.id,
      total: this.total(),
      metodoPagoId: this.metodoPagoIdSeleccionado,
      detalles: detalles.map(d => ({
        producto: { id: d.productoId },
        productoId: d.productoId,
        cantidad: d.cantidad,
        precioUnitario: d.precioUnitario
      }))
    };

    this.notificationService.show('Procesando compra...', 'info');

    this.compraService.realizarCompra(nuevaCompra).subscribe({
      next: (res) => {
        if (res) {
          this.notificationService.show('¡Compra realizada con éxito!', 'success');
          this.cartService.limpiarCarrito();
          if (res.id) {
            this.router.navigate(['/compra-exito', res.id]);
          } else {
            this.router.navigate(['/catalogo']);
          }
        } else {
          this.notificationService.show('Problema al procesar tu compra.', 'error');
        }
      },
      error: (err) => {
        this.notificationService.show('Error: ' + (err.error?.message || 'Servidor no responde'), 'error');
      }
    });
  }

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
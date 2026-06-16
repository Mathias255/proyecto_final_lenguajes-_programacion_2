import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart';
import { AuthService } from '../../services/auth';
import { NotificationService } from '../../services/notification.service';
import { ResenaService } from '../../services/resena.service';
import { Producto, Resena } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './producto-detalle.html',
  styleUrls: ['./producto-detalle.css']
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);
  private resenaService = inject(ResenaService);

  producto: Producto | null = null;
  resenas = signal<Resena[]>([]);
  promedio = signal<number>(0);
  
  // Usamos signals/computed para reactividad
  usuarioLogueado = this.authService.currentUser;
  esAdmin = computed(() => this.authService.hasRole('ADMIN'));

  // Formulario de reseña
  nuevaResena = {
    calificacion: 5,
    comentario: ''
  };
  estrellaHover = 0;
  mostrarFormResena = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.getProducto(id).subscribe({
        next: (p) => {
          this.producto = p;
          if (p?.id) this.cargarResenas(p.id);
        },
        error: (err) => console.error('Error al cargar producto', err)
      });
    }
  }

  cargarResenas(productoId: number) {
    this.resenaService.getResenasPorProducto(productoId).subscribe({
      next: (res) => {
        console.log('Reseñas cargadas:', res);
        this.resenas.set(res);
      },
      error: (err) => console.error('Error al cargar reseñas del producto:', err)
    });

    this.resenaService.getMediaCalificacion(productoId).subscribe({
      next: (media) => {
        console.log('Media de calificación:', media);
        this.promedio.set(media);
      },
      error: (err) => console.error('Error al cargar media de calificación:', err)
    });
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

  toggleFormResena() {
    console.log('Intentando abrir formulario de reseña. Usuario logueado:', !!this.usuarioLogueado());
    if (!this.usuarioLogueado()) {
      this.notificationService.show('¡Inicia sesión para dejar una reseña! 🎮', 'warning');
      return;
    }
    this.mostrarFormResena = !this.mostrarFormResena;
    console.log('Estado de mostrarFormResena:', this.mostrarFormResena);
  }

  setCalificacion(val: number) {
    this.nuevaResena.calificacion = val;
  }

  enviarResena() {
    const usuario = this.usuarioLogueado();
    if (!usuario || !this.producto?.id) return;
    if (!this.nuevaResena.comentario.trim()) {
      this.notificationService.show('Escribe un comentario antes de enviar.', 'warning');
      return;
    }

    const resena: Resena = {
      productoId: this.producto.id,
      usuarioId: usuario.id!,
      nombreUsuario: `${usuario.nombre} ${usuario.apellido || ''}`.trim(),
      calificacion: this.nuevaResena.calificacion,
      comentario: this.nuevaResena.comentario,
      fechaResena: new Date().toISOString()
    };

    this.resenaService.agregarResena(resena).subscribe(() => {
      this.notificationService.show('¡Reseña publicada! ⭐', 'success');
      this.nuevaResena = { calificacion: 5, comentario: '' };
      this.mostrarFormResena = false;
      this.cargarResenas(this.producto!.id!);
    });
  }

  eliminarResena(id: number) {
    if (confirm('¿Eliminar esta reseña?')) {
      this.resenaService.eliminarResena(id).subscribe(() => {
        this.notificationService.show('Reseña eliminada', 'info');
        this.cargarResenas(this.producto!.id!);
      });
    }
  }

  arregloEstrellas(n: number): number[] {
    return Array.from({ length: 5 }, (_, i) => i + 1);
  }

  formatFecha(iso: string): string {
    return new Date(iso).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }
}

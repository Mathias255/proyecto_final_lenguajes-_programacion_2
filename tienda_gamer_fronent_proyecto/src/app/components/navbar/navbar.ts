import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { CartService } from '../../services/cart';
import { AnimeDirective } from '../../directives/anime.directive';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AnimeDirective],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private cartService = inject(CartService);
  private router = inject(Router);

  // Consumimos el signal directamente desde el servicio
  usuarioLogueado = this.authService.currentUser;
  
  // Computamos estados para el HTML para mayor claridad
  esAdmin = computed(() => this.authService.hasRole('ADMIN'));
  estaLogueado = computed(() => this.authService.isLoggedIn());
  
  totalCarrito = this.cartService.totalItems;

  logout() {
    this.authService.logout();
    // La redirección ya ocurre dentro del logout() del servicio
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  email = '';
  password = '';
  errorMessage = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    // Bypass para el administrador
    if (this.email === 'admin@tienda.com' && this.password === 'admin123') {
      const adminMock: any = {
        nombre: 'Administrador',
        email: 'admin@tienda.com',
        rol: 'ADMIN'
      };
      this.authService.login(adminMock);
      this.router.navigate(['/catalogo']);
      return;
    }

    this.apiService.login({ email: this.email, password: this.password }).subscribe({
      next: (usuario) => {
        this.authService.login(usuario);
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        console.warn('Error con POST login, intentando alternativa GET...', err);
        
        // Si el POST falla con 405, intentamos buscar al usuario con GET (común en algunos backends MVC)
        if (err.status === 405) {
          this.apiService.loginQuery(this.email, this.password).subscribe({
            next: (usuario) => {
              this.authService.login(usuario);
              this.router.navigate(['/catalogo']);
            },
            error: (err2) => {
              this.errorMessage = 'Credenciales inválidas o usuario no encontrado.';
              console.error('Error final en login:', err2);
            }
          });
        } else {
          this.errorMessage = 'Error de conexión con el servidor.';
          console.error('Error en login:', err);
        }
      }
    });
  }
}
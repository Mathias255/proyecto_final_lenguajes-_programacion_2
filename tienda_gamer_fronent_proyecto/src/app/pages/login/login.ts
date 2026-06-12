import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);

  credenciales = {
    email: '',
    password: ''
  };

  errorMessage = '';
  cargando = false;

  onLogin() {
    this.errorMessage = '';
    this.cargando = true;

    this.authService.login(this.credenciales.email, this.credenciales.password).subscribe({
      next: (respuesta: any) => {
        console.log('Login exitoso:', respuesta);
        this.cargando = false;
        
        // Redirección inteligente basada en rol
        if (this.authService.hasRole('ADMIN')) {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/catalogo']);
        }
      },
      error: (err) => {
        this.cargando = false;
        // Mostramos el mensaje real del backend si está disponible
        const mensajeBackend = err?.error?.message || err?.error?.error;
        this.errorMessage = mensajeBackend ?? 'Credenciales inválidas o error de servidor.';
        console.error('Error en login:', err);
      }
    });
  }
}
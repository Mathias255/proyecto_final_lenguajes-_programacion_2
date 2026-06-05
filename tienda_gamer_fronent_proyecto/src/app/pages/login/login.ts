import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { AuthService } from '../../services/auth';

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

  onLogin() {
    this.usuarioService.login(this.credenciales).subscribe({
      next: (usuario) => {
        this.authService.login(usuario);
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.errorMessage = 'Credenciales inválidas o error de servidor.';
        console.error('Error en login:', err);
      }
    });
  }
}
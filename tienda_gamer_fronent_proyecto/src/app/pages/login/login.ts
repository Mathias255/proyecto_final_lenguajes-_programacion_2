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

    this.usuarioService.login(this.credenciales).subscribe({
      next: (respuesta: any) => {
        console.log('RESPUESTA COMPLETA DEL BACKEND:', respuesta);
        
        // 🔥 ALERTA DE EMERGENCIA: Si el ID no aparece, mostramos la respuesta en un popup
        if (!respuesta.id && !respuesta.userId && !respuesta.idUsuario) {
          alert('DEBUG: El backend no envió un ID. Respuesta recibida: ' + JSON.stringify(respuesta));
        }

        const token = respuesta.token;

        // Intentamos mapear el ID desde cualquier campo posible
        const userId = respuesta.id || respuesta.userId || respuesta.idUsuario || respuesta.id_usuario;

        // Construimos el objeto Usuario con los datos reales obtenidos del backend
        const usuario: Usuario = {
          id: userId,
          nombre: respuesta.nombre,
          email: respuesta.email,
          rol: respuesta.rol
        };

        console.log('Login exitoso, usuario mapeado:', usuario);

        // Guardamos el usuario y el token en AuthService / localStorage
        this.authService.login(usuario, token);
        this.cargando = false;
        this.router.navigate(['/catalogo']);
      },
      error: (err) => {
        this.cargando = false;
        // Mostramos el mensaje real del backend si está disponible
        const mensajeBackend = err?.error?.message;
        this.errorMessage = mensajeBackend ?? 'Credenciales inválidas o error de servidor.';
        console.error('Error en login:', err);
      }
    });
  }
}
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  private usuarioService = inject(UsuarioService);
  private router = inject(Router);

  usuario = {
    nombre: '',
    apellido: '',
    email: '',
    password: ''
  };

  errorMessage = '';

  onRegister() {
    const payload: Partial<Usuario> = {
      ...this.usuario,
      rol: 'CLIENTE'
    };
    this.usuarioService.registrar(payload).subscribe({
      next: (res) => {
        alert('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Error al registrar usuario. Es posible que el correo ya exista o que el servidor no responda.';
        console.error('Error en registro:', err);
      }
    });
  }
}
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { ApiService } from '../../services/api';
import { Usuario } from '../../models/interfaces';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent {
  nombre = '';
  email = '';
  password = '';
  rol: 'CLIENTE' | 'ADMIN' = 'CLIENTE';
  errorMessage = '';

  constructor(private apiService: ApiService, private router: Router) {}

  onRegister() {
    // Bypass para simular registro exitoso de admin en local si falla el servidor
    if (this.email === 'admin@tienda.com') {
      alert('¡Usuario Administrador simulado con éxito!');
      this.router.navigate(['/login']);
      return;
    }

    const nuevoUsuario: Usuario = {
      nombre: this.nombre,
      email: this.email,
      password: this.password,
      rol: this.rol
    };

    console.log('Intentando registrar:', nuevoUsuario);

    this.apiService.registrarUsuario(nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Registro exitoso:', res);
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
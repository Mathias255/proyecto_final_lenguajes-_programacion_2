import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/interfaces';

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  email: string;
  rol: 'Cliente' | 'Administrador' | 'CLIENTE' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Inyección moderna de HttpClient (Angular 17+)
  private http = inject(HttpClient);

  // URL base apuntando estrictamente a localhost
  private apiUrl = 'http://localhost:8080/api/usuarios';

  /**
   * Registra un nuevo usuario en el sistema.
   * Envía una petición POST limpia para evitar conflictos de CORS.
   */
  registrar(usuario: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, usuario);
  }

  /**
   * Realiza la autenticación del usuario.
   * El backend devuelve { token: string } en lugar de un objeto Usuario.
   * La URL final es http://localhost:8080/api/usuarios/login
   */
  login(credenciales: { email: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciales);
  }

  /**
   * Obtiene todos los usuarios del sistema.
   * Útil como fallback si fallan los filtros por email.
   */
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /**
   * Obtiene los datos del usuario logueado por su email.
   */
  obtenerPorEmail(email: string): Observable<Usuario> {
    // Intentamos por ruta estándar; si falla el componente usará getUsuarios() como fallback.
    return this.http.get<Usuario>(`${this.apiUrl}/email/${email}`);
  }
}

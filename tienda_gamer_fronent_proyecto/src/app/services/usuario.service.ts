import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/interfaces';

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
   * La URL final es http://localhost:8080/api/usuarios/login
   */
  login(credenciales: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credenciales);
  }
}

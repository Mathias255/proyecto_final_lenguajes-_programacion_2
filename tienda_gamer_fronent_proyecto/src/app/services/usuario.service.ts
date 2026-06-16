import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  // Inyección moderna de HttpClient (Angular 17+)
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/usuarios`;

  /**
   * Registra un nuevo usuario en el sistema.
   * Envía una petición POST limpia para evitar conflictos de CORS.
   */
  registrar(usuario: Partial<Usuario>): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

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

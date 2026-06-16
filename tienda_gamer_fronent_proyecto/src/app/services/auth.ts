import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Usuario } from '../models/interfaces';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  apellido?: string; // Agregado por si el backend lo envía
  email: string;
  rol: 'ADMIN' | 'CLIENTE';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth/login`;

  // Usamos un Signal para manejar el estado reactivo del usuario (Angular 17+)
  private currentUserSignal = signal<Usuario | null>(this.getUsuarioDesdeStorage());

  // Exponemos el usuario como un signal de solo lectura
  public currentUser = computed(() => this.currentUserSignal());

  private getUsuarioDesdeStorage(): Usuario | null {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('usuarioLogueado');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  }

  /**
   * Envía las credenciales al backend y almacena la sesión.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          const usuario: Usuario = {
            id: response.id,
            nombre: response.nombre,
            apellido: response.apellido || '', // Mapeo del nuevo campo
            email: response.email,
            rol: response.rol
          };
          this.setSession(response.token, usuario);
        }
      })
    );
  }

  private setSession(token: string, usuario: Usuario) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      localStorage.setItem('userRole', usuario.rol);
      this.currentUserSignal.set(usuario);
    }
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  getRol(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  hasRole(requiredRole: string): boolean {
    const user = this.currentUserSignal();
    const rol = user?.rol?.toUpperCase();
    
    if (requiredRole.toUpperCase() === 'ADMIN') {
      return rol === 'ADMIN' || rol === 'ADMINISTRADOR';
    }
    
    return rol === requiredRole.toUpperCase();
  }

  /**
   * Actualiza los datos del usuario en la sesión actual.
   */
  updateUser(usuario: Usuario) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      localStorage.setItem('userRole', usuario.rol);
      this.currentUserSignal.set(usuario);
    }
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioLogueado');
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRole');
      this.currentUserSignal.set(null);
      this.router.navigate(['/login']);
    }
  }

  // Mantener compatibilidad con código que use currentUserValue
  get currentUserValue(): Usuario | null {
    return this.currentUserSignal();
  }
}
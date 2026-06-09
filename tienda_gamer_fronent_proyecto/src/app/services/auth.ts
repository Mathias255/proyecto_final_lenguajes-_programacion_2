import { Injectable } from '@angular/core';
import { Usuario } from '../models/interfaces';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor() {
    const savedUser = typeof window !== 'undefined' ? localStorage.getItem('usuarioLogueado') : null;
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(savedUser ? JSON.parse(savedUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Guarda el usuario y el token JWT en localStorage.
   */
  login(usuario: Usuario, token?: string) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
      if (token) {
        localStorage.setItem('authToken', token);
      }
    }
    this.currentUserSubject.next(usuario);
  }

  /**
   * Devuelve el token JWT almacenado, si existe.
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioLogueado');
      localStorage.removeItem('authToken');
    }
    this.currentUserSubject.next(null);
  }

  esAdmin(): boolean {
    const rol = this.currentUserValue?.rol?.toUpperCase();
    return rol === 'ADMIN' || rol === 'ADMINISTRADOR';
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
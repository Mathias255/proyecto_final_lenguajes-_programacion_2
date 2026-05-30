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

  login(usuario: Usuario) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('usuarioLogueado', JSON.stringify(usuario));
    }
    this.currentUserSubject.next(usuario);
  }

  logout() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('usuarioLogueado');
    }
    this.currentUserSubject.next(null);
  }

  esAdmin(): boolean {
    return this.currentUserValue?.rol === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return !!this.currentUserValue;
  }
}
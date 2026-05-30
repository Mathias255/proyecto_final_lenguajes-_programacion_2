import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    const savedUser = localStorage.getItem('gamer_session');
    if (savedUser) {
      this.currentUserSubject.next(JSON.parse(savedUser));
    }
  }

  login(credentials: any): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/login`, credentials).pipe(
      tap(user => {
        localStorage.setItem('gamer_session', JSON.stringify(user));
        this.currentUserSubject.next(user);
      })
    );
  }

  logout() {
    localStorage.removeItem('gamer_session');
    this.currentUserSubject.next(null);
  }

  isAdmin(): boolean {
    const user = this.currentUserSubject.value;
    return user !== null && user.rol === 'ADMIN';
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }
}
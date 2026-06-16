import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Resena } from '../models/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/resenas`;

  getResenasPorProducto(productoId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/producto/${productoId}`);
  }

  getResenasPorUsuario(usuarioId: number): Observable<Resena[]> {
    return this.http.get<Resena[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  getMediaCalificacion(productoId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/producto/${productoId}/media`);
  }

  agregarResena(resena: Resena): Observable<Resena> {
    return this.http.post<Resena>(this.apiUrl, resena);
  }

  eliminarResena(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}


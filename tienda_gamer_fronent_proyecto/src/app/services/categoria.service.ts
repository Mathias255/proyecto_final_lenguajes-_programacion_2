import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Categoria } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/categorias';

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener categorías:', error);
        return of([]);
      })
    );
  }

  getCategoria(id: number): Observable<Categoria | null> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener categoría ${id}:`, error);
        return of(null);
      })
    );
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria);
  }

  actualizarCategoria(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria);
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

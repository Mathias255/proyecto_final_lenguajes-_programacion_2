import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Producto } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/productos';

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener productos:', error);
        return of([]);
      })
    );
  }

  getProducto(id: number): Observable<Producto | null> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Error al obtener producto ${id}:`, error);
        return of(null);
      })
    );
  }

  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.apiUrl}/categoria/${categoriaId}`).pipe(
      catchError(error => {
        console.error(`Error al obtener productos por categoría ${categoriaId}:`, error);
        return of([]);
      })
    );
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto);
  }

  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.apiUrl}/${id}`, producto);
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

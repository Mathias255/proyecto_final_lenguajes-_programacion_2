import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { Compra } from '../models/interfaces';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/compras`;

  realizarCompra(compra: Compra): Observable<Compra | null> {
    return this.http.post<Compra>(this.apiUrl, compra).pipe(
      catchError(error => {
        console.error('Error al realizar compra:', error);
        return of(null);
      })
    );
  }

  getCompras(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.apiUrl).pipe(
      catchError(error => {
        console.error('Error al obtener compras:', error);
        return of([]);
      })
    );
  }

  getCompraById(id: number): Observable<Compra | null> {
    return this.http.get<Compra>(`${this.apiUrl}/${id}`).pipe(
      catchError(() => {
        return of(null);
      })
    );
  }

  eliminarCompra(id: number): Observable<boolean> {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(() => {
        // Silenciamos el error en consola ya que es un problema del backend (500 No static resource)
        // El componente mostrará el aviso de error al usuario de forma elegante.
        return of(false);
      })
    );
  }
}

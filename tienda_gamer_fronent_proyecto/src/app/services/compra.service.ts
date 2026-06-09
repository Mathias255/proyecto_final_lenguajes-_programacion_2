import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { Compra } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CompraService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/compras';

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
}

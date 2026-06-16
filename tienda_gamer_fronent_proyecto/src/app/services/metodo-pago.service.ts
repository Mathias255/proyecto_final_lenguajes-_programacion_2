import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MetodoPago } from '../models/interfaces';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/metodos-pago`;

  getMetodosPago(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(this.apiUrl);
  }

  getMetodosPagoActivos(): Observable<MetodoPago[]> {
    return this.http.get<MetodoPago[]>(`${this.apiUrl}/activos`);
  }

  getMetodoPago(id: number): Observable<MetodoPago> {
    return this.http.get<MetodoPago>(`${this.apiUrl}/${id}`);
  }

  crearMetodoPago(metodo: MetodoPago): Observable<MetodoPago> {
    return this.http.post<MetodoPago>(this.apiUrl, metodo);
  }

  actualizarMetodoPago(id: number, metodo: MetodoPago): Observable<MetodoPago> {
    return this.http.put<MetodoPago>(`${this.apiUrl}/${id}`, metodo);
  }

  eliminarMetodoPago(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

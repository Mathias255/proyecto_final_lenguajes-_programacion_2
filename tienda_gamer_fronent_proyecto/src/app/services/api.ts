import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto, Categoria, Usuario } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // --- PRODUCTOS ---
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos`);
  }

  // Se acopla al método 'getPorCategoria' de tu ProductoService en Java
  getProductosPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.baseUrl}/productos/categoria/${categoriaId}`);
  }

  // Se acopla al método 'guardar' de tu backend
  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${this.baseUrl}/productos`, producto);
  }

  // Se acopla al método 'actualizar' de tu backend
  actualizarProducto(id: number, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.baseUrl}/productos/${id}`, producto);
  }

  // Se acopla al método 'eliminar' de tu backend
  deleteProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/productos/${id}`);
  }

  // --- CATEGORIAS ---
  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${this.baseUrl}/categorias`);
  }

  crearCategoria(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(`${this.baseUrl}/categorias`, categoria);
  }

  // --- LOGIN INTERNO ---
  // Intentaremos POST como primera opción
  login(credenciales: { email: string, password: string }): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios/login`, credenciales);
  }

  // Alternativa si el backend usa GET para buscar por email/pass (menos seguro pero común en proyectos iniciales)
  loginQuery(email: string, pass: string): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/usuarios/login?email=${email}&password=${pass}`);
  }

  // --- REGISTRO ---
  registrarUsuario(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.baseUrl}/usuarios`, usuario);
  }
}
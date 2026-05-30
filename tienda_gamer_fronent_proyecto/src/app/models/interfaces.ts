export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  imagenUrl: string;
  categoria: Categoria;
}

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'CLIENTE' | 'ADMIN';
}
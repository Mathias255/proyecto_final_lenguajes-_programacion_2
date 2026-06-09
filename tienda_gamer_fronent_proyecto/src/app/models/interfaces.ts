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
  categoria?: Categoria;
  categoriaId?: number; // 🔥 Para compatibilidad con el backend
}

export interface Usuario {
  id?: number;
  nombre: string;
  email: string;
  password?: string;
  rol: 'Cliente' | 'Administrador' | 'CLIENTE' | 'ADMIN';
}

export interface DetalleCompra {
  id?: number;
  producto: Producto;
  productoId?: number; // 🔥 Para compatibilidad con el backend
  cantidad: number;
  precioUnitario: number;
}

export interface Compra {
  id?: number;
  usuario: Usuario;
  usuarioId?: number; // 🔥 Para compatibilidad con el backend
  fecha?: string;
  total: number;
  detalles: DetalleCompra[];
}
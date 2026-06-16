export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

export interface Proveedor {
  id?: number;
  nombre: string;
  contacto: string;
  email: string;
  telefono: string;
  direccion: string;
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
  proveedor?: Proveedor;
  proveedorId?: number;
}

export interface Resena {
  id?: number;
  productoId: number;
  usuarioId: number;
  nombreUsuario: string;
  calificacion: number; // 1-5
  comentario: string;
  fechaResena: string;
}

export interface Usuario {
  id?: number;
  nombre: string;
  apellido: string; // 🔥 Nuevo campo obligatorio
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

export interface MetodoPago {
  id?: number;
  nombre: string;
  descripcion: string;
  tipo: 'TARJETA' | 'TRANSFERENCIA' | 'EFECTIVO' | 'BILLETERA_DIGITAL';
  comisionPorcentaje: number;
  activo: boolean;
}

export interface Compra {
  id?: number;
  usuario: Usuario;
  usuarioId?: number; // 🔥 Para compatibilidad con el backend
  fecha?: string;
  total: number;
  detalles: DetalleCompra[];
  metodoPago?: MetodoPago;
  metodoPagoId?: number;
}
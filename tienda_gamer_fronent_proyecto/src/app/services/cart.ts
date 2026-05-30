import { Injectable, signal, computed } from '@angular/core';
import { Producto } from '../models/interfaces';

export interface CartItem extends Producto {
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems = signal<CartItem[]>([]);

  // Selectores
  items = computed(() => this.cartItems());
  
  totalItems = computed(() => 
    this.cartItems().reduce((acc, item) => acc + item.cantidad, 0)
  );

  totalPrecio = computed(() => 
    this.cartItems().reduce((acc, item) => acc + (item.precio * item.cantidad), 0)
  );

  agregarProducto(producto: Producto) {
    this.cartItems.update(prevItems => {
      const existingItem = prevItems.find(item => item.id === producto.id);
      
      if (existingItem) {
        return prevItems.map(item => 
          item.id === producto.id 
            ? { ...item, cantidad: item.cantidad + 1 } 
            : item
        );
      }
      
      return [...prevItems, { ...producto, cantidad: 1 }];
    });
    
    alert(`¡${producto.nombre} añadido al carrito!`);
  }

  quitarProducto(id: number) {
    this.cartItems.update(prevItems => prevItems.filter(item => item.id !== id));
  }

  actualizarCantidad(id: number, cantidad: number) {
    if (cantidad <= 0) {
      this.quitarProducto(id);
      return;
    }
    this.cartItems.update(prevItems => 
      prevItems.map(item => item.id === id ? { ...item, cantidad } : item)
    );
  }

  limpiarCarrito() {
    this.cartItems.set([]);
  }
}
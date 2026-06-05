import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CartService } from '../../services/cart';
import { Producto } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-producto-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './producto-detalle.html',
  styleUrls: ['./producto-detalle.css']
})
export class ProductoDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private productoService = inject(ProductoService);
  private cartService = inject(CartService);

  producto: Producto | null = null;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.productoService.getProducto(id).subscribe({
        next: (p) => this.producto = p,
        error: (err) => console.error('Error al cargar producto', err)
      });
    }
  }

  agregarAlCarrito() {
    if (this.producto) {
      this.cartService.agregarProducto(this.producto);
    }
  }
}
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-compras.html',
  styleUrls: ['./admin-compras.css']
})
export class AdminComprasComponent implements OnInit {
  private compraService = inject(CompraService);
  compras: Compra[] = [];
  compraSeleccionada: Compra | null = null;

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe(data => {
      this.compras = data;
    });
  }

  verDetalle(compra: Compra) {
    this.compraSeleccionada = (this.compraSeleccionada?.id === compra.id) ? null : compra;
  }
}

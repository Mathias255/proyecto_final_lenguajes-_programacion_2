import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-compras',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  templateUrl: './admin-compras.html',
  styleUrls: ['./admin-compras.css']
})
export class AdminComprasComponent implements OnInit {
  private compraService = inject(CompraService);
  private notificationService = inject(NotificationService);
  
  compras = signal<Compra[]>([]);
  compraSeleccionada = signal<Compra | null>(null);

  ngOnInit() {
    this.cargarCompras();
  }

  cargarCompras() {
    this.compraService.getCompras().subscribe(data => {
      this.compras.set(data);
    });
  }

  verDetalle(compra: Compra) {
    const actual = this.compraSeleccionada();
    this.compraSeleccionada.set(actual?.id === compra.id ? null : compra);
  }

  eliminarCompra(id: number | undefined, event: Event) {
    event.stopPropagation();
    if (!id) return;
    
    if (confirm('¿Estás seguro de que deseas eliminar este registro de compra?')) {
      this.compraService.eliminarCompra(id).subscribe(exito => {
        if (exito) {
          this.notificationService.show('Compra eliminada correctamente', 'success');
          this.cargarCompras();
        } else {
          this.notificationService.show('Error al eliminar la compra', 'error');
        }
      });
    }
  }
}

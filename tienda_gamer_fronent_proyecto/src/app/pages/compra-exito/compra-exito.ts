import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CompraService } from '../../services/compra.service';
import { Compra } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';

@Component({
  selector: 'app-compra-exito',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent],
  templateUrl: './compra-exito.html',
  styleUrls: ['./compra-exito.css']
})
export class CompraExitoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private compraService = inject(CompraService);
  
  compra = signal<Compra | null>(null);
  loading = signal(true);
  error = signal(false);

  ngOnInit() {
    const idStr = this.route.snapshot.paramMap.get('id');
    if (!idStr) {
      this.loading.set(false);
      this.error.set(true);
      return;
    }

    const id = +idStr;
    
    // Intentar obtener la compra específica
    this.compraService.getCompraById(id).subscribe({
      next: (data) => {
        if (data) {
          this.compra.set(data);
          this.loading.set(false);
        } else {
          this.intentarFallback(id);
        }
      },
      error: () => {
        // Si falla el endpoint (500), intentamos el fallback
        this.intentarFallback(id);
      }
    });
  }

  private intentarFallback(id: number) {
    this.compraService.getCompras().subscribe({
      next: (compras) => {
        const encontrada = compras.find(c => c.id === id);
        if (encontrada) {
          this.compra.set(encontrada);
        } else {
          this.error.set(true);
        }
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  imprimir() {
    window.print();
  }
}

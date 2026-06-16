import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { HttpClient } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AuditEntry {
  id: number;
  email: string;
  evento: string; // "LOGIN_EXITOSO" o "LOGIN_FALLIDO"
  fechaHora: string;
}

@Component({
  selector: 'app-auditoria',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar>
    <div class="audit-container">
      <div class="header">
        <h1>🔍 Auditoría de Accesos (JAAS)</h1>
        <p>Registro histórico de inicios de sesión y seguridad.</p>
      </div>

      <div class="table-wrapper">
        <table class="audit-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha y Hora</th>
              <th>Evento</th>
              <th>Resultado</th>
            </tr>
          </thead>
          <tbody>
            @for (entry of entries(); track entry.id) {
              <tr [class.fail]="entry.evento.includes('FALLIDO')">
                <td>#{{ entry.id }}</td>
                <td><strong>{{ entry.email }}</strong></td>
                <td>{{ entry.fechaHora | date:'medium' }}</td>
                <td>{{ entry.evento }}</td>
                <td>
                  <span class="status-badge" [class.success]="entry.evento.includes('EXITOSO')">
                    {{ entry.evento.includes('EXITOSO') ? 'Éxito ✅' : 'Fallido ❌' }}
                  </span>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="no-data">No hay registros de auditoría disponibles.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
    <app-footer></app-footer>
  `,
  styles: [`
    .audit-container {
      max-width: 1200px;
      margin: 40px auto;
      padding: 0 20px;
      min-height: 70vh;
    }
    .header {
      text-align: center;
      margin-bottom: 30px;
      h1 { color: #00ff88; font-family: 'Orbitron', sans-serif; text-shadow: 0 0 10px rgba(0,255,136,0.3); }
      p { color: #888; }
    }
    .table-wrapper {
      background: rgba(20, 20, 30, 0.8);
      border-radius: 15px;
      overflow: hidden;
      border: 1px solid #333;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    }
    .audit-table {
      width: 100%;
      border-collapse: collapse;
      color: #eee;
      th { background: #1a1a2e; padding: 15px; text-align: left; border-bottom: 2px solid #333; }
      td { padding: 15px; border-bottom: 1px solid #222; }
      tr.fail { background: rgba(255, 50, 50, 0.05); }
    }
    .status-badge {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: bold;
      background: rgba(255, 50, 50, 0.2);
      color: #ff5555;
      &.success { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
    }
    .no-data { text-align: center; padding: 40px; color: #666; font-style: italic; }
  `]
})
export class AuditoriaComponent implements OnInit {
  private http = inject(HttpClient);
  entries = signal<AuditEntry[]>([]);

  ngOnInit() {
    this.cargarAuditoria();
  }

  cargarAuditoria() {
    // Asumimos que el backend tiene un endpoint de auditoría. 
    // Si no existe, al menos tenemos el componente listo para cuando se implemente.
    this.http.get<AuditEntry[]>(`${environment.apiUrl}/auditoria`).pipe(
      catchError(() => of([]))
    ).subscribe(data => this.entries.set(data));
  }
}

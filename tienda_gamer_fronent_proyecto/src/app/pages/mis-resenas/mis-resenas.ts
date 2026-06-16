import { Component, OnInit, inject, signal } from '@angular/core';


import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth';
import { Resena } from '../../models/interfaces';
import { NavbarComponent } from '../../components/navbar/navbar';
import { FooterComponent } from '../../components/footer/footer';
import { AnimeDirective } from '../../directives/anime.directive';
import { NotificationService } from '../../services/notification.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-mis-resenas',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, FooterComponent, AnimeDirective],
  template: `
    <app-navbar></app-navbar>

    <div class="reviews-container">
      <header class="page-header" [appAnime]="{ translateY: [-20, 0], opacity: [0, 1] }">
        <h1>⭐ Mis Reseñas Gamer</h1>
        <p>Aquí puedes ver todas las opiniones que has compartido sobre tus componentes.</p>
      </header>

      <div class="reviews-grid" *ngIf="resenas().length > 0; else noReviews">
        <div class="review-card" *ngFor="let r of resenas()" [appAnime]="{ scale: [0.95, 1], opacity: [0, 1] }">
          <div class="card-header">
            <div class="stars">
              <span *ngFor="let s of [1,2,3,4,5]" class="star" [class.filled]="s <= r.calificacion">★</span>
            </div>
            <span class="date">{{ r.fechaResena | date:'dd/MM/yyyy' }}</span>
          </div>
          
          <div class="product-info" *ngIf="r.productoId">
             <i class="fas fa-microchip"></i> <span>Producto ID: #{{ r.productoId }}</span>
          </div>

          <p class="comment">"{{ r.comentario }}"</p>

          <div class="actions">
            <button class="btn-delete" (click)="eliminar(r.id!)">🗑️ Eliminar Opinion</button>
            <button class="btn-view" [routerLink]="['/producto', r.productoId]">Ver Producto</button>
          </div>
        </div>
      </div>


      <ng-template #noReviews>
        <div class="empty-state" [appAnime]="{ opacity: [0, 1] }">
          <i class="fas fa-comment-slash"></i>
          <p>Aún no has escrito ninguna reseña. ¡Comparte tu experiencia!</p>
          <button routerLink="/catalogo" class="btn-primary">Explorar Catálogo</button>
        </div>
      </ng-template>
    </div>

    <app-footer></app-footer>
  `,
  styles: [`
    .reviews-container { max-width: 1000px; margin: 40px auto; padding: 0 20px; min-height: 70vh; }
    .page-header { margin-bottom: 40px; h1 { font-family: 'Orbitron', sans-serif; color: var(--primary); } p { color: #888; } }
    .reviews-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(400px, 1fr)); gap: 25px; }
    .review-card { background: rgba(22, 22, 26, 0.8); border: 1px solid #333; border-radius: 20px; padding: 25px; transition: 0.3s; }
    .review-card:hover { border-color: var(--primary); transform: translateY(-5px); }
    .card-header { display: flex; justify-content: space-between; margin-bottom: 15px; }
    .star { color: #444; font-size: 1.2rem; }
    .star.filled { color: #ffd700; text-shadow: 0 0 8px rgba(255, 215, 0, 0.4); }
    .date { color: #666; font-size: 0.8rem; }
    .product-info { font-size: 0.9rem; color: var(--primary); margin-bottom: 15px; display: flex; align-items: center; gap: 8px; }
    .comment { color: #ccc; line-height: 1.6; font-style: italic; margin-bottom: 20px; min-height: 50px; }
    .actions { display: flex; gap: 15px; border-top: 1px solid #222; padding-top: 20px; }
    .btn-delete { background: rgba(255, 50, 50, 0.1); color: #ff4444; border: 1px solid rgba(255, 50, 50, 0.2); padding: 8px 15px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; }
    .btn-view { background: #222; color: #fff; border: 1px solid #444; padding: 8px 15px; border-radius: 10px; cursor: pointer; font-size: 0.85rem; }
    .empty-state { text-align: center; padding: 100px 20px; i { font-size: 4rem; color: #222; margin-bottom: 20px; } p { color: #888; margin-bottom: 25px; } }
    .btn-primary { background: var(--primary); color: #000; padding: 12px 30px; border-radius: 30px; font-weight: bold; }
    @media (max-width: 600px) { .reviews-grid { grid-template-columns: 1fr; } }
  `]
})
export class MisResenasComponent implements OnInit {
  private resenaService = inject(ResenaService);
  private authService = inject(AuthService);
  private notificationService = inject(NotificationService);

  resenas = signal<Resena[]>([]);


  ngOnInit() {
    const usuario = this.authService.currentUserValue;
    if (usuario && usuario.id) {
      this.resenaService.getResenasPorUsuario(usuario.id).pipe(
        catchError(err => {
          console.error('Endpoint de reseñas por usuario no disponible en el backend', err);
          return of([]);
        })
      ).subscribe(data => {
        this.resenas.set(data);
      });
    }
  }

  eliminar(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta reseña?')) {
      this.resenaService.eliminarResena(id).subscribe(() => {
        this.notificationService.show('Reseña eliminada con éxito', 'info');
        this.resenas.update(prev => prev.filter(r => r.id !== id));
      });
    }
  }




}


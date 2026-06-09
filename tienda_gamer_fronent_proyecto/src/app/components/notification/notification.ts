import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      @for (notif of notifications(); track notif.id) {
        <div class="notification" [class]="notif.type">
          <span class="icon">
            @if (notif.type === 'success') { ✔ }
            @else if (notif.type === 'error') { ✖ }
            @else if (notif.type === 'warning') { ⚠ }
            @else { ℹ }
          </span>
          <span class="message">{{ notif.message }}</span>
          <button class="close-btn" (click)="remove(notif.id)">×</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 10000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      pointer-events: none;
    }
    .notification {
      pointer-events: auto;
      min-width: 280px;
      max-width: 400px;
      padding: 16px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      color: white;
      box-shadow: 0 8px 16px rgba(0,0,0,0.2);
      animation: slideIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      backdrop-filter: blur(8px);
    }
    .success { background: rgba(34, 197, 94, 0.9); border-left: 4px solid #16a34a; }
    .error { background: rgba(239, 68, 68, 0.9); border-left: 4px solid #dc2626; }
    .warning { background: rgba(234, 179, 8, 0.9); border-left: 4px solid #ca8a04; color: #422006; }
    .info { background: rgba(59, 130, 246, 0.9); border-left: 4px solid #2563eb; }
    
    .icon { font-size: 1.2rem; font-weight: bold; }
    .message { flex-grow: 1; font-weight: 500; font-family: sans-serif; }
    .close-btn { background: none; border: none; color: inherit; font-size: 1.5rem; cursor: pointer; opacity: 0.7; }
    .close-btn:hover { opacity: 1; }

    @keyframes slideIn {
      from { transform: translateX(120%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
  `]
})
export class NotificationComponent {
  private notificationService = inject(NotificationService);
  notifications = this.notificationService.notifications;

  remove(id: number) {
    this.notificationService.remove(id);
  }
}

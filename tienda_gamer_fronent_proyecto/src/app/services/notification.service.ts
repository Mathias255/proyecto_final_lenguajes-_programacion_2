import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: number;
  message: string;
  type: NotificationType;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSignal = signal<Notification[]>([]);
  notifications = this.notificationsSignal.asReadonly();
  private nextId = 0;

  show(message: string, type: NotificationType = 'success', duration: number = 3000) {
    // Usamos setTimeout para evitar el error NG0100 (ExpressionChangedAfterItHasBeenCheckedError)
    // al asegurar que la actualización ocurra en el siguiente ciclo de detección.
    setTimeout(() => {
      const id = this.nextId++;
      const newNotification: Notification = { id, message, type };
      
      this.notificationsSignal.update(prev => [...prev, newNotification]);

      setTimeout(() => {
        this.remove(id);
      }, duration);
    });
  }

  remove(id: number) {
    this.notificationsSignal.update(prev => prev.filter(n => n.id !== id));
  }
}

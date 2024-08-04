import { Injectable, signal } from '@angular/core';
import { NotificationData } from '../interfaces/common-interface';

@Injectable({
  providedIn: 'root'
})
export class DataTransferService {
  notificationDataShare = signal<NotificationData>({ notificationType: '', notificationMessage: '' }) // For sending data to notification component


  constructor() { }


  // For sending notifications status and message in notification component
  sendNotification(status: boolean, message: string): void {
    this.notificationDataShare.set({ notificationType: status ? "success": "danger", notificationMessage: message });
  }


}

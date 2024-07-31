import { NgClass } from '@angular/common';
import { Component, OnInit, effect, signal } from '@angular/core';
import { Toast } from 'bootstrap';
import { DataTransferService } from '../../services/data-transfer.service';
import { NotificationData } from '../../interfaces/common-interface';


@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [NgClass],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})


export class NotificationComponent implements OnInit {
  notificationType = signal<string>('');
  notificationMessage = signal<string>('');
  toast!: Toast;


  constructor(private _dataTransfer: DataTransferService) {
    effect(() => {
      if (_dataTransfer.notificationDataShare()) {  // For handling infinite loop on effect
        let notificationData = _dataTransfer.notificationDataShare();
        if (!notificationData.notificationType || !notificationData.notificationMessage) return  // For handling signal default value it was getting triggered with '' value cause it's the initialize value
        this.showNotification(notificationData);
      }
    }, { allowSignalWrites: true });
  }


  ngOnInit(): void {
    const toastElement = document.getElementById('liveToast');
    this.toast = new Toast(toastElement!);
  }


  // For showing notification
  showNotification(notificationData: NotificationData): void {
    this.notificationType.set(notificationData.notificationType);
    this.notificationMessage.set(notificationData.notificationMessage);
    this.toast.show();
  }

}
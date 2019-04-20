import { Injectable } from '@angular/core';
import { ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor(
    private toastController: ToastController
  ) { }

  async toast(message, color) {
    
    const toast = await this.toastController.create({
      message: message,
      color: color,
      position: 'top',
      duration: 2000
    });
    toast.present();
  }

  async persistToast(message, color) {
    const toast = await this.toastController.create({
      message: message,
      color: color,
      position: 'top',
      showCloseButton: true
    });
    toast.present();
  }
}

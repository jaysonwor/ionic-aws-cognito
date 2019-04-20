import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.page.html',
  styleUrls: ['./forgot.page.scss'],
})
export class ForgotPage {
  email: string
  loading: boolean = false

  constructor(
    private navCtrl: NavController,
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  send() {
    this.loading = true
    this.cognitoService.forgotPassword(this.email).then(
      res => {
        this.loading = false
        this.toastService.toast("Reset password using code sent to email", "primary")
        this.navCtrl.navigateRoot('/auth/reset/'+this.email)
      },
      err => {
        this.loading = false
        console.log("ForgotPage.send: failed, stack: " + err.message)
        this.toastService.toast(err.message, "danger")
      }
    )
  }


}

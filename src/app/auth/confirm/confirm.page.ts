import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.page.html',
  styleUrls: ['./confirm.page.scss'],
})
export class ConfirmPage {
  id: string
  code: string
  loading: boolean = false

  constructor(
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id')
    console.log("ConfirmPage.id = "+this.id)
  }

  confirm() {
    this.loading = true
    this.cognitoService.confirmUser(this.code, this.id).then(
      res => {
        this.loading = false
        this.toastService.toast("Registration confirmed", "primary")
        this.navCtrl.navigateRoot('/auth/login')
      },
      err => {
        this.loading = false
        console.log("ConfirmPage.confirm: failed, stack: "+err.message)
        this.toastService.toast(err.message, "danger")
      }
    );
  }

  resend() {
    this.cognitoService.resendCode(this.id).then(
      res => {
        this.toastService.toast("Code resent check email", "primary")
      },
      err => {
        console.log("ConfirmPage.resend: failed, stack: "+err.message)
        this.toastService.toast(err.message, "danger")
      }
    );
  }


}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-reset',
  templateUrl: './reset.page.html',
  styleUrls: ['./reset.page.scss'],
})
export class ResetPage {
  id: string
  password: string
  code: string
  loading: boolean = false

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  ionViewWillEnter() {
    this.id = this.route.snapshot.paramMap.get('id')
    console.log("ResetPage.id = "+this.id)
  }

  reset() {
    this.loading = true
    this.cognitoService.confirmNewPassword(this.id, this.code, this.password).then(
      res => {
        this.loading = false
        this.toastService.toast("Password reset", "primary")
        this.navCtrl.navigateRoot('/auth/login')
      },
      err => {
        this.loading = false
        console.log("ResetPage.reset: failed, stack: " + err.message)
        this.toastService.toast(err.message, "danger")
      }
    )
  }

}

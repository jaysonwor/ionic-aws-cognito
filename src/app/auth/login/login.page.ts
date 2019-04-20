import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  //todo debug
  email: string 
  password: string 
  loading: boolean = false

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private toastService: ToastService,
    private alertController: AlertController,
    private cognitoService: CognitoService
  ) { }

  login() {
    this.loading = true
    this.cognitoService.authenticate(this.email.toLowerCase(), this.password, null)
      .then(res => {
        this.loading = false
        this.navCtrl.navigateRoot('/home')
      }, err => {
        this.loading = false
        console.log("LoginPage.login: failed, stack: "+ err.message)
        if("newPasswordRequired" == err.message) {
          this.toastService.toast("Requires Password Change", "primary")
          this.promptNewPassword()
        } else if("user is not confirmed." == err.message.toString().toLowerCase()) {
          this.toastService.toast(err.message, "danger")
          this.router.navigate(['/auth/confirm/'+this.email])       
        } else {
          this.toastService.toast(err.message, "danger")
        }
      });
  }

  async promptNewPassword() {
    const alert = await this.alertController.create({
      header: "Enter new password",
      inputs: [
        {
          name: "password",
          type: "password",
          placeholder: "Password"
        }
      ],
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: data => {
            console.log("Cancel clicked");
          }
        },
        {
          text: "Submit",
          handler: data => {
            this.cognitoService.authenticate(this.email, this.password, data.password)
              .then(res => {
                this.toastService.toast("Password Updated", "primary")
                this.navCtrl.navigateRoot('/auth/login')
              }, err => {
                console.log("LoginPage.promptNewPassword: failed, stack: "+ err.message)
                this.toastService.toast(err.message, "danger")
                this.promptNewPassword()
              });
          }
        }
      ]
    });
    await alert.present();
  }


}

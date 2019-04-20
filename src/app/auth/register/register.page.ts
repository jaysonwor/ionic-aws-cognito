import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage {
  email: string
  password: string
  loading: boolean = false

  constructor(
    private router: Router,
    private toastService: ToastService,
    private cognitoService: CognitoService,
  ) { }

  register() {
    this.loading = true
    this.cognitoService.signUp(this.email.toLowerCase(), this.password).then(
      res => {
        this.loading = false
        this.toastService.toast("Confirm registration with code sent to email", "primary")
        this.router.navigate(['/auth/confirm/'+this.email])
      },
      err => {
        this.loading = false
        console.log("RegisterPage.register: failed, stack: "+err.message)
        this.toastService.toast(err.message, "danger")
      }
    );
  }


}

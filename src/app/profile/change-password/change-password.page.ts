import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage {
  email: string
  currentPassword: string
  newPassword: string
  loading: boolean = false

  constructor(
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  async ionViewWillEnter() {
    await this.cognitoService.getCurrentUserId().then(
      value => {
        this.email = value
      }
    )
  }

  change() {
    this.loading = true
    this.cognitoService.changePassword(this.email, this.currentPassword, this.newPassword).then(
      res => {
        this.loading = false
        this.toastService.toast("Password changed", "primary")
      },
      err => {
        this.loading = false
        if("incorrect username or password" == err.message.toString().toLowerCase()) {
          err.message = "Error Saving: confirm current password is correct"
        }
        console.log("ChangePasswordPage.change: failed, stack: " + err.message)
        this.toastService.persistToast(err.message, "danger")
      }
    );
  }



}

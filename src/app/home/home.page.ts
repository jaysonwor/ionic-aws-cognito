import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { CognitoService } from '../services/cognito.service'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  email: string

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private cognitoService: CognitoService
  ) { }

  async ionViewWillEnter() {
    await this.cognitoService.getCurrentUserId().then(
      value => {
        this.email = value
      }
    )
  }

  logout() {
    console.log("HomePage.logout")
    this.cognitoService.logout()
    this.router.navigate([''])
  }


}

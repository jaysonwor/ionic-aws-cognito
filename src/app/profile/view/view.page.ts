import { Component, OnInit } from '@angular/core';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-view',
  templateUrl: './view.page.html',
  styleUrls: ['./view.page.scss'],
})
export class ViewPage {

  constructor(
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  async ionViewWillEnter() {
    let attributes = await this.cognitoService.getUserAttributes()
    console.log(JSON.stringify(attributes))
      


  }

}

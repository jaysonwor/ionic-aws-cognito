import { Component, OnInit, } from '@angular/core';
// import { DomSanitizer } from '@angular/platform-browser';
import { Storage } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Crop } from '@ionic-native/crop/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { CognitoService } from '../../services/cognito.service'
import { ToastService } from '../../services/toast.service'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage {
  email: string
  name: string
  picture: any
  // imgPreview = 'assets/imgs/blank-avatar.jpg';
  loading: boolean = false

  constructor(
    private imagePicker: ImagePicker,
    private base64: Base64,
    private crop: Crop,
    private storage: Storage,
    // private sanitizer: DomSanitizer,
    private toastService: ToastService,
    private cognitoService: CognitoService
  ) { }

  async ionViewWillEnter() {
    let attributes = await this.cognitoService.getUserAttributes()
    this.email = attributes['email']
    this.name = attributes['name']
    this.picture = attributes['picture']
    // this.imgPreview = await this.storage.get('IMAGE2')
  }

  // public getSantizeUrl(url : string) {
  //   return this.sanitizer.bypassSecurityTrustUrl(url);
  // }

  getPhoto() {
    let options = {
      maximumImagesCount: 1
    };
    this.imagePicker.getPictures(options).then((results) => {
      for (var i = 0; i < results.length; i++) {
        // this.storage.set('IMAGE1', results[i])
        this.base64.encodeFile(results[i]).then((base64File: string) => {
          this.picture = base64File;
          // this.storage.set('IMAGE2', this.imgPreview)
        }, (err) => {
          console.log(err);
        });
          // this.imgPreview = results[i]
          // this.imgPreview = results[i];
          // this.toastService.toast(this.imgPreview, "primary")
          // this.reduceImages(results).then(() => {
          //   console.log('all images cropped!!');
          // });
          // this.base64.encodeFile(results[i]).then((base64File: string) => {
          //   this.picture = base64File;
          // }, (err) => {
          //   this.toastService.persistToast(err.message, "danger")
          //   console.log(err);
          // });
      }
    }, (err) => { });
  }

  // private reduceImages(selected_pictures: any) : any{
  //   return selected_pictures.reduce((promise:any, item:any) => {
  //     return promise.then((result) => {
  //       return this.crop.crop(item, {quality: 75})
	// 			.then(cropped_image => {
  //         this.imgPreview = cropped_image
  //         this.storage.set('IMAGE', cropped_image)
  //       })
  //     });
  //   }, Promise.resolve());
  // }

  save() {
    this.loading = true
    this.cognitoService.updateAttributes(this.formatAttributes()).then(
      res => {
        this.loading = false
        this.toastService.toast("Profile updated", "primary")
      },
      err => {
        this.loading = false
        console.log("EditPage.save: failed, stack: " + err.message)
        this.toastService.toast(err.message, "danger")
      }
    )

  }

  private formatAttributes() {
    let attributes = [
      {
        Name: "name",
        Value: this.name
      },
      {
        Name: "picture",
        Value: this.picture
      },
    ]
    return attributes
  }

  

}

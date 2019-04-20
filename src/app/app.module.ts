import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IonicStorageModule } from '@ionic/storage';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { Base64 } from '@ionic-native/base64/ngx';
import { Crop } from '@ionic-native/crop/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CognitoService } from './services/cognito.service'
import { ToastService } from './services/toast.service'
import { AuthGuard } from './guards/auth.guard';
import { SanitizerPipe } from './pipes/sanitizer.pipe'

@NgModule({
  declarations: [
    AppComponent, 
    SanitizerPipe
  ],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    IonicStorageModule.forRoot()
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    CognitoService,
    ToastService,
    AuthGuard,
    ImagePicker,
    Base64,
    Crop
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

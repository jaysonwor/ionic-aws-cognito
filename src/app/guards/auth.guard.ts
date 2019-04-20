import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { CognitoService } from '../services/cognito.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private cognitoService: CognitoService
  ) { }

  canActivate(): Promise<boolean> | boolean {
    console.log("AuthGuard.canActivate")
    return new Promise(resolve => {
      this.cognitoService.isAuthenticated().then((valid) => {
        console.log("AuthGuard.canActivate: "+ valid)
        resolve(valid)
      }).catch(() => {
        resolve(false)
        this.router.navigate([''])
      })
    })
    // return new Promise(resolve => {
    //   if (this.cognitoService.isAuthenticated()) {
    //     console.log("logged in")
    //     resolve(true);
    //   } else {
    //     console.log("not logged in")
    //     // this.toastr.error("Please login...", "Unauthorized");
    //     this.router.navigate(['/auth/login']);
    //     resolve(false);
    //   }
    // });
  }
}

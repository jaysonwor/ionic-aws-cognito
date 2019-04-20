import { Injectable } from '@angular/core';
import { environment } from "../../environments/environment"
import { Storage } from '@ionic/storage';
import { JwtHelperService } from '@auth0/angular-jwt';
import * as AWSCognito from "amazon-cognito-identity-js"

@Injectable({
  providedIn: 'root'
})
export class CognitoService {
  currentUser: AWSCognito.CognitoUser

  _POOL_DATA = {
    UserPoolId: environment.userPoolId,
    ClientId: environment.clientId
  }

  constructor(
    private storage: Storage
  ) { }

  /**
   * Register a new user
   * @param email 
   * @param password 
   */
  signUp(email, password) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      let userAttribute = [];
      userAttribute.push(
        new AWSCognito.CognitoUserAttribute({ Name: "email", Value: email })
      );

      userPool.signUp(email, password, userAttribute, null, function (err, result) {
        if (err) {
          console.log("CognitoService.signUp: failed, stack: " + err)
          reject(err);
        } else {
          console.log("CognitoService.signUp: success")
          resolved(result);
        }
      });
    });
  }

  /**
   * Registration confirmation 
   * @param verificationCode 
   * @param userName 
   */
  confirmUser(verificationCode, userName) {
    return new Promise((resolved, reject) => {
      const userPool = new AWSCognito.CognitoUserPool(this._POOL_DATA);

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: userName,
        Pool: userPool
      });

      cognitoUser.confirmRegistration(verificationCode, true, function (err, result) {
        if (err) {
          console.log("CognitoService.confirmUser: failed, stack: " + err)
          reject(err);
        } else {
          console.log("CognitoService.confirmUser: success")
          resolved(result);
        }
      });
    });
  }

  /**
   * Resend registration confirmation code
   * @param email 
   */
  resendCode(email) {
    return new Promise((resolved, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(this._POOL_DATA)
      });
      cognitoUser.resendConfirmationCode((error, result) => {
        if (error) {
          console.log("CognitoService.resendCode: failed: " + error)
          reject(error)
        } else {
          console.log("CognitoService.resendCode: success ")
          resolved(result)
        }
      })
    })
  }

  /**
   * Authenticates an existing user
   * @param email 
   * @param password 
   * @param newPassword 
   */
  authenticate(email, password, newPassword) {
    return new Promise((resolved, reject) => {

      const authDetails = new AWSCognito.AuthenticationDetails({
        Username: email,
        Password: password
      });

      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(this._POOL_DATA)
      });

      this.setCurrentUser(cognitoUser)

      this.getCurrentUser().authenticateUser(authDetails, {
        onSuccess: result => {
          console.log("CognitoService.authenticate: success")
          this.storage.set('USER.EMAIL', email)
          resolved(result);
        },
        onFailure: err => {
          console.log("CognitoService.authenticate: failed, stack: " + err)
          reject(err);
        },
        //admin created account with temporary password
        newPasswordRequired: userAttributes => {

          if (null != newPassword) {
            userAttributes.email = email;
            delete userAttributes.email_verified;
            this.getCurrentUser().completeNewPasswordChallenge(newPassword, userAttributes, {
              onSuccess: function (result) {
                console.log("CognitoService.newPasswordRequired: success")
                resolved(result)
              },
              onFailure: function (error) {
                console.log("CognitoService.newPasswordRequired: failed: " + error)
                reject(error);
              }
            })
          } else {
            console.log("CognitoService.authenticate: newPasswordRequired")
            resolved({ message: "newPasswordRequired" })
          }
        }
      });
    });
  }

  /**
   * Sends reset password code
   * @param email 
   */
  forgotPassword(email) {
    return new Promise((resolved, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(this._POOL_DATA)
      });
      cognitoUser.forgotPassword({
        onSuccess: function (result) {
          console.log("CognitoService.forgotPassword: success ")
          resolved(result)
        },
        onFailure: function (error) {
          console.log("CognitoService.forgotPassword: failed: " + error)
          reject(error)
        },
        inputVerificationCode: function (result) {
          console.log("CognitoService.forgotPassword: inputVerificationCode")
          resolved(result)
        }
      })
    })
  }

  /**
   * Resets password
   * @param email 
   * @param verificationCode 
   * @param password 
   */
  confirmNewPassword(email: string, verificationCode: string, password: string) {
    return new Promise((resolved, reject) => {
      const cognitoUser = new AWSCognito.CognitoUser({
        Username: email,
        Pool: new AWSCognito.CognitoUserPool(this._POOL_DATA)
      });
      cognitoUser.confirmPassword(verificationCode, password, {
        onSuccess: function () {
          console.log("CognitoService.confirmNewPassword: success ")
          resolved()
        },
        onFailure: function (error) {
          console.log("CognitoService.confirmNewPassword: failed: " + error)
          reject(error)
        }
      })
    })
  }

  /**
   * Change password of authenticated user
   * @param email 
   * @param oldPassword 
   * @param newPassword 
   */
  changePassword(email: string, oldPassword: string, newPassword: string) {
    return new Promise((resolved, reject) => {
      this.getCurrentUser().changePassword(oldPassword, newPassword, (error, result) => {
        if (error) {
          console.log("CognitoService.changePassword: failed: " + error)
          reject(error)
        } else {
          console.log("CognitoService.changePassword: success ")
          resolved(result)
        }
      })
    })
  }

  /**
   * Get logged in user attributes
   */
  getUserAttributes(): {} {
    // return new Promise((resolved, reject) => {
      let attributes = null
      return this.getIdToken()
        .then(token => {
          const jwtHelper = new JwtHelperService();       
          const attributes = jwtHelper.decodeToken(token)
          console.log(JSON.stringify(attributes))
          return attributes
        })
        .catch((error) => {
          return attributes
        });
    // })
  }

  /**
   * Updates logged in user attributes
   */
  updateAttributes(attributes) {
    return new Promise((resolved, reject) => {
      this.getCurrentUser().updateAttributes(attributes, (error, result) => {
        if (error) {
          console.log("CognitoService.updateAttributes: failed: " + error)
          reject(error)
        } else {
          console.log("CognitoService.updateAttributes: success ")
          resolved(result)
        }
      })
    })
  }

  /**
   * Checks for authenticated session
   */
  isAuthenticated(): Promise<boolean> {
    // Check whether the current time is past the 
    // access token's expiry time
    let authenticated: boolean = false
    return this.getIdToken()
      .then(token => {
        const jwtHelper = new JwtHelperService();
        authenticated = token !== null && !jwtHelper.isTokenExpired(token)
        return authenticated;
      })
      .catch(() => {
        authenticated = false;
        return authenticated;
      });
  }

  /**
   * Logs out active user
   */
  logout() {
    if (null != this.getCurrentUser()) {
      this.getCurrentUser().signOut()
      this.storage.remove('USER.EMAIL')
      this.currentUser = null
      console.log("CognitoService.logout: success")
    }
  }

  getCurrentUserId(): Promise<string> {
    return this.storage.get('USER.EMAIL')
  }

  // private getUserPool() {
  //   return new AWSCognito.CognitoUserPool(this._POOL_DATA);
  // }

  private getCurrentUser(): AWSCognito.CognitoUser {
    return this.currentUser
  }

  private setCurrentUser(user: AWSCognito.CognitoUser) {
    this.currentUser = user
  }

  // private getCognitoUser(email) {
  //   return new AWSCognito.CognitoUser({
  //     Username: email,
  //     Pool: this.getUserPool()
  //   });
  // }

  // private getAccessToken(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     if (this.getCurrentUser() != null)
  //       this.getCurrentUser().getSession(function (err, session) {
  //         if (err) {
  //           console.log(err);
  //           reject(err);
  //         }
  //         else {
  //           if (session.isValid()) {
  //             resolve(session.getAccessToken().getJwtToken());
  //           } else {
  //             reject({ message: "Got the id token, but the session isn't valid" });
  //           }
  //         }
  //       });
  //     else
  //       reject({ message: "No current user." });
  //   });
  // }

  private getIdToken(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.getCurrentUser() != null)
        this.getCurrentUser().getSession(function (err, session) {
          if (err) {
            console.log(err);
            reject(err);
          }
          else {
            if (session.isValid()) {
              resolve(session.getIdToken().getJwtToken());
            } else {
              reject({ message: "Got the id token, but the session isn't valid" });
            }
          }
        });
      else
        reject({ message: "No current user." });
    });
  }

}

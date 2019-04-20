import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule'},
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule'},
  { path: 'confirm/:id', loadChildren: './confirm/confirm.module#ConfirmPageModule'},
  { path: 'forgot', loadChildren: './forgot/forgot.module#ForgotPageModule' },
  { path: 'reset/:id', loadChildren: './reset/reset.module#ResetPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

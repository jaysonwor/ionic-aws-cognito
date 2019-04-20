import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'change-password', loadChildren: './change-password/change-password.module#ChangePasswordPageModule'},
  { path: 'view', loadChildren: './view/view.module#ViewPageModule' },
  { path: 'edit', loadChildren: './edit/edit.module#EditPageModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

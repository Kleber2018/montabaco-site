import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Components.*/
import { LoginFormComponent } from './login-form/login-form.component';

const authenticationRoutes: Routes = [
  { path: '', component: LoginFormComponent }
];

@NgModule({
  imports: [RouterModule.forChild(authenticationRoutes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }

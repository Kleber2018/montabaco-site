// import { NgModule } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/**Routes.*/
import { AuthenticationRoutingModule } from './authentication-routing.module';

/**Modules.*/
import { SharedModule } from '../shared/shared.module';

/**Components.*/
import { LoginFormComponent } from './login-form/login-form.component';

import { EsqueciSenhaDialogComponent } from './login-form/esqueci-senha-dialog/esqueci-senha-dialog.component';


@NgModule({
  declarations: [
    LoginFormComponent,
    EsqueciSenhaDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AuthenticationRoutingModule,
    SharedModule
  ]
})
export class AuthenticationModule { }

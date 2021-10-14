import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

/**Angular Material.*/
import { AngularMaterialModule } from '../angular-material/angular-material.module';

/**Components.*/
import { ComeBackButtonComponent } from './come-back-button/come-back-button.component';

@NgModule({
  declarations: [
    ComeBackButtonComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule
  ],
  exports: [
    ComeBackButtonComponent
  ]
})
export class ButtonModule { }

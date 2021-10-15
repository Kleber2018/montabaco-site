import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicaoRoutingModule } from './medicao-routing.module';
import { MedicaoComponent } from './medicao/medicao.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MedicaoComponent
  ],
  imports: [
    CommonModule,
    MedicaoRoutingModule,
    SharedModule
  ]
})
export class MedicaoModule { }

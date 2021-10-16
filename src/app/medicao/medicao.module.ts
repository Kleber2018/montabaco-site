import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MedicaoRoutingModule } from './medicao-routing.module';
import { MedicaoComponent } from './medicao/medicao.component';
import { SharedModule } from '../shared/shared.module';
import { ChartsModule } from 'ng2-charts';


@NgModule({
  declarations: [
    MedicaoComponent
  ],
  imports: [
    CommonModule,
    MedicaoRoutingModule,
    SharedModule,
    ChartsModule
  ]
})
export class MedicaoModule { }

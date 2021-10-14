import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VersionamentoRoutingModule } from './versionamento-routing.module';
import { VersionamentoComponent } from './versionamento/versionamento.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [VersionamentoComponent],
  imports: [
    CommonModule,
    VersionamentoRoutingModule,
    SharedModule
  ]
})
export class VersionamentoModule { }

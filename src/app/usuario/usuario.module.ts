import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioRoutingModule } from './usuario-routing.module';
import { UsuarioComponent } from './usuario/usuario.component';
import { UsuarioListComponent } from './usuario-list/usuario-list.component';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [ UsuarioListComponent, UsuarioFormComponent,  UsuarioComponent],
  imports: [
    CommonModule,
    UsuarioRoutingModule,
    SharedModule
  ],
  exports: [UsuarioListComponent]
})
export class UsuarioModule { }

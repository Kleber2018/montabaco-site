import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsuarioFormComponent } from './usuario-form/usuario-form.component';

import { UsuarioComponent } from './usuario/usuario.component'


const routes: Routes = [
  { path: '', component: UsuarioComponent},
  { path: 'editar/:uid', component: UsuarioFormComponent},
  { path: '**', redirectTo: ''}
];



@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioRoutingModule { }

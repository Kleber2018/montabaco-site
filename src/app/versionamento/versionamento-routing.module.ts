import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VersionamentoComponent } from './versionamento/versionamento.component';


const routes: Routes = [
  { path: '', component: VersionamentoComponent },
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VersionamentoRoutingModule { }

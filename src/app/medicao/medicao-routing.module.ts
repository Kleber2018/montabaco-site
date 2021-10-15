import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MedicaoComponent } from './medicao/medicao.component';

const routes: Routes = [
  { path: '', component: MedicaoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MedicaoRoutingModule { }

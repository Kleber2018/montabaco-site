import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


/* Components.*/
import { MgeListComponent } from './mge-list/mge-list.component';
import { MgeFormComponent } from './mge-form/mge-form.component';
import { MgeDashboardComponent } from './mge-dashboard/mge-dashboard.component';

const mgeRoutes: Routes = [
  { path: '', component: MgeDashboardComponent },
  { path: 'dashboard', component: MgeDashboardComponent },
  { path: 'editar/:id', component: MgeFormComponent },
  { path: 'novo', component: MgeFormComponent },
];

@NgModule({
  imports: [RouterModule.forChild(mgeRoutes)],
  exports: [RouterModule]
})
export class MgeRoutingModule {}

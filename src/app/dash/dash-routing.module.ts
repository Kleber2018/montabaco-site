import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashComponent } from './dash/dash.component';
/**Components.*/


const dashRoutes: Routes = [
  { path: '', component: DashComponent },
];

@NgModule({
    imports: [RouterModule.forChild(dashRoutes)],
    exports: [RouterModule]
})
export class DashRoutingModule { }

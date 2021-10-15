import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Components.*/
import { AuthenticationGuard } from './authentication/authentication.guard';

const appRoutes: Routes = [
  //{ path: 'login', loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule) },
  { path: 'dashboard', loadChildren: () => import('./dash/dash.module').then(m => m.DashModule)},
  { path: 'versionamento', loadChildren: () => import('./versionamento/versionamento.module').then(m => m.VersionamentoModule)},
  { path: '**', redirectTo: '/dashboard'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

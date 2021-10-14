import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**Components.*/
import { AuthenticationGuard } from './authentication/authentication.guard';

const appRoutes: Routes = [
  { path: 'login', loadChildren: './authentication/authentication.module#AuthenticationModule' },
  { path: 'dashboard', loadChildren: './dash/dash.module#DashModule'},
  { path: 'mge', loadChildren: './mge/mge.module#MgeModule', canActivate: [AuthenticationGuard]},
  { path: 'versionamento', loadChildren: './versionamento/versionamento.module#VersionamentoModule'},
  { path: 'usuario', loadChildren: './usuario/usuario.module#UsuarioModule', canActivate: [AuthenticationGuard]},
  { path: '**', redirectTo: '/login'}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

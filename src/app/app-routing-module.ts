import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', canActivate: [AuthGuard], loadChildren: () => import('./dashboard/dashboard-module').then(m => m.DashboardModule) },
  { path: 'funcionarios', canActivate: [AuthGuard], data: { blockedRoles: ['MORADOR'] }, loadChildren: () => import('./funcionarios/funcionarios-module').then(m => m.FuncionariosModule) },
  { path: 'compromissos', canActivate: [AuthGuard], data: { blockedRoles: ['MORADOR'] }, loadChildren: () => import('./compromissos/compromissos-module').then(m => m.CompromissosModule) },
  { path: 'obrigacoes', canActivate: [AuthGuard], data: { roles: ['ADMIN', 'SINDICO'] }, loadChildren: () => import('./obrigacoes/obrigacoes-module').then(m => m.ObrigacoesModule) },
  { path: 'moradores', canActivate: [AuthGuard], data: { blockedRoles: ['MORADOR'] }, loadChildren: () => import('./moradores/moradores-module').then(m => m.MoradoresModule) },
  { path: 'eventos', canActivate: [AuthGuard], loadChildren: () => import('./eventos/eventos-module').then(m => m.EventosModule) },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
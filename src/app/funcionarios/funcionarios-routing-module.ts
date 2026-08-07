import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionarioList } from './funcionario-list/funcionario-list';
import { FuncionarioForm } from './funcionario-form/funcionario-form';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: FuncionarioList, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'new', component: FuncionarioForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'edit/:id', component: FuncionarioForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionariosRoutingModule {}
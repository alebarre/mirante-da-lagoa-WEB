import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrigacaoList } from './obrigacao-list/obrigacao-list';
import { ObrigacaoForm } from './obrigacao-form/obrigacao-form';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: ObrigacaoList, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SINDICO'] } },
  { path: 'new', component: ObrigacaoForm, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SINDICO'] } },
  { path: 'edit/:id', component: ObrigacaoForm, canActivate: [RoleGuard], data: { roles: ['ADMIN', 'SINDICO'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObrigacoesRoutingModule {}
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompromissoList } from './compromisso-list/compromisso-list';
import { CompromissoForm } from './compromisso-form/compromisso-form';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: CompromissoList, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'new', component: CompromissoForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'edit/:id', component: CompromissoForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompromissosRoutingModule {}
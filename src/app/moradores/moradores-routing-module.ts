import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoradorList } from './morador-list/morador-list';
import { MoradorForm } from './morador-form/morador-form';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: MoradorList, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'new', component: MoradorForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'edit/:id', component: MoradorForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoradoresRoutingModule {}
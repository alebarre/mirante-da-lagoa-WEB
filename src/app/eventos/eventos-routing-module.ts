import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoList } from './evento-list/evento-list';
import { EventoForm } from './evento-form/evento-form';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: EventoList },
  { path: 'new', component: EventoForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } },
  { path: 'edit/:id', component: EventoForm, canActivate: [RoleGuard], data: { blockedRoles: ['MORADOR'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule {}
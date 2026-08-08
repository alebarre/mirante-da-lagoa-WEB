import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParametroList } from './parametro-list/parametro-list';
import { RoleGuard } from '../core/guards/role.guard';

const routes: Routes = [
  { path: '', component: ParametroList, canActivate: [RoleGuard], data: { roles: ['ADMIN'] } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParametrosRoutingModule {}

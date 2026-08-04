import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuncionarioList } from './funcionario-list/funcionario-list';
import { FuncionarioForm } from './funcionario-form/funcionario-form';

const routes: Routes = [
  { path: '', component: FuncionarioList },
  { path: 'new', component: FuncionarioForm },
  { path: 'edit/:id', component: FuncionarioForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FuncionariosRoutingModule {}

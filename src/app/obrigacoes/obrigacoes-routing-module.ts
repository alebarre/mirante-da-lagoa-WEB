import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ObrigacaoList } from './obrigacao-list/obrigacao-list';
import { ObrigacaoForm } from './obrigacao-form/obrigacao-form';

const routes: Routes = [
  { path: '', component: ObrigacaoList },
  { path: 'new', component: ObrigacaoForm },
  { path: 'edit/:id', component: ObrigacaoForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObrigacoesRoutingModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompromissoList } from './compromisso-list/compromisso-list';
import { CompromissoForm } from './compromisso-form/compromisso-form';

const routes: Routes = [
  { path: '', component: CompromissoList },
  { path: 'new', component: CompromissoForm },
  { path: 'edit/:id', component: CompromissoForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CompromissosRoutingModule {}

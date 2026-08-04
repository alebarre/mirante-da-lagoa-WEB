import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MoradorList } from './morador-list/morador-list';
import { MoradorForm } from './morador-form/morador-form';

const routes: Routes = [
  { path: '', component: MoradorList },
  { path: 'new', component: MoradorForm },
  { path: 'edit/:id', component: MoradorForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MoradoresRoutingModule {}

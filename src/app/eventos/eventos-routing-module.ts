import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventoList } from './evento-list/evento-list';
import { EventoForm } from './evento-form/evento-form';

const routes: Routes = [
  { path: '', component: EventoList },
  { path: 'new', component: EventoForm },
  { path: 'edit/:id', component: EventoForm }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule {}

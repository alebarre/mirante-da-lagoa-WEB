import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { EventosRoutingModule } from './eventos-routing-module';
import { EventoList } from './evento-list/evento-list';
import { EventoForm } from './evento-form/evento-form';

@NgModule({
  declarations: [EventoList, EventoForm],
  imports: [SharedModule, EventosRoutingModule]
})
export class EventosModule {}

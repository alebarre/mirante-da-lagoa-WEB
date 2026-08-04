import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { CompromissosRoutingModule } from './compromissos-routing-module';
import { CompromissoList } from './compromisso-list/compromisso-list';
import { CompromissoForm } from './compromisso-form/compromisso-form';

@NgModule({
  declarations: [CompromissoList, CompromissoForm],
  imports: [SharedModule, CompromissosRoutingModule]
})
export class CompromissosModule {}

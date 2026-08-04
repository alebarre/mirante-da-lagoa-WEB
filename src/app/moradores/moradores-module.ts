import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { MoradoresRoutingModule } from './moradores-routing-module';
import { MoradorList } from './morador-list/morador-list';
import { MoradorForm } from './morador-form/morador-form';

@NgModule({
  declarations: [MoradorList, MoradorForm],
  imports: [SharedModule, MoradoresRoutingModule]
})
export class MoradoresModule {}

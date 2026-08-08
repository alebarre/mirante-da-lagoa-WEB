import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { ParametrosRoutingModule } from './parametros-routing-module';
import { ParametroList } from './parametro-list/parametro-list';

@NgModule({
  declarations: [ParametroList],
  imports: [SharedModule, ParametrosRoutingModule]
})
export class ParametrosModule {}

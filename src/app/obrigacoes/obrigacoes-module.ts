import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { ObrigacoesRoutingModule } from './obrigacoes-routing-module';
import { ObrigacaoList } from './obrigacao-list/obrigacao-list';
import { ObrigacaoForm } from './obrigacao-form/obrigacao-form';

@NgModule({
  declarations: [ObrigacaoList, ObrigacaoForm],
  imports: [SharedModule, ObrigacoesRoutingModule]
})
export class ObrigacoesModule {}

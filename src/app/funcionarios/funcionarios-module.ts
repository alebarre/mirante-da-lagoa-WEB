import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FuncionariosRoutingModule } from './funcionarios-routing-module';
import { FuncionarioList } from './funcionario-list/funcionario-list';
import { FuncionarioForm } from './funcionario-form/funcionario-form';

@NgModule({
  declarations: [FuncionarioList, FuncionarioForm],
  imports: [SharedModule, FuncionariosRoutingModule]
})
export class FuncionariosModule {}

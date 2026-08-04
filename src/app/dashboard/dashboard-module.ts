import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { DashboardRoutingModule } from './dashboard-routing-module';
import { Home } from './home/home';

@NgModule({
  declarations: [Home],
  imports: [SharedModule, DashboardRoutingModule]
})
export class DashboardModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Toast } from './components/toast/toast';
import { Modal } from './components/modal/modal';

@NgModule({
  declarations: [Toast, Modal],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, Toast, Modal]
})
export class SharedModule {}
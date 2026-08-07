import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Toast } from './components/toast/toast';
import { Modal } from './components/modal/modal';
import { DetailModal } from './components/detail-modal/detail-modal';

@NgModule({
  declarations: [Toast, Modal, DetailModal],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, Toast, Modal, DetailModal]
})
export class SharedModule {}
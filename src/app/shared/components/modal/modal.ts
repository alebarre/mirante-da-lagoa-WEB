import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService, ModalState } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: false,
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  modal$: Observable<ModalState | null>;

  constructor(public modalService: ModalService) {
    this.modal$ = this.modalService.modal$;
  }
}
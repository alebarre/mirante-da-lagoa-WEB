import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Toast as ToastItem, ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: false,
  templateUrl: './toast.html',
  styleUrl: './toast.scss'
})
export class Toast {
  toasts$: Observable<ToastItem[]>;

  constructor(public toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }
}
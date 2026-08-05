import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ModalConfig {
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'danger';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
}

export interface ModalState extends ModalConfig {
  resolve: (value: boolean) => void;
}

@Injectable({ providedIn: 'root' })
export class ModalService {
  private modalSubject = new BehaviorSubject<ModalState | null>(null);
  modal$ = this.modalSubject.asObservable();

  open(config: ModalConfig): Promise<boolean> {
    return new Promise(resolve => {
      this.modalSubject.next({ ...config, resolve });
    });
  }

  alert(config: Omit<ModalConfig, 'showCancel'>): Promise<boolean> {
    return this.open({ ...config, showCancel: false });
  }

  close(confirmed: boolean): void {
    const state = this.modalSubject.value;
    if (state) {
      state.resolve(confirmed);
      this.modalSubject.next(null);
    }
  }
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DetailField {
  label?: string;
  value: string;
  icon?: string;
}

export interface DetailAction {
  label: string;
  icon?: string;
  cssClass?: string;
  handler: () => void;
}

export interface DetailModalConfig {
  title: string;
  icon?: string;
  subtitle?: string;
  fields: DetailField[];
  actions?: DetailAction[];
}

export interface DetailModalState extends DetailModalConfig {}

@Injectable({ providedIn: 'root' })
export class DetailModalService {
  private detailModalSubject = new BehaviorSubject<DetailModalState | null>(null);
  detailModal$ = this.detailModalSubject.asObservable();

  open(config: DetailModalConfig): void {
    this.detailModalSubject.next(config);
  }

  close(): void {
    this.detailModalSubject.next(null);
  }
}

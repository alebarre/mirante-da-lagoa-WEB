import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DetailModalService, DetailModalState } from '../../../core/services/detail-modal.service';

@Component({
  selector: 'app-detail-modal',
  standalone: false,
  templateUrl: './detail-modal.html',
  styleUrl: './detail-modal.scss'
})
export class DetailModal {
  detailModal$: Observable<DetailModalState | null>;

  constructor(public detailModalService: DetailModalService) {
    this.detailModal$ = this.detailModalService.detailModal$;
  }
}

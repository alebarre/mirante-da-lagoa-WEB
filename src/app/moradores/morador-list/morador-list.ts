import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Morador } from '../../core/models/morador.model';

@Component({
  selector: 'app-morador-list',
  templateUrl: './morador-list.html',
  standalone: false
})
export class MoradorList implements OnInit {
  items: Morador[] = [];
  loading = false;

  constructor(
    private api: ApiService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private modalService: ModalService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading = true;
    this.api.get<Morador[]>('/moradores').subscribe({
      next: d => {
        this.items = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar moradores');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id?: string): void { if (id) this.router.navigate(['/moradores/edit', id]); }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    const confirmed = await this.modalService.open({
      title: 'Excluir morador',
      message: 'Deseja realmente excluir este morador?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/moradores/${id}`).subscribe({
      next: () => {
        this.toastService.success('Morador excluÃ­do com sucesso!');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir morador');
        this.toastService.error(message);
      }
    });
  }

  newItem(): void { this.router.navigate(['/moradores/new']); }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';

@Component({
  selector: 'app-obrigacao-list',
  templateUrl: './obrigacao-list.html',
  standalone: false
})
export class ObrigacaoList implements OnInit {
  items: ObrigacaoTrabalhista[] = [];
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
    this.api.get<ObrigacaoTrabalhista[]>('/obrigacoes').subscribe({
      next: d => {
        this.items = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar obrigaÃ§Ãµes');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id?: string): void { if (id) this.router.navigate(['/obrigacoes/edit', id]); }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    const confirmed = await this.modalService.open({
      title: 'Excluir obrigaÃ§Ã£o',
      message: 'Deseja realmente excluir esta obrigaÃ§Ã£o trabalhista?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/obrigacoes/${id}`).subscribe({
      next: () => {
        this.toastService.success('ObrigaÃ§Ã£o excluÃ­da com sucesso!');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir obrigaÃ§Ã£o');
        this.toastService.error(message);
      }
    });
  }

  newItem(): void { this.router.navigate(['/obrigacoes/new']); }
}

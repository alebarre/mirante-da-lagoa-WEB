import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';

@Component({
  selector: 'app-obrigacao-list',
  templateUrl: './obrigacao-list.html',
  standalone: false
})
export class ObrigacaoList implements OnInit {
  items: ObrigacaoTrabalhista[] = [];
  loading = false;
  canManage = false;

  constructor(
    private api: ApiService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private modalService: ModalService,
    private errorHandler: ErrorHandlerService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.auth$.subscribe(a => {
      this.canManage = a?.role === 'ADMIN' || a?.role === 'SINDICO';
      this.cdr.detectChanges();
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<ObrigacaoTrabalhista[]>('/obrigacoes').subscribe({
      next: d => {
        this.items = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar obrigações');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  newItem(): void {
    if (!this.canManage) {
      this.toastService.warning('Apenas ADMIN e SÍNDICO podem cadastrar obrigações.');
      return;
    }
    this.router.navigate(['/obrigacoes/new']);
  }

  edit(id?: string): void {
    if (!id) return;
    if (!this.canManage) {
      this.toastService.warning('Apenas ADMIN e SÍNDICO podem editar obrigações.');
      return;
    }
    this.router.navigate(['/obrigacoes/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    if (!this.canManage) {
      this.toastService.warning('Apenas ADMIN e SÍNDICO podem excluir obrigações.');
      return;
    }
    const confirmed = await this.modalService.open({
      title: 'Excluir obrigação',
      message: 'Deseja realmente excluir esta obrigação trabalhista?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/obrigacoes/${id}`).subscribe({
      next: () => {
        this.toastService.success('Obrigação excluída com sucesso.');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir obrigação');
        this.toastService.error(message);
      }
    });
  }
}
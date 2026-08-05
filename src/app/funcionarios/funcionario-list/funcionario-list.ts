import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Funcionario } from '../../core/models/funcionario.model';

@Component({
  selector: 'app-funcionario-list',
  templateUrl: './funcionario-list.html',
  standalone: false
})
export class FuncionarioList implements OnInit {
  items: Funcionario[] = [];
  loading = false;

  constructor(
    private api: ApiService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private modalService: ModalService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<Funcionario[]>('/funcionarios').subscribe({
      next: data => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar funcionÃ¡rios');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id?: string): void {
    if (id) this.router.navigate(['/funcionarios/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    const confirmed = await this.modalService.open({
      title: 'Excluir funcionÃ¡rio',
      message: 'Tem certeza que deseja excluir este funcionÃ¡rio? Esta aÃ§Ã£o nÃ£o poderÃ¡ ser desfeita.',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/funcionarios/${id}`).subscribe({
      next: () => {
        this.toastService.success('FuncionÃ¡rio excluÃ­do com sucesso!');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir funcionÃ¡rio');
        this.toastService.error(message);
      }
    });
  }

  newItem(): void {
    this.router.navigate(['/funcionarios/new']);
  }
}

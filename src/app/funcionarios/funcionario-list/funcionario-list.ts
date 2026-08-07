import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Funcionario } from '../../core/models/funcionario.model';

@Component({
  selector: 'app-funcionario-list',
  templateUrl: './funcionario-list.html',
  standalone: false
})
export class FuncionarioList implements OnInit {
  items: Funcionario[] = [];
  loading = false;
  isMorador = false;

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
      this.isMorador = a?.role === 'MORADOR';
      this.cdr.detectChanges();
    });
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
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar funcionários');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  newItem(): void {
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem cadastrar funcionários.');
      return;
    }
    this.router.navigate(['/funcionarios/new']);
  }

  edit(id?: string): void {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem editar funcionários.');
      return;
    }
    this.router.navigate(['/funcionarios/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem excluir funcionários.');
      return;
    }
    const confirmed = await this.modalService.open({
      title: 'Excluir funcionário',
      message: 'Tem certeza que deseja excluir este funcionário? Esta ação não poderá ser desfeita.',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/funcionarios/${id}`).subscribe({
      next: () => {
        this.toastService.success('Funcionário excluído com sucesso.');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir funcionário');
        this.toastService.error(message);
      }
    });
  }
}
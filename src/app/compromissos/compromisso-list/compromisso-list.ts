import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Compromisso } from '../../core/models/compromisso.model';

@Component({
  selector: 'app-compromisso-list',
  templateUrl: './compromisso-list.html',
  standalone: false
})
export class CompromissoList implements OnInit {
  items: Compromisso[] = [];
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
    this.api.get<Compromisso[]>('/compromissos').subscribe({
      next: data => {
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar compromissos');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id?: string): void { if (id) this.router.navigate(['/compromissos/edit', id]); }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    const confirmed = await this.modalService.open({
      title: 'Excluir compromisso',
      message: 'Deseja realmente excluir este compromisso?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/compromissos/${id}`).subscribe({
      next: () => {
        this.toastService.success('Compromisso excluÃ­do com sucesso!');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir compromisso');
        this.toastService.error(message);
      }
    });
  }

  newItem(): void { this.router.navigate(['/compromissos/new']); }
}

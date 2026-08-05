import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.html',
  standalone: false
})
export class EventoList implements OnInit {
  items: Evento[] = [];
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
    this.api.get<Evento[]>('/eventos').subscribe({
      next: d => {
        this.items = d;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar eventos');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id?: string): void { if (id) this.router.navigate(['/eventos/edit', id]); }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    const confirmed = await this.modalService.open({
      title: 'Excluir evento',
      message: 'Deseja realmente excluir este evento?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/eventos/${id}`).subscribe({
      next: () => {
        this.toastService.success('Evento excluÃ­do com sucesso!');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir evento');
        this.toastService.error(message);
      }
    });
  }

  newItem(): void { this.router.navigate(['/eventos/new']); }
}

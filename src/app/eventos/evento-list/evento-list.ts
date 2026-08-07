import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.html',
  standalone: false
})
export class EventoList implements OnInit {
  items: Evento[] = [];
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

  newItem(): void {
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem criar eventos.');
      return;
    }
    this.router.navigate(['/eventos/new']);
  }

  edit(id?: string): void {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem editar eventos.');
      return;
    }
    this.router.navigate(['/eventos/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem excluir eventos.');
      return;
    }
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
        this.toastService.success('Evento excluído com sucesso.');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir evento');
        this.toastService.error(message);
      }
    });
  }
}
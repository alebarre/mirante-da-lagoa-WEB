import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Evento } from '../../core/models/evento.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';
import { DetailAction, DetailField, DetailModalService } from '../../core/services/detail-modal.service';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.html',
  styleUrls: ['./evento-list.scss'],
  standalone: false
})
export class EventoList implements OnInit {
  items: Evento[] = [];
  filteredItems: Evento[] = [];
  loading = false;
  isMorador = false;
  selectedId?: string;
  searchText = '';
  filterLocation = '';

  constructor(
    private api: ApiService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
    private modalService: ModalService,
    private detailModalService: DetailModalService,
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
        this.applyFilter();
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

  applyFilter(): void {
    let result = filterByText(this.items, this.searchText, ['title', 'description', 'organizer', 'location']);
    result = filterByExactField(result, this.filterLocation, 'location');
    this.filteredItems = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterLocation = '';
    this.applyFilter();
  }

  selectItem(item: Evento): void {
    this.selectedId = item.id;
    const fields: DetailField[] = [
      { label: 'Início', value: item.startAt ? new Date(item.startAt).toLocaleString('pt-BR') : '-', icon: 'fa-hourglass-start' },
      { label: 'Término', value: item.endAt ? new Date(item.endAt).toLocaleString('pt-BR') : '-', icon: 'fa-hourglass-end' },
      { label: 'Local', value: item.location || '-', icon: 'fa-map-marker-alt' },
      { label: 'Organizador', value: item.organizer || '-', icon: 'fa-user-tie' },
      { label: 'Status', value: item.status || '-', icon: 'fa-tag' },
      { label: 'Máx. participantes', value: item.maxParticipants !== undefined ? String(item.maxParticipants) : '-', icon: 'fa-users' },
      { label: 'Restrito a moradores', value: item.restrictedToResidents ? 'Sim' : 'Não', icon: 'fa-lock' }
    ];
    if (item.description) {
      fields.unshift({ label: 'Descrição', value: item.description, icon: 'fa-align-left' });
    }
    if (item.notes) {
      fields.push({ label: 'Observações', value: item.notes, icon: 'fa-sticky-note' });
    }
    const actions: DetailAction[] = [];
    if (!this.isMorador) {
      actions.push(
        { label: 'Editar', icon: 'fa-edit', cssClass: 'btn-secondary', handler: () => this.edit(item.id) },
        { label: 'Excluir', icon: 'fa-trash-alt', cssClass: 'btn-danger', handler: () => this.remove(item.id) }
      );
    }
    this.detailModalService.open({
      title: item.title,
      icon: 'fa-glass-cheers',
      subtitle: item.status,
      fields,
      actions
    });
  }

  trackById(index: number, item: Evento): string | undefined {
    return item.id;
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
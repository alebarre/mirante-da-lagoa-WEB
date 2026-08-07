import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';

@Component({
  selector: 'app-obrigacao-list',
  templateUrl: './obrigacao-list.html',
  styleUrls: ['./obrigacao-list.scss'],
  standalone: false
})
export class ObrigacaoList implements OnInit {
  items: ObrigacaoTrabalhista[] = [];
  filteredItems: ObrigacaoTrabalhista[] = [];
  loading = false;
  canManage = false;
  selectedId?: string;
  searchText = '';
  filterStatus = '';

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
        this.applyFilter();
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

  applyFilter(): void {
    let result = filterByText(this.items, this.searchText, ['name', 'description', 'periodicity', 'responsible']);
    result = filterByExactField(result, this.filterStatus, 'status');
    this.filteredItems = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterStatus = '';
    this.applyFilter();
  }

  get statuses(): string[] {
    const all = this.items.map(i => i.status).filter((s): s is string => !!s);
    return [...new Set(all)].sort();
  }

  selectItem(item: ObrigacaoTrabalhista): void {
    this.selectedId = item.id;
  }

  trackById(index: number, item: ObrigacaoTrabalhista): string | undefined {
    return item.id;
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
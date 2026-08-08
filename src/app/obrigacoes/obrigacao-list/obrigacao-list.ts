import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';
import { FuncionarioResumoFinanceiro } from '../../core/models/funcionario-resumo.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';
import { DetailAction, DetailField, DetailModalService } from '../../core/services/detail-modal.service';

@Component({
  selector: 'app-obrigacao-list',
  templateUrl: './obrigacao-list.html',
  styleUrls: ['./obrigacao-list.scss'],
  standalone: false
})
export class ObrigacaoList implements OnInit {
  items: ObrigacaoTrabalhista[] = [];
  filteredItems: ObrigacaoTrabalhista[] = [];
  resumo?: FuncionarioResumoFinanceiro;
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
    private detailModalService: DetailModalService,
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

    this.api.get<FuncionarioResumoFinanceiro>('/funcionarios/resumo-financeiro').subscribe({
      next: r => {
        this.resumo = r;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('[ObrigacaoList] Erro ao carregar resumo financeiro');
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
    const fields: DetailField[] = [
      { label: 'Periodicidade', value: item.periodicity, icon: 'fa-sync' },
      { label: 'Vencimento', value: item.dueDate ? new Date(item.dueDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-day' },
      { label: 'Concluído em', value: item.completedAt ? new Date(item.completedAt).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-check' },
      { label: 'Responsável', value: item.responsible || '-', icon: 'fa-user-tie' },
      { label: 'Status', value: item.status || '-', icon: 'fa-tag' }
    ];
    if (item.description) {
      fields.unshift({ label: 'Descrição', value: item.description, icon: 'fa-align-left' });
    }
    if (item.notes) {
      fields.push({ label: 'Observações', value: item.notes, icon: 'fa-sticky-note' });
    }
    const actions: DetailAction[] = [];
    if (this.canManage) {
      actions.push(
        { label: 'Editar', icon: 'fa-edit', cssClass: 'btn-secondary', handler: () => this.edit(item.id) },
        { label: 'Excluir', icon: 'fa-trash-alt', cssClass: 'btn-danger', handler: () => this.remove(item.id) }
      );
    }
    this.detailModalService.open({
      title: item.name,
      icon: 'fa-clipboard-check',
      subtitle: item.status,
      fields,
      actions
    });
  }

  trackById(index: number, item: ObrigacaoTrabalhista): string | undefined {
    return item.id;
  }

  formatCurrency(value?: number): string {
    return value !== undefined ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
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
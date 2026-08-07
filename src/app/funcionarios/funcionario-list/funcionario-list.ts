import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Funcionario } from '../../core/models/funcionario.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';

@Component({
  selector: 'app-funcionario-list',
  templateUrl: './funcionario-list.html',
  styleUrls: ['./funcionario-list.scss'],
  standalone: false
})
export class FuncionarioList implements OnInit {
  items: Funcionario[] = [];
  filteredItems: Funcionario[] = [];
  loading = false;
  isMorador = false;
  selectedId?: string;
  searchText = '';
  filterPosition = '';

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
        this.applyFilter();
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

  applyFilter(): void {
    let result = filterByText(this.items, this.searchText, ['fullName', 'email', 'phone', 'cpf', 'department']);
    result = filterByExactField(result, this.filterPosition, 'position');
    this.filteredItems = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterPosition = '';
    this.applyFilter();
  }

  get positions(): string[] {
    const all = this.items.map(i => i.position).filter((p): p is string => !!p);
    return [...new Set(all)].sort();
  }

  selectItem(item: Funcionario): void {
    this.selectedId = item.id;
  }

  trackById(index: number, item: Funcionario): string | undefined {
    return item.id;
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
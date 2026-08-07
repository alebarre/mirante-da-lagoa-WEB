import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Morador } from '../../core/models/morador.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';

@Component({
  selector: 'app-morador-list',
  templateUrl: './morador-list.html',
  styleUrls: ['./morador-list.scss'],
  standalone: false
})
export class MoradorList implements OnInit {
  items: Morador[] = [];
  filteredItems: Morador[] = [];
  loading = false;
  isMorador = false;
  selectedId?: string;
  searchText = '';
  filterApartment = '';

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
    this.api.get<Morador[]>('/moradores').subscribe({
      next: d => {
        this.items = d;
        this.applyFilter();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao carregar moradores');
        this.toastService.error(message);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  applyFilter(): void {
    let result = filterByText(this.items, this.searchText, ['fullName', 'email', 'phone', 'cpf', 'block', 'emergencyContact']);
    result = filterByExactField(result, this.filterApartment, 'apartment');
    this.filteredItems = result;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterApartment = '';
    this.applyFilter();
  }

  get apartments(): string[] {
    const all = this.items.map(i => i.apartment).filter((a): a is string => !!a);
    return [...new Set(all)].sort();
  }

  selectItem(item: Morador): void {
    this.selectedId = item.id;
  }

  trackById(index: number, item: Morador): string | undefined {
    return item.id;
  }

  newItem(): void {
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem cadastrar moradores.');
      return;
    }
    this.router.navigate(['/moradores/new']);
  }

  edit(id?: string): void {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem editar moradores.');
      return;
    }
    this.router.navigate(['/moradores/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem excluir moradores.');
      return;
    }
    const confirmed = await this.modalService.open({
      title: 'Excluir morador',
      message: 'Deseja realmente excluir este morador?',
      type: 'danger',
      confirmText: 'Excluir',
      cancelText: 'Cancelar'
    });
    if (!confirmed) return;

    this.api.delete(`/moradores/${id}`).subscribe({
      next: () => {
        this.toastService.success('Morador excluído com sucesso.');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir morador');
        this.toastService.error(message);
      }
    });
  }
}
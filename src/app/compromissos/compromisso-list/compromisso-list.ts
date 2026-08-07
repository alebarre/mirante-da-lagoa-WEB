import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Compromisso } from '../../core/models/compromisso.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';

@Component({
  selector: 'app-compromisso-list',
  templateUrl: './compromisso-list.html',
  styleUrls: ['./compromisso-list.scss'],
  standalone: false
})
export class CompromissoList implements OnInit {
  items: Compromisso[] = [];
  filteredItems: Compromisso[] = [];
  loading = false;
  isMorador = false;
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
      this.isMorador = a?.role === 'MORADOR';
      this.cdr.detectChanges();
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<Compromisso[]>('/compromissos').subscribe({
      next: data => {
        this.items = data;
        this.applyFilter();
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

  applyFilter(): void {
    let result = filterByText(this.items, this.searchText, ['title', 'description', 'location', 'responsible']);
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

  selectItem(item: Compromisso): void {
    this.selectedId = item.id;
  }

  trackById(index: number, item: Compromisso): string | undefined {
    return item.id;
  }

  newItem(): void {
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem criar compromissos.');
      return;
    }
    this.router.navigate(['/compromissos/new']);
  }

  edit(id?: string): void {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem editar compromissos.');
      return;
    }
    this.router.navigate(['/compromissos/edit', id]);
  }

  async remove(id?: string): Promise<void> {
    if (!id) return;
    if (this.isMorador) {
      this.toastService.warning('Moradores não podem excluir compromissos.');
      return;
    }
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
        this.toastService.success('Compromisso excluído com sucesso.');
        this.load();
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao excluir compromisso');
        this.toastService.error(message);
      }
    });
  }
}
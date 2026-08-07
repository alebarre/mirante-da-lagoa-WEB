import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Morador } from '../../core/models/morador.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';
import { DetailAction, DetailField, DetailModalService } from '../../core/services/detail-modal.service';

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
    const fields: DetailField[] = [
      { label: 'Bloco', value: item.block, icon: 'fa-building' },
      { label: 'Apartamento', value: item.apartment, icon: 'fa-door-closed' },
      { label: 'Telefone', value: item.phone || '-', icon: 'fa-phone' },
      { label: 'E-mail', value: item.email || '-', icon: 'fa-envelope' },
      { label: 'CPF', value: item.cpf || '-', icon: 'fa-id-card' },
      { label: 'RG', value: item.rg || '-', icon: 'fa-address-card' },
      { label: 'Nascimento', value: item.birthDate ? new Date(item.birthDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-birthday-cake' },
      { label: 'Vaga', value: item.parkingSpot || '-', icon: 'fa-car' },
      { label: 'Pets', value: item.pets || '-', icon: 'fa-paw' },
      { label: 'Entrada', value: item.moveInDate ? new Date(item.moveInDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-alt' },
      { label: 'Saída', value: item.moveOutDate ? new Date(item.moveOutDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-times' },
      { label: 'Contato emergência', value: item.emergencyContact || '-', icon: 'fa-phone-alt' },
      { label: 'Proprietário', value: item.owner ? 'Sim' : 'Não', icon: 'fa-home' }
    ];
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
      title: item.fullName,
      icon: 'fa-home',
      subtitle: `Bloco ${item.block} · Apto ${item.apartment}`,
      fields,
      actions
    });
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
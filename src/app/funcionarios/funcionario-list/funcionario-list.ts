import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ModalService } from '../../core/services/modal.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { AuthService } from '../../core/services/auth.service';
import { Funcionario } from '../../core/models/funcionario.model';
import { filterByExactField, filterByText } from '../../core/utils/filter.utils';
import { DetailAction, DetailField, DetailModalService } from '../../core/services/detail-modal.service';

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
    const fields: DetailField[] = [
      { label: 'Cargo', value: item.position || '-', icon: 'fa-briefcase' },
      { label: 'Departamento', value: item.department || '-', icon: 'fa-building' },
      { label: 'Telefone', value: item.phone || '-', icon: 'fa-phone' },
      { label: 'E-mail', value: item.email || '-', icon: 'fa-envelope' },
      { label: 'CPF', value: item.cpf || '-', icon: 'fa-id-card' },
      { label: 'RG', value: item.rg || '-', icon: 'fa-address-card' },
      { label: 'Nascimento', value: item.birthDate ? new Date(item.birthDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-birthday-cake' },
      { label: 'Endereço', value: item.address || '-', icon: 'fa-map-marked-alt' },
      { label: 'Admissão', value: item.hireDate ? new Date(item.hireDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-check' },
      { label: 'Demissão', value: item.terminationDate ? new Date(item.terminationDate).toLocaleDateString('pt-BR') : '-', icon: 'fa-calendar-times' },
      { label: 'Salário', value: this.formatCurrency(item.salary), icon: 'fa-money-bill-wave' },
      { label: 'Regime', value: item.workRegime || '-', icon: 'fa-clock' },
      { label: 'Conta bancária', value: item.bankAccount || '-', icon: 'fa-university' }
    ];

    fields.push({ label: 'INSS patronal', value: this.formatCurrency(item.inssEmployer), icon: 'fa-shield-alt' });
    fields.push({ label: 'FGTS', value: this.formatCurrency(item.fgts), icon: 'fa-piggy-bank' });
    fields.push({ label: 'IRRF', value: this.formatCurrency(item.irrf), icon: 'fa-file-invoice-dollar' });
    fields.push({ label: 'Vale transporte', value: this.formatCurrency(item.transportAllowance), icon: 'fa-bus' });
    fields.push({ label: 'Vale alimentação/refeição', value: this.formatCurrency(item.mealAllowance), icon: 'fa-utensils' });
    fields.push({ label: 'Plano de saúde', value: this.formatCurrency(item.healthInsurance), icon: 'fa-heartbeat' });
    fields.push({ label: 'Outros benefícios', value: this.formatCurrency(item.otherBenefits), icon: 'fa-plus-circle' });

    fields.push({ label: 'Provisão 13º salário', value: this.formatCurrency(item.thirteenthSalaryProvision), icon: 'fa-calendar' });
    fields.push({ label: 'Provisão férias', value: this.formatCurrency(item.vacationProvision), icon: 'fa-umbrella-beach' });
    fields.push({ label: 'Provisão 1/3 férias', value: this.formatCurrency(item.vacationThirdProvision), icon: 'fa-umbrella-beach' });
    fields.push({ label: 'Provisão multa rescisória', value: this.formatCurrency(item.severanceFineProvision), icon: 'fa-exclamation-triangle' });

    if (item.ocorrencias && item.ocorrencias.length > 0) {
      const ocorrenciasTexto = item.ocorrencias.map(o => {
        const data = o.data ? new Date(o.data).toLocaleDateString('pt-BR') : 'sem data';
        return `${o.tipo} (${data}): ${o.descricao || '-'}`;
      }).join(' <br> ');
      fields.push({ label: 'Ocorrências', value: ocorrenciasTexto, icon: 'fa-history' });
    }

    if (item.notes) {
      fields.push({ label: 'Observações gerais', value: item.notes, icon: 'fa-sticky-note' });
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
      icon: 'fa-hard-hat',
      subtitle: item.position,
      fields,
      actions
    });
  }

  private formatCurrency(value?: number | null): string {
    return value !== undefined && value !== null ? value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }) : '-';
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
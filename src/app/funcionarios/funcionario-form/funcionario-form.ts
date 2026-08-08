import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ParametroService } from '../../core/services/parametro.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Funcionario, FuncionarioOcorrencia } from '../../core/models/funcionario.model';

const OCORRENCIA_TIPOS = [
  'OBSERVACAO', 'ATESTADO', 'LICENCA', 'AFASTAMENTO', 'FERIAS',
  'ADVERTENCIA', 'SUSPENSAO', 'TREINAMENTO', 'PROMOCAO', 'DEMISSAO', 'OUTRO'
];

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.html',
  standalone: false
})
export class FuncionarioForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  loading = false;
  ocorrenciaTipos = OCORRENCIA_TIPOS;

  percentuais: Record<string, number> = {};

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private parametroService: ParametroService,
    public router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      cpf: [''],
      rg: [''],
      birthDate: [''],
      phone: [''],
      email: [''],
      address: [''],
      position: [''],
      department: [''],
      hireDate: [''],
      terminationDate: [''],
      salary: [null],
      workRegime: [''],
      bankAccount: [''],
      notes: [''],

      inssEmployer: [null],
      fgts: [null],
      irrf: [null],
      transportAllowance: [null],
      mealAllowance: [null],
      healthInsurance: [null],
      otherBenefits: [null],

      thirteenthSalaryProvision: [null],
      vacationProvision: [null],
      vacationThirdProvision: [null],
      severanceFineProvision: [null],

      ocorrencias: this.fb.array([])
    });
  }

  get ocorrencias(): FormArray {
    return this.form.get('ocorrencias') as FormArray;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.carregarPercentuais();
    if (this.id) {
      this.api.get<Funcionario>(`/funcionarios/${this.id}`).subscribe({
        next: data => {
          this.form.patchValue(data);
          this.setOcorrencias(data.ocorrencias || []);
        },
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar funcionário');
          this.toastService.error(message);
        }
      });
    }
    this.form.get('salary')?.valueChanges.subscribe(() => this.calcularEncargos());
    this.form.get('workRegime')?.valueChanges.subscribe(() => this.calcularEncargos());
  }

  private carregarPercentuais(): void {
    this.parametroService.getFolhaPercentuais().subscribe({
      next: res => {
        this.percentuais = Object.fromEntries(
          Object.entries(res).map(([k, v]) => [k, parseFloat(v)])
        );
        this.calcularEncargos();
      },
      error: () => {
        this.percentuais = {};
      }
    });
  }

  calcularEncargos(): void {
    const salary = this.form.get('salary')?.value;
    const regime = this.form.get('workRegime')?.value;
    if (!salary || regime !== 'CLT' || Object.keys(this.percentuais).length === 0) {
      return;
    }
    const base = typeof salary === 'string' ? parseFloat(salary) : salary;
    const patch: Record<string, number | null> = {};
    patch['inssEmployer'] = this.multiplicar(base, this.percentuais['INSS_PATRONAL_PERCENTUAL']);
    patch['fgts'] = this.multiplicar(base, this.percentuais['FGTS_PERCENTUAL']);
    patch['irrf'] = this.multiplicar(base, this.percentuais['IRRF_PERCENTUAL']);
    patch['transportAllowance'] = this.multiplicar(base, this.percentuais['TRANSPORTE_PERCENTUAL']);
    patch['mealAllowance'] = this.multiplicar(base, this.percentuais['ALIMENTACAO_PERCENTUAL']);
    patch['healthInsurance'] = this.multiplicar(base, this.percentuais['SAUDE_PERCENTUAL']);
    patch['otherBenefits'] = this.multiplicar(base, this.percentuais['BENEFICIOS_OUTROS_PERCENTUAL']);
    patch['thirteenthSalaryProvision'] = this.multiplicar(base, this.percentuais['DECIMO_TERCEIRO_PERCENTUAL']);
    patch['vacationProvision'] = this.multiplicar(base, this.percentuais['FERIAS_PERCENTUAL']);
    patch['vacationThirdProvision'] = this.multiplicar(base, this.percentuais['FERIAS_TERCO_PERCENTUAL']);
    patch['severanceFineProvision'] = this.multiplicar(base, this.percentuais['MULTA_RESCISORIA_PERCENTUAL']);
    this.form.patchValue(patch, { emitEvent: false });
  }

  private multiplicar(base: number, percentual?: number): number | null {
    if (base == null || percentual == null || isNaN(base) || isNaN(percentual)) {
      return null;
    }
    return Math.round(base * percentual * 100) / 100;
  }

  private setOcorrencias(items: FuncionarioOcorrencia[]): void {
    this.ocorrencias.clear();
    items.forEach(item => this.ocorrencias.push(this.buildOcorrencia(item)));
  }

  private buildOcorrencia(item?: FuncionarioOcorrencia): FormGroup {
    return this.fb.group({
      id: [item?.id || null],
      tipo: [item?.tipo || 'OBSERVACAO', Validators.required],
      data: [item?.data || ''],
      descricao: [item?.descricao || ''],
      anexo: [item?.anexo || '']
    });
  }

  addOcorrencia(): void {
    this.ocorrencias.push(this.buildOcorrencia());
  }

  removeOcorrencia(index: number): void {
    this.ocorrencias.removeAt(index);
  }

  save(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha os campos obrigatórios.');
      return;
    }
    this.loading = true;
    const value = this.form.value as Funcionario;
    const call = this.id
      ? this.api.put<Funcionario>(`/funcionarios/${this.id}`, value)
      : this.api.post<Funcionario>('/funcionarios', value);

    call.subscribe({
      next: () => {
        this.toastService.success(`Funcionário ${this.id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.router.navigate(['/funcionarios']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, `Erro ao ${this.id ? 'atualizar' : 'cadastrar'} funcionário`);
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

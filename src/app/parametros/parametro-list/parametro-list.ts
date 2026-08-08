import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize, forkJoin, Subject, takeUntil, timeout, TimeoutError } from 'rxjs';
import { ParametroService } from '../../core/services/parametro.service';
import { ParametroCondominio } from '../../core/models/parametro.model';

const FOLHA_KEYS = [
  { chave: 'INSS_PATRONAL_PERCENTUAL', label: 'INSS patronal' },
  { chave: 'FGTS_PERCENTUAL', label: 'FGTS' },
  { chave: 'IRRF_PERCENTUAL', label: 'IRRF' },
  { chave: 'TRANSPORTE_PERCENTUAL', label: 'Vale-transporte' },
  { chave: 'ALIMENTACAO_PERCENTUAL', label: 'Vale-alimentação' },
  { chave: 'SAUDE_PERCENTUAL', label: 'Plano de saúde' },
  { chave: 'BENEFICIOS_OUTROS_PERCENTUAL', label: 'Outros benefícios' },
  { chave: 'DECIMO_TERCEIRO_PERCENTUAL', label: 'Provisão 13º salário' },
  { chave: 'FERIAS_PERCENTUAL', label: 'Provisão de férias' },
  { chave: 'FERIAS_TERCO_PERCENTUAL', label: 'Provisão 1/3 férias' },
  { chave: 'MULTA_RESCISORIA_PERCENTUAL', label: 'Provisão multa rescisória' }
];

interface ParametroFormValue {
  id: string;
  chave: string;
  label: string;
  descricao: string;
  valorNumerico: number;
  categoria: string;
}

@Component({
  selector: 'app-parametro-list',
  templateUrl: './parametro-list.html',
  styleUrls: ['./parametro-list.scss'],
  standalone: false
})
export class ParametroList implements OnInit, OnDestroy {
  parametros: ParametroCondominio[] = [];
  form!: FormGroup;
  salvo = false;
  erro: string | null = null;
  carregando = false;

  private destroy$ = new Subject<void>();

  constructor(
    private service: ParametroService,
    private fb: FormBuilder,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('[ParametroList] ngOnInit executado');
    this.inicializarFormulario();
    this.carregar();
  }

  ngOnDestroy(): void {
    console.log('[ParametroList] ngOnDestroy executado');
    this.destroy$.next();
    this.destroy$.complete();
  }

  private inicializarFormulario(): void {
    this.form = this.fb.group({
      itens: this.fb.array<FormGroup>([])
    });
  }

  get itens(): FormArray<FormGroup> {
    return this.form.get('itens') as FormArray<FormGroup>;
  }

  carregar(): void {
    this.carregando = true;
    this.erro = null;
    console.log('[ParametroList] Iniciando carregamento de parâmetros');

    this.service.listAll()
      .pipe(
        takeUntil(this.destroy$),
        timeout(10000),
        finalize(() => {
          this.carregando = false;
          this.cdr.detectChanges();
          console.log('[ParametroList] Carregamento finalizado. carregando=', this.carregando, 'itens=', this.itens.length);
        })
      )
      .subscribe({
        next: (res) => {
          console.log('[ParametroList] Resposta recebida:', res.length, 'itens');
          this.parametros = res.filter(p => p.categoria === 'FOLHA_PAGAMENTO');
          this.montarFormulario();
        },
        error: (err) => {
          if (err instanceof TimeoutError) {
            this.erro = 'A requisição demorou mais que o esperado. Tente recarregar a página.';
          } else {
            this.erro = 'Erro ao carregar parâmetros.';
          }
          console.error('[ParametroList] Erro ao carregar parâmetros:', err);
        }
      });
  }

  private montarFormulario(): void {
    this.itens.clear();
    FOLHA_KEYS.forEach(meta => {
      const parametro = this.parametros.find(p => p.chave === meta.chave);
      const valor = parametro?.valorNumerico != null ? parametro.valorNumerico * 100 : 0;
      this.itens.push(this.fb.group({
        id: [parametro?.id || null],
        chave: [meta.chave],
        label: [meta.label],
        descricao: [parametro?.descricao || ''],
        valorNumerico: [this.arredondar(valor), [Validators.required, Validators.min(0), Validators.max(100)]],
        categoria: ['FOLHA_PAGAMENTO']
      }));
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.erro = 'Preencha todos os percentuais corretamente.';
      return;
    }
    this.erro = null;
    this.salvo = false;
    this.carregando = true;

    const atualizacoes = this.itens.controls.map((grupo) => {
      const valor = grupo.value as ParametroFormValue;
      const body: ParametroCondominio = {
        id: valor.id,
        categoria: valor.categoria,
        chave: valor.chave,
        descricao: valor.descricao,
        valorNumerico: this.arredondar(valor.valorNumerico / 100)
      };
      return this.service.update(valor.id, body);
    });

    forkJoin(atualizacoes)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.carregando = false;
        })
      )
      .subscribe({
        next: () => {
          this.salvo = true;
          this.carregar();
        },
        error: () => {
          this.erro = 'Erro ao salvar alguns parâmetros.';
        }
      });
  }

  voltar(): void {
    this.router.navigate(['/dashboard']);
  }

  private arredondar(valor: number): number {
    return Math.round(valor * 10000) / 10000;
  }
}

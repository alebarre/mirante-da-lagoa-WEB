import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class ParametroList implements OnInit {
  parametros: ParametroCondominio[] = [];
  form!: FormGroup;
  salvo = false;
  erro: string | null = null;
  carregando = false;

  constructor(private service: ParametroService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      itens: this.fb.array<FormGroup>([])
    });
    this.carregar();
  }

  get itens(): FormArray<FormGroup> {
    return this.form.get('itens') as FormArray<FormGroup>;
  }

  carregar(): void {
    this.carregando = true;
    this.service.listAll().subscribe({
      next: (res) => {
        this.parametros = res.filter(p => p.categoria === 'FOLHA_PAGAMENTO');
        this.montarFormulario();
        this.carregando = false;
      },
      error: () => {
        this.erro = 'Erro ao carregar parâmetros.';
        this.carregando = false;
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
    let concluidas = 0;
    let falhas = 0;
    atualizacoes.forEach(obs$ => obs$.subscribe({
      next: () => {
        concluidas++;
        if (concluidas + falhas === atualizacoes.length) {
          this.finalizarSalvar(falhas === 0);
        }
      },
      error: () => {
        falhas++;
        if (concluidas + falhas === atualizacoes.length) {
          this.finalizarSalvar(false);
        }
      }
    }));
  }

  private finalizarSalvar(sucesso: boolean): void {
    this.salvo = sucesso;
    if (!sucesso) {
      this.erro = 'Erro ao salvar alguns parâmetros.';
    }
    this.carregar();
  }

  private arredondar(valor: number): number {
    return Math.round(valor * 10000) / 10000;
  }
}

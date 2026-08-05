import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';

@Component({
  selector: 'app-obrigacao-form',
  templateUrl: './obrigacao-form.html',
  standalone: false
})
export class ObrigacaoForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      periodicity: ['MENSAL'],
      dueDate: [''],
      completedAt: [''],
      responsible: [''],
      status: ['PENDENTE'],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<ObrigacaoTrabalhista>(`/obrigacoes/${this.id}`).subscribe({
        next: d => this.form.patchValue(d),
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar obrigação');
          this.toastService.error(message);
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha os campos obrigatórios.');
      return;
    }
    this.loading = true;
    const call = this.id
      ? this.api.put(`/obrigacoes/${this.id}`, this.form.value)
      : this.api.post('/obrigacoes', this.form.value);

    call.subscribe({
      next: () => {
        this.toastService.success(`Obrigação ${this.id ? 'atualizada' : 'cadastrada'} com sucesso!`);
        this.router.navigate(['/obrigacoes']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, `Erro ao ${this.id ? 'atualizar' : 'cadastrar'} obrigação`);
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

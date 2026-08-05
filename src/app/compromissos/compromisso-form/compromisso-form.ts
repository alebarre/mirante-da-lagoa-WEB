import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Compromisso } from '../../core/models/compromisso.model';

@Component({
  selector: 'app-compromisso-form',
  templateUrl: './compromisso-form.html',
  standalone: false
})
export class CompromissoForm implements OnInit {
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
      title: ['', Validators.required],
      description: [''],
      scheduledAt: [''],
      location: [''],
      responsible: [''],
      status: ['AGENDADO']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Compromisso>(`/compromissos/${this.id}`).subscribe({
        next: d => this.form.patchValue(d),
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar compromisso');
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
      ? this.api.put(`/compromissos/${this.id}`, this.form.value)
      : this.api.post('/compromissos', this.form.value);

    call.subscribe({
      next: () => {
        this.toastService.success(`Compromisso ${this.id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.router.navigate(['/compromissos']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, `Erro ao ${this.id ? 'atualizar' : 'cadastrar'} compromisso`);
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

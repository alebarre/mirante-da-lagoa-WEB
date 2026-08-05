import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Morador } from '../../core/models/morador.model';

@Component({
  selector: 'app-morador-form',
  templateUrl: './morador-form.html',
  standalone: false
})
export class MoradorForm implements OnInit {
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
      fullName: ['', Validators.required],
      cpf: [''],
      rg: [''],
      birthDate: [''],
      phone: [''],
      email: [''],
      block: [''],
      apartment: [''],
      parkingSpot: [''],
      pets: [''],
      owner: [true],
      moveInDate: [''],
      moveOutDate: [''],
      emergencyContact: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Morador>(`/moradores/${this.id}`).subscribe({
        next: d => this.form.patchValue(d),
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar morador');
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
      ? this.api.put(`/moradores/${this.id}`, this.form.value)
      : this.api.post('/moradores', this.form.value);

    call.subscribe({
      next: () => {
        this.toastService.success(`Morador ${this.id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.router.navigate(['/moradores']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, `Erro ao ${this.id ? 'atualizar' : 'cadastrar'} morador`);
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

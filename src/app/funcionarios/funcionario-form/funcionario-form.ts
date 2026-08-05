import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Funcionario } from '../../core/models/funcionario.model';

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.html',
  standalone: false
})
export class FuncionarioForm implements OnInit {
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
      address: [''],
      position: [''],
      department: [''],
      hireDate: [''],
      terminationDate: [''],
      salary: [null],
      workRegime: [''],
      bankAccount: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Funcionario>(`/funcionarios/${this.id}`).subscribe({
        next: data => this.form.patchValue(data),
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar funcionário');
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

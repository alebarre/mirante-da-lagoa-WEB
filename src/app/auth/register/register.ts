import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Role } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register {
  form: FormGroup;
  loading = false;
  roles: Role[] = ['ADMIN', 'SINDICO', 'PORTARIA', 'FUNCIONARIO', 'MORADOR'];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['MORADOR', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha todos os campos obrigatórios corretamente.');
      return;
    }
    this.loading = true;
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.toastService.success('Cadastro realizado! Redirecionando para o login...');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao cadastrar');
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class Login {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha e-mail e senha corretamente.');
      return;
    }
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: () => {
        this.toastService.success('Login realizado com sucesso!');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'E-mail ou senha inválidos');
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

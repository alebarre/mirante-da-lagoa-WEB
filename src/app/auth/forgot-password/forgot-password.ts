import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  standalone: false
})
export class ForgotPassword {
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
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.warning('Informe um e-mail válido.');
      return;
    }
    this.loading = true;
    this.authService.forgotPassword(this.form.value).subscribe({
      next: () => {
        this.toastService.success('Se o e-mail existir, um código de 5 dígitos foi enviado.');
        setTimeout(() => this.router.navigate(['/reset'], { queryParams: { email: this.form.value.email } }), 2000);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Erro ao solicitar recuperação');
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

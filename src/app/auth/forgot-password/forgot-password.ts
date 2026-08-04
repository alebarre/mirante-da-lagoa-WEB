import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.html',
  standalone: false
})
export class ForgotPassword {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.forgotPassword(this.form.value).subscribe({
      next: () => {
        this.success = 'Se o e-mail existir, um código de 5 dígitos foi enviado.';
        setTimeout(() => this.router.navigate(['/reset'], { queryParams: { email: this.form.value.email } }), 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Erro ao solicitar recuperação';
        this.loading = false;
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.html',
  standalone: false
})
export class ResetPassword implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      code: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(5)]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['email']) {
        this.form.patchValue({ email: params['email'] });
      }
    });
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha todos os campos corretamente.');
      return;
    }
    this.loading = true;
    this.authService.resetPassword(this.form.value).subscribe({
      next: () => {
        this.toastService.success('Senha redefinida com sucesso!');
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, 'Código inválido ou expirado');
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

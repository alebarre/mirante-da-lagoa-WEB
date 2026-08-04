import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/auth.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  standalone: false
})
export class Register {
  form: FormGroup;
  error = '';
  success = '';
  loading = false;
  roles: Role[] = ['ADMIN', 'SINDICO', 'PORTARIA', 'FUNCIONARIO', 'MORADOR'];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['MORADOR', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    this.loading = true;
    this.error = '';
    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Cadastro realizado! Redirecionando para o login...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: err => {
        this.error = err.error?.message || 'Erro ao cadastrar';
        this.loading = false;
      }
    });
  }
}

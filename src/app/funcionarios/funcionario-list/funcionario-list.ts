import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Funcionario } from '../../core/models/funcionario.model';

@Component({
  selector: 'app-funcionario-list',
  templateUrl: './funcionario-list.html',
  standalone: false
})
export class FuncionarioList implements OnInit {
  items: Funcionario[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.get<Funcionario[]>('/funcionarios').subscribe({
      next: data => { this.items = data; this.loading = false; },
      error: err => { this.error = err.error?.message || 'Erro ao carregar'; this.loading = false; }
    });
  }

  edit(id?: string): void {
    if (id) this.router.navigate(['/funcionarios/edit', id]);
  }

  remove(id?: string): void {
    if (!id || !confirm('Confirma exclusão?')) return;
    this.api.delete(`/funcionarios/${id}`).subscribe(() => this.load());
  }

  newItem(): void {
    this.router.navigate(['/funcionarios/new']);
  }
}

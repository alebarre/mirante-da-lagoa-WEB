import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    console.log('[FuncionarioList] load() iniciado');
    this.loading = true;
    this.error = '';
    this.api.get<Funcionario[]>('/funcionarios').subscribe({
      next: data => {
        console.log('[FuncionarioList] next chamado, itens:', data.length);
        this.items = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.log('[FuncionarioList] error chamado:', err);
        this.error = err.error?.message || err.message || 'Erro ao carregar';
        this.loading = false;
        this.cdr.detectChanges();
      },
      complete: () => {
        console.log('[FuncionarioList] complete chamado');
      }
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

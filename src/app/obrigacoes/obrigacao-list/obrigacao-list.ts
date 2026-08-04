import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';

@Component({
  selector: 'app-obrigacao-list',
  templateUrl: './obrigacao-list.html',
  standalone: false
})
export class ObrigacaoList implements OnInit {
  items: ObrigacaoTrabalhista[] = [];
  loading = false;
  error = '';
  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.get<ObrigacaoTrabalhista[]>('/obrigacoes').subscribe({
      next: d => { this.items = d; this.loading = false; this.cdr.detectChanges(); },
      error: err => { this.error = err.error?.message || 'Erro'; this.loading = false; this.cdr.detectChanges(); }
    });
  }
  edit(id?: string): void { if (id) this.router.navigate(['/obrigacoes/edit', id]); }
  remove(id?: string): void { if (id && confirm('Confirma?')) this.api.delete(`/obrigacoes/${id}`).subscribe(() => this.load()); }
  newItem(): void { this.router.navigate(['/obrigacoes/new']); }
}

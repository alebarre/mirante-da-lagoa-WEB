import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Morador } from '../../core/models/morador.model';

@Component({
  selector: 'app-morador-list',
  templateUrl: './morador-list.html',
  standalone: false
})
export class MoradorList implements OnInit {
  items: Morador[] = [];
  loading = false;
  error = '';
  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.get<Morador[]>('/moradores').subscribe({
      next: d => { this.items = d; this.loading = false; this.cdr.detectChanges(); },
      error: err => { this.error = err.error?.message || 'Erro'; this.loading = false; this.cdr.detectChanges(); }
    });
  }
  edit(id?: string): void { if (id) this.router.navigate(['/moradores/edit', id]); }
  remove(id?: string): void { if (id && confirm('Confirma?')) this.api.delete(`/moradores/${id}`).subscribe(() => this.load()); }
  newItem(): void { this.router.navigate(['/moradores/new']); }
}

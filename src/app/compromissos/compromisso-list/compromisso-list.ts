import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Compromisso } from '../../core/models/compromisso.model';

@Component({
  selector: 'app-compromisso-list',
  templateUrl: './compromisso-list.html',
  standalone: false
})
export class CompromissoList implements OnInit {
  items: Compromisso[] = [];
  loading = false;
  error = '';

  constructor(private api: ApiService, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.get<Compromisso[]>('/compromissos').subscribe({
      next: data => { this.items = data; this.loading = false; this.cdr.detectChanges(); },
      error: err => { this.error = err.error?.message || 'Erro'; this.loading = false; this.cdr.detectChanges(); }
    });
  }
  edit(id?: string): void { if (id) this.router.navigate(['/compromissos/edit', id]); }
  remove(id?: string): void { if (id && confirm('Confirma?')) this.api.delete(`/compromissos/${id}`).subscribe(() => this.load()); }
  newItem(): void { this.router.navigate(['/compromissos/new']); }
}

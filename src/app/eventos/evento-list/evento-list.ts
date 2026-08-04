import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-list',
  templateUrl: './evento-list.html',
  standalone: false
})
export class EventoList implements OnInit {
  items: Evento[] = [];
  loading = false;
  error = '';
  constructor(private api: ApiService, private router: Router) {}
  ngOnInit(): void { this.load(); }
  load(): void {
    this.loading = true;
    this.api.get<Evento[]>('/eventos').subscribe({
      next: d => { this.items = d; this.loading = false; },
      error: err => { this.error = err.error?.message || 'Erro'; this.loading = false; }
    });
  }
  edit(id?: string): void { if (id) this.router.navigate(['/eventos/edit', id]); }
  remove(id?: string): void { if (id && confirm('Confirma?')) this.api.delete(`/eventos/${id}`).subscribe(() => this.load()); }
  newItem(): void { this.router.navigate(['/eventos/new']); }
}

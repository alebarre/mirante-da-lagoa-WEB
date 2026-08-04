import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ObrigacaoTrabalhista } from '../../core/models/obrigacao.model';

@Component({
  selector: 'app-obrigacao-form',
  templateUrl: './obrigacao-form.html',
  standalone: false
})
export class ObrigacaoForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  constructor(private fb: FormBuilder, private api: ApiService, public router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      name: [''], description: [''], periodicity: ['MENSAL'], dueDate: [''],
      completedAt: [''], responsible: [''], status: ['PENDENTE'], notes: ['']
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.api.get<ObrigacaoTrabalhista>(`/obrigacoes/${this.id}`).subscribe(d => this.form.patchValue(d));
  }
  save(): void {
    const call = this.id ? this.api.put(`/obrigacoes/${this.id}`, this.form.value) : this.api.post('/obrigacoes', this.form.value);
    call.subscribe(() => this.router.navigate(['/obrigacoes']));
  }
}

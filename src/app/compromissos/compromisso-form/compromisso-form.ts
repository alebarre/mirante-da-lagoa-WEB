import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Compromisso } from '../../core/models/compromisso.model';

@Component({
  selector: 'app-compromisso-form',
  templateUrl: './compromisso-form.html',
  standalone: false
})
export class CompromissoForm implements OnInit {
  form: FormGroup;
  id: string | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, public router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      title: [''], description: [''], scheduledAt: [''],
      location: [''], responsible: [''], status: ['AGENDADO']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.api.get<Compromisso>(`/compromissos/${this.id}`).subscribe(d => this.form.patchValue(d));
  }

  save(): void {
    const call = this.id ? this.api.put(`/compromissos/${this.id}`, this.form.value) : this.api.post('/compromissos', this.form.value);
    call.subscribe(() => this.router.navigate(['/compromissos']));
  }
}

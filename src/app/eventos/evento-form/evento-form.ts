import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.html',
  standalone: false
})
export class EventoForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  constructor(private fb: FormBuilder, private api: ApiService, public router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      title: [''], description: [''], startAt: [''], endAt: [''],
      location: [''], organizer: [''], status: ['AGENDADO'],
      restrictedToResidents: [false], maxParticipants: [null], notes: ['']
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.api.get<Evento>(`/eventos/${this.id}`).subscribe(d => this.form.patchValue(d));
  }
  save(): void {
    const call = this.id ? this.api.put(`/eventos/${this.id}`, this.form.value) : this.api.post('/eventos', this.form.value);
    call.subscribe(() => this.router.navigate(['/eventos']));
  }
}

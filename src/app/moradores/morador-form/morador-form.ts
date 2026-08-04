import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Morador } from '../../core/models/morador.model';

@Component({
  selector: 'app-morador-form',
  templateUrl: './morador-form.html',
  standalone: false
})
export class MoradorForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  constructor(private fb: FormBuilder, private api: ApiService, public router: Router, private route: ActivatedRoute) {
    this.form = this.fb.group({
      fullName: [''], cpf: [''], rg: [''], birthDate: [''], phone: [''], email: [''],
      block: [''], apartment: [''], parkingSpot: [''], pets: [''], owner: [true],
      moveInDate: [''], moveOutDate: [''], emergencyContact: [''], notes: ['']
    });
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) this.api.get<Morador>(`/moradores/${this.id}`).subscribe(d => this.form.patchValue(d));
  }
  save(): void {
    const call = this.id ? this.api.put(`/moradores/${this.id}`, this.form.value) : this.api.post('/moradores', this.form.value);
    call.subscribe(() => this.router.navigate(['/moradores']));
  }
}

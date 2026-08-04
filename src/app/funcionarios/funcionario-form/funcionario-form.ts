import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Funcionario } from '../../core/models/funcionario.model';

@Component({
  selector: 'app-funcionario-form',
  templateUrl: './funcionario-form.html',
  standalone: false
})
export class FuncionarioForm implements OnInit {
  form: FormGroup;
  id: string | null = null;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      fullName: [''],
      cpf: [''],
      rg: [''],
      birthDate: [''],
      phone: [''],
      email: [''],
      address: [''],
      position: [''],
      department: [''],
      hireDate: [''],
      terminationDate: [''],
      salary: [null],
      workRegime: [''],
      bankAccount: [''],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Funcionario>(`/funcionarios/${this.id}`).subscribe(data => this.form.patchValue(data));
    }
  }

  save(): void {
    const value = this.form.value as Funcionario;
    const call = this.id
      ? this.api.put<Funcionario>(`/funcionarios/${this.id}`, value)
      : this.api.post<Funcionario>('/funcionarios', value);
    call.subscribe(() => this.router.navigate(['/funcionarios']));
  }
}

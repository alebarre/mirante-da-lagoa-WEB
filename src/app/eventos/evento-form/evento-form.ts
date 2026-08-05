import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { ToastService } from '../../core/services/toast.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
import { Evento } from '../../core/models/evento.model';

@Component({
  selector: 'app-evento-form',
  templateUrl: './evento-form.html',
  standalone: false
})
export class EventoForm implements OnInit {
  form: FormGroup;
  id: string | null = null;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService,
    private errorHandler: ErrorHandlerService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startAt: [''],
      endAt: [''],
      location: [''],
      organizer: [''],
      status: ['AGENDADO'],
      restrictedToResidents: [false],
      maxParticipants: [null],
      notes: ['']
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id) {
      this.api.get<Evento>(`/eventos/${this.id}`).subscribe({
        next: d => this.form.patchValue(d),
        error: err => {
          const message = this.errorHandler.extractMessage(err, 'Erro ao carregar evento');
          this.toastService.error(message);
        }
      });
    }
  }

  save(): void {
    if (this.form.invalid) {
      this.toastService.warning('Preencha os campos obrigatórios.');
      return;
    }
    this.loading = true;
    const call = this.id
      ? this.api.put(`/eventos/${this.id}`, this.form.value)
      : this.api.post('/eventos', this.form.value);

    call.subscribe({
      next: () => {
        this.toastService.success(`Evento ${this.id ? 'atualizado' : 'cadastrado'} com sucesso!`);
        this.router.navigate(['/eventos']);
      },
      error: err => {
        const message = this.errorHandler.extractMessage(err, `Erro ao ${this.id ? 'atualizar' : 'cadastrar'} evento`);
        this.toastService.error(message);
        this.loading = false;
      }
    });
  }
}

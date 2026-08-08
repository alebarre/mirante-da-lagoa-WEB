import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ParametroCondominio } from '../models/parametro.model';

@Injectable({ providedIn: 'root' })
export class ParametroService {
  constructor(private api: ApiService) {}

  listAll(): Observable<ParametroCondominio[]> {
    return this.api.get<ParametroCondominio[]>('/parametros');
  }

  getFolhaPercentuais(): Observable<Record<string, string>> {
    return this.api.get<Record<string, string>>('/parametros/folha');
  }

  update(id: string, body: ParametroCondominio): Observable<ParametroCondominio> {
    return this.api.put<ParametroCondominio>(`/parametros/${id}`, body);
  }
}

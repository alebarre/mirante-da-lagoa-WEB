import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ErrorHandlerService {
  extractMessage(err: any, fallback = 'Ocorreu um erro inesperado. Tente novamente.'): string {
    if (err instanceof HttpErrorResponse) {
      if (err.error?.message) return err.error.message;
      if (err.error?.error) return err.error.error;
      if (err.status === 0) return 'Não foi possível conectar ao servidor. Verifique sua internet.';
      if (err.status === 401) return 'Sua sessão expirou. Faça login novamente.';
      if (err.status === 403) return 'Você não tem permissão para realizar esta ação.';
      if (err.status === 404) return 'Recurso não encontrado.';
      if (err.status >= 500) return 'Erro no servidor. Tente novamente mais tarde.';
    }
    if (err?.message) return err.message;
    return fallback;
  }

  extractStatus(err: any): number | null {
    return err instanceof HttpErrorResponse ? err.status : err?.status ?? null;
  }
}

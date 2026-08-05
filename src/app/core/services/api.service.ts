import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  private log(action: string, path: string, data?: unknown): void {
    console.log(`[ApiService] ${action} ${path}`, data ?? '');
  }

  private handleError(method: string, path: string) {
    return (err: any): Observable<never> => {
      console.error(`[ApiService] ${method} ${path} falhou`, err);
      return throwError(() => err);
    };
  }

  get<T>(path: string): Observable<T> {
    this.log('GET', path);
    return this.http.get<T>(`${API_URL}${path}`).pipe(
      tap(res => this.log('GET response', path, res)),
      catchError(this.handleError('GET', path))
    );
  }

  post<T>(path: string, body: any): Observable<T> {
    this.log('POST', path, body);
    return this.http.post<T>(`${API_URL}${path}`, body).pipe(
      tap(res => this.log('POST response', path, res)),
      catchError(this.handleError('POST', path))
    );
  }

  put<T>(path: string, body: any): Observable<T> {
    this.log('PUT', path, body);
    return this.http.put<T>(`${API_URL}${path}`, body).pipe(
      tap(res => this.log('PUT response', path, res)),
      catchError(this.handleError('PUT', path))
    );
  }

  delete<T>(path: string): Observable<T> {
    this.log('DELETE', path);
    return this.http.delete<T>(`${API_URL}${path}`).pipe(
      tap(() => this.log('DELETE response', path)),
      catchError(this.handleError('DELETE', path))
    );
  }
}

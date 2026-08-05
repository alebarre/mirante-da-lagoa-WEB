import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest,
  Role
} from '../models/auth.model';

const API_URL = `${environment.apiUrl}/auth`;
const STORAGE_KEY = 'mirante_lagoa_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authSubject = new BehaviorSubject<AuthResponse | null>(this.loadStoredAuth());
  public auth$ = this.authSubject.asObservable();

  constructor(private http: HttpClient) {}

  private log(action: string, data?: unknown): void {
    console.log(`[AuthService] ${action}`, data ?? '');
  }

  private post<T>(path: string, body: any): Observable<T> {
    this.log(`${path} request`, body);
    return this.http.post<T>(`${API_URL}${path}`, body).pipe(
      tap(res => this.log(`${path} response`, res)),
      catchError(err => {
        console.error(`[AuthService] ${path} error`, err);
        return throwError(() => err);
      })
    );
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.post<AuthResponse>('/login', req).pipe(
      tap(res => this.setAuth(res))
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.post('/register', req);
  }

  forgotPassword(req: ForgotPasswordRequest): Observable<any> {
    return this.post('/forgot', req);
  }

  resetPassword(req: ResetPasswordRequest): Observable<any> {
    return this.post('/reset', req);
  }

  refreshToken(): Observable<AuthResponse> {
    const current = this.authSubject.value;
    if (!current?.refreshToken) {
      return throwError(() => new Error('No refresh token'));
    }
    return this.http.post<AuthResponse>(`${API_URL}/refresh`, { refreshToken: current.refreshToken }).pipe(
      tap(res => this.setAuth(res)),
      catchError(err => {
        this.logout();
        return throwError(() => err);
      })
    );
  }

  logout(): void {
    this.log('logout');
    localStorage.removeItem(STORAGE_KEY);
    this.authSubject.next(null);
  }

  setAuth(auth: AuthResponse): void {
    this.log('setAuth', auth);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(auth));
    this.authSubject.next(auth);
  }

  loadStoredAuth(): AuthResponse | null {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  }

  getAccessToken(): string | null {
    return this.authSubject.value?.accessToken || null;
  }

  isAuthenticated(): boolean {
    return !!this.getAccessToken();
  }

  hasAnyRole(roles: Role[]): boolean {
    const role = this.authSubject.value?.role;
    return !!role && roles.includes(role);
  }
}

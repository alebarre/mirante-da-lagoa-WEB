import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
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

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${API_URL}/login`, req).pipe(
      tap(res => this.setAuth(res))
    );
  }

  register(req: RegisterRequest): Observable<any> {
    return this.http.post(`${API_URL}/register`, req);
  }

  forgotPassword(req: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${API_URL}/forgot`, req);
  }

  resetPassword(req: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${API_URL}/reset`, req);
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
    localStorage.removeItem(STORAGE_KEY);
    this.authSubject.next(null);
  }

  setAuth(auth: AuthResponse): void {
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



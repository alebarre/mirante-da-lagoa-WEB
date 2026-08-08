import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

const SKIP_REFRESH_HEADER = 'X-Skip-Refresh';
const REFRESH_URL_SUFFIX = '/auth/refresh';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();
    if (token) {
      req = this.addToken(req, token);
      console.log('[JwtInterceptor] Token adicionado à requisição');
    }

    return next.handle(req).pipe(
      catchError(err => {
        if (this.shouldRefresh(err, req)) {
          console.log('[JwtInterceptor] 401 detectado, tentando refresh');
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  private cloneWithRefreshedToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
        [SKIP_REFRESH_HEADER]: 'true'
      }
    });
  }

  private shouldRefresh(err: any, req: HttpRequest<any>): boolean {
    return err instanceof HttpErrorResponse
      && err.status === 401
      && !req.headers.has(SKIP_REFRESH_HEADER)
      && !req.url.endsWith(REFRESH_URL_SUFFIX);
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.authService.refreshToken().pipe(
      switchMap(auth => {
        console.log('[JwtInterceptor] Token renovado com sucesso');
        return next.handle(this.cloneWithRefreshedToken(req, auth.accessToken));
      }),
      catchError(err => {
        console.error('[JwtInterceptor] Falha ao renovar token');
        this.authService.logout();
        if (!this.isLoginPage()) {
          this.router.navigate(['/login']);
        }
        return throwError(() => err);
      })
    );
  }

  private isLoginPage(): boolean {
    const url = this.router.url;
    return url === '/login' || url.startsWith('/login');
  }
}

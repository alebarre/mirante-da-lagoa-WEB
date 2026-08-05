import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const start = Date.now();
    const body = req.body ? JSON.parse(JSON.stringify(req.body)) : undefined;
    console.log(`[HTTP] REQ ${req.method} ${req.url}`, body ?? '');

    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          const elapsed = Date.now() - start;
          console.log(`[HTTP] RES ${req.method} ${req.url} ${event.status} (${elapsed}ms)`, event.body);
        }
      }),
      catchError(err => {
        const elapsed = Date.now() - start;
        const status = err instanceof HttpErrorResponse ? err.status : '?';
        console.error(`[HTTP] ERR ${req.method} ${req.url} ${status} (${elapsed}ms)`, err);
        return throwError(() => err);
      })
    );
  }
}

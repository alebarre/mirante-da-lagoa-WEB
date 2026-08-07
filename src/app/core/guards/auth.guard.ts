import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean | Observable<boolean> {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    return this.authService.auth$.pipe(
      take(1),
      map(auth => {
        const role = auth?.role;
        const blockedRoles = route.data?.['blockedRoles'] as string[] | undefined;
        if (role && blockedRoles && blockedRoles.includes(role)) {
          this.router.navigate(['/dashboard']);
          return false;
        }
        return true;
      })
    );
  }
}
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authService.auth$.pipe(
      take(1),
      map(auth => {
        const currentRole = auth?.role;
        if (!currentRole) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredRoles = route.data?.['roles'] as string[] | undefined;
        if (requiredRoles && !requiredRoles.includes(currentRole)) {
          this.toastService.warning('Você não tem permissão para acessar esta página.');
          this.router.navigate(['/dashboard']);
          return false;
        }

        const blockedRoles = route.data?.['blockedRoles'] as string[] | undefined;
        if (blockedRoles && blockedRoles.includes(currentRole)) {
          this.toastService.warning('Moradores não podem acessar esta funcionalidade.');
          this.router.navigate(['/dashboard']);
          return false;
        }

        return true;
      })
    );
  }
}
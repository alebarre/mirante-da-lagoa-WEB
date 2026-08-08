import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/auth.model';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles?: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: false
})
export class Home implements OnInit {
  auth: AuthResponse | null = null;
  sidebarOpen = false;

  allMenu: MenuItem[] = [
    { label: 'Funcionários', path: '/funcionarios', icon: 'fa-hard-hat', roles: ['ADMIN', 'SINDICO', 'PORTARIA', 'FUNCIONARIO'] },
    { label: 'Compromissos', path: '/compromissos', icon: 'fa-calendar-alt', roles: ['ADMIN', 'SINDICO', 'PORTARIA', 'FUNCIONARIO'] },
    { label: 'Obrigações Trabalhistas', path: '/obrigacoes', icon: 'fa-clipboard-check', roles: ['ADMIN', 'SINDICO'] },
    { label: 'Moradores', path: '/moradores', icon: 'fa-home', roles: ['ADMIN', 'SINDICO', 'PORTARIA'] },
    { label: 'Eventos', path: '/eventos', icon: 'fa-glass-cheers', roles: ['ADMIN', 'SINDICO', 'PORTARIA', 'FUNCIONARIO', 'MORADOR'] },
    { label: 'Parâmetros de Encargos', path: '/parametros', icon: 'fa-percentage', roles: ['ADMIN'] }
  ];

  menu: MenuItem[] = [];
  dashboardCards: MenuItem[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.auth$.subscribe(a => {
      this.auth = a;
      this.buildMenu();
    });
  }

  private buildMenu(): void {
    if (!this.auth) {
      this.menu = [];
      this.dashboardCards = [];
      return;
    }
    const role = this.auth.role;
    if (role === 'MORADOR') {
      this.menu = this.allMenu.filter(item => item.label === 'Eventos');
      this.dashboardCards = this.menu;
      return;
    }
    this.menu = this.allMenu.filter(item => !item.roles || item.roles.includes(role));
    this.dashboardCards = this.menu;
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    this.sidebarOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
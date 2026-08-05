import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { AuthResponse } from '../../core/models/auth.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.html',
  standalone: false
})
export class Home implements OnInit {
  auth: AuthResponse | null = null;
  sidebarOpen = false;

  menu = [
    { label: 'Funcionários', path: '/funcionarios', icon: 'fa-hard-hat' },
    { label: 'Compromissos', path: '/compromissos', icon: 'fa-calendar-alt' },
    { label: 'Obrigações Trabalhistas', path: '/obrigacoes', icon: 'fa-clipboard-check' },
    { label: 'Moradores', path: '/moradores', icon: 'fa-home' },
    { label: 'Eventos', path: '/eventos', icon: 'fa-glass-cheers' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.auth$.subscribe(a => this.auth = a);
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

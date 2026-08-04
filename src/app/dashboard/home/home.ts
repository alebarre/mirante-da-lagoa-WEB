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

  menu = [
    { label: 'Funcionários', path: '/funcionarios', icon: '👷' },
    { label: 'Compromissos', path: '/compromissos', icon: '📅' },
    { label: 'Obrigações Trabalhistas', path: '/obrigacoes', icon: '📋' },
    { label: 'Moradores', path: '/moradores', icon: '🏠' },
    { label: 'Eventos', path: '/eventos', icon: '🎉' }
  ];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.authService.auth$.subscribe(a => this.auth = a);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}

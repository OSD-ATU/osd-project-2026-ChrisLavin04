// Declare global gtag function for Google Analytics
declare function gtag(type: string, eventName: string, params?: any): void;

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sports Management System';
  darkMode = false;

  constructor(public authService: AuthService, private router: Router) {
    // Optionally, load dark mode preference from localStorage
    const saved = localStorage.getItem('darkMode');
    this.darkMode = saved === 'true';
    this.updateDarkModeClass();
  }

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (typeof gtag === 'function') {
          gtag('event', 'page_view', {
            page_path: event.urlAfterRedirects
          });
        }
      }
    });
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('darkMode', String(this.darkMode));
    this.updateDarkModeClass();
  }

  updateDarkModeClass() {
    if (this.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  logout(): void {
    this.authService.logout();
  }
}

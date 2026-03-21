// Declare global gtag function for Google Analytics
declare function gtag(type: string, eventName: string, params?: any): void;

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { DarkModeService } from './services/dark-mode.service';
import { NavbarService } from './services/navbar.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'Sports Management System';

  constructor(
    public authService: AuthService,
    public darkModeService: DarkModeService,
    public navbarService: NavbarService,
    private router: Router
  ) {}
  toggleMenu() {
    this.navbarService.toggleMenu();
  }

  closeMenu() {
    this.navbarService.closeMenu();
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
    this.darkModeService.toggle();
  }

  logout(): void {
    this.authService.logout();
  }
}

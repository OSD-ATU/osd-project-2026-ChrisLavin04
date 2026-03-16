import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
//HomeComponent: Displays the main navigation features for the sports management app.
export class HomeComponent {
    get userName(): string | null {
      return this.authService.currentUserValue?.name || null;
    }
  constructor(public authService: AuthService) {}

  //List of features to display on the home page, each with a title, description, and route.
  allFeatures = [
    {
      title: 'Teams',
      description: 'Manage your sports teams - Create, view, and update team information.',
      route: '/teams',
      roles: ['admin', 'coach', 'player']
    },
    {
      title: 'Players',
      description: 'Track player details - Create, view and update player information.',
      route: '/players',
      roles: ['admin', 'coach', 'player']
    },
    {
      title: 'Matches',
      description: 'Track played matches - Create, view and update match information.',
      route: '/matches',
      roles: ['admin', 'player', 'coach']
    },
    {
      title: 'Users',
      description: 'Manage users and their roles - Create, view and update user information.',
      route: '/users',
      roles: ['admin']
    }
  ];

  get features() {
    const role = this.authService.getRole();
    if (!role) return [];
    if (role === 'admin') return this.allFeatures;
    return this.allFeatures.filter(f => f.roles.includes(role));
  }
}

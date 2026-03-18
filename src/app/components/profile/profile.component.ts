import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  coachedTeams: Team[] = [];

  constructor(
    public authService: AuthService,
    private router: Router,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(u => {
      this.user = u;
      if (u && u._id) {
        this.teamService.getTeams().subscribe(teams => {
          this.coachedTeams = teams.filter(team => team.coach === u._id);
        });
      }
    });
  }

  goToEditProfile() {
    if (this.user?._id) {
      this.router.navigate(['/users/edit', this.user._id]);
    }
  }
}

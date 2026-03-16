import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Team } from '../../../models/team.model';
import { Player } from '../../../models/player.model';
import { User } from '../../../models/user.model';
import { TeamService } from '../../../services/team.service';
import { PlayerService } from '../../../services/player.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-team-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './team-details.component.html',
  styleUrl: './team-details.component.css'
})
export class TeamDetailsComponent implements OnInit {
  team: Team | null = null;
  players: Player[] = [];
  coachName: string | null = null;
  coachUsername: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private teamService: TeamService,
    private playerService: PlayerService,
    private userService: UserService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadTeamDetails(id);
    }
  }

  loadTeamDetails(id: string): void {
    this.loading = true;
    this.error = null;
    this.coachName = null; // Reset coach name

    this.teamService.getTeamById(id).subscribe({
      next: (team) => {
        this.team = team;
        // Prefer coachUsername if present (from backend)
        if ((team as any).coachUsername) {
          this.coachUsername = (team as any).coachUsername;
          this.coachName = this.coachUsername;
          this.loadTeamPlayers(id);
          return;
        }
        // Fallback to old logic if coachUsername not present
        if (team.coach) {
          this.userService.getUserById(team.coach).subscribe({
            next: (user) => {
              this.coachName = user.username;
            },
            error: () => {
              this.coachName = null;
            }
          });
        }
        this.loadTeamPlayers(id);
      },
      error: (err) => {
        this.error = 'Failed to load team details';
        this.loading = false;
      }
    });
  }

  loadTeamPlayers(teamId: string): void {
    this.playerService.getPlayersByTeam(teamId).subscribe({
      next: (players: Player[]) => {
        this.players = players;
        // Update team's player count
        if (this.team) {
          this.team.players = players.map(p => p._id || '');
        }
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load team players';
        this.loading = false;
        console.error('Error loading players:', err);
      }
    });
  }
}

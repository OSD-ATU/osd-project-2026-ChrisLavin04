import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Team } from '../../models/team.model';
import { Player } from '../../models/player.model';
import { TeamService } from '../../services/team.service';
import { PlayerService } from '../../services/player.service';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

type TeamWithCoachName = Team & { coachUsername?: string };
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-teams',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './teams.component.html',
  styleUrl: './teams.component.css'
})


export class TeamsComponent implements OnInit {
  //List of teams to display
  teams: TeamWithCoachName[] = [];
  //Filtered teams for search
  filteredTeams: TeamWithCoachName[] = [];
  //Search term
  searchTerm: string = '';
  //Loading state for UI feedback
  loading = false;
  //Error message to display if something goes wrong
  error: string | null = null;

  //Injects the TeamService, PlayerService, AuthService for API calls and MatDialog for confirmation dialogs.
  constructor(
    private teamService: TeamService,
    private dialog: MatDialog,
    private playerService: PlayerService,
    public authService: AuthService,
    private userService: UserService
  ) {}


  //Map of coach IDs to names (not used in new approach)
  //coachNames: Record<string, string> = {};

  //On component initialization, load the teams list.
  ngOnInit(): void {
    this.loadTeams();
  }

  //Loads the list of teams and their players from the backend, and fetches coach usernames per team.
  loadTeams(): void {
    this.loading = true;
    this.error = null;

    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.playerService.getPlayers().subscribe({
          next: (players) => {
            this.teams = teams.map(team => ({
              ...team,
              players: players.filter(p => p.team_id === team._id).map(p => p._id || '')
            }));
            this.applySearch();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load players';
            this.loading = false;
            console.error('Error loading players:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load teams';
        this.loading = false;
        console.error('Error loading teams:', err);
      }
    });
  }

  applySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredTeams = this.teams;
    } else {
      this.filteredTeams = this.teams.filter(team =>
        team.name.toLowerCase().includes(term)
      );
    }
  }

  //Deletes a team after confirmation dialog.
  deleteTeam(id: string | undefined): void {
    if (!id) return;

    //Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Team',
        message: 'Are you sure you want to delete this team?'
      }
    });

    //After dialog closes, delete if confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.teamService.deleteTeam(id).subscribe({
          next: () => {
            this.loadTeams();
          },
          error: (err) => {
            this.error = 'Failed to delete team';
            console.error('Error deleting team:', err);
          }
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Match } from '../../models/match.model';
import { MatchService } from '../../services/match.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './matches.component.html',
  styleUrl: './matches.component.css'
})
//MatchesComponent: Displays and manages the list of matches. Handles loading, deleting, and error states.
export class MatchesComponent implements OnInit {
  //List of matches to display
  matches: Match[] = [];
  //Map of team IDs to team objects for quick lookup
  teams: { [key: string]: Team } = {};
  //Loading state for UI feedback
  loading = false;
  //Error message to display if something goes wrong
  error: string | null = null;

  //Inject required services including AuthService
  constructor(
    private matchService: MatchService,
    private teamService: TeamService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  //On component initialization, load matches and teams
  ngOnInit(): void {
    this.loadMatches();
  }

  //Loads matches and teams from the backend. First fetches matches, then fetches teams, and builds a lookup map.
  loadMatches() {
    this.loading = true;
    this.error = null;

    //Fetch all matches
    this.matchService.getMatches().subscribe({
      next: (matches) => {
        this.matches = matches;
        //After matches are loaded, fetch all teams
        this.teamService.getTeams().subscribe({
          next: (teams) => {
            //Build a map of team IDs to team objects
            this.teams = {};
            teams.forEach(team => {
              if (team._id) {
                this.teams[team._id] = team;
              }
            });
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load teams';
            this.loading = false;
            console.error('Error loading teams:', err);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load matches';
        this.loading = false;
        console.error('Error loading matches:', err);
      }
    });
  }

  //Deletes a match after user confirmation dialog.
  deleteMatch(id: string | undefined): void {
    if (!id) return;

    //Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Match',
        message: 'Are you sure you want to delete this match?'
      }
    });

    //After dialog closes, delete if confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.matchService.deleteMatch(id).subscribe({
          next: () => {
            this.loadMatches(); //Refresh list after deletion
          },
          error: (err) => {
            this.error = 'Failed to delete match';
            console.error('Error deleting match:', err);
          }
        });
      }
    });
  }

  //Returns a formatted score string for a match.
  getScoreDisplay(match: Match): string {
    if (match.score) {
      return match.score.home + ' - ' + match.score.away;
    }
    return '-';
  }

  //Returns the team name for a given team ID.
  getTeamName(teamId: string): string {
    return this.teams[teamId]?.name || teamId;
  }

  //Returns a CSS class for the match status badge (not implemented).
  getStatusBadgeClass(status: string): string {
    return '';
  }
}

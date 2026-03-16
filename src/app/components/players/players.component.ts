import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-players',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './players.component.html',
  styleUrl: './players.component.css'
})
//PlayersComponent: Displays and manages the list of players. Handles loading, deleting, and error states.
export class PlayersComponent implements OnInit {
  //List of players to display
  players: Player[] = [];
  //Map of team IDs to names
  teamNames: Record<string, string> = {};
  //Loading state for UI feedback
  loading = false;
  //Error message to display if something goes wrong
  error: string | null = null;

  //Injects the PlayerService, AuthService for API calls and MatDialog for confirmation dialogs.
  constructor(
    private playerService: PlayerService,
    private teamService: TeamService,
    private dialog: MatDialog,
    public authService: AuthService
  ) {}

  //On component initialization, load the players list.
  ngOnInit(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teamNames = {};
        for (const team of teams) {
          if (team._id && team.name) {
            this.teamNames[team._id] = team.name;
          }
        }
        this.loadPlayers();
      },
      error: () => {
        this.loadPlayers();
      }
    });
  }
  getTeamName(teamId?: string): string {
    if (!teamId) return 'N/A';
    return this.teamNames[teamId] || 'N/A';
  }

  //Loads the list of players from the backend.
  loadPlayers() {
    this.loading = true;
    this.error = null;
    this.playerService.getPlayers().subscribe({
      next: (data) => {
        this.players = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load players';
        this.loading = false;
        console.error('Error loading players:', err);
      }
    });
  }

  //Deletes a player after confirmation dialog.
  deletePlayer(id: string | undefined): void {
    if (!id) return;

    //Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete Player',
        message: 'Are you sure you want to delete this player?'
      }
    });

    //After dialog closes, delete if confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.playerService.deletePlayer(id).subscribe({
          next: () => {
            this.loadPlayers();
          },
          error: (err) => {
            this.error = 'Failed to delete player';
            console.error('Error deleting player:', err);
          }
        });
      }
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player.model';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-player-stats',
  templateUrl: './player-stats.component.html',
  styleUrls: ['./player-stats.component.css']
  ,
  imports: [CommonModule, RouterModule]
})
export class PlayerStatsComponent implements OnInit {
  player: Player | null = null;
  error: string | null = null;
  teamNames: Record<string, string> = {};

  constructor(
    private route: ActivatedRoute,
    private playerService: PlayerService,
    private teamService: TeamService
  ) {}

  ngOnInit(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => {
        this.teamNames = {};
        for (const team of teams) {
          if (team._id && team.name) {
            this.teamNames[team._id] = team.name;
          }
        }
        this.loadPlayer();
      },
      error: () => {
        this.loadPlayer();
      }
    });
  }

  loadPlayer(): void {
    const playerId = this.route.snapshot.paramMap.get('id');
    if (playerId) {
      this.playerService.getPlayerById(playerId).subscribe({
        next: (player) => {
          this.player = player;
        },
        error: () => {
          this.error = 'Failed to load player statistics.';
        }
      });
    }
  }

  getTeamName(teamId?: string): string {
    if (!teamId) return 'N/A';
    return this.teamNames[teamId] || 'N/A';
  }
}

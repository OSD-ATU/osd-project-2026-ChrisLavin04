import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamService } from '../../services/team.service';
import { MatchService } from '../../services/match.service';
import { LambdaStandingsService } from '../../services/lambda-standings.service';
import { Team } from '../../models/team.model';
import { Match } from '../../models/match.model';
import { forkJoin } from 'rxjs';
import { RouterLink } from '@angular/router';

export interface StandingRow {
  teamId: string;
  teamName: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
}

@Component({
  selector: 'app-standings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './standings.component.html',
  styleUrl: './standings.component.css'
})
export class StandingsComponent implements OnInit {
  standings: StandingRow[] = [];
  loading = true;
  error = '';

  constructor(
    private teamService: TeamService,
    private matchService: MatchService,
    private lambdaStandings: LambdaStandingsService
  ) {}

  ngOnInit(): void {
    forkJoin({
      teams: this.teamService.getTeams(),
      matches: this.matchService.getMatches()
    }).subscribe({
      next: ({ teams, matches }) => {
        this.lambdaStandings.getUniqueStandings(teams, matches).subscribe({
          next: (result) => {
            this.standings = result.standings;
            this.loading = false;
          },
          error: () => {
            this.error = 'Failed to load standings from Lambda.';
            this.loading = false;
          }
        });
      },
      error: () => {
        this.error = 'Failed to load teams or matches.';
        this.loading = false;
      }
    });
  }

  // The local calculateStandings method is now replaced by Lambda. Here is the old code.
  /*
    private calculateStandings(teams: Team[], matches: Match[]): StandingRow[] {
    const map = new Map<string, StandingRow>();

    for (const team of teams) {
      map.set(team._id!, {
        teamId: team._id!,
        teamName: team.name,
        played: 0,
        won: 0,
        drawn: 0,
        lost: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        points: 0
      });
    }

    for (const match of matches) {
      if (!match.score) continue;

      const home = map.get(match.home_team_id);
      const away = map.get(match.away_team_id);
      const { home: hg, away: ag } = match.score;

      if (home) {
        home.played++;
        home.goalsFor += hg;
        home.goalsAgainst += ag;
        if (hg > ag) { home.won++; home.points += 3; }
        else if (hg === ag) { home.drawn++; home.points += 1; }
        else { home.lost++; }
      }

      if (away) {
        away.played++;
        away.goalsFor += ag;
        away.goalsAgainst += hg;
        if (ag > hg) { away.won++; away.points += 3; }
        else if (ag === hg) { away.drawn++; away.points += 1; }
        else { away.lost++; }
      }
    }

    return Array.from(map.values())
      .map(row => ({ ...row, goalDifference: row.goalsFor - row.goalsAgainst }))
      .sort((a, b) => b.points - a.points || b.goalDifference - a.goalDifference || b.goalsFor - a.goalsFor);
  }*/
}

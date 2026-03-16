import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from '../../services/match.service';
import { Match } from '../../models/match.model';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-match-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './match-form.component.html',
  styleUrl: './match-form.component.css'
})
export class MatchFormComponent implements OnInit {
  matchForm: FormGroup;
  teams: Team[] = [];
  isEditMode = false;
  matchId: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private matchService: MatchService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.matchForm = this.fb.group({
      home_team_id: ['', Validators.required],
      away_team_id: ['', Validators.required],
      home_score: ['', [Validators.required, Validators.min(0)]],
      away_score: ['', [Validators.required, Validators.min(0)]],
      date: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => { this.teams = teams; },
      error: () => { this.error = 'Failed to load teams.'; }
    });
    this.matchId = this.route.snapshot.paramMap.get('id');
    if (this.matchId) {
      this.isEditMode = true;
      this.loadMatch(this.matchId);
    }
  }

  loadMatch(id: string) {
    this.matchService.getMatchById(id).subscribe({
      next: (match) => {
        this.matchForm.patchValue({
          home_team_id: match.home_team_id,
          away_team_id: match.away_team_id,
          home_score: match.score?.home || 0,
          away_score: match.score?.away || 0,
          date: new Date(match.date)
        });
      },
      error: (err) => {
        this.error = 'Failed to load match';
        console.error('Error loading match:', err);
      }
    });
  }

  onSubmit() {
    if (this.matchForm.valid) {
      const formValue = this.matchForm.value;
      const matchData: any = {
        home_team_id: formValue.home_team_id,
        away_team_id: formValue.away_team_id,
        score: {
          home: Number(formValue.home_score),
          away: Number(formValue.away_score)
        },
        date: new Date(formValue.date).toISOString()
      };

      if (this.isEditMode && this.matchId) {
        this.matchService.updateMatch(this.matchId, matchData).subscribe({
          next: () => {
            this.router.navigate(['/matches']);
          },
          error: (err) => {
            if (err.status === 304) {
              this.router.navigate(['/matches']);
              return;
            }
            
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to update match';
            }
          }
        });
      } else {
        this.matchService.createMatch(matchData).subscribe({
          next: () => {
            this.router.navigate(['/matches']);
          },
          error: (err) => {
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to create match';
            }
            console.error('Error creating match:', err);
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/matches']);
  }
}

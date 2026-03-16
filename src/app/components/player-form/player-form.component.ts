import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { PlayerService } from '../../services/player.service';
import { Player } from '../../models/player.model';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';

@Component({
  selector: 'app-player-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './player-form.component.html',
  styleUrl: './player-form.component.css'
})
//PlayerFormComponent: Handles the form for creating and editing a player.
export class PlayerFormComponent implements OnInit {
  //Reactive form group for player data
  playerForm: FormGroup;
  //True if editing an existing player
  isEditMode = false;
  //ID of the player being edited (if any)
  playerId: string | null = null;
  //Error message to display if something goes wrong
  error: string | null = null;

  //Available player positions
  positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];
  //List of teams for dropdown
  teams: Team[] = [];

  //Injects form builder, player service, router, and route
  constructor(
    private fb: FormBuilder,
    private playerService: PlayerService,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    //Initialize the form with validation rules
    this.playerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      position: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(16), Validators.max(45)]],
      team_id: ['', Validators.required],
      goals: [0, [Validators.required, Validators.min(0)]],
      assists: [0, [Validators.required, Validators.min(0)]],
      matchesPlayed: [0, [Validators.required, Validators.min(0)]]
    });
  }

  //On component initialization, check for edit mode and load player if needed
  ngOnInit(): void {
    this.teamService.getTeams().subscribe({
      next: (teams) => { this.teams = teams; },
      error: () => { this.error = 'Failed to load teams.'; }
    });
    this.playerId = this.route.snapshot.paramMap.get('id');
    //Check for team_id in query params
    const teamId = this.route.snapshot.queryParamMap.get('team_id');
    if (teamId) {
      this.playerForm.patchValue({ team_id: teamId });
    }
    if (this.playerId) {
      this.isEditMode = true;
      this.loadPlayer(this.playerId);
    }
  }

  //Loads player data into the form for editing
  loadPlayer(id: string) {
    this.playerService.getPlayerById(id).subscribe({
      next: (player) => {
        this.playerForm.patchValue({
          name: player.name,
          position: player.position,
          age: player.age,
          team_id: player.team_id || ''
          ,
          goals: player.goals ?? 0,
          assists: player.assists ?? 0,
          matchesPlayed: player.matchesPlayed ?? 0
        });
      },
      error: (err) => {
        this.error = 'Failed to load player';
        console.error('Error loading player:', err);
      }
    });
  }

  onSubmit() {
    if (this.playerForm.valid) {
      const formValue = this.playerForm.value;
      const playerData: any = {
        name: formValue.name,
        position: formValue.position,
        age: Number(formValue.age)
        ,
        goals: Number(formValue.goals),
        assists: Number(formValue.assists),
        matchesPlayed: Number(formValue.matchesPlayed)
      };
      
      // Only include team_id if it's not empty
      if (formValue.team_id && formValue.team_id.trim() !== '') {
        playerData.team_id = formValue.team_id;
      }

      if (this.isEditMode && this.playerId) {
        console.log('Updating player with ID:', this.playerId);
        console.log('Player data:', playerData);
        
        this.playerService.updatePlayer(this.playerId, playerData).subscribe({
          next: () => {
            this.router.navigate(['/players']);
          },
          error: (err) => {
            // "304 Not Modified" ignored (no changes made)
            if (err.status === 304) {
              this.router.navigate(['/players']);
              return;
            }
            
            console.error('Full error object:', err);
            console.error('Status:', err.status);
            console.error('Status text:', err.statusText);
            console.error('Error body:', err.error);
            
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to update player (Status: ' + err.status + ')';
            }
          }
        });
      } else {
        this.playerService.createPlayer(playerData).subscribe({
          next: () => {
            this.router.navigate(['/players']);
          },
          error: (err) => {
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to create player';
            }
            console.error('Error creating player:', err);
            console.error('Error details:', err.error);
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/players']);
  }
}

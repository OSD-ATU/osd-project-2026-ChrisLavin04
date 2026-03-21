import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { TeamService } from '../../services/team.service';
import { Team } from '../../models/team.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-team-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './team-form.component.html',
  styleUrl: './team-form.component.css'
})
export class TeamFormComponent implements OnInit {
  teamForm: FormGroup;
  isEditMode = false;
  teamId: string | null = null;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private teamService: TeamService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    this.teamForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      coach: ['']
    });
  }

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('id');
    if (this.teamId) {
      this.isEditMode = true;
      this.loadTeam(this.teamId);
    } else {
      // Autofill coach with logged-in user's ID
      const user = this.authService.currentUserValue;
      if (user && user._id) {
        this.teamForm.patchValue({ coach: user._id });
      }
    }
  }

  loadTeam(id: string) {
    this.teamService.getTeamById(id).subscribe({
      next: (team) => {
        this.teamForm.patchValue({
          name: team.name,
          coach: team.coach || ''
        });
      },
      error: (err) => {
        this.error = 'Failed to load team';
        console.error('Error loading team:', err);
      }
    });
  }

  onSubmit() {
    if (this.teamForm.valid) {
      const formValue = this.teamForm.value;
      const teamData: any = {
        name: formValue.name
      };
      
      if (formValue.coach && formValue.coach.trim() !== '') {
        teamData.coach = formValue.coach;
      }

      if (this.isEditMode && this.teamId) {
        this.teamService.updateTeam(this.teamId, teamData).subscribe({
          next: () => {
            this.router.navigate(['/teams']);
          },
          error: (err) => {
            if (err.status === 304) {
              this.router.navigate(['/teams']);
              return;
            }
            
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to update team';
            }
          }
        });
      } else {
        this.teamService.createTeam(teamData).subscribe({
          next: () => {
            this.router.navigate(['/teams']);
          },
          error: (err) => {
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to create team';
            }
            console.error('Error creating team:', err);
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/teams']);
  }

  // Detect dark mode by checking the body class
  isDarkMode(): boolean {
    return document.body.classList.contains('dark-mode');
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-user-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  isEditMode = false;
  userId: string | null = null;
  error: string | null = null;

  roles = ['admin', 'coach', 'player'];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id');
    if (this.userId) {
      this.isEditMode = true;
      this.loadUser(this.userId);
      // Password not required for edit
      this.userForm.get('password')?.clearValidators();
      this.userForm.get('password')?.updateValueAndValidity();
    } else {
      // Password required for create
      this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    }
  }

  loadUser(id: string) {
    this.userService.getUserById(id).subscribe({
      next: (user) => {
        this.userForm.patchValue({
          username: user.username,
          email: user.email,
          role: user.role
        });
      },
      error: (err) => {
        this.error = 'Failed to load user';
        console.error('Error loading user:', err);
      }
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const userData: any = {
        username: formValue.username,
        email: formValue.email,
        role: formValue.role
      };
      
      // Only include password if provided
      if (formValue.password && formValue.password.trim() !== '') {
        userData.password_hash = formValue.password;
      }

      if (this.isEditMode && this.userId) {
        this.userService.updateUser(this.userId, userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (err) => {
            if (err.status === 304) {
              this.router.navigate(['/users']);
              return;
            }
            
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to update user';
            }
          }
        });
      } else {
        this.userService.createUser(userData).subscribe({
          next: () => {
            this.router.navigate(['/users']);
          },
          error: (err) => {
            if (err.error && err.error.details) {
              this.error = 'Validation failed: ' + err.error.details.map((d: any) => d.message).join(', ');
            } else if (err.error && err.error.error) {
              this.error = err.error.error;
            } else {
              this.error = 'Failed to create user';
            }
            console.error('Error creating user:', err);
          }
        });
      }
    }
  }

  onCancel() {
    this.router.navigate(['/users']);
  }
}

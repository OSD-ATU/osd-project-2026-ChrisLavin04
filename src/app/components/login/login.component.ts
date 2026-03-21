import { DarkModeService } from '../../services/dark-mode.service';
import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTabsModule,
    MatSelectModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    isDarkMode: (() => boolean) | null = null;
  loginForm: FormGroup;
  registerForm: FormGroup;
  loginError: string | null = null;
  registerError: string | null = null;
  loading = false;
  returnUrl: string = '/';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private darkModeService: DarkModeService
  ) {
      this.isDarkMode = this.darkModeService.darkMode ? () => this.darkModeService.darkMode() : null;
    // Get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';

    // Initialize login form
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Initialize register form
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['user', [Validators.required]]
    });
  }

  /**
   * Handle login form submission
   */
  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.loginError = null;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (err: any) => {
        this.loading = false;
        this.loginError = err.error?.error || 'Login failed. Please check your credentials.';
        console.error('Login error:', err);
      }
    });
  }

  /**
   * Handle register form submission
   */
  onRegister(): void {
    // Frontend validation
    if (this.registerForm.invalid) {
      const errors: string[] = [];
      const controls = this.registerForm.controls;
      if (controls['username'].invalid) errors.push('Username is required and must be at least 2 characters.');
      if (controls['email'].invalid) errors.push('Valid email is required.');
      if (controls['password'].invalid) errors.push('Password is required and must be at least 6 characters.');
      if (controls['confirmPassword'].invalid) errors.push('Please confirm your password.');
      if (controls['role'].invalid) errors.push('Role is required.');
      this.registerError = errors.join(' ');
      return;
    }

    // Check if passwords match
    const { username, email, password, confirmPassword, role } = this.registerForm.value;
    if (password !== confirmPassword) {
      this.registerError = 'Passwords do not match.';
      return;
    }

    this.loading = true;
    this.registerError = null;

    this.authService.register({ username, email, password, role }).subscribe({
      next: () => {
        this.router.navigate([this.returnUrl]);
      },
      error: (err: any) => {
        this.loading = false;
        // Always show backend error message if present
        let backendMsg = '';
        if (err.error?.error) {
          backendMsg = err.error.error;
        } else if (err.error?.message) {
          backendMsg = err.error.message;
        }
        // Try to detect duplicate/exists/validation errors
        const duplicateMsg = (msg: unknown): boolean => typeof msg === 'string' && (msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('duplicate'));
        let duplicate = false;
        if (err.error?.details && Array.isArray(err.error.details)) {
          duplicate = err.error.details.some((e: any) => duplicateMsg(e.msg || e.message || ''));
        } else if (err.error?.errors && Array.isArray(err.error.errors)) {
          duplicate = err.error.errors.some((e: any) => duplicateMsg(e.msg || e.message || ''));
        } else if (duplicateMsg(backendMsg)) {
          duplicate = true;
        }
        if (duplicate) {
          this.registerError = backendMsg || 'Email or username already exists. Please edit credentials and try again.';
          return;
        }
        // Show backend validation errors if available
        if (err.error?.details && Array.isArray(err.error.details)) {
          this.registerError = err.error.details.map((e: any) => e.msg || e.message || e).join(' ');
        } else if (err.error?.errors && Array.isArray(err.error.errors)) {
          this.registerError = err.error.errors.map((e: any) => e.msg || e.message || e).join(' ');
        } else if (backendMsg) {
          this.registerError = backendMsg;
        } else {
          this.registerError = 'Registration failed. Please try again.';
        }
        console.error('Registration error:', err);
      }
    });
  }
}

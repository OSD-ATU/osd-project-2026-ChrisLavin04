import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
//UsersComponent: Displays and manages the list of users. Handles loading, deleting, and error states.

export class UsersComponent implements OnInit {
  //List of users to display
  users: User[] = [];
  //Loading state for UI feedback
  loading = false;
  //Error message to display if something goes wrong
  error: string | null = null;

  //Injects the UserService for API calls and MatDialog for confirmation dialogs.

  constructor(private userService: UserService, private dialog: MatDialog) {}

  //On component initialization, load the users list.
   
  ngOnInit(): void {
    this.loadUsers();
  }

  //Loads the list of users from the backend.
 
  loadUsers() {
    this.loading = true;
    this.error = null;
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load users';
        this.loading = false;
        console.error('Error loading users:', err);
      }
    });
  }

  // Deletes a user after confirmation dialog. 
   
  deleteUser(id: string | undefined): void {
    if (!id) return;

    // Open confirmation dialog
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?'
      }
    });

    // After dialog closes, delete if confirmed
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.deleteUser(id).subscribe({
          next: () => {
            this.loadUsers();
          },
          error: (err) => {
            this.error = 'Failed to delete user';
            console.error('Error deleting user:', err);
          }
        });
      }
    });
  }
}

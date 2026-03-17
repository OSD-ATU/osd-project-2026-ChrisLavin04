import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard - Protects routes that require authentication
 * Usage: Add to route configuration: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Role-based route protection
  const role = authService.getRole();
  const url = state.url;

  // Everyone can view teams, players, matches, standings, profile
  if (
    url.startsWith('/teams') ||
    url.startsWith('/players') ||
    url.startsWith('/matches') ||
    url.startsWith('/standings') ||
    url.startsWith('/profile')
  ) {
    // Restrict create/edit actions based on role
    if (url.includes('/new') || url.includes('/edit')) {
      // Admin: can create/edit teams, matches, players
      if (role === 'admin' && (url.startsWith('/teams') || url.startsWith('/matches') || url.startsWith('/players'))) {
        return true;
      }
      // Coach: can create/edit matches, players, add to teams
      if (role === 'coach' && (url.startsWith('/matches') || url.startsWith('/players') || url.startsWith('/teams'))) {
        return true;
      }
      // Player: cannot create/edit anything
      if (role === 'player') {
        router.navigate(['/']);
        return false;
      }
      // Other roles: deny create/edit
      router.navigate(['/']);
      return false;
    }
    // All roles can view
    return true;
  }

  // Only admin can view users, but allow users to edit their own account
  if (url.startsWith('/users')) {
    // Allow /users/edit/:id if the id matches the current user's id
    const currentUser = authService.currentUserValue;
    const editOwn = url.match(/^\/users\/edit\/([a-zA-Z0-9]+)/);
    if (role === 'admin') {
      return true;
    }
    if (editOwn && currentUser && editOwn[1] === currentUser._id) {
      return true;
    }
    router.navigate(['/']);
    return false;
  }

  // Default: deny access
  router.navigate(['/']);
  return false;
};

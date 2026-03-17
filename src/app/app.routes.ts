import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { TeamsComponent } from './components/teams/teams.component';
import { PlayersComponent } from './components/players/players.component';
import { MatchesComponent } from './components/matches/matches.component';
import { UsersComponent } from './components/users/users.component';
import { PlayerFormComponent } from './components/player-form/player-form.component';
import { TeamFormComponent } from './components/team-form/team-form.component';
import { MatchFormComponent } from './components/match-form/match-form.component';
import { UserFormComponent } from './components/user-form/user-form.component';
import { TeamDetailsComponent } from './components/teams/team-details/team-details.component';
import { PlayerStatsComponent } from './components/player-stats/player-stats.component';
import { StandingsComponent } from './components/standings/standings.component';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  
  // Protected routes - require authentication
  { path: 'teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'teams/new', component: TeamFormComponent, canActivate: [authGuard] },
  { path: 'teams/:id', component: TeamDetailsComponent, canActivate: [authGuard] },
  { path: 'teams/edit/:id', component: TeamFormComponent, canActivate: [authGuard] },
  
  { path: 'players', component: PlayersComponent, canActivate: [authGuard] },
  { path: 'players/new', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'players/edit/:id', component: PlayerFormComponent, canActivate: [authGuard] },
  { path: 'players/details/:id', component: PlayerStatsComponent, canActivate: [authGuard] },
  
  { path: 'standings', component: StandingsComponent, canActivate: [authGuard] },

  { path: 'matches', component: MatchesComponent, canActivate: [authGuard] },
  { path: 'matches/new', component: MatchFormComponent, canActivate: [authGuard] },
  { path: 'matches/edit/:id', component: MatchFormComponent, canActivate: [authGuard] },
  
  { path: 'users', component: UsersComponent, canActivate: [authGuard] },
  { path: 'users/new', component: UserFormComponent, canActivate: [authGuard] },
  { path: 'users/edit/:id', component: UserFormComponent, canActivate: [authGuard] },
  
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];


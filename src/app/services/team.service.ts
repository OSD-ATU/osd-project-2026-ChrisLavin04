import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
//TeamService: Handles all HTTP requests related to teams.
export class TeamService {
  //API endpoint for teams
  private apiUrl = environment.apiUrl + '/api/teams';

  //Injects HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  //Get all teams
  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }

  //Get a team by ID
  getTeamById(id: string): Observable<Team> {
    return this.http.get<Team>(this.apiUrl + '/' + id);
  }

  //Create a new team
  createTeam(team: Team): Observable<any> {
    return this.http.post(this.apiUrl, team);
  }

  //Update an existing team
  updateTeam(id: string, team: Team): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, team);
  }

  //Delete a team by ID
  deleteTeam(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}

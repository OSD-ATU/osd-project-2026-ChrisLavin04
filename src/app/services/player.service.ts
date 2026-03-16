import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Player } from '../models/player.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
//PlayerService: Handles all HTTP requests related to players.
export class PlayerService {
  //API endpoint for players
  private apiUrl = environment.apiUrl + '/api/players';

  //Injects HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  //Get all players
  getPlayers(): Observable<Player[]> {
    return this.http.get<Player[]>(this.apiUrl);
  }

  //Get a player by ID
  getPlayerById(id: string): Observable<Player> {
    return this.http.get<Player>(this.apiUrl + '/' + id);
  }

  //Create a new player
  createPlayer(player: Player): Observable<any> {
    return this.http.post(this.apiUrl, player);
  }

  //Update an existing player
  updatePlayer(id: string, player: Player): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, player);
  }

  //Delete a player by ID
  deletePlayer(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }

  //Get all players belonging to a specific team
  getPlayersByTeam(teamId: string): Observable<Player[]> {
    return new Observable(observer => {
      this.getPlayers().subscribe({
        next: (players) => {
          const teamPlayers = players.filter(p => p.team_id === teamId);
          observer.next(teamPlayers);
          observer.complete();
        },
        error: (err) => {
          observer.error(err);
        }
      });
    });
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Match } from '../models/match.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
//MatchService: Handles all HTTP requests related to matches.
export class MatchService {
  //API endpoint for matches
  private apiUrl = environment.apiUrl + '/api/matches';

  //Injects HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  //Get all matches
  getMatches(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  //Get a match by ID
  getMatchById(id: string): Observable<Match> {
    return this.http.get<Match>(this.apiUrl + '/' + id);
  }

  //Create a new match
  createMatch(match: Match): Observable<any> {
    return this.http.post(this.apiUrl, match);
  }

  //Update an existing match
  updateMatch(id: string, match: Match): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, match);
  }

  //Delete a match by ID
  deleteMatch(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}

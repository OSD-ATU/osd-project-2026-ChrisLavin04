import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Team } from '../models/team.model';
import { Match } from '../models/match.model';

@Injectable({ providedIn: 'root' })
export class LambdaStandingsService {
  private lambdaUrl = environment.standingsApiUrl;

  constructor(private http: HttpClient) {}

  // Calls AWS Lambda to calculate unique league standings with bonus points for away wins
  getUniqueStandings(teams: Team[], matches: Match[]): Observable<any> {
    return this.http.post<any>(this.lambdaUrl, { teams, matches });
  }
}

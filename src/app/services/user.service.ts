import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
//UserService: Handles all HTTP requests related to users.
export class UserService {
  //API endpoint for users
  private apiUrl = environment.apiUrl + '/api/users';

  //Injects HttpClient for making HTTP requests
  constructor(private http: HttpClient) { }

  //Get all users
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  //Get a user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.apiUrl + '/' + id);
  }

  //Create a new user
  createUser(user: User): Observable<any> {
    return this.http.post(this.apiUrl, user);
  }

  //Update an existing user
  updateUser(id: string, user: User): Observable<any> {
    return this.http.put(this.apiUrl + '/' + id, user);
  }

  //Delete a user by ID
  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.apiUrl + '/' + id);
  }
}

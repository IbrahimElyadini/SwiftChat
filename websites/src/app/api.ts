import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from './user-info';
import { UserCredential } from './user-credential';
import { ProfileInterface } from './profileInterface';

@Injectable({
  providedIn: 'root'
})
export class Api {

  private baseUrl = 'http://127.0.0.1:5000';

  constructor(private http: HttpClient) {}

  register(user: UserInfo): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, user);
  }

  login(credentials: UserCredential): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  getProfile(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile/${userId}`);
  }

  updateProfile(profile: ProfileInterface): Observable<any> {
    return this.http.put(`${this.baseUrl}/profile/${profile.id}`, {
      avatar: profile.avatar,
      bio: profile.bio
    });
  }

  deleteProfile(userId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/profile/${userId}`);
  }


  getMessages(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages`);
  }





}

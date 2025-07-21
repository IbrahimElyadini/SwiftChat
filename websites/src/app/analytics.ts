import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Analytics {
  
  private baseUrl = 'http://127.0.0.1:5000/stats';

  constructor(private http: HttpClient) {}

  getMessagesPerHour(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/hourly`);
  }

  getMessagesPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/daily`);
  }

  getMessagesPerUser(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/per_user`);
  }

  getLoginsPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/logins/daily`);
  }

  getRegistrationsPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/registrations/daily`);
  }

  getProfileUpdatesPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile_updates/daily`);
  }

  getDeletionsPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/deletions/daily`);
  }

  getMessagesPerConversation(): Observable<any> {
    return this.http.get(`${this.baseUrl}/messages/per_conversation`);
  }

  getActiveUsersPerDay(): Observable<any> {
    return this.http.get(`${this.baseUrl}/active_users/daily`);
  }
}

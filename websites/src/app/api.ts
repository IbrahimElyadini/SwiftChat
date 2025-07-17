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

  getUserConversations(userId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/conversations/${userId}`);
  }

  getConversationMessages(conversationId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/conversations/${conversationId}/messages`);
  }

  sendMessage(conversationId: number, senderId: number, message: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/send_message`, {
      conversation_id: conversationId,
      sender_id: senderId,
      message: message
    });
  }

  startConversation(user1_id: number, user2_id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/start_conversation`, {
      user1_id,
      user2_id
    });
  }

  getAllProfiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/profile`);
  }

}

import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Websocket {
  private socket: Socket;
  private baseUrl = 'http://127.0.0.1:5000';
  private userId: string | null = null;

  constructor() {
    this.socket = io(this.baseUrl);

    // Re-emit identify on reconnect
    this.socket.on('connect', () => {
      if (this.userId) {
        this.identify(this.userId);
      }
    });
  }

  identify(userId: string) {
    this.userId = userId;
    this.socket.emit('identify', { user_id: userId });
  }

  onIdentifyResponse(): Observable<{ status: string; user_id?: string; reason?: string }> {
    return new Observable((subscriber) => {
      this.socket.on('identify_response', (data) => subscriber.next(data));
    });
  }

  sendMessage(senderId: string, recipientId: string, content: string) {
    this.socket.emit('send_message', {
      sender_id: senderId,
      recipient_id: recipientId,
      content
    });
  }
  
  notifyNewConversation(userId: string, conversationId: string ) {
    this.socket.emit('create_conversation', {
      user_id: userId,
      conversation_id: conversationId,
    });
  }

  onReceiveMessage(): Observable<{ sender_id: string; content: string }> {
    return new Observable((subscriber) => {
      this.socket.on('receive_message', (data) => subscriber.next(data));
    });
  }

  onNewConversation(): Observable<{ conversation_id: string; conversation_name: string }> {
    return new Observable((subscriber) => {
      this.socket.on('new_conversation', (data) => subscriber.next(data));
    });
  }

  onDeliveryFailed(): Observable<{ recipient_id: string; reason: string }> {
    return new Observable((subscriber) => {
      this.socket.on('delivery_failed', (data) => subscriber.next(data));
    });
  }

  disconnect() {
    this.socket.disconnect();
  }

  reconnect() {
    this.socket.connect();
  }
}

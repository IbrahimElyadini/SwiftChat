import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Api } from '../api';
import { ProfileInterface } from '../profileInterface';
import { Conversation } from '../conversation';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit {
  conversations: Conversation[] = [];
  users: ProfileInterface[] = [];
  selectedConversation: Conversation | null = null;
  selectedMessages: Array<{ sender_id: number; message: string; sent_at: string }> = [];

  showPopup = false;
  popupUser: ProfileInterface | null = null;

  currentUserId!: number;

  newMessageText: string = '';

  private platformId = inject(PLATFORM_ID);

  constructor(private api: Api, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('userId');
      if (storedId) {
        this.currentUserId = Number(storedId);
        this.loadUsers();
        this.loadConversations();
      } else {
        console.error('No userId in sessionStorage.');
        window.location.href = '/auth';
      }
    }
  }

  loadUsers() {
    this.api.getAllProfiles().subscribe((users: ProfileInterface[]) => {
      this.users = users.filter((u: ProfileInterface) => u.id !== this.currentUserId);
      this.cdr.detectChanges();
    });
  }

  loadConversations() {
    this.api.getUserConversations(this.currentUserId).subscribe((convos: Conversation[]) => {
      this.conversations = convos.map((c: Conversation) => ({
        conversation_id: c.conversation_id,
        title: c.title,
      }));
      this.cdr.detectChanges();
    });
  }

  selectConversation(convo: Conversation) {
    this.selectedConversation = convo;
    this.api.getConversationMessages(convo.conversation_id).subscribe(messages => {
      this.selectedMessages = messages;
      this.cdr.detectChanges();
    });
  }

  startConversation(user: ProfileInterface) {
    this.popupUser = user;
    this.showPopup = true;
    this.cdr.detectChanges();
  }

  sendMessage() {
    if (!this.selectedConversation || !this.newMessageText.trim()) return;

    this.api
      .sendMessage(this.selectedConversation.conversation_id, this.currentUserId, this.newMessageText)
      .subscribe(response => {
        this.selectedMessages.push({
          sender_id: this.currentUserId,
          message: this.newMessageText,
          sent_at: new Date().toISOString(),
        });
        this.newMessageText = '';
        this.cdr.detectChanges();
      });
  }

  confirmStart() {
    if (!this.popupUser) return;

    this.api.startConversation(this.currentUserId, this.popupUser.id).subscribe(response => {
      const newConvo: Conversation = {
        conversation_id: response.conversation_id,
        title: response.name,
      };
      this.conversations.push(newConvo);
      this.selectConversation(newConvo);
      this.showPopup = false;
      this.popupUser = null;
      this.cdr.detectChanges();
    });
  }

  cancelPopup() {
    this.popupUser = null;
    this.showPopup = false;
    this.cdr.detectChanges();
  }
}

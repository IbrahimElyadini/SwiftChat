import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Api } from '../api';
import { ProfileInterface } from '../profileInterface';
import { Conversation } from '../conversation';
import { FormsModule } from '@angular/forms';
import { Websocket } from '../websocket';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css'],
})
export class Chat implements OnInit, OnDestroy {
  conversations: Conversation[] = [];
  users: ProfileInterface[] = [];
  selectedConversation: Conversation | null = null;
  selectedMessages: Array<{ sender_id: number; message: string; sent_at: string }> = [];

  showPopup = false;
  popupUser: ProfileInterface | null = null;

  currentUserId!: number;
  newMessageText: string = '';

  private platformId = inject(PLATFORM_ID);

  constructor(private api: Api, private cdr: ChangeDetectorRef, private ws: Websocket) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('userId');
      if (storedId) {
        this.currentUserId = Number(storedId);

        //websocket setup
        this.ws.identify(this.currentUserId.toString());
        this.ws.onIdentifyResponse().subscribe(res => {
          if (res.status !== 'ok') {
            console.error('WebSocket identify failed:', res.reason);
          }
        });

        this.ws.onReceiveMessage().subscribe(data => {
          if (this.selectedConversation && data.sender_id.toString() === this.selectedConversation.other_user?.user_id.toString()) {
            this.selectedMessages.push({
              sender_id: Number(data.sender_id),
              message: data.content,
              sent_at: new Date().toISOString()
            });
            this.cdr.detectChanges();
          }
        });

        this.ws.onNewConversation().subscribe(data => {
          this.loadConversations(); // refresh the conversation list
        });

        this.loadUsers();
        this.loadConversations();

      } else {
        console.error('No userId in sessionStorage.');
        window.location.href = '/auth';
      }
    }
  }

  ngOnDestroy() {
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
        name: c.name,
        created_at: c.created_at || new Date().toISOString(),
        other_user: {
          user_id: c.other_user?.user_id ?? -1,
          name: c.other_user?.name ?? 'Unknown',
          avatar: c.other_user?.avatar || '0',
        },
      }));
      this.cdr.detectChanges();
    });
  }

  loadMessages(conversationId: number) {
    this.api.getConversationMessages(conversationId).subscribe(messages => {
      this.selectedMessages = messages;
      this.cdr.detectChanges();
    });
  }

  getUserName(userId: number): string {
    if (userId === this.currentUserId) return 'You';
    const user = this.users.find(u => u.id === userId);
    return user ? user.username : 'Unknown';
  }

  selectConversation(convo: Conversation) {
    this.selectedConversation = convo;
    this.loadMessages(convo.conversation_id);
  }

  startConversation(user: ProfileInterface) {
    const existing = this.conversations.find(c => c.other_user?.user_id === user.id);
    if (existing) {
      this.selectConversation(existing);
    } else {
      this.popupUser = user;
      this.showPopup = true;
      this.cdr.detectChanges();
    }
  }

  sendMessage() {
    if (!this.selectedConversation || !this.newMessageText.trim()) return;

    this.api
      .sendMessage(this.selectedConversation.conversation_id, this.currentUserId, this.newMessageText)
      .subscribe(() => {
          this.ws.sendMessage(
            this.currentUserId.toString(),
            String(this.selectedConversation!.other_user?.user_id),
            this.newMessageText
        );
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
        name: response.name,
        created_at: new Date().toISOString(),
        other_user: {
          user_id: this.popupUser!.id,
          name: this.popupUser!.username,
          avatar: String(this.popupUser!.avatar) || '0',
        }
      };

      this.ws.notifyNewConversation(this.popupUser!.id.toString(), response.conversation_id.toString());

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

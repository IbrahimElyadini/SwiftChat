import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProfileInterface } from '../profileInterface.js';
import { Api } from '../api.js';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  profile: ProfileInterface = {
    avatar: 0,
    bio: '',
    email: '',
    id: 0,
    username: ''
  };

  errorMessage: string = '';

  bioEditing = false;
  avatarPopupOpen = false;

  availableAvatars = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 , 11, 12, 13, 14, 15, 16, 17, 18, 19, 20 ];

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef // 🔄 Change Detection hook
  ) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
      if (userId) {
        this.api.getProfile(userId).subscribe({
          next: (response) => {
            this.profile.avatar = response.avatar ?? 0;
            this.profile.bio = response.bio ?? '';
            this.profile.email = response.email ?? '';
            this.profile.id = response.id ?? 0;
            this.profile.username = response.username ?? '';
            console.log('Profile loaded successfully:', this.profile);

            while (this.cdr == undefined) { // Wait for ChangeDetectorRef to be defined
            }
            this.updateView();
          },
          error: (error) => {
            this.errorMessage = 'Failed to load profile. Please try again later.';
            console.error('Error loading profile:', error);
          }
        });
      }
    } else {
      this.errorMessage = 'Cannot access session storage (not running in browser)';
    }
  }

  updateProfile() {
    this.api.updateProfile(this.profile).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.errorMessage = 'Profile updated successfully.';
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile.';
        console.error('Update error:', error);
      }
    });
    this.updateView();
  }

  deleteProfile() {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    this.api.deleteProfile(this.profile.id).subscribe({
      next: () => {
        console.log('Profile deleted.');
        sessionStorage.clear();
        this.errorMessage = 'Profile deleted. You have been logged out.';
        this.profile = { avatar: 0, bio: '', email: '', id: 0, username: '' };
        setTimeout(() => {
          this.router.navigate(['/auth']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete profile.';
        console.error('Delete error:', error);
      }
    });
  }

  changeAvatar(delta: number) {
    const newValue = (this.profile.avatar || 0) + delta;
    this.profile.avatar = newValue >= 0 ? newValue : 0;
  }

  openAvatarPopup() {
    this.avatarPopupOpen = true;
  }

  closeAvatarPopup() {
    this.avatarPopupOpen = false;
  }

  selectAvatar(avatarId: number) {
    this.profile.avatar = avatarId;
    this.closeAvatarPopup();
  }

  updateView() {
    console.log('is cdr defined:', this.cdr);
    if(!this.cdr) return;
    this.cdr.detectChanges();
  }
}

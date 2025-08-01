import { Component, OnInit, ChangeDetectorRef, inject, PLATFORM_ID } from '@angular/core';
import { ProfileInterface } from '../profileInterface.js';
import { Api } from '../api.js';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth-service.js';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  private platformId = inject(PLATFORM_ID);

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

  resetPasswordMode = false;
  newPassword: string = '';

  constructor(
    private api: Api,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.authService.isLoggedIn) {
        this.router.navigate(['/auth']);
        return;
      }

      const userId = parseInt(sessionStorage.getItem('userId') || '0', 10);
      if (userId) {
        this.api.getProfile(userId).subscribe({
          next: (response) => {
            this.profile = {
              avatar: response.avatar ?? 0,
              bio: response.bio ?? '',
              email: response.email ?? '',
              id: response.id ?? 0,
              username: response.username ?? ''
            };
            this.updateView();
          },
          error: (error) => {
            this.errorMessage = 'Failed to load profile. Please try again later.';
            this.updateView();
            console.error('Error loading profile:', error);
          }
        });
      } else {
        this.errorMessage = 'User ID not found.';
        this.updateView();
      }
    } else {
      this.errorMessage = 'Not running in a browser environment.';
      this.updateView();
    }
  }


  updateProfile() {
    this.api.updateProfile(this.profile).subscribe({
      next: (response) => {
        console.log('Profile updated:', response);
        this.errorMessage = 'Profile updated successfully.';
        this.updateView();
      },
      error: (error) => {
        this.errorMessage = 'Failed to update profile.';
        this.updateView();
        console.error('Update error:', error);
      }
    });
    this.updateView();
  }

  deleteProfile() {
    if (!confirm('Are you sure you want to delete this profile?')) return;

    this.api.deleteProfile(this.profile.id).subscribe({
      next: () => {
        this.authService.setLoggedIn(false);
        sessionStorage.clear();
        this.errorMessage = 'Profile deleted. You have been logged out.';
        this.profile = { avatar: 0, bio: '', email: '', id: 0, username: '' };
        this.updateView();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1500);
      },
      error: (error) => {
        this.errorMessage = 'Failed to delete profile.';
        this.updateView();
        console.error('Delete error:', error);
      }
    });
  }

  resetPassword() {
  if (!this.newPassword || this.newPassword.length < 5) {
    this.errorMessage = 'Password must be at least 5 characters.';
    this.updateView();
    return;
  }

  this.api.resetPassword(this.profile.id, this.newPassword).subscribe({
    next: (response) => {
      this.errorMessage = 'Password reset successfully.';
      this.newPassword = '';
      this.resetPasswordMode = false;
      this.updateView();
    },
    error: (error) => {
      this.errorMessage = 'Failed to reset password.';
      console.error('Password reset error:', error);
      this.updateView();
    }
  });
}
  logout() {
    this.authService.setLoggedIn(false);
    sessionStorage.clear();
    this.errorMessage = 'You have been logged out.';
    this.updateView();
    setTimeout(() => {
        this.router.navigate(['/']);
    }, 1500);
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
    if(!this.cdr) return;
    this.cdr.detectChanges();
  }
}

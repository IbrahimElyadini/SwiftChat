import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {

  isLoggedIn = false;
  darkMode = false;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    }
  }

 toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', this.darkMode);
    }
  }

  redirect() {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/auth']);
  }

}

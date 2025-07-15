import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit {

  isLoggedIn = false;
  darkMode = false;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);

  constructor() {
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';

      // Simulate mouse events to trigger any hover effects which help with UI updates
      setTimeout(() => {
        const bioElem = document.querySelector('.lightning-icon');
        if( bioElem) {
          bioElem.classList.add('hovered');
          setTimeout(() => {
            bioElem.classList.remove('hovered');
          }, 300);
        }
      }, 100);
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

  gotoHome() {
    this.router.navigate(['/']);
  }

}

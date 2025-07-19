import { Component, inject, OnInit, PLATFORM_ID, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header implements OnInit, OnDestroy {

  isLoggedIn = false;
  darkMode = false;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private authService = inject(AuthService);
  private loginSub?: Subscription;


  constructor() {
  }
  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loginSub = this.authService.loggedIn$.subscribe(value => {
        this.isLoggedIn = value;
      });
      const storedMode = localStorage.getItem('darkMode');
      this.darkMode = (storedMode === 'true');
      document.body.classList.toggle('dark-mode', this.darkMode);

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

  ngOnDestroy(): void {
    this.loginSub?.unsubscribe();
  }

 toggleDarkMode() {
    this.darkMode = !this.darkMode;
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-mode', this.darkMode);
      localStorage.setItem('darkMode', String(this.darkMode));
    }
  }

  redirect() {
    this.router.navigate([this.isLoggedIn ? '/profile' : '/auth']);
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

}

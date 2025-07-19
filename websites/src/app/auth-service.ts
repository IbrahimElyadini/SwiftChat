import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private loggedInSubject = new BehaviorSubject<boolean>(
    isPlatformBrowser(this.platformId) && sessionStorage.getItem('loggedIn') === 'true'
  );

  loggedIn$ = this.loggedInSubject.asObservable();

  setLoggedIn(value: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem('loggedIn', String(value));
    }
    this.loggedInSubject.next(value);
  }

  get isLoggedIn(): boolean {
    return this.loggedInSubject.value;
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})
export class HomePage implements OnInit {
  isLoggedIn = false;
  private router = inject(Router);

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    }
  }

  goToChat() {
    this.router.navigate(['/chat']);
  }
  goToAuth() {
    this.router.navigate(['/auth']);
  }
}

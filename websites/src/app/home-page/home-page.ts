import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css'
})
export class HomePage implements OnInit {
  isLoggedIn : boolean = false;

  ngOnInit() {
    if (typeof window !== 'undefined' && window.sessionStorage) {
      this.isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    } else {
      this.isLoggedIn = false;
    }

    if (this.isLoggedIn) {
      console.log('User is logged in');
    } else {
      console.log('User is not logged in');
    }
  }  

}

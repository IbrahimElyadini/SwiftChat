import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  
  private platformId = inject(PLATFORM_ID);


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const storedId = sessionStorage.getItem('userId');
      if (storedId === 'admin') {
        console.log('Admin dashboard initialized');
        this.loadAdminData();
      } else {
        console.error('User is not an admin.');
        window.location.href = '/';
      }
    }


  }



  loadAdminData() {
    // Logic to load admin-specific data
    console.log('Loading admin data...');
  }

}

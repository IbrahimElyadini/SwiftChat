import { Component } from '@angular/core';
import { FormsModule, NgForm  } from '@angular/forms';
import { Api } from '../api';
import { UserInfo } from '../user-info';
import { CommonModule } from '@angular/common';
import { UserCredential } from '../user-credential';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './register-login.html',
  styleUrls: ['./register-login.css']
})
export class RegisterLogin {
  username: string = '';
  password: string = '';
  email: string = '';
  errorMessage: string = '';
  mode: 'register' | 'login' = 'register';
  timeout: number = 2200; // Timeout for form reset

  constructor(private api: Api, private router: Router) {}

  toggleMode() {
    this.errorMessage = '';
    this.mode = this.mode === 'register' ? 'login' : 'register';
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      console.error('Form is invalid:', this.errorMessage);
      return;
    }

    this.errorMessage = '';

    if (this.mode === 'register') {
      this.register();
    } else {
      this.login();
    }
    setTimeout(() => {
      form.resetForm();
      this.username = '';
      this.password = '';
      this.email = '';  
    }, this.timeout);

  }

  login() {
    const credentials: UserCredential = {
      username: this.username,
      password: this.password
    };

    this.api.login(credentials).subscribe({
      next: (response) => {
        sessionStorage.setItem('username', credentials.username);
        sessionStorage.setItem('password', credentials.password);
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userId', response.user_id.toString());
        console.log('User logged in successfully:', response);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, this.timeout);
      },
      error: (error) => {
        if (error.status === 401) {
          this.errorMessage = 'Invalid credentials';
        } else if (error.status === 404) {
          this.errorMessage = 'User not found';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error';
        } else {
          this.errorMessage = 'Unexpected error occurred';
        }
        console.error(this.errorMessage, error);
      }
    });
  }

  register() {
    const user: UserInfo = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    this.api.register(user).subscribe({
      next: (response) => {
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('password', user.password);
        sessionStorage.setItem('loggedIn', 'true');
        sessionStorage.setItem('userId', response.user_id.toString());
        console.log("User registered successfully: ", response);

        setTimeout(() => {
          this.router.navigate(['/']);
        }, this.timeout);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Bad request: ' + error.error.message;
        } else if (error.status === 409) {
          this.errorMessage = 'User already exists';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error';
        } else {
          this.errorMessage = 'Unexpected error occurred';
        }
        console.log("setting error:", this.errorMessage);
      }
    });
  }
}

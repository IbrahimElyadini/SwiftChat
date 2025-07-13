import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Api } from '../api';
import { UserInfo } from '../user-info';
import { CommonModule } from '@angular/common';
import { UserCredential } from '../user-credential';

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

  constructor(private api: Api) {}

  toggleMode() {
    this.errorMessage = '';
    this.mode = this.mode === 'register' ? 'login' : 'register';
  }

  login() {
    this.errorMessage = '';

    const credentials: UserCredential = {
      username: this.username,
      password: this.password
    };

    this.api.login(credentials).subscribe({
      next: (response) => {
        console.log('User logged in successfully:', response);
        sessionStorage.setItem('username', credentials.username);
        sessionStorage.setItem('password', credentials.password);
        sessionStorage.setItem('loggedIn', 'true');
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
    this.errorMessage = '';

    const user : UserInfo = {
      username: this.username,
      password: this.password,
      email: this.email
    };

    this.api.register(user).subscribe({
      next: (response) => {
        sessionStorage.setItem('username', user.username);
        sessionStorage.setItem('password', user.password);
        sessionStorage.setItem('loggedIn', 'true');
        console.log(response.message);
      },
      error: (error) => {
        if (error.status === 400) {
          this.errorMessage = 'Bad request: ' + error.error.message;
        } else if( error.status === 409) {
          this.errorMessage = 'User already exists';
        } else if (error.status === 500) {
          this.errorMessage = 'Server error';
        } else {
          this.errorMessage = 'Unexpected error occurred';
        }
        console.log("setting error:", this.errorMessage)
      }
    });
  }
}

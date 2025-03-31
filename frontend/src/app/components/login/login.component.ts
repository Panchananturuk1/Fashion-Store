import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = ''; // Clear any previous errors
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Store token in localStorage
        localStorage.setItem('token', response.token);
        // Store user data
        localStorage.setItem('currentUser', JSON.stringify(response));
        // Update the behavior subject
        this.authService['currentUserSubject'].next(response);
        // Navigate to home
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid username or password';
        }
      }
    });
  }
} 
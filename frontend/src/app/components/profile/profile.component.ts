import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule]
})
export class ProfileComponent implements OnInit {
  profileForm!: FormGroup;
  user: any = null;
  successMessage = '';
  errorMessage = '';
  loading = true;
  submitting = false;
  debugResult: any = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('Profile component initialized');
    // Initialize form
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.pattern(/^\d{10}$/)],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        zipCode: ['', [Validators.required, Validators.pattern(/^\d{5}(-\d{4})?$/)]]
      })
    });

    // Get user data
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.loading = true;
    console.log('Loading user profile...');
    // Check if token exists
    if (!localStorage.getItem('token')) {
      console.error('No auth token found');
      this.errorMessage = 'You must be logged in to view your profile';
      this.loading = false;
      return;
    }
    
    this.authService.getUserProfile().subscribe({
      next: (userData) => {
        console.log('User profile loaded:', userData);
        this.user = userData;
        
        // Map backend data to form fields
        this.profileForm.patchValue({
          name: userData.name,
          email: userData.email,
          phone: userData.phone || '',
          address: {
            street: userData.street || '',
            city: userData.city || '',
            state: userData.state || '',
            zipCode: userData.zip_code || ''
          }
        });
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.errorMessage = 'Failed to load profile. Please try again.';
        this.loading = false;
        
        // Fallback to localStorage data if available
        const storedUser = this.authService.currentUserValue;
        if (storedUser) {
          console.log('Using stored user data:', storedUser);
          this.user = storedUser;
          this.profileForm.patchValue({
            name: storedUser.name || '',
            email: storedUser.email || '',
            phone: storedUser.phone || '',
            address: {
              street: storedUser.street || '',
              city: storedUser.city || '',
              state: storedUser.state || '',
              zipCode: storedUser.zip_code || ''
            }
          });
        }
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid || this.submitting) {
      return;
    }

    this.submitting = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    // Extract form values and map to backend field names
    const formValues = this.profileForm.value;
    const profileData = {
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone,
      street: formValues.address.street,
      city: formValues.address.city,
      state: formValues.address.state,
      zip_code: formValues.address.zipCode
    };
    
    console.log('Submitting profile data:', profileData);
    
    this.authService.updateProfile(profileData).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.successMessage = 'Profile updated successfully!';
        this.user = response; // Update local user object with response
        this.submitting = false;
        
        // Clear success message after a delay
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Update profile error:', error);
        
        if (error.status === 401) {
          this.errorMessage = 'Authorization error. Please log in again.';
        } else if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Failed to update profile. Please try again.';
        }
        
        this.submitting = false;
      }
    });
  }

  // Debug method to check token validity
  checkToken(): void {
    this.loading = true;
    this.errorMessage = '';
    this.debugResult = null;
    
    const token = localStorage.getItem('token');
    console.log('Current token:', token);
    
    this.http.get(`${environment.apiUrl}/auth/debug`).subscribe({
      next: (response) => {
        console.log('Debug response:', response);
        this.debugResult = response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Debug error:', error);
        this.errorMessage = 'Token validation failed. Please try logging in again.';
        this.loading = false;
      }
    });
  }

  // Test API access with the test endpoint
  testApiAccess(): void {
    this.loading = true;
    this.errorMessage = '';
    this.debugResult = null;
    
    // Test the auth/test endpoint which doesn't require authentication
    this.http.get(`${environment.apiUrl}/auth/test`).subscribe({
      next: (response) => {
        console.log('API test response:', response);
        this.debugResult = {
          success: true,
          endpoint: `${environment.apiUrl}/auth/test`,
          response: response
        };
        this.loading = false;
      },
      error: (error) => {
        console.error('API test error:', error);
        this.errorMessage = 'API test failed. Server might be unavailable.';
        this.debugResult = {
          success: false,
          endpoint: `${environment.apiUrl}/auth/test`,
          error: {
            status: error.status,
            message: error.message,
            statusText: error.statusText
          }
        };
        this.loading = false;
      }
    });
  }
} 
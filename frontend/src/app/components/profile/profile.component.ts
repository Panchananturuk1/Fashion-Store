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

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Initialize the form
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]{7,20}$/)]],
      address: this.fb.group({
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['', [Validators.pattern(/^\d{5}(-\d{4})?$/)]]
      })
    });
    
    // Load user profile data
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
} 
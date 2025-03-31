import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface ProfileData {
  name?: string;
  email?: string;
  phone?: string;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
    this.apiUrl = `${environment.apiUrl}/auth`;
    console.log('Auth Service initialized with API URL:', this.apiUrl);
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(loginData: LoginData): Observable<any> {
    console.log('Login request to:', `${this.apiUrl}/login`);
    return this.http.post(`${this.apiUrl}/login`, loginData);
  }

  register(registerData: RegisterData): Observable<any> {
    console.log('Register request to:', `${this.apiUrl}/register`);
    return this.http.post(`${this.apiUrl}/register`, registerData);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserProfile(): Observable<any> {
    console.log('Get profile request to:', `${this.apiUrl}/profile`);
    return this.http.get(`${this.apiUrl}/profile`);
  }

  updateProfile(profileData: ProfileData): Observable<any> {
    console.log('Update profile request to:', `${this.apiUrl}/profile`);
    console.log('With data:', profileData);
    
    // Explicitly add the authentication header as a backup
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    
    return this.http.put(`${this.apiUrl}/profile`, profileData, { headers })
      .pipe(
        tap(updatedUser => {
          console.log('Profile updated successfully:', updatedUser);
          // Update stored user data with new profile info
          const currentUser = this.currentUserValue;
          if (currentUser) {
            const updatedUserData = { ...currentUser, ...updatedUser };
            localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
            this.currentUserSubject.next(updatedUserData);
          }
        })
      );
  }
  
  // New method to test if API is reachable
  testApi(): Observable<any> {
    return this.http.get(`${environment.apiUrl}`);
  }
} 
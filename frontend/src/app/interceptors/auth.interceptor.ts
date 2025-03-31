import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Get the auth token from localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      console.log('Adding auth token to request:', request.url);
      
      // Clone the request and add the authorization header
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      
      return next.handle(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Request failed:', error);
          
          if (error.status === 401) {
            console.error('Authentication error - token may be invalid');
            // You could redirect to login or clear token here
          }
          
          return throwError(() => error);
        }),
        finalize(() => {
          console.log('Request completed:', request.url);
        })
      );
    }
    
    // If no token, proceed with the original request
    console.log('No auth token available for request:', request.url);
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Request failed (no auth):', error);
        return throwError(() => error);
      }),
      finalize(() => {
        console.log('Request completed (no auth):', request.url);
      })
    );
  }
} 
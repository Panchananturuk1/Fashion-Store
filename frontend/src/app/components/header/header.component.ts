import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule]
})
export class HeaderComponent implements OnInit {
  cartItemCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Subscribe to cart changes to update the cart item count
    this.cartService.getCartItemsCount().subscribe(count => {
      this.cartItemCount = count;
    });
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authService.logout();
    window.location.href = '/'; // Redirect to home page after logout
  }
} 
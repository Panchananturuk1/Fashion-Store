import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    // Subscribe to cart items
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.calculateTotal();
    });

    // Get total price
    this.cartService.getTotalPrice().subscribe(total => {
      this.total = total;
    });
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  }

  updateQuantity(index: number, change: number): void {
    const newQuantity = Math.max(1, this.cartItems[index].quantity + change);
    this.cartService.updateQuantity(index, newQuantity);
  }

  removeItem(index: number): void {
    this.cartService.removeFromCart(index);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  checkout(): void {
    if (!this.authService.isLoggedIn()) {
      // If user is not logged in, redirect to login page
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/checkout' } });
    } else {
      // If user is logged in, proceed to checkout
      this.router.navigate(['/checkout']);
    }
  }
} 
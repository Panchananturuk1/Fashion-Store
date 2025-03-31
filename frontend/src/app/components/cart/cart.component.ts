import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';

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
    private router: Router
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
    // Placeholder for checkout functionality
    alert('Checkout functionality will be implemented in the future!');
    // For now, just clear the cart
    this.cartService.clearCart();
    this.router.navigate(['/']);
  }
} 
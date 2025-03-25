import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: any[] = [];
  total: number = 0;

  constructor() { }

  ngOnInit(): void {
    // TODO: Implement cart functionality
    this.cartItems = [];
    this.calculateTotal();
  }

  calculateTotal(): void {
    this.total = this.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  updateQuantity(item: any, change: number): void {
    item.quantity = Math.max(1, item.quantity + change);
    this.calculateTotal();
  }

  removeItem(item: any): void {
    const index = this.cartItems.indexOf(item);
    if (index > -1) {
      this.cartItems.splice(index, 1);
      this.calculateTotal();
    }
  }
} 
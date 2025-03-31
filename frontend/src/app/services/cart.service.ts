import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  size: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: CartItem[] = [];
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  
  constructor() {
    // Load cart from localStorage on service initialization
    this.loadCart();
  }

  // Get all items in cart as observable
  getCartItems(): Observable<CartItem[]> {
    return this.cartItemsSubject.asObservable();
  }

  // Get cart items count
  getCartItemsCount(): Observable<number> {
    return new Observable(observer => {
      this.getCartItems().subscribe(items => {
        const count = items.reduce((total, item) => total + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  // Add item to cart
  addToCart(item: CartItem): void {
    // Check if item already exists in cart (same product, size and color)
    const existingItemIndex = this.cartItems.findIndex(
      i => i.product.id === item.product.id && 
           i.size === item.size && 
           i.color === item.color
    );

    if (existingItemIndex !== -1) {
      // If item exists, update quantity
      this.cartItems[existingItemIndex].quantity += item.quantity;
    } else {
      // Otherwise add as new item
      this.cartItems.push(item);
    }

    // Update cart subject and save to localStorage
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCart();
  }

  // Remove item from cart
  removeFromCart(index: number): void {
    this.cartItems.splice(index, 1);
    this.cartItemsSubject.next([...this.cartItems]);
    this.saveCart();
  }

  // Update item quantity
  updateQuantity(index: number, quantity: number): void {
    if (quantity > 0) {
      this.cartItems[index].quantity = quantity;
      this.cartItemsSubject.next([...this.cartItems]);
      this.saveCart();
    }
  }

  // Clear cart
  clearCart(): void {
    this.cartItems = [];
    this.cartItemsSubject.next([]);
    localStorage.removeItem('cart');
  }

  // Calculate total price
  getTotalPrice(): Observable<number> {
    return new Observable(observer => {
      this.getCartItems().subscribe(items => {
        const total = items.reduce(
          (sum, item) => sum + (item.product.price * item.quantity), 0
        );
        observer.next(total);
      });
    });
  }

  // Save cart to localStorage
  private saveCart(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
  }

  // Load cart from localStorage
  private loadCart(): void {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      this.cartItems = JSON.parse(cartData);
      this.cartItemsSubject.next([...this.cartItems]);
    }
  }
} 
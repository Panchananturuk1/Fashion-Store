import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
// @ts-ignore
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

interface OrderData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  paymentMethod: string;
  items: any[];
  total: number;
  paymentDetails?: {
    cardNumber?: string;
    cardExpiry?: string;
    cardCvv?: string;
    upiId?: string;
  };
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutForm: FormGroup;
  cartItems: any[] = [];
  total: number = 0;
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.checkoutForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
      paymentMethod: ['card', [Validators.required]],
      cardNumber: [''],
      cardExpiry: [''],
      cardCvv: [''],
      upiId: ['']
    });

    // Add conditional validators based on payment method
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardNumber = this.checkoutForm.get('cardNumber');
      const cardExpiry = this.checkoutForm.get('cardExpiry');
      const cardCvv = this.checkoutForm.get('cardCvv');
      const upiId = this.checkoutForm.get('upiId');

      // Reset validators first
      cardNumber?.clearValidators();
      cardExpiry?.clearValidators();
      cardCvv?.clearValidators();
      upiId?.clearValidators();

      // Set validators based on payment method
      if (method === 'card') {
        cardNumber?.setValidators([Validators.required]);
        cardExpiry?.setValidators([Validators.required]);
        cardCvv?.setValidators([Validators.required]);
      } else if (method === 'upi') {
        upiId?.setValidators([Validators.required]);
      }

      // Update form validation
      cardNumber?.updateValueAndValidity();
      cardExpiry?.updateValueAndValidity();
      cardCvv?.updateValueAndValidity();
      upiId?.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    // Get cart items and total
    this.cartService.getCartItems().subscribe(items => {
      this.cartItems = items;
      this.total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    });

    // Pre-fill user data if logged in
    if (this.authService.isLoggedIn()) {
      this.authService.currentUser.subscribe(user => {
        if (user) {
          this.checkoutForm.patchValue({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone
          });
        }
      });
    }
  }

  onSubmit(): void {
    if (this.checkoutForm.valid) {
      this.loading = true;
      this.error = null;

      // Transform form data to match backend expectations
      const orderData: OrderData = {
        firstName: this.checkoutForm.value.firstName,
        lastName: this.checkoutForm.value.lastName,
        email: this.checkoutForm.value.email,
        phone: this.checkoutForm.value.phone,
        address: this.checkoutForm.value.address,
        city: this.checkoutForm.value.city,
        state: this.checkoutForm.value.state,
        zipCode: this.checkoutForm.value.zipCode,
        paymentMethod: this.checkoutForm.value.paymentMethod,
        items: this.cartItems,
        total: this.total,
        paymentDetails: {}
      };

      // Add payment specific data based on payment method
      if (orderData.paymentMethod === 'card') {
        orderData.paymentDetails = {
          cardNumber: this.checkoutForm.value.cardNumber,
          cardExpiry: this.checkoutForm.value.cardExpiry,
          cardCvv: this.checkoutForm.value.cardCvv
        };
      } else if (orderData.paymentMethod === 'upi') {
        orderData.paymentDetails = {
          upiId: this.checkoutForm.value.upiId
        };
      }

      this.orderService.createOrder(orderData).subscribe({
        next: (response: Order) => {
          // Clear cart and redirect to order confirmation
          this.cartService.clearCart();
          this.router.navigate(['/orders', response.id]);
        },
        error: (error: any) => {
          this.error = error.message || 'An error occurred while processing your order.';
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/cart']);
  }
} 
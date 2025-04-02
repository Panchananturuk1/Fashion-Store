import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class OrderConfirmationComponent implements OnInit {
  orderId: string = '';
  order: Order | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Get the order ID from the route parameters
    this.route.params.subscribe(params => {
      this.orderId = params['id'];
      this.loadOrder();
    });
  }

  loadOrder(): void {
    if (!this.orderId) {
      this.error = 'Order ID not found';
      this.loading = false;
      return;
    }

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.loading = false;
      },
      error: (error: any) => {
        this.error = error.message || 'An error occurred while loading the order.';
        this.loading = false;
      }
    });
  }

  continueShopping(): void {
    this.router.navigate(['/']);
  }

  viewOrders(): void {
    this.router.navigate(['/orders']);
  }
} 
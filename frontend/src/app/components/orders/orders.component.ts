import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Order {
  id: string;
  date: string;
  status: string;
  total: number;
  items: {
    productId: number;
    name: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    imageUrl: string;
  }[];
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  loading = true;
  selectedOrder: Order | null = null;

  constructor() {}

  ngOnInit(): void {
    // In a real app, fetch orders from a service
    this.loading = true;
    
    // For demo purposes, generate some mock orders
    setTimeout(() => {
      this.orders = this.getMockOrders();
      this.loading = false;
    }, 800);
  }

  viewOrderDetails(order: Order): void {
    this.selectedOrder = order;
  }

  closeOrderDetails(): void {
    this.selectedOrder = null;
  }

  // Mock data for demo purposes
  private getMockOrders(): Order[] {
    return [
      {
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        date: '2023-05-15',
        status: 'Delivered',
        total: 128.97,
        items: [
          {
            productId: 1,
            name: 'Classic Blue Jeans',
            price: 59.99,
            quantity: 1,
            size: 'M',
            color: 'Blue',
            imageUrl: 'assets/images/products/mens-jeans.jpg'
          },
          {
            productId: 2,
            name: 'Casual T-Shirt',
            price: 24.99,
            quantity: 2,
            size: 'L',
            color: 'Black',
            imageUrl: 'assets/images/products/mens-tshirt.jpg'
          },
          {
            productId: 3,
            name: 'Leather Belt',
            price: 19.00,
            quantity: 1,
            size: 'One Size',
            color: 'Brown',
            imageUrl: 'assets/images/products/belt.jpg'
          }
        ]
      },
      {
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        date: '2023-04-28',
        status: 'Delivered',
        total: 147.95,
        items: [
          {
            productId: 4,
            name: 'Summer Dress',
            price: 79.99,
            quantity: 1,
            size: 'S',
            color: 'Floral Print',
            imageUrl: 'assets/images/products/womens-dress.jpg'
          },
          {
            productId: 5,
            name: 'Casual Sneakers',
            price: 67.96,
            quantity: 1,
            size: '8',
            color: 'White',
            imageUrl: 'assets/images/products/sneakers.jpg'
          }
        ]
      },
      {
        id: 'ORD-' + Math.floor(Math.random() * 10000),
        date: '2023-06-05',
        status: 'Processing',
        total: 234.50,
        items: [
          {
            productId: 6,
            name: 'Slim Fit Suit',
            price: 199.50,
            quantity: 1,
            size: 'L',
            color: 'Navy',
            imageUrl: 'assets/images/products/suit.jpg'
          },
          {
            productId: 7,
            name: 'Dress Shirt',
            price: 35.00,
            quantity: 1,
            size: 'L',
            color: 'White',
            imageUrl: 'assets/images/products/dress-shirt.jpg'
          }
        ]
      }
    ];
  }
} 
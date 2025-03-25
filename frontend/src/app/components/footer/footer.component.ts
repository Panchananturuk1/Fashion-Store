import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>About Us</h3>
          <p>Your trusted destination for quality products and excellent service.</p>
        </div>
        <div class="footer-section">
          <h3>Quick Links</h3>
          <ul>
            <li><a routerLink="/">Home</a></li>
            <li><a routerLink="/products">Products</a></li>
            <li><a routerLink="/cart">Cart</a></li>
            <li><a routerLink="/login">Login</a></li>
            <li><a routerLink="/register">Register</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>Email: support@example.com</p>
          <p>Phone: (123) 456-7890</p>
          <p>Address: 123 Main St, City, Country</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Your E-commerce Store. All rights reserved.</p>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: #333;
      color: white;
      padding: 40px 0 20px;
      margin-top: auto;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 40px;
      padding: 0 20px;
    }

    .footer-section h3 {
      color: #fff;
      margin-bottom: 20px;
    }

    .footer-section ul {
      list-style: none;
      padding: 0;
    }

    .footer-section ul li {
      margin-bottom: 10px;
    }

    .footer-section a {
      color: #fff;
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-section a:hover {
      color: #007bff;
    }

    .footer-bottom {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #555;
    }
  `]
})
export class FooterComponent {} 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  selectedSize: string = '';
  selectedColor: string = '';
  quantity: number = 1;
  addedToCart = false;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.getProduct(parseInt(id, 10));
    });
  }

  getProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(id).subscribe({
      next: (product) => {
        this.product = product;
        this.loading = false;
        
        // Initialize color and size if available
        if (this.product && this.product.color && this.product.color.length > 0) {
          this.selectedColor = this.product.color[0];
        }
        
        if (this.product && this.product.size && this.product.size.length > 0) {
          this.selectedSize = this.product.size[0];
        }
      },
      error: (error) => {
        this.error = 'Error loading product details. Please try again later.';
        this.loading = false;
        console.error('Error loading product:', error);
      }
    });
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    if (!this.product || !this.selectedSize || !this.selectedColor) {
      return;
    }

    this.cartService.addToCart({
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity
    });

    // Show the added to cart confirmation
    this.addedToCart = true;
    
    // Reset the flag after a delay
    setTimeout(() => {
      this.addedToCart = false;
    }, 3000);
  }

  // Method to navigate to cart page
  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  getColorHex(colorName: string): string {
    // Map color names to hex codes
    const colorMap: { [key: string]: string } = {
      'White': '#FFFFFF',
      'Black': '#000000',
      'Blue': '#0d6efd',
      'Gray': '#6c757d',
      'Navy': '#000080',
      'Olive': '#808000',
      'Red': '#dc3545',
      'Cream': '#FFFDD0',
      'Burgundy': '#800020',
      'Beige': '#F5F5DC',
      'Floral Print': '#FF69B4',
      'Pastel Pink': '#FFD1DC'
    };
    
    return colorMap[colorName] || colorName;
  }
} 
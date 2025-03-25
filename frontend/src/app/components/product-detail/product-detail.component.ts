import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
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

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get the product ID from the route parameters
    this.route.params.subscribe(params => {
      const productId = parseInt(params['id'], 10);
      if (!isNaN(productId)) {
        this.loadProduct(productId);
      } else {
        this.error = 'Invalid product ID';
        this.loading = false;
      }
    });
  }

  loadProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProduct(id).subscribe({
      next: (response) => {
        this.product = response;
        this.loading = false;
        // Set default selections
        if (this.product.color.length > 0) {
          this.selectedColor = this.product.color[0];
        }
        if (this.product.size.length > 0) {
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

    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      product: this.product,
      size: this.selectedSize,
      color: this.selectedColor,
      quantity: this.quantity
    });
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
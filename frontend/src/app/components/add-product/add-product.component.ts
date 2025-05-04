import { Component, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.css']
})
export class AddProductComponent implements OnInit {
  product: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    category: 'men',
    subCategory: '',
    imageUrl: '',
    size: [],
    color: [],
    inStock: true,
    featured: false,
    rating: 0,
    numReviews: 0
  };

  categories = ['men', 'women'];
  subCategories: { [key: string]: string[] } = {
    men: ['shirts', 'pants', 'shoes', 'accessories'],
    women: ['dresses', 'tops', 'skirts', 'shoes', 'accessories']
  };

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is an admin, if not redirect to home
    const currentUser = this.authService.currentUserValue;
    if (!currentUser || !(currentUser.isAdmin || currentUser.role === 'admin')) {
      console.log('Unauthorized access to Add Product page. Redirecting to home.');
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    if (!this.product.size || !this.product.color) {
      return;
    }

    // Create a copy of the product data
    const productData = { ...this.product };

    // Ensure size and color are arrays
    if (typeof productData.size === 'string') {
      productData.size = (productData.size as string).split(',').map((s: string) => s.trim());
    }
    if (typeof productData.color === 'string') {
      productData.color = (productData.color as string).split(',').map((c: string) => c.trim());
    }

    this.productService.createProduct(productData).subscribe({
      next: (response: Product) => {
        console.log('Product created successfully:', response);
        this.router.navigate(['/products']);
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
      }
    });
  }
} 
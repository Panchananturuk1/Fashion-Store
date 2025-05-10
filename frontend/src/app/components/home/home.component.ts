import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule]
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  displayedProducts: Product[] = [];
  carouselIndex = 0;
  carouselSize = 4; // Number of products displayed in carousel
  mensCollectionImage: string | null = null;
  womensCollectionImage: string | null = null;
  newsletterEmail: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCollectionImages();
  }

  loadFeaturedProducts(): void {
    this.http.get<Product[]>(`${environment.apiUrl}/products?featured=true`)
      .subscribe({
        next: (response) => {
          // Add dummy attributes for demo purposes
          this.featuredProducts = response.map(product => {
            // Ensure price is a number for calculations
            const productPrice = typeof product.price === 'string' ? parseFloat(product.price) : product.price;
            
            return {
              ...product,
              price: productPrice, // Ensure price is always a number
              rating: Math.floor(Math.random() * 5) + 1,
              isNew: Math.random() > 0.7,
              sale: Math.random() > 0.8,
              originalPrice: Math.random() > 0.3 ? Number((productPrice * 1.2).toFixed(2)) : null
            };
          });
          
          // Initialize displayed products
          this.updateDisplayedProducts();
        },
        error: (error) => {
          console.error('Error loading featured products:', error);
          // Add fallback data for demo purposes
          this.featuredProducts = this.getFallbackProducts();
          this.updateDisplayedProducts();
        }
      });
  }

  getFallbackProducts(): Product[] {
    return [
      {
        id: 1,
        name: "Men's Blue T-Shirt",
        description: "Comfortable cotton t-shirt",
        price: 29.99,
        category: "men",
        imageUrl: "https://images.unsplash.com/photo-1527719327859-c6ce80353573",
        rating: 4,
        isNew: true,
        sale: false
      },
      {
        id: 2,
        name: "Women's Summer Dress",
        description: "Lightweight floral dress",
        price: 49.99,
        originalPrice: 59.99,
        category: "women",
        imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446",
        rating: 5,
        isNew: false,
        sale: true
      },
      {
        id: 3,
        name: "Men's Denim Jacket",
        description: "Classic denim jacket",
        price: 89.99,
        category: "men",
        imageUrl: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
        rating: 4,
        isNew: false,
        sale: false
      },
      {
        id: 4,
        name: "Women's Leather Bag",
        description: "Stylish leather handbag",
        price: 79.99,
        originalPrice: 99.99,
        category: "women",
        imageUrl: "https://images.unsplash.com/photo-1591561954557-26941169b49e",
        rating: 4,
        isNew: true,
        sale: true
      },
      {
        id: 5,
        name: "Men's Casual Shoes",
        description: "Comfortable everyday shoes",
        price: 69.99,
        category: "men",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772",
        rating: 3,
        isNew: false,
        sale: false
      },
      {
        id: 6,
        name: "Women's Sunglasses",
        description: "UV protection sunglasses",
        price: 39.99,
        category: "women",
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
        rating: 5,
        isNew: true,
        sale: false
      }
    ];
  }

  updateDisplayedProducts(): void {
    if (!this.featuredProducts.length) return;
    
    // Get products for current carousel position
    const startIndex = this.carouselIndex % this.featuredProducts.length;
    
    // Handle wrapping around the array
    this.displayedProducts = [];
    for (let i = 0; i < this.carouselSize; i++) {
      const index = (startIndex + i) % this.featuredProducts.length;
      this.displayedProducts.push(this.featuredProducts[index]);
    }
  }

  nextProduct(): void {
    this.carouselIndex++;
    this.updateDisplayedProducts();
  }

  prevProduct(): void {
    this.carouselIndex = Math.max(0, this.carouselIndex - 1);
    this.updateDisplayedProducts();
  }

  loadCollectionImages(): void {
    // Load collection images from the API
    this.http.get<Product[]>(`${environment.apiUrl}/products`)
      .subscribe({
        next: (products) => {
          // Find the first product with a collection image for each category
          const mensProduct = products.find(p => p.category === 'men' && p.collectionImage);
          const womensProduct = products.find(p => p.category === 'women' && p.collectionImage);
          
          if (mensProduct?.collectionImage) {
            this.mensCollectionImage = mensProduct.collectionImage;
          }
          if (womensProduct?.collectionImage) {
            this.womensCollectionImage = womensProduct.collectionImage;
          }
        },
        error: (error) => {
          console.error('Error loading collection images:', error);
        }
      });
  }

  addToCart(product: Product): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', product);
    alert(`Added ${product.name} to cart!`);
  }

  addToWishlist(product: Product): void {
    // TODO: Implement wishlist functionality
    console.log('Adding to wishlist:', product);
    alert(`Added ${product.name} to wishlist!`);
  }

  hoverCategory(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const img = target.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1.1)';
    }
  }

  leaveCategory(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const img = target.querySelector('img');
    if (img) {
      img.style.transform = 'scale(1)';
    }
  }

  subscribeNewsletter(): void {
    if (!this.newsletterEmail || !this.validateEmail(this.newsletterEmail)) {
      alert('Please enter a valid email address');
      return;
    }
    
    // TODO: Implement actual newsletter subscription
    console.log('Newsletter subscription:', this.newsletterEmail);
    alert(`Thank you for subscribing with: ${this.newsletterEmail}`);
    this.newsletterEmail = '';
  }
  
  validateEmail(email: string): boolean {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  }
} 
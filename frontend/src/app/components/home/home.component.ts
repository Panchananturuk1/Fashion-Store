import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  featuredProducts: Product[] = [];
  mensCollectionImage: string | null = null;
  womensCollectionImage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadFeaturedProducts();
    this.loadCollectionImages();
  }

  loadFeaturedProducts(): void {
    this.http.get<Product[]>(`${environment.apiUrl}/products?featured=true`)
      .subscribe({
        next: (response) => {
          this.featuredProducts = response;
        },
        error: (error) => {
          console.error('Error loading featured products:', error);
        }
      });
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
  }
} 
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  category: string | null = null;
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Get category from route parameters
    this.route.params.subscribe(params => {
      this.category = params['category'];
      this.loadProducts();
    });
  }

  loadProducts(): void {
    this.loading = true;
    this.error = null;

    // Build the URL based on category
    let url = `${environment.apiUrl}/products`;
    if (this.category) {
      url += `?category=${this.category}`;
    }

    this.http.get<Product[]>(url).subscribe({
      next: (response) => {
        this.products = response;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Error loading products. Please try again later.';
        this.loading = false;
        console.error('Error loading products:', error);
      }
    });
  }
} 
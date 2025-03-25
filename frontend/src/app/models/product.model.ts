export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'men' | 'women';
  subCategory: string;
  imageUrl: string;
  size: string[];
  color: string[];
  inStock: boolean;
  featured: boolean;
  rating: number;
  numReviews: number;
  createdAt?: string;
  updatedAt?: string;
  collectionImage?: string; // URL for the collection image
} 
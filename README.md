# E-Commerce Website
Link: http://ecom-fashion-store.s3-website-us-east-1.amazonaws.com/
A full-stack e-commerce platform built with Node.js, Express, MySQL, and Angular. This project features a modern, responsive design with a comprehensive product catalog, user authentication, and shopping cart functionality.

## Features

- 🛍️ **Product Catalog**
  - Browse products by category
  - Detailed product views
  - Size and color selection
  - Product ratings and reviews

- 👤 **User Authentication**
  - Secure user registration and login
  - JWT-based authentication
  - Protected routes

- 🛒 **Shopping Cart**
  - Add/remove products
  - Quantity management
  - Size and color selection
  - Real-time updates

- 🎨 **Modern UI/UX**
  - Responsive design
  - Bootstrap 5 styling
  - Loading states and animations
  - Error handling and feedback

## Tech Stack

### Backend
- Node.js
- Express.js
- MySQL
- Sequelize ORM
- JWT Authentication

### Frontend
- Angular 17
- TypeScript
- Bootstrap 5
- RxJS
- Angular Material

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8 or higher)
- Angular CLI (v17 or higher)
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ecom-website.git
cd ecom-website
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

4. Set up the database:
```bash
# Navigate to backend directory
cd ../backend

# Create and configure the database
mysql -u root -p < create_database.sql
```

5. Configure environment variables:
   - Copy `.env.example` to `.env` in the backend directory
   - Update the database credentials and JWT secret

## Development

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
ng serve
```

3. Access the application:
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:5000

## Deployment

### Backend Deployment (AWS Elastic Beanstalk)

1. Install AWS CLI and EB CLI:
```bash
pip install awscli
pip install awsebcli
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Initialize Elastic Beanstalk:
```bash
cd backend
eb init
```

4. Create and deploy:
```bash
eb create production
eb deploy
```

### Frontend Deployment (AWS S3 + CloudFront)

1. Build the production version:
```bash
cd frontend
ng build --configuration=production
```

2. Create and configure S3 bucket:
```bash
aws s3 mb s3://your-bucket-name
aws s3 website s3://your-bucket-name --index-document index.html --error-document index.html
```

3. Upload built files:
```bash
aws s3 sync dist/frontend s3://your-bucket-name
```

4. Create CloudFront distribution:
```bash
aws cloudfront create-distribution --origin-domain-name your-bucket-name.s3.amazonaws.com --default-root-object index.html --enabled
```

## Environment Variables

### Backend (.env)
```
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=ecommerce
JWT_SECRET=your-jwt-secret
```

### Frontend (environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Bootstrap](https://getbootstrap.com/) for the UI components
- [Unsplash](https://unsplash.com/) for the product images
- [Angular](https://angular.io/) for the frontend framework
- [Express](https://expressjs.com/) for the backend framework 

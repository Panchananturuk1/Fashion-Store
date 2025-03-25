# Fashion Store E-commerce Website

A responsive e-commerce website for men's and women's clothing built with Angular frontend and Node.js backend.

## Features

- Responsive design that works on mobile, tablet, and desktop
- Product listing with filtering by category (men/women)
- Detailed product pages with size and color selection
- Featured products showcase on the homepage
- RESTful API with Node.js and Express
- MySQL database for product storage

## Tech Stack

### Frontend
- Angular
- Bootstrap 5 for responsive UI
- RxJS for reactive programming

### Backend
- Node.js
- Express.js
- MySQL with Sequelize

## Project Structure

```
ecom-website/
├── backend/                # Node.js backend
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── index.js        # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Backend dependencies
│
└── frontend/               # Angular frontend
    ├── src/
    │   ├── app/
    │   │   ├── components/ # Angular components
    │   │   ├── models/     # TypeScript interfaces
    │   │   └── services/   # Angular services
    │   ├── assets/         # Static assets
    │   └── environments/   # Environment configurations
    └── package.json        # Frontend dependencies
```

## Setup Instructions

### Prerequisites
- Node.js and npm
- MySQL Server
- MySQL Workbench (optional, for database management)

### Backend Setup
1. Navigate to the backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file with the following:
   ```
   PORT=5000
   NODE_ENV=development
   
   # MySQL database configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=ecommerce
   DB_USER=root
   DB_PASSWORD=your_password
   ```
4. Run the setup script:
   - For Windows: `setup.bat`
   - For Linux/Mac: `./setup.sh`
5. Start the server: `npm run dev`
6. Initialize the database with dummy products: 
   - Make a POST request to `http://localhost:5000/api/products/create-dummy`

### Frontend Setup
1. Navigate to the frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. Access the application at `http://localhost:4200`

## License
MIT 
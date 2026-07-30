# Product Management Application

A full-stack Product Management Application built with the MERN stack. The application allows authenticated users to manage categories, subcategories, products with multiple variants, and wishlists. It follows a clean backend architecture with proper validation, authentication, centralized error handling, and a structured frontend.

---

## Assignment Requirements

This project was developed based on the following requirements:

- User Authentication (Signup & Login)
- Add Category
- Add Sub Category
- Add Products
- Support Multiple Product Variants
- Each Variant contains:
  - RAM
  - Price
  - Quantity
- Display Products
- Edit Product
- Wishlist
- Search Product by Name
- Filter Products by Sub Category
- Pagination
- Clean Project Structure

---

## Additional Features Implemented

Along with the assignment requirements, several additional improvements were implemented to make the application closer to a production-ready product management system.

### Backend
- Complete CRUD operations for Categories
- Complete CRUD operations for Sub Categories
- Complete CRUD operations for Products
- **Safe Delete Validation (Referential Integrity)**
  - Categories cannot be deleted if subcategories exist.
  - Subcategories cannot be deleted if products exist.
- Product image upload using Multer
- Product Variant validation
- Duplicate Product validation
- Duplicate Variant (RAM) validation
- Centralized Error Handling (`401 Unauthorized` token expiry handling)
- Request Validation using Zod
- JWT Authentication
- Protected API Routes
- Clean 3-Layer Architecture (Routes → Controllers → Services)
- RESTful API Design
- API testing using Postman

### Frontend
- Protected Routes & Auto-Redirect on Token Expiry
- Authentication Flow (Signup & Login)
- Dashboard Layout
- Product Management UI
- Dynamic Variant Management
- Image Upload
- Search by Product Name
- Filter by Sub Category
- Pagination
- Wishlist Toggle & View
- Responsive Design
- Component-based Architecture

---

## Key Engineering Highlights

- **3-Layer Backend Architecture**: Clean separation of concerns between `Routes` (endpoint definitions), `Controllers` (request/response handling), and `Services` (business & database logic).
- **Axios Interceptors**: Automatically attaches `Authorization: Bearer <token>` from `localStorage` to all API requests, and gracefully handles `401 Unauthorized` responses by logging out expired sessions.
- **Referential Integrity**: Implemented safe-deletion checks so parent entities (Categories/Subcategories) cannot be deleted while dependent records exist.
- **Strict Validation**: Zod schemas validate request payloads on both frontend and backend before database interaction.

---

## Tech Stack

### Frontend
- **React 18** + **Vite**
- **React Router DOM**
- **Axios** (with Custom Request & Response Interceptors)
- **Tailwind CSS**
- **React Hook Form** + **Zod**
- **React Hot Toast**

### Backend
- **Node.js** + **Express.js**
- **MongoDB** + **Mongoose**
- **JWT Authentication** (`jsonwebtoken`)
- **Multer** (File Storage & Handling)
- **Zod** (Request Schema Validation)
- **Bcrypt** (Password Hashing)
- **Cookie Parser** + **CORS**

---

## Project Structure

```
Product-Management
│
├── frontend
│   ├── src
│   │   ├── api          # Axios client & API module definitions
│   │   ├── components   # Reusable UI components
│   │   ├── pages        # Application screens
│   │   └── routes       # Application routing & Protected Routes
│   └── public
│
└── backend
    ├── src
    │   ├── config       # Database & environment config
    │   ├── controllers  # Request & Response logic
    │   ├── middlewares  # Auth, Error & Upload middlewares
    │   ├── models       # Mongoose schemas
    │   ├── routes       # REST endpoints
    │   ├── services     # Core business logic
    │   ├── utils        # Token generation & helpers
    │   └── validators   # Zod schemas
    ├── uploads          # Static image storage
    └── app.js
```

---

## Authentication & Authorization

The application uses **JWT (JSON Web Token)** authentication.

- **Public Routes**: Signup, Login, Viewing Categories/Subcategories/Products.
- **Protected Routes**: Creating/Updating/Deleting Categories, Subcategories, Products, and Wishlist management.
- **Token Verification Middleware**: Intercepts protected requests, verifies token validity and expiration, and attaches the authenticated user to `req.user`.

---

## Product Variants & Structure

Each product supports multiple variants.

Each variant contains:
- **RAM** (e.g., 8GB, 12GB)
- **Price**
- **Quantity**

### Example Product Payload
```json
{
  "name": "MacBook Pro M3",
  "category": "65b...c1",
  "subCategory": "65b...c2",
  "description": "High performance laptop",
  "variants": [
    {
      "ram": 8,
      "price": 149999,
      "quantity": 10
    },
    {
      "ram": 16,
      "price": 189999,
      "quantity": 5
    }
  ]
}
```

---

## Image Upload

Product images are uploaded using **Multer** and stored locally inside the `backend/uploads` directory. Uploaded files are served via Express static middleware at `http://localhost:5000/uploads/<filename>`.

---

## API Reference

### Auth Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | Register a new user account | No |
| `POST` | `/api/auth/login` | Login and receive a JWT token | No |

### Category & SubCategory Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/category` | Retrieve all categories | No |
| `POST` | `/api/category` | Create a new category | Yes |
| `PUT` | `/api/category/:id` | Update an existing category | Yes |
| `DELETE` | `/api/category/:id` | Delete a category (with safe-delete check) | Yes |
| `GET` | `/api/subCategory` | Retrieve all subcategories | No |
| `POST` | `/api/subCategory` | Create a new subcategory | Yes |
| `PUT` | `/api/subCategory/:id` | Update an existing subcategory | Yes |
| `DELETE` | `/api/subCategory/:id` | Delete a subcategory (with safe-delete check)| Yes |

### Product Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/product` | Get products (supports pagination, search, filter) | No |
| `GET` | `/api/product/:id` | Get single product by ID | No |
| `POST` | `/api/product` | Create product with image upload & variants | Yes |
| `PUT` | `/api/product/:id` | Update product details, image & variants | Yes |
| `DELETE` | `/api/product/:id` | Delete a product | Yes |

### Wishlist Endpoints
| Method | Endpoint | Description | Protected |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/wishlist` | Get logged-in user's wishlist | Yes |
| `POST` | `/api/wishlist/:productId` | Toggle product in wishlist | Yes |

---

## Environment Variables

### 1. Backend (`backend/.env`)
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### 2. Frontend (`frontend/.env`)
Create a `.env` file inside the `frontend/` folder (optional, defaults to `http://localhost:5000/api`):
```env
VITE_API_URL=http://localhost:5000/api
```

---

## Installation & Setup

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (running locally or a MongoDB Atlas URI)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Product-Management
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run dev
```
*Backend server will start on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
*Frontend application will start on `http://localhost:5173`*

---

## Future Improvements

- Role-based Authorization (Admin vs User roles)
- Cloudinary Image Storage for cloud persistence
- Product Stock Analytics & Dashboard Charts
- Product Image Gallery support
- Automated Unit & Integration Testing (Jest/Supertest)
- Docker & Docker Compose support for one-click deployment

---

## Author

**Muhammad Shamil**

- **GitHub**: [shaamil777](https://github.com/shaamil777)
- **LinkedIn**: [Muhammad Shamil](https://www.linkedin.com/in/muhammad-shamil-4b42a8329)

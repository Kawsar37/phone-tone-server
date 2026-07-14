# ⚙️ PhoneTone Backend - AI-Powered E-commerce API

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-4.x-black?style=for-the-badge&logo=express)](https://expressjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Render](https://img.shields.io/badge/Deployed_on-Render-000000?style=for-the-badge&logo=render)](https://render.com/)

**PhoneTone Backend** is the robust, secure, and scalable REST API powering the **PhoneTone AI-driven e-commerce platform**. Built with **Express.js** and **strict TypeScript**, it handles authentication, product management, shopping cart functionality, order processing, analytics, and seamless integration with **Google Gemini AI** to automatically generate detailed phone specifications from minimal user input.

🔗 **Live API:** https://phone-tone-server.onrender.com  
🔗 **Frontend Repository:** https://github.com/Kawsar37/phone-tone-client

---

# 📖 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [📂 Project Structure](#-project-structure)
- [🔑 Environment Variables](#-environment-variables)
- [🚀 Installation & Setup](#-installation--setup)
- [🌐 API Endpoints](#-api-endpoints)
- [🌍 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

# ✨ Features

## 🤖 AI-Powered Product Generation

- Google Gemini AI integration
- Generates complete phone specifications from a simple phone name
- Converts AI responses into structured JSON
- Automatically fills:
  - Display
  - Processor
  - Camera
  - Battery
  - Storage
  - RAM
  - Price
  - Colors
  - Features

---

## 🔐 Secure Authentication

- JWT Authentication
- HttpOnly Cookies
- Secure Cookies
- SameSite=None Cookie Configuration
- Password Hashing using Bcrypt
- Protected Routes
- Role-Based Authorization (Admin/User)
- CORS Protection

---

## 🛒 Complete E-commerce Backend

- User Registration & Login
- Product CRUD
- Product Search
- Pagination
- Sorting
- Filtering
- Shopping Cart
- Stock Validation
- Checkout
- Order Management
- Order Status Updates

---

## 📊 Admin Dashboard

MongoDB Aggregation Pipelines provide:

- Total Revenue
- Total Orders
- Total Users
- Monthly Sales
- Revenue Analytics
- Order Statistics

---

## ⚡ Performance Optimizations

- Strict TypeScript
- MongoDB Connection Caching
- Async Error Handling
- Modular Architecture
- Optimized MongoDB Queries
- Clean Folder Structure

---

# 🛠️ Tech Stack

| Category           | Technologies               |
| ------------------ | -------------------------- |
| **Runtime**        | Node.js, Express.js        |
| **Language**       | TypeScript (Strict Mode)   |
| **Database**       | MongoDB Atlas, Mongoose    |
| **Authentication** | JWT, Cookie Parser, Bcrypt |
| **AI**             | Google Gemini API          |
| **Security**       | CORS, HttpOnly Cookies     |
| **Deployment**     | Render                     |

---

# 📂 Project Structure

```text
phone-tone-server/
│
├── src/
│   ├── config/
│   │   └── db.ts
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   ├── phone.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── order.controller.ts
│   │   └── admin.controller.ts
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── role.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── models/
│   │   ├── User.ts
│   │   ├── Phone.ts
│   │   ├── Cart.ts
│   │   ├── Order.ts
│   │   └── Review.ts
│   │
│   ├── routes/
│   │
│   ├── utils/
│   │
│   └── index.ts
│
├── .env
├── package.json
├── tsconfig.json
└── vercel.json
```

---

# 🔑 Environment Variables

Create a **`.env`** file in the project root.

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_atlas_connection_string

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Google Gemini
GEMINI_API_KEY=your_google_gemini_api_key

# Frontend URL
CLIENT_URL=http://localhost:3000
```

---

# 🚀 Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/Kawsar37/phone-tone-server.git
cd phone-tone-server
```

---

## 2️⃣ Install Dependencies

```bash
npm install
```

---

## 3️⃣ Configure Environment Variables

Create a **`.env`** file in the project root and add the required environment variables listed above.

---

## 4️⃣ Run the Development Server

```bash
npm run dev
```

Server runs at:

```
http://localhost:5000
```

You can verify the server is running by visiting:

```
http://localhost:5000/
```

---

## 5️⃣ Build for Production

```bash
npm run build
```

---

## 6️⃣ Start Production Server

```bash
npm start
```

---

# 🌐 API Endpoints

| Method | Endpoint             | Description              | Access |
| ------ | -------------------- | ------------------------ | ------ |
| POST   | `/api/auth/register` | Register new user        | Public |
| POST   | `/api/auth/login`    | Login user               | Public |
| GET    | `/api/auth/logout`   | Logout user              | User   |
| GET    | `/api/phones`        | Get all phones           | Public |
| GET    | `/api/phones/:id`    | Get phone details        | Public |
| POST   | `/api/phones`        | Create phone (Gemini AI) | Admin  |
| PATCH  | `/api/phones/:id`    | Update phone             | Admin  |
| DELETE | `/api/phones/:id`    | Delete phone             | Admin  |
| GET    | `/api/cart`          | Get user cart            | User   |
| POST   | `/api/cart`          | Add to cart              | User   |
| PATCH  | `/api/cart/:id`      | Update cart item         | User   |
| DELETE | `/api/cart/:id`      | Remove cart item         | User   |
| POST   | `/api/orders`        | Create order             | User   |
| GET    | `/api/orders`        | Get user orders          | User   |
| PATCH  | `/api/orders/:id`    | Update order status      | Admin  |
| GET    | `/api/admin/stats`   | Dashboard analytics      | Admin  |

---

# 🌍 Deployment

The backend is deployed on **Render**.

### Benefits

- Persistent Node.js server
- Reliable API uptime
- AI generation support
- Secure environment variables
- MongoDB Atlas integration
- CORS configured for Vercel frontend

Live API:

**https://phone-tone-server.onrender.com**

---

# 🤝 Contributing

Contributions are always welcome!

If you'd like to contribute:

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/amazing-feature
```

3. Commit your changes

```bash
git commit -m "Add amazing feature"
```

4. Push to GitHub

```bash
git push origin feature/amazing-feature
```

5. Open a Pull Request

---

# 📄 License

This project is licensed under the **MIT License**.

---

# 👨‍💻 Author

**Kawsar Ali**

- GitHub: https://github.com/Kawsar37
- Portfolio: https://www.kawsar.engineer
- LinkedIn: https://www.linkedin.com/in/kawsar-ali-pramanik/

---

<div align="center">

### ⭐ If you found this project helpful, consider giving it a star!

Built with ❤️ using **Node.js**, **Express.js**, **TypeScript**, **MongoDB**, and **Google Gemini AI**.

</div>

# Coupon Generator - MERN Stack with Vite

## Introduction
The **Coupon Generator** is a full-stack web application built using the **MERN stack** with **Vite** for a modern, high-performance frontend. The core feature of this project is generating unique coupons for individual users, ensuring that each IP address gets only **one coupon**. The application includes **login, signup, and an admin panel**, where the admin has complete control over coupon management.

## Project Description
This application allows users to claim a **unique coupon** based on their IP address. If a user doesn’t want to sign up, a **guest login** option is available. The system provides a smooth user experience with **interactive backgrounds** and **secure authentication mechanisms** like password hashing using **Salt**.

### Features:
- **Unique Coupon Generation**: Each user/IP gets a single coupon.
- **Admin Panel**: Manage (Add, Delete, Modify) coupons.
- **Secure Authentication**: Password hashing with Salt.
- **Form Validation**: Used **Yup** for login and signup validations.
- **Guest Login**: Users can claim a coupon without signing up.
- **Interactive UI**: Enhanced with animated backgrounds.
- **REST API Integration**: Uses GET, POST, PUT, DELETE methods for CRUD operations.

---
## Admin Page
The **Admin Panel** is the control center for managing coupons. Admins can:
- **Create new coupons**
- **Delete existing coupons**
- **Update coupon statuses** (claimed/unclaimed)

#### **Admin Credentials:**
- **Email**: `admin@example.com`
- **Password**: `Admin@123`

_Note: Change these credentials after deployment for security._

---
## Login & Signup Page
The authentication system includes:
- **Signup Page**: Users register using an email and password.
- **Login Page**: Users sign in securely.
- **Yup Validation**: Ensures strong password rules.
- **Password Security**: Uses **Salt Hashing** to store passwords securely.
- **Guest Mode**: Users can claim a coupon without signing in.

---
## API Endpoints
| Method | Endpoint | Description |
|--------|---------|-------------|
| **POST** | `/api/auth/signup` | Registers a new user |
| **POST** | `/api/auth/login` | Logs in an existing user |
| **GET** | `/api/coupons` | Retrieves all coupons |
| **POST** | `/api/coupons/add` | Adds a new coupon (Admin only) |
| **PUT** | `/api/coupons/claim/:id` | Toggles claimed status |
| **DELETE** | `/api/coupons/delete/:id` | Deletes a coupon (Admin only) |

---
## Additional Features
- **Fast Performance**: Vite is used for an optimized development experience.
- **Role-Based Access**: Only admins can manage coupons.
- **Database**: MongoDB is used to store coupon data securely.
- **State Management**: React hooks are used for efficient state updates.
- **Responsive Design**: Works smoothly on all devices.

---
## Installation & Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/coupon-generator.git
   cd coupon-generator
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run the backend server:
   ```bash
   node server.js
   ```

---
## Conclusion
The **Coupon Generator** provides an interactive and secure coupon system with full admin control. Whether for user engagement, promotions, or giveaways, this app ensures fairness by limiting one coupon per user/IP.

🚀 Happy Coding!


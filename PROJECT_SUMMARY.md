# CheezyBite – Online Pizza Ordering Platform

**Project Type:** Full-stack web application  
**Domain:** Food ordering & delivery  
**Target Users:** Customers, Admin, Manager

---

## 1. Project Overview

CheezyBite is a comprehensive, full-stack online pizza ordering platform designed to bridge the gap between hungry customers and kitchen operations. The core purpose of the application is to provide a seamless, real-time food ordering experience while giving business owners robust tools to manage products, orders, and performance analytics.

It solves the common problems of order tracking opacity, menu management complexity, and inefficient communication between the front-end user and the back-end kitchen staff.

## 2. Key Features

### Customer Features
*   **Dynamic Menu Browsing:** Explore a wide range of pizzas with filtering by category (Chicken, Veg, Spicy, Cheese).
*   **Customization:** Personalize orders by selecting sizes and adding extra toppings.
*   **Smart Cart:** Real-time price calculation, easy quantity adjustments, and transparent cost breakdown.
*   **Secure Checkout:** Integrated payment flow with address management and order validation.
*   **Real-Time Order Tracking:** Live status updates (Preparing, Baking, Out for Delivery) powered by WebSockets.
*   **User Profile:** Manage saved addresses, view order history, and update personal details.

### Admin Features
*   **Comprehensive Dashboard:** High-level view of revenue, active orders, and sales trends.
*   **Product Management:** Full CRUD capabilities for Pizzas and Toppings, including availability toggles.
*   **User Management:** Manage customer accounts and internal staff roles.
*   **Analytics & Reporting:** Visual insights into sales performance and customer retention.
*   **System Configuration:** Control platform settings and operational parameters.

### Manager Features
*   **Operational Dashboard:** Focused view on daily order flow and kitchen status.
*   **Order Processing:** Capability to update order stages (e.g., move from "Preparing" to "Baking").
*   **Real-Time Alerts:** Instant notifications for new incoming orders to ensure zero delays.

## 3. User Roles & Responsibilities

*   **Customer:** The end-user who browses the menu, places orders, and tracks delivery. Their primary goal is convenience and speed.
*   **Admin:** The business owner or system administrator with full access to all modules. Responsible for menu pricing, staff management, and strategic decision-making based on analytics.
*   **Manager:** The operational staff member responsible for the kitchen and delivery workflow. Their focus is on ensuring orders are prepared and dispatched efficiently.

## 4. System Architecture (High-Level)

The application follows a modern, decoupled architecture:

*   **Frontend:** Built with Next.js (App Router), serving as the client-side interface. It handles routing, UI rendering, and state management, communicating with the backend via REST APIs.
*   **Backend:** A Node.js and Express.js server that acts as the central logic layer. It processes API requests, handles business rules, and manages database interactions.
*   **Database:** A MongoDB NoSQL database used for flexible and scalable storage of users, products, orders, and sessions.
*   **Real-Time Layer:** A Socket.IO integration that establishes a bidirectional communication channel between the server and connected clients (Customers/Admins) for instant event broadcasting.

## 5. Technology Stack

### Frontend Technologies
*   **Framework:** Next.js 16 (React)
*   **Styling:** Tailwind CSS
*   **Animations:** Framer Motion
*   **Icons:** Lucide React
*   **State Management:** React Context API & Hooks

### Backend Technologies
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Real-Time Engine:** Socket.IO
*   **Authentication:** JSON Web Tokens (JWT)

### Database
*   **Primary DB:** MongoDB
*   **ODM:** Mongoose

### Tools / Libraries
*   **Validation:** Bcryptjs (Password Hashing)
*   **Notifications:** React Hot Toast
*   **Testing:** Jest

## 6. Project File Structure

```
cheezybite/
├── jest.config.js                  # Jest testing configuration
├── jest.setup.js                   # Jest setup file
├── jsconfig.json                   # JavaScript configuration
├── LICENSE                         # Project license
├── next.config.js                  # Next.js configuration
├── package.json                    # Dependencies and scripts
├── postcss.config.js               # PostCSS configuration
├── PROJECT_SUMMARY.md              # This file - project documentation
├── tailwind.config.js              # Tailwind CSS configuration
├── verify-setup.sh                 # Setup verification script
├── coverage/                       # Test coverage reports
│   ├── clover.xml
│   ├── coverage-final.json
│   ├── lcov.info
│   └── lcov-report/
├── public/                         # Static assets
│   └── pizzas/                     # Pizza images
├── scripts/                        # Utility scripts
│   ├── debug-login.mjs
│   ├── list-users.mjs
│   ├── reseed-admins.mjs
│   ├── resetDatabase.js
│   ├── seed.mjs
│   ├── seedDatabase.js
│   ├── test_user.mjs
│   ├── test-api-login.mjs
│   ├── test-coupon-scenarios.mjs
│   ├── test-db.mjs
│   └── test-protected-apis.mjs
├── server/                         # Backend server
│   └── index.js                    # Express & Socket.IO server
└── src/                            # Source code
    ├── middleware.js               # Next.js middleware (auth, routing)
    ├── app/                        # Next.js App Router
    │   ├── globals.css             # Global styles
    │   ├── layout.js               # Root layout
    │   ├── loading.js              # Loading component
    │   ├── (shop)/                 # Customer-facing pages
    │   ├── admin/                  # Admin dashboard pages
    │   ├── api/                    # API route handlers
    │   ├── components/             # React components
    │   ├── context/                # React Context providers
    │   ├── hooks/                  # Custom React hooks
    │   └── utils/                  # Utility functions
    ├── lib/                        # Core libraries
    │   ├── apiResponse.js          # API response utilities
    │   ├── auth.js                 # Authentication logic
    │   ├── dbConnect.js            # MongoDB connection
    │   ├── emailService.js         # Email service
    │   ├── socketBridge.js         # Socket.IO bridge
    │   ├── token.js                # JWT token utilities
    │   └── validators.js           # Input validation
    ├── models/                     # Mongoose models
    │   ├── Address.js
    │   ├── Admin.js
    │   ├── AuditLog.js
    │   ├── Cart.js
    │   ├── Coupon.js
    │   ├── Notification.js
    │   ├── Offer.js
    │   ├── Order.js
    │   ├── OrderEvent.js
    │   ├── OtpSession.js
    │   ├── Payment.js
    │   ├── Pizza.js
    │   ├── Session.js
    │   ├── Topping.js
    │   └── User.js
    ├── services/                   # Business logic services
    │   ├── analyticsService.js
    │   ├── apiClient.js
    │   ├── authService.js
    │   ├── cartService.js
    │   ├── customersService.js
    │   ├── notificationsService.js
    │   ├── offersService.js
    │   ├── ordersService.js
    │   ├── pizzasService.js
    │   └── toppingsService.js
    ├── test-utils/                 # Testing utilities
    │   └── index.js
    └── utils/                      # Helper utilities
        ├── cardValidation.js
        ├── dateFormatter.js
        ├── storeLogic.js
        └── __tests__/              # Unit tests
```

## 7. Core Functional Modules

*   **Authentication & Authorization:** Secure registration and login system with role-based redirection and session management.
*   **Pizza Management:** specialized module for cataloging pizzas, including ingredients, pricing tiers, and image assets.
*   **Order Management:** A complex state machine handling the lifecycle of an order from placement to delivery.
*   **Category Filtering:** Smart filtering logic to help users find products based on dietary preferences (e.g., Veg, Spicy).
*   **Pricing & Size Handling:** Dynamic pricing engine calculating totals based on base price, size multipliers, and add-ons.
*   **Admin & Manager Control:** Dedicated interfaces for internal staff to oversee and control the business operations.

## 8. Security Considerations

*   **Authentication:** Secure implementation using JWT (JSON Web Tokens) to verify identity without maintaining session state on the server.
*   **Role-Based Access Control (RBAC):** Middleware checks ensure that sensitive API endpoints (like Analytics) are accessible only to authorized roles (Admin/Manager).
*   **Secure APIs:** REST endpoints are protected against unauthorized access and validate all incoming data payloads.
*   **Data Protection:** Sensitive user data, specifically passwords, are hashed using bcrypt before storage.
*   **Traffic Safety:** Socket connections are verified to prevent unauthorized event emission.

## 9. User Experience (UX) Considerations

*   **Simple Navigation:** Intuitive sticky headers and clear call-to-action buttons guide the user journey.
*   **Category-Based Filtering:** Visual distinctions and instant filter application make finding food effortless.
*   **Clear Pricing:** Total costs update instantly as users modify their orders, preventing checkout shock.
*   **Responsive Design:** A mobile-first approach ensures the app works flawlessly on smartphones, tablets, and desktops.
*   **Accessibility Basics:** High contrast text, accessible form labels, and keyboard-navigable interfaces.

## 10. Project Status

The CheezyBite platform is currently in a **Production-Ready** state.

*   **Implemented:** Full customer flow, complete admin/manager dashboards, real-time tracking, and payment integration logic.
*   **Stability:** Core features have been rigorously tested and verified.
*   **Ready-for-use:** The system is fully capable of handling live orders and managing a pizza delivery operation.

## 11. Conclusion

CheezyBite represents a modern solution to the complexities of food delivery management. By combining a user-friendly frontend with a powerful, real-time backend, it delivers exceptional value to both the customer and the business operator. The architecture is scalable, secure, and built to support the dynamic needs of a growing food business.

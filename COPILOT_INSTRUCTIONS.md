# GitHub Copilot Instructions for Refynd App

This document provides comprehensive guidance on using GitHub Copilot to accelerate development of the Refynd app, a Vinted power-user tool.

## Tech Stack Overview

- **Frontend:** Vue.js 3, Vuex, Tailwind CSS (located in `frontend/`)
- **Backend:** Node.js, PostgreSQL, Bull queue, Fastify, Nginx (located in `backend/`)
- **Infrastructure:** Docker, docker-compose.yml
- **Development:** ESLint, Prettier, npm/yarn

## 🚀 Frontend Development with Copilot

### Vue.js Component Generation

#### Sample Prompts for Vue Components

```
// Generate a Vue 3 composition API component for product listing
Create a Vue 3 component using composition API that displays a grid of Vinted products with image, title, price, and favorite button

// Create reusable UI components
Generate a Vue component for a search filter sidebar with checkboxes for categories, size, brand, and price range using Tailwind CSS

// Form components with validation
Create a Vue 3 component for user registration form with email, password, confirm password fields using Vuelidate for validation and Tailwind styling
```

#### Tailwind CSS Integration

```
// Responsive card components
Generate a product card component using Tailwind CSS with responsive design, hover effects, and proper spacing

// Navigation components
Create a responsive navigation bar component with mobile hamburger menu using Vue 3 and Tailwind CSS

// Modal components
Generate a modal component using Vue 3 Teleport and Tailwind CSS with backdrop blur and slide-in animation
```

### Vuex Store Management

```
// State management for products
Create Vuex store module for managing Vinted products with actions for fetching, filtering, and favoriting products

// User authentication store
Generate Vuex store module for user authentication with login, logout, register actions and JWT token management

// Shopping cart functionality
Create Vuex store module for shopping cart with add item, remove item, update quantity, and calculate total actions
```

### Vue Router Setup

```
// Route configuration
Generate Vue Router configuration with lazy-loaded components for products, profile, favorites, and settings pages

// Route guards
Create Vue Router navigation guards for authentication and authorization checking
```

## 🔧 Backend Development with Copilot

### Fastify Server Setup

#### API Endpoint Generation

```
// RESTful API endpoints
Create Fastify route handlers for CRUD operations on products with proper HTTP status codes and error handling

// Authentication endpoints
Generate Fastify routes for user authentication including login, register, logout, and refresh token endpoints

// Search and filtering endpoints
Create Fastify endpoint for advanced product search with filters for category, price range, size, and brand
```

#### Middleware and Plugins

```
// Authentication middleware
Create Fastify authentication middleware using JWT tokens with proper error handling and token validation

// Rate limiting middleware
Generate Fastify rate limiting plugin to prevent API abuse with different limits for authenticated and guest users

// CORS configuration
Create Fastify CORS plugin configuration for secure cross-origin requests from the Vue frontend
```

### PostgreSQL Database Operations

#### Schema and Migrations

```
// Database schema
Create PostgreSQL schema for users, products, favorites, and search_history tables with proper indexes and constraints

// Migration scripts
Generate database migration scripts for adding new columns and indexes to existing tables

// Database seeders
Create database seeder scripts for populating development database with sample products and users
```

#### Secure Query Operations

```
// Parameterized queries
Create PostgreSQL queries using parameterized statements to prevent SQL injection for user search functionality

// Transaction management
Generate database transaction wrapper for complex operations like user registration with profile creation

// Connection pooling
Create PostgreSQL connection pool configuration with proper error handling and reconnection logic
```

### Bull Queue Job Management

#### Job Creation and Processing

```
// Email notification jobs
Create Bull queue job for sending email notifications when users find matching products

// Image processing jobs
Generate Bull queue job for processing and optimizing product images with different sizes

// Data sync jobs
Create Bull queue job for synchronizing product data from Vinted API with retry logic and error handling
```

#### Queue Monitoring

```
// Queue dashboard
Create Bull queue monitoring dashboard with job statistics, failed jobs, and retry mechanisms

// Queue health checks
Generate health check endpoints for monitoring queue status and worker availability
```

## 🐳 Docker and Infrastructure

### Docker Configuration

```
// Dockerfile for frontend
Create optimized Dockerfile for Vue.js application with multi-stage build and Nginx serving

// Dockerfile for backend
Generate Dockerfile for Node.js Fastify application with proper security practices and non-root user

// docker-compose.yml
Create docker-compose configuration with PostgreSQL, Redis, backend, frontend, and Nginx services with proper networking
```

### Development Environment

```
// Development docker-compose
Generate docker-compose.dev.yml with hot reload for both frontend and backend development

// Production optimization
Create production-ready docker-compose with proper health checks, restart policies, and resource limits
```

## 🔄 Automation and Workflows

### Development Automation

```
// Package.json scripts
Generate npm scripts for development, testing, building, and deployment workflows

// Pre-commit hooks
Create pre-commit hooks using Husky for running ESLint, Prettier, and tests before commits

// GitHub Actions
Generate CI/CD pipeline with GitHub Actions for testing, building, and deployment
```

### Code Quality

```
// ESLint configuration
Create ESLint configuration for Vue.js and Node.js with proper rules for code consistency

// Prettier configuration
Generate Prettier configuration with consistent formatting rules for the entire project

// Testing setup
Create Jest configuration for unit testing Vue components and Node.js API endpoints
```

## 📝 Best Practices for Copilot Integration

### Effective Prompting Strategies

1. **Be Specific with Context**
   ```
   // Instead of: "Create a component"
   // Use: "Create a Vue 3 component using composition API for displaying Vinted product details with image gallery, price, seller info, and add to favorites button using Tailwind CSS"
   ```

2. **Include Technology Stack**
   ```
   // Always mention the specific technologies
   "Create a Fastify route handler with PostgreSQL query for searching products with pagination and filters"
   ```

3. **Specify Error Handling**
   ```
   // Include error handling requirements
   "Generate API endpoint with try-catch blocks, proper HTTP status codes, and user-friendly error messages"
   ```

### Code Review with Copilot

1. **Security Review**
   ```
   // Review this authentication middleware for security vulnerabilities
   // Check this database query for SQL injection prevention
   // Validate this CORS configuration for production use
   ```

2. **Performance Optimization**
   ```
   // Optimize this Vue component for better performance
   // Review this database query for performance improvements
   // Suggest caching strategies for this API endpoint
   ```

3. **Code Consistency**
   ```
   // Make this component consistent with our design system
   // Align this API response format with our standard
   // Update this code to follow our naming conventions
   ```

### Refactoring Assistance

1. **Component Extraction**
   ```
   // Extract reusable components from this large Vue component
   // Split this API handler into smaller, focused functions
   // Refactor this Vuex store into smaller modules
   ```

2. **Code Modernization**
   ```
   // Convert this Options API component to Composition API
   // Update this callback-based code to use async/await
   // Modernize this CommonJS module to ES6 modules
   ```

### Testing with Copilot

```
// Unit tests for Vue components
Generate unit tests for this product card component using Vue Test Utils and Jest

// API endpoint testing
Create integration tests for authentication endpoints using supertest and Jest

// E2E testing
Generate Playwright tests for the complete user registration and product search flow
```

## 🎯 Workflow Integration Tips

### Daily Development Workflow

1. **Morning Setup**
   - Use Copilot to generate daily standup notes
   - Create TODO comments with Copilot for planned features
   - Generate placeholder components and API endpoints

2. **Feature Development**
   - Start with Copilot-generated boilerplate
   - Use Copilot for implementing business logic
   - Generate comprehensive error handling

3. **Code Review Preparation**
   - Use Copilot to add missing documentation
   - Generate unit tests for new features
   - Create commit messages with proper formatting

### Team Collaboration

1. **Code Documentation**
   ```
   // Generate JSDoc comments for this function
   // Create README section for this new feature
   // Add inline comments explaining complex business logic
   ```

2. **API Documentation**
   ```
   // Generate OpenAPI/Swagger documentation for these endpoints
   // Create usage examples for new API features
   // Document authentication requirements and error responses
   ```

### Troubleshooting and Debugging

1. **Error Investigation**
   ```
   // Analyze this error message and suggest solutions
   // Debug this Vue component reactivity issue
   // Investigate this database performance problem
   ```

2. **Performance Monitoring**
   ```
   // Add performance monitoring to this API endpoint
   // Create logging for this background job
   // Generate health check endpoints for monitoring
   ```

## 🔒 Security Considerations

### Secure Coding Practices

```
// Input validation
Create input validation schemas for user registration using Joi or similar library

// Authentication security
Generate secure password hashing using bcrypt with proper salt rounds

// API security
Create rate limiting and request validation middleware for API endpoints
```

### Data Protection

```
// Sensitive data handling
Create utilities for encrypting sensitive user data before database storage

// GDPR compliance
Generate data export and deletion utilities for GDPR compliance requirements

// Audit logging
Create audit logging system for tracking user actions and data changes
```

Remember to always review and test Copilot-generated code before merging, especially for security-critical features and database operations.
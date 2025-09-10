# Contributing to Refynd

Thank you for your interest in contributing to Refynd! This guide will help you get started with development using GitHub Copilot and our established workflows.

## 🤖 Using GitHub Copilot

This project is optimized for GitHub Copilot development. **Please read our [Copilot Instructions](./COPILOT_INSTRUCTIONS.md)** before starting development. It contains:

- Specific prompts for Vue.js + Tailwind CSS components
- Backend development patterns with Fastify + PostgreSQL
- Bull queue job management techniques
- Docker configuration assistance
- Security best practices and code review guidance

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm/yarn
- Docker and docker-compose
- Git
- GitHub Copilot extension for your IDE

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Refynd.git
   cd Refynd
   ```

2. **Copy environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

3. **Start development environment**
   ```bash
   docker-compose -f docker-compose.dev.yml up -d
   ```

4. **Install dependencies** (if developing locally)
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd ../backend && npm install
   ```

## 📋 Development Workflow

### 1. Feature Development

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Use Copilot for scaffolding**
   - Start with our [Copilot prompts](./COPILOT_INSTRUCTIONS.md)
   - Generate boilerplate code and components
   - Follow established patterns from existing code

3. **Implement your feature**
   - Write code with Copilot assistance
   - Add comprehensive error handling
   - Include proper input validation
   - Follow security best practices

4. **Add tests**
   ```bash
   # Frontend tests
   cd frontend && npm run test

   # Backend tests
   cd backend && npm run test
   ```

### 2. Code Quality

#### Linting and Formatting

```bash
# Frontend
cd frontend
npm run lint
npm run format

# Backend
cd backend
npm run lint
npm run format
```

#### Pre-commit Hooks

We use Husky for pre-commit hooks that run:
- ESLint for code quality
- Prettier for formatting
- Unit tests
- Type checking (if applicable)

### 3. Testing

#### Unit Tests
```bash
# Frontend (Vue Test Utils + Jest)
cd frontend && npm run test:unit

# Backend (Jest + Supertest)
cd backend && npm run test:unit
```

#### Integration Tests
```bash
# API integration tests
cd backend && npm run test:integration

# End-to-end tests
npm run test:e2e
```

#### Test Coverage
```bash
npm run test:coverage
```

## 🏗️ Architecture Guidelines

### Frontend (Vue.js)

- **Components**: Use Vue 3 Composition API
- **State Management**: Vuex for complex state, local state for simple cases
- **Styling**: Tailwind CSS utility classes
- **Routing**: Vue Router with lazy-loaded components
- **API**: Axios with centralized configuration

**Copilot Prompts Example:**
```
Create a Vue 3 component using composition API for product filtering with checkboxes for categories, price range slider, and search input using Tailwind CSS
```

### Backend (Node.js)

- **Framework**: Fastify for high performance
- **Database**: PostgreSQL with migrations
- **Queue**: Bull for background jobs
- **Authentication**: JWT with refresh tokens
- **Validation**: Joi schemas for input validation

**Copilot Prompts Example:**
```
Create Fastify route handler for product search with PostgreSQL query, pagination, and filters with proper error handling and validation
```

## 🔒 Security Guidelines

### Frontend Security
- Sanitize user inputs
- Use HTTPS in production
- Implement CSP headers
- Validate API responses

### Backend Security
- Input validation with Joi
- SQL injection prevention
- Rate limiting
- CORS configuration
- JWT token security

**Use Copilot for security reviews:**
```
Review this authentication middleware for security vulnerabilities and suggest improvements
```

## 📝 Code Standards

### Naming Conventions

- **Variables/Functions**: camelCase
- **Components**: PascalCase
- **Files**: kebab-case for Vue components, camelCase for JS/TS
- **Constants**: UPPER_SNAKE_CASE

### Documentation

- JSDoc comments for complex functions
- README files for each major component
- API documentation with examples
- Inline comments for business logic

### Git Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add product filtering functionality
fix: resolve authentication token expiry issue
docs: update API documentation
test: add unit tests for user service
refactor: extract reusable validation middleware
```

## 🧪 Testing Strategy

### Test Types

1. **Unit Tests**: Individual functions and components
2. **Integration Tests**: API endpoints and database operations
3. **E2E Tests**: Complete user workflows
4. **Performance Tests**: API response times and load testing

### Testing with Copilot

```
Generate unit tests for this Vue component using Vue Test Utils and Jest with proper mocking
Create integration test for user registration API endpoint with validation scenarios
```

## 🚀 Deployment

### Staging Deployment

```bash
# Build and test
npm run build
npm run test

# Deploy to staging
docker-compose -f docker-compose.staging.yml up -d
```

### Production Deployment

```bash
# Build production images
docker-compose build

# Deploy with zero downtime
docker-compose up -d --no-deps --scale backend=2 backend
```

## 🐛 Debugging

### Local Debugging

```bash
# Backend debugging
cd backend && npm run debug

# Frontend debugging with Vue DevTools
cd frontend && npm run dev
```

### Docker Debugging

```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Execute commands in containers
docker-compose exec backend npm run migrate
docker-compose exec postgres psql -U refynd -d refynd
```

## 📚 Resources

- [Vue.js Documentation](https://vuejs.org)
- [Fastify Documentation](https://fastify.io)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [PostgreSQL Documentation](https://postgresql.org/docs)
- [Bull Queue Documentation](https://github.com/OptimalBits/bull)
- [Docker Documentation](https://docs.docker.com)

## 🤝 Getting Help

- **GitHub Copilot**: Use our [Copilot Instructions](./COPILOT_INSTRUCTIONS.md)
- **Issues**: Search existing issues or create a new one
- **Discussions**: Use GitHub Discussions for questions
- **Code Review**: All PRs require review before merging

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows our style guidelines
- [ ] All tests pass
- [ ] Documentation is updated
- [ ] Commits follow conventional commit format
- [ ] Security considerations are addressed
- [ ] Performance impact is considered
- [ ] Breaking changes are documented

Thank you for contributing to Refynd! 🎉
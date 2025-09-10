# Refynd - Vinted Power User Tool

Refynd is a powerful tool designed to enhance the Vinted marketplace experience for power users, providing advanced search, filtering, and notification capabilities.

## 🏗️ Architecture

```
Refynd/
├── frontend/          # Vue.js 3 + Vuex + Tailwind CSS
├── backend/           # Node.js + Fastify + PostgreSQL + Bull Queue
├── docker-compose.yml # Container orchestration
└── docs/              # Documentation
```

## 🚀 Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework with Composition API
- **Vuex** - State management for complex application state
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Vue Router** - Official router for single-page application navigation

### Backend
- **Node.js** - JavaScript runtime for server-side development
- **Fastify** - Fast and low overhead web framework
- **PostgreSQL** - Robust relational database for data persistence
- **Bull Queue** - Redis-based queue for background job processing
- **Nginx** - Reverse proxy and static file serving

### Infrastructure
- **Docker** - Containerization for consistent development and deployment
- **docker-compose** - Multi-container Docker application management
- **Redis** - In-memory data store for caching and queue management

## 🤖 GitHub Copilot Integration

This project is optimized for development with GitHub Copilot. For comprehensive guidance on using Copilot with this tech stack, see:

**[📖 Copilot Instructions](./COPILOT_INSTRUCTIONS.md)**

The Copilot instructions include:
- Sample prompts for Vue.js components with Tailwind CSS
- Backend API development with Fastify and PostgreSQL
- Bull queue job management and processing
- Docker configuration and orchestration
- Security best practices and code review guidance
- Automation workflows and testing strategies

## 🛠️ Quick Start

### Prerequisites
- Docker and docker-compose
- Node.js 16+ (for local development)
- Git

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/dannybisby/Refynd.git
   cd Refynd
   ```

2. **Start with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - Admin Dashboard: http://localhost:8000/admin

### Development Commands

```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Run frontend development server
cd frontend && npm run dev

# Run backend development server
cd backend && npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📁 Project Structure

```
Refynd/
├── frontend/
│   ├── src/
│   │   ├── components/     # Vue components
│   │   ├── views/          # Page components
│   │   ├── store/          # Vuex store modules
│   │   ├── router/         # Vue Router configuration
│   │   └── assets/         # Static assets
│   ├── public/             # Public static files
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── models/         # Database models
│   │   ├── services/       # Business logic services
│   │   ├── jobs/           # Bull queue job processors
│   │   ├── middleware/     # Custom middleware
│   │   └── utils/          # Utility functions
│   ├── migrations/         # Database migrations
│   ├── seeds/              # Database seeders
│   └── package.json
├── nginx/                  # Nginx configuration
├── docker-compose.yml      # Production Docker setup
├── docker-compose.dev.yml  # Development Docker setup
└── docs/                   # Documentation
```

## 🎯 Key Features

- **Advanced Search**: Powerful search capabilities with multiple filters
- **Real-time Notifications**: Instant alerts for new matching products
- **Favorite Management**: Save and organize favorite items and searches
- **Price Tracking**: Monitor price changes for saved items
- **User Dashboard**: Comprehensive overview of activity and saved items

## 🔧 Development Guidelines

### Code Style
- Follow ESLint and Prettier configurations
- Use TypeScript for type safety where applicable
- Write comprehensive unit and integration tests
- Document complex business logic

### Git Workflow
- Use conventional commit messages
- Create feature branches for new functionality
- Require code review for all pull requests
- Run tests and linting before committing

### Security
- Never commit sensitive data or credentials
- Use environment variables for configuration
- Implement proper input validation and sanitization
- Follow security best practices for authentication

## 📚 Documentation

- [Copilot Instructions](./COPILOT_INSTRUCTIONS.md) - GitHub Copilot usage guide
- [API Documentation](./docs/api.md) - Backend API reference
- [Component Library](./docs/components.md) - Frontend component documentation
- [Deployment Guide](./docs/deployment.md) - Production deployment instructions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the development guidelines and use Copilot instructions
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Vinted API Documentation](https://vinted.com)
- [Vue.js Documentation](https://vuejs.org)
- [Fastify Documentation](https://fastify.io)
- [Tailwind CSS Documentation](https://tailwindcss.com)
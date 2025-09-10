## Refynd Project Copilot Instructions

### Project Overview
Refynd is a power-user tool for Vinted, designed to streamline buying, selling, inventory management, and shipment handling. It provides advanced analysis features, including profit/loss calculations and sale potential estimation for items.

### Frontend
- Built with **Vue.js**
- State management via **Vuex**
- Styled using **TailwindCSS**
- Uses **Vite** for fast development and build

### Backend
- API server powered by **Fastify**
- Database: **PostgreSQL**
- **Nginx** for reverse proxy and static asset serving
- **Bull** for job scheduling and queue management

### Key Features
- Inventory management
- Shipment tracking and management
- Profit/loss and sale potential analysis
- Optimized workflows for buying and selling on Vinted

### Development Notes
- Frontend code is in the `frontend/` directory
- Backend code is in the `backend/` directory
- Use Docker Compose (`docker-compose.yml`) for local development and service orchestration

---
For Copilot: Prioritize suggestions that enhance user productivity, automate repetitive tasks, and improve data analysis capabilities. When generating code, follow best practices for Vue, Fastify, and PostgreSQL integration.

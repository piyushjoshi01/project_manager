# Project Manager

Full-stack project management application with Jira integration and AI-powered analytics.

## Tech Stack

### Backend
- Java 21
- Spring Boot 4.0.0
- MySQL Database
- Spring WebFlux (for Jira API integration)
- Springdoc OpenAPI (Swagger UI)

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS
- Axios

## Quick Start

### Prerequisites
- Java 21
- Node.js 24
- MySQL 8.0+
- Docker (optional)

### Backend Setup

1. **Configure Environment Variables**

   Copy the example file:
   ```bash
   cd project_manager_backend
   cp .env.example .env
   ```

   Edit `.env` with your credentials:
   ```properties
   # Database
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/project_management
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=your_password

   # Jira
   JIRA_BASE_URL=https://yourcompany.atlassian.net/
   JIRA_EMAIL=your.email@example.com
   JIRA_API_TOKEN=your_jira_token
   ```

2. **Run Backend**
   ```bash
   mvn spring-boot:run
   ```

3. **Access Swagger UI**
   ```
   http://localhost:8080/swagger-ui.html
   ```

### Frontend Setup

1. **Install Dependencies**
   ```bash
   cd project-manager_frontend
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Access Application**
   ```
   http://localhost:5173
   ```

## Features

- 📊 **Jira Integration** - Sync and manage Jira projects and issues
- 📈 **Analytics Dashboard** - Performance metrics and cost analysis
- 🤖 **AI-Powered Insights** - LLM integration for intelligent project analysis
- 🎯 **Milestone Tracking** - Create and manage project milestones
- 💰 **Cost Management** - Track assignee costs and project budgets

## API Documentation

API documentation is available via Swagger UI at:
```
http://localhost:8080/swagger-ui.html
```

## Docker Deployment

Build and run with Docker:

```bash
# Build images
docker-compose build

# Run containers
docker-compose up
```

## CI/CD

The project uses GitHub Actions for automated deployment.

Required GitHub Secrets:
- `DOCKER_USERNAME` & `DOCKER_PASSWORD`
- `BACKEND_DB_URL`, `BACKEND_DB_USERNAME`, `BACKEND_DB_PASSWORD`
- `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`
- `BACKEND_HOST`, `BACKEND_USERNAME`, `BACKEND_SSH_KEY`
- `FRONTEND_HOST`, `FRONTEND_USERNAME`, `FRONTEND_SSH_KEY`

See `.github/workflows/ci-cd.yml` for full CI/CD configuration.

## Environment Variables

### Backend
- `SPRING_DATASOURCE_URL` - Database connection URL
- `SPRING_DATASOURCE_USERNAME` - Database username
- `SPRING_DATASOURCE_PASSWORD` - Database password
- `JIRA_BASE_URL` - Your Jira instance URL
- `JIRA_EMAIL` - Jira account email
- `JIRA_API_TOKEN` - Jira API token
- `LLM_SERVER_URL` - External LLM server URL (optional)

### Frontend
- `VITE_API_URL` - Backend API URL (default: http://localhost:8080)

## License

MIT

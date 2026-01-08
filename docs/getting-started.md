### Getting Started

This guide will help you get a local copy of EventPlanner up and running.

#### Prerequisites

- **Node.js**: Version 18.x or higher
- **npm**: Version 9.x or higher
- **Backend Service**: This project is designed to work with a Spring Boot backend usually running on `http://localhost:8080`. If the backend is not available, the application will automatically fall back to using mock data stored in `src/assets/mocks/`.

#### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/your-username/events-planner-ui.git
    cd events-planner-ui
    ```

2. **Install dependencies**
    ```bash
    npm install
    ```

#### Development

Start the development server with Hot-Module Replacement (HMR):

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

#### Building for Production

To build the project for production, run:

```bash
npm run build
```

The output will be in the `dist/` directory. You can preview the production build locally:

```bash
npm run preview
```

#### Testing

EventPlanner uses a comprehensive testing strategy including unit tests and E2E tests.

- **Unit Tests (Vitest)**:

    ```bash
    npm run test:unit
    ```

- **End-to-End Tests (Playwright)**:

    ```bash
    # Install Playwright browsers (first time only)
    npx playwright install

    # Run tests
    npm run test:e2e
    ```

#### Environment Configuration

The application is configured to connect to the backend at `http://localhost:8080` by default. This is defined in `src/api/axios.ts` and `src/constants/api.ts`.

# EventPlanner

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4fc08d?style=flat-square&logo=vue.js)](https://vuejs.org/)
[![Pinia](https://img.shields.io/badge/Pinia-2.x-yellow?style=flat-square&logo=pinia)](https://pinia.vuejs.org/)
[![PrimeVue](https://img.shields.io/badge/PrimeVue-4.x-33ab83?style=flat-square&logo=primevue)](https://primevue.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3.x-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

EventPlanner is a modern, professional event planning platform designed for organizers and teams. It allows seamless coordination of events, tasks, members, and locations in real-time.

## 🚀 Quick Start

```bash
git clone https://github.com/your-username/events-planner-ui.git
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

---

## 📖 Documentation

For detailed information about the project, please refer to the following guides:

- 🛠 **[Getting Started](./docs/getting-started.md)**: Installation, Prerequisites, and local development.
- ✨ **[Features & Functionality](./docs/features.md)**: Overview of User/Admin capabilities and route protection.
- 🏗 **[Architecture & Tech Stack](./docs/architecture.md)**: Technical overview, diagrams, and design patterns.

---

## 🌟 Key Features

### For Users

- **Unified Dashboard**: Visual overview of your events and urgent tasks.
- **Event Coordination**: Detailed management of schedules, locations, and teams.
- **Task Tracking**: Assign tasks, set deadlines, and monitor progress.

### For Administrators

- **System Monitoring**: Integration with Spring Boot Actuator for health and performance metrics.
- **User Management**: Full control over user accounts, roles, and security status.
- **Usage Analytics**: Track top API endpoints and system performance.

---

## 🏗 Project Structure

```text
src/
├── api/          # Axios configuration and interceptors
├── assets/       # Static assets and mock data
├── components/   # Reusable Vue components (grouped by domain)
├── composables/  # Reusable logic (form management, stats calculation)
├── constants/    # Centralized API endpoints and UI constants
├── pages/        # Main route views
├── router/       # Vue Router configuration and guards
├── schemas/      # Zod validation schemas and initial values
├── services/     # API communication layer
├── stores/       # Pinia state management
├── types/        # TypeScript interfaces and DTOs
└── utils/        # Helper functions (formatting, date logic)
```

---

## 🧪 Testing

We ensure quality through rigorous testing:

- **Unit Tests**: Powered by Vitest. `npm run test:unit`
- **E2E Tests**: Powered by Playwright. `npm run test:e2e`

---

Built with ❤️ using Vue 3 and PrimeVue.

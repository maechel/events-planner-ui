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

## 🔑 Authentication

The API uses session-based authentication.

- **Register**: `POST /api/auth/register` -> `{"message": "string"}` or `{"error": "string"}`
- **Login**: `POST /api/auth/login` -> `{"message": "string"}` or `{"error": "string"}`
- **Logout**: `POST /api/auth/logout` -> `204 No Content`
- **Current User**: `GET /api/me` -> `{"authenticated": boolean, "id": "UUID string", "username": "string", "roles": ["string"]}`

## 📑 Main API Endpoints

### Events

- `GET /api/events` - List events (personalized for users, all for admins). Returns `List<EventSummaryDTO>`.
- `POST /api/events` - Create a new event. Returns `EventDetailDTO`.
- `GET /api/events/{id}` - Get event details. Returns `EventDetailDTO`.
- `PUT /api/events/{id}` - Update event details. Returns `EventDetailDTO`.
- `DELETE /api/events/{id}` - Delete an event. Returns `204 No Content`.
- `GET /api/events/{id}/members` - Get event members. Returns `Set<UserSummaryDTO>`.
- `GET /api/events/{id}/organizers` - Get event organizers. Returns `Set<UserSummaryDTO>`.
- `POST /api/events/{id}/members/{userId}` - Add a participant. Returns `EventDetailDTO`.
- `DELETE /api/events/{id}/members/{userId}` - Remove a participant. Returns `EventDetailDTO`.
- `POST /api/events/{id}/organizers/{userId}` - Add an organizer. Returns `EventDetailDTO`.
- `DELETE /api/events/{id}/organizers/{userId}` - Remove an organizer. Returns `EventDetailDTO`.

### Tasks

- `GET /api/tasks` - List tasks assigned to the current user (can be filtered by `eventId`). Returns `List<TaskSummaryDTO>`.
- `POST /api/tasks` - Create a task (must be linked to an event). Returns `TaskDetailDTO`.
- `GET /api/tasks/{id}` - Get task details. Returns `TaskDetailDTO`.
- `PUT /api/tasks/{id}` - Update task details. Returns `TaskDetailDTO`.
- `DELETE /api/tasks/{id}` - Delete a task. Returns `204 No Content`.
- `PATCH /api/tasks/{id}/toggle` - Mark task as completed/incomplete. Returns `TaskDetailDTO`.

### Users

- `GET /api/users` - List all user summaries. Returns `List<UserSummaryDTO>`.

### Admin

- `GET /api/admin/stats` - System-wide statistics. Returns `AdminStatsDTO`.
- `GET /api/admin/users` - List all users with details. Returns `List<UserDetailDTO>`.
- `GET /api/admin/users/{id}` - Get user details. Returns `UserDetailDTO`.
- `POST /api/admin/users` - Create a new user (Admin only). Returns `UserDetailDTO`.
- `PUT /api/admin/users/{id}` - Update user details. Returns `UserDetailDTO`.
- `DELETE /api/admin/users/{id}` - Delete a user. Returns `204 No Content`.

## 📦 Data Transfer Objects (DTOs)

Below are the details of the DTOs used by the API, providing clarity on the expected fields and types for the frontend.

### User DTOs

#### `UserSummaryDTO`

Used for lists and nested user references where minimal info is needed.

- `id`: `UUID`
- `username`: `String`
- `avatar`: `String` (nullable)

#### `UserDetailDTO`

Detailed user information, typically used in Admin views.

- `id`: `UUID`
- `username`: `String`
- `email`: `String`
- `enabled`: `boolean`
- `accountNonLocked`: `boolean`
- `avatar`: `String` (nullable)
- `failedLoginAttempts`: `int`
- `lastLogin`: `OffsetDateTime`
- `createdAt`: `OffsetDateTime`
- `updatedAt`: `OffsetDateTime`
- `authorities`: `Set<String>` (e.g., `["ROLE_USER", "ROLE_ADMIN"]`)

### Event DTOs

#### `EventSummaryDTO`

Used when listing events.

- `id`: `UUID`
- `title`: `String`
- `description`: `String`
- `date`: `OffsetDateTime`
- `locationName`: `String`
- `participantCount`: `long`
- `taskCount`: `long`
- `hasUnfinishedTasks`: `boolean`

#### `EventDetailDTO`

Detailed event information.

- `id`: `UUID`
- `title`: `String`
- `description`: `String`
- `date`: `OffsetDateTime`
- `address`: `AddressDTO`
- `organizers`: `Set<UserSummaryDTO>`
- `members`: `Set<UserSummaryDTO>`
- `tasks`: `Set<TaskSummaryDTO>`
- `createdAt`: `OffsetDateTime`
- `updatedAt`: `OffsetDateTime`

#### `AddressDTO`

- `id`: `UUID`
- `street`: `String`
- `city`: `String`
- `zipCode`: `String`
- `country`: `String`
- `locationName`: `String`
- `latitude`: `Double` (nullable)
- `longitude`: `Double` (nullable)

### Task DTOs

#### `TaskSummaryDTO`

- `id`: `UUID`
- `description`: `String`
- `completed`: `boolean`
- `dueDate`: `OffsetDateTime`
- `assignedToId`: `UUID`
- `assignedToUsername`: `String`
- `eventId`: `UUID`

#### `TaskDetailDTO`

- `id`: `UUID`
- `description`: `String`
- `completed`: `boolean`
- `dueDate`: `OffsetDateTime`
- `assignedTo`: `UserSummaryDTO`
- `eventId`: `UUID`
- `createdAt`: `OffsetDateTime`
- `updatedAt`: `OffsetDateTime`

### Admin DTOs

#### `AdminStatsDTO`

- `totalUsers`: `long`
- `totalEvents`: `long`
- `totalTasks`: `long`
- `completedTasks`: `long`
- `taskCompletionRate`: `double`
- `activeOrganizers`: `long`

---

## 🧪 Testing

We ensure quality through rigorous testing:

- **Unit Tests**: Powered by Vitest. `npm run test:unit`
- **E2E Tests**: Powered by Playwright. `npm run test:e2e`

---

Built with ❤️ using Vue 3 and PrimeVue.

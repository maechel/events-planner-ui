### Features & Functionality

EventPlanner provides a robust set of features for both regular users and administrators.

#### 1. Authentication & Session Management

- **Secure Login & Registration**: Users can create accounts and log in using JWT-based authentication.
- **Session Persistence**: The application remembers the last visited route and restores the session on refresh.
- **Automatic Fallback**: If the backend is unreachable, the app uses local mock data to remain functional for demonstration.

#### 2. User Features

- **Dashboard**: A comprehensive overview of upcoming events, urgent tasks, and participation statistics.
- **Event Management**:
    - Browse upcoming and past events.
    - View detailed event information including location, schedule, and team.
    - Create and update events (for organizers).
- **Task Coordination**:
    - Create, assign, and track tasks within events.
    - Real-time updates on task completion status.
    - Automatic urgency calculation for upcoming deadlines.
- **Team Collaboration**:
    - Add/remove organizers and members to events.
    - Manage participant roles.

#### 3. Administrator Features

- **Admin Dashboard**: System-level overview with real-time monitoring.
- **System Monitoring**:
    - Integration with Spring Boot Actuator.
    - Real-time health checks (Database, Disk Space).
    - Resource monitoring (CPU usage, Memory usage, Uptime).
    - API usage statistics (Top endpoints by hit count and response time).
- **User Management**:
    - List all registered users.
    - Create, update, and delete users.
    - Manage user roles (Admin vs. User).
    - Monitor security metrics (Last login, failed login attempts, account lock status).

#### 4. UI/UX

- **Modern Design**: Built with Tailwind CSS and PrimeVue for a professional look.
- **Responsive Layout**: Optimized for both desktop and mobile devices.
- **Dark Mode Support**: Seamlessly switch between light and dark themes.
- **Feedback System**: Real-time toast notifications and progress bars for all asynchronous operations.

---

### User vs. Admin Routes

Access control is strictly enforced via Vue Router guards.

| Route                  | Accessibility | Description                            |
| :--------------------- | :------------ | :------------------------------------- |
| `/`                    | Public        | Landing page with platform overview.   |
| `/login` / `/register` | Public        | Authentication portals.                |
| `/dashboard`           | User          | Personal overview of events and tasks. |
| `/events`              | User          | List and management of events.         |
| `/admin`               | Admin         | System monitoring dashboard.           |
| `/admin/users`         | Admin         | User management interface.             |
| `/changelog`           | Public        | History of application updates.        |

> **Note**: Routes marked as `Admin` require the user to have the `ROLE_ADMIN` authority. Unauthorized access attempts are redirected to the home page.

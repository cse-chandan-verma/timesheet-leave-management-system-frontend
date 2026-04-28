# 🗂️ Timesheet & Leave Management System — Frontend

A production-grade enterprise HR management frontend built with **React + Vite**, connected to a **Spring Boot Microservices** backend.

---

## 🖥️ Tech Stack

### Frontend
| Technology | Version |
|---|---|
| React | 18.x |
| Vite | Latest |
| React Router DOM | 6.x |
| Axios | 1.x |
| Lucide React | 0.383.0 |
| CSS (Custom) | — |
| Font — Josefin Sans | Google Fonts |

### Backend (Microservices)
| Technology | Version |
|---|---|
| Java | 17 |
| Spring Boot | 4.0.4 |
| Spring Cloud Gateway | 2025.1.1 |
| Spring Security + JWT | 7.x |
| MySQL | 8.0 |
| RabbitMQ | 3.12 |
| Docker Compose | Latest |
| Eureka Server | Latest |

---

## 🎨 Color Palette

| Color | Hex | Usage |
|---|---|---|
| Dark Gray | `#4A4A4A` | Primary / Sidebar |
| Steel Blue | `#6D8196` | Accent / Buttons |
| Light Gray | `#CBCBCB` | Borders |
| Cream White | `#FFFFE3` | Background |

---

## 🔐 Role Based Access

| Role | Access |
|---|---|
| `EMPLOYEE` | Dashboard, Timesheet, Leave, Holidays, Profile |
| `MANAGER` | Everything above + Pending Timesheets, Pending Leaves, Team Overview |
| `ADMIN` | Everything above + User Management, Holiday Management, Notifications, Audit Log |

---

## 🚀 Pages Overview

### Auth
- **Login** — JWT based login with role redirect
- **Register** — Employee self registration
- **Forgot Password** — Password reset via email

### Employee
- **Dashboard** — Leave balance overview, recent timesheets
- **Timesheet** — Log daily hours per project, submit and recall
- **Timesheet History** — View all past weekly timesheets
- **Leave** — Apply for leave with balance cards
- **Leave History** — View and cancel leave requests
- **Holidays** — Company holiday calendar
- **Profile** — View and update name and password

### Manager
- **Dashboard** — Pending items overview
- **Pending Timesheets** — Approve or reject with comments
- **Pending Leaves** — Approve or reject with comments
- **Team Overview** — View all employees

### Admin
- **Dashboard** — Full system overview
- **User Management** — View all users, change roles
- **Holiday Management** — Add and delete holidays
- **Notifications** — View all system events
- **Audit Log** — Complete history of all actions

---

## 🏗️ Backend Architecture

The backend is built using **Spring Boot Microservices** with the following services:

| Service | Port | Responsibility |
|---|---|---|
| Eureka Server | `8761` | Service registry and discovery |
| API Gateway | `8080` | Single entry point, JWT validation, routing |
| Auth Service | `8081` | Login, register, profile, role management |
| Timesheet Service | `8082` | Timesheet entries, weekly submission, approval |
| Leave Service | `8083` | Leave requests, balances, holidays |
| Admin Service | `8084` | Approval orchestration via OpenFeign, audit log |
| Notification Service | `8085` | RabbitMQ consumer, email notifications |

### Security Flow

Frontend → API Gateway (validates JWT) → Downstream Service (reads headers)

- JWT generated on login, valid for 24 hours
- Gateway validates token and passes `X-User-Email`, `X-User-Role`, `X-User-Id` headers
- Downstream services read headers — no re-parsing of JWT
---

## ⚙️ Running the Project

### Prerequisites
- Node.js 18+
- Docker Desktop
- Backend repo cloned and running

### Frontend Setup
```bash
# Clone the repo
git clone https://github.com/cse-chandan-verma/timesheet-leave-management-system-frontend.git

# Go into project folder
cd tms-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs at → `http://localhost:5173`

### Backend Setup
```bash
# Clone backend repo
git clone <backend-repo-url>

# Start all services via Docker
docker-compose up --build -d
```

Backend gateway runs at → `http://localhost:8080`

---

## 🔑 Test Credentials

| Role | Email | Password |
|---|---|---|
| Admin | `admin@tms.com` | `Admin@1234` |
| Manager | `manager@tms.com` | `Manager@1234` |
| Employee | `john@tms.com` | `John@1234` |
| Employee | `priya@tms.com` | `Emp@1234` |

---

## 🔗 Backend Repository

> 🔗 [Timesheet & Leave Management System — Backend](https://github.com/cse-chandan-verma/timesheet-leave-management-system)

---

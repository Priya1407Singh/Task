# NOVA - Premium Full-Stack Team Task Manager

NOVA is a high-performance, visually stunning workspace designed for team collaboration and task management. Built with a modern tech stack and a futuristic "Cyberpunk" aesthetic, it offers a seamless experience for managing projects, tracking missions, and coordinating team personnel.

## 🚀 Live Demo
*   **Frontend**: [Link to be added after deployment]
*   **Backend**: [Link to be added after deployment]

## ✨ Key Features
-   **Mission Control Dashboard**: Real-time analytics of project health, task status, and overdue objectives.
-   **Sector Management**: Create and organize projects into "Sectors" for clean scoping.
-   **Mission Log (Task Board)**: Advanced task tracking with status updates and priority levels.
-   **Fleet Management (Team)**: Direct personnel recruitment via email and role-based access.
-   **Operator Profiles**: Customizable profiles with unique avatars and display settings.
-   **Secure Access**: JWT-based authentication for data protection.

## 🛠️ Tech Stack
-   **Frontend**: React 18, TypeScript, Vite, Lucide Icons, Custom CSS3 (Glassmorphism).
-   **Backend**: Node.js, Express.js.
-   **Database**: Prisma ORM, SQLite (Production-ready schema).
-   **Security**: Bcrypt.js for hashing, JSON Web Tokens (JWT) for session management.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository
```bash
git clone https://github.com/Priya1407Singh/task.git
cd task
```

### 2. Backend Setup
```bash
cd backend
npm install
# Setup environment variables
cp .env.example .env
# Initialize database
npx prisma migrate dev --name init
# Start server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Start dev server
npm run dev
```

## 🌐 Deployment Instructions

### Backend (Railway)
1. Connect your GitHub repo to Railway.
2. Add environment variables: `PORT`, `JWT_SECRET`, `DATABASE_URL`.
3. The `postinstall` script will automatically generate the Prisma client.

### Frontend (Vercel)
1. Connect repo to Vercel and set root directory to `frontend`.
2. Add Environment Variable: `VITE_API_URL` (pointing to your Railway backend URL).

## 📄 License
This project was developed as a technical assignment. All rights reserved.

---
**Operator: NOVA Mainframe // Systems Online.**

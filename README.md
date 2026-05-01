# CatchUp 🚀 - Revenue Recovery SaaS

CatchUp is a full-stack Revenue Recovery platform designed to help freelancers and agencies automatically follow up with pending deals and recover lost revenue. It features an automated backend engine that tracks deal age and dispatches SMTP follow-up emails, combined with a sleek, glassmorphism-inspired React frontend.

![CatchUp Dashboard](https://via.placeholder.com/800x400.png?text=CatchUp+Dashboard) <!-- Replace with an actual screenshot of your app -->

## ✨ Key Features
- **Automated Follow-up Engine**: A Node.js background process that tracks lead waiting times and automatically sends customized emails via SMTP.
- **Full-Stack Architecture**: React (Vite) frontend communicating with an Express.js REST API.
- **Persistent Local Database**: Uses SQLite for fast, local storage of leads, tasks, activity logs, and user settings.
- **Premium UI/UX**: Custom CSS featuring dynamic glassmorphism, responsive data tables, modern typography (Outfit font), and global toast notifications.
- **Pipeline Analytics**: Real-time calculation of recovered vs. pending revenue with visual progress indicators.
- **Task Management**: Built-in manual task tracker for high-touch clients.

## 🛠️ Tech Stack
- **Frontend**: React.js, Vite, Vanilla CSS (Glassmorphism UI)
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Email Service**: Nodemailer (SMTP integration)

## 🚀 Getting Started

To run this application locally, you will need to start both the backend server and the frontend development environment.

### 1. Clone the repository
```bash
git clone https://github.com/your-username/CatchUp.git
cd CatchUp
```

### 2. Start the Backend
The backend runs on `http://localhost:5000` and manages the SQLite database and email automation engine.
```bash
cd catchup-backend
npm install
node server.js
```

### 3. Start the Frontend
The frontend runs on `http://localhost:5173` using Vite.
```bash
cd catchup-app
npm install
npm run dev
```

## 🧠 System Architecture
1. **Frontend (`catchup-app`)**: Handles user interactions, form validations, and displays real-time data via `useEffect` polling. It communicates exclusively via the REST API.
2. **Backend (`catchup-backend`)**: Exposes REST endpoints (`GET/POST/PUT/DELETE /api/leads`). It also runs an isolated `setInterval` loop every 10 seconds to scan the `leads` table. If a lead has exceeded the `targetDays` threshold, it attempts an SMTP dispatch.
3. **Database (`catchup.db`)**: Self-contained SQLite file. Easy to back up and perfect for single-tenant prototype deployments.

## 🔮 Future Roadmap (Unfinished Features)
While the core recovery engine is functional, the following features are planned for future releases:
- **Authentication**: JWT-based login (e.g., Supabase or Auth0 integration).
- **Payment Processing**: Stripe integration to capture recovered payments directly via a payment link.
- **Multi-tenant Architecture**: Migrating from SQLite to PostgreSQL to support multiple discrete user accounts.

## 📝 License
MIT License. Feel free to use this as a boilerplate for your own full-stack SaaS projects!

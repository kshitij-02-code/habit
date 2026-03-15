# ✅ Habit & Study Tracker

A full-stack web application to help students build better daily habits and achieve their study goals. Track your routines, set deadlines, and monitor progress — all from a beautifully animated dashboard.

---

## 📸 Features

- **User Authentication** — Register & login with email/password. Sessions persist via `localStorage`.
- **Dashboard** — Personalized overview with stat cards, completion progress bars, and recent habit activity.
- **Habit Management** — Create, edit, delete, and quick-update status (active → completed / skipped) for daily habits.
- **Goal Tracking** — Set goals with deadlines, track status (pending → in-progress → completed), and see time remaining with overdue warnings.
- **Responsive Design** — Adaptive sidebar navigation for desktop; collapsible drawer + top app bar on mobile.
- **Smooth Animations** — Page transitions, staggered card reveals, and hover effects powered by Framer Motion.
- **Toast Notifications** — Instant feedback on every action via Notistack snackbar.

---

## 🛠️ Tech Stack

| Layer        | Technology                                                                       |
| ------------ | -------------------------------------------------------------------------------- |
| **Frontend** | React 19, Vite 7, Material UI 7, Framer Motion, Axios, Day.js, React Router DOM |
| **Backend**  | Node.js, Express 5, Mongoose 9                                                  |
| **Database** | MongoDB                                                                          |
| **Styling**  | MUI Theme (Inter font, custom palette, rounded components)                       |
| **Deploy**   | Render (backend via `render.yaml`)                                               |

---

## 📁 Project Structure

```
habit-study-tracker/
├── package.json              # Root — monorepo build & start scripts
│
├── backend/
│   ├── index.js              # Express server, MongoDB connection
│   ├── models/
│   │   ├── User.js           # name, email, password, role (student/admin)
│   │   ├── Habit.js          # title, description, time, status, userId
│   │   └── Goal.js           # title, description, deadline, status, userId
│   ├── routes/
│   │   ├── userRoutes.js     # CRUD + signin
│   │   ├── habitRoutes.js    # CRUD
│   │   └── goalRoutes.js     # CRUD
│   ├── render.yaml           # Render deployment config
│   └── .env                  # MONGO_URI, PORT
│
└── Frontend/
    ├── index.html
    ├── vite.config.js        # Dev proxy /api → :5000, chunk splitting
    ├── .env                  # VITE_API_URL
    └── src/
        ├── main.jsx          # React root + Inter font imports
        ├── App.jsx           # Routes, providers (Theme, Auth, Snackbar)
        ├── theme.js          # MUI theme (palette, typography, components)
        ├── context/
        │   └── AuthContext.jsx   # Auth state, login, register, logout
        ├── services/
        │   └── api.js            # Axios instance with all API calls
        ├── components/
        │   ├── Layout.jsx        # Sidebar + responsive app shell
        │   └── ProtectedRoute.jsx
        └── pages/
            ├── Dashboard.jsx     # Stats, progress bars, recent habits
            ├── Habits.jsx        # CRUD cards with quick status actions
            ├── Goals.jsx         # CRUD cards with deadlines & progress
            ├── Login.jsx         # Gradient auth page
            └── Register.jsx      # Sign-up form
```

---

## 🔌 API Endpoints

### Users — `/api/users`

| Method   | Endpoint   | Description        |
| -------- | ---------- | ------------------ |
| `POST`   | `/`        | Register a user    |
| `POST`   | `/signin`  | Sign in            |
| `GET`    | `/`        | Get all users      |
| `GET`    | `/:id`     | Get user by ID     |
| `PUT`    | `/:id`     | Update user        |
| `DELETE` | `/:id`     | Delete user        |

### Habits — `/api/habits`

| Method   | Endpoint | Description       |
| -------- | -------- | ----------------- |
| `POST`   | `/`      | Create a habit    |
| `GET`    | `/`      | Get all habits    |
| `GET`    | `/:id`   | Get habit by ID   |
| `PUT`    | `/:id`   | Update a habit    |
| `DELETE` | `/:id`   | Delete a habit    |

### Goals — `/api/goals`

| Method   | Endpoint | Description      |
| -------- | -------- | ---------------- |
| `POST`   | `/`      | Create a goal    |
| `GET`    | `/`      | Get all goals    |
| `GET`    | `/:id`   | Get goal by ID   |
| `PUT`    | `/:id`   | Update a goal    |
| `DELETE` | `/:id`   | Delete a goal    |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **MongoDB** (local instance or [MongoDB Atlas](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/habit-study-tracker.git
cd habit-study-tracker
```

### 2. Configure environment variables

**Backend** (`backend/.env`):

```env
MONGO_URI=mongodb://localhost:27017/habits-tracker
PORT=5000
NODE_ENV=development
```

**Frontend** (`Frontend/.env`):

```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Install dependencies & run

```bash
# Install all dependencies (backend + frontend)
npm run build

# Start the backend server
npm start
```

Or run **frontend** and **backend** separately for development:

```bash
# Terminal 1 — Backend
cd backend
npm install
npm run dev          # Uses nodemon for hot reload

# Terminal 2 — Frontend
cd Frontend
npm install
npm run dev          # Vite dev server on http://localhost:3000
```

The Vite dev server proxies all `/api` requests to `http://localhost:5000`.

---

## 🌐 Deployment

The backend includes a `render.yaml` for one-click deployment on [Render](https://render.com):

```yaml
services:
  - type: web
    name: backend
    runtime: node
    buildCommand: npm install
    startCommand: node index.js
    envVars:
      - key: MONGO_URI
        sync: false
      - key: NODE_ENV
        value: production
```

For the frontend, build with `npm run build` inside the `Frontend/` folder and deploy the `dist/` output to any static hosting (Vercel, Netlify, Render Static Site, etc.).

---

## 📄 License

This project is open source and available under the [ISC License](https://opensource.org/licenses/ISC).

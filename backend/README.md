# habit-backend

A RESTful API backend for a **Habit and Study Tracker** application built with Node.js, Express, and MongoDB.

## Features

- User management
- Habit tracking
- Goal setting and tracking

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Other:** CORS, dotenv

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB running locally or a MongoDB Atlas URI

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kshitij-02-code/habit-backend.git
   cd habit-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/habit-tracker
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

## API Endpoints

| Method | Endpoint        | Description       |
|--------|-----------------|-------------------|
| GET    | `/`             | Health check      |
| -      | `/api/users`    | User routes       |
| -      | `/api/habits`   | Habit routes      |
| -      | `/api/goals`    | Goal routes       |

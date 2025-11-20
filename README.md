# Task Management System

A comprehensive RESTful API for managing tasks, with user authentication, role-based access control, task analytics, and real-time notifications.

---

## Features

- User registration, login, logout
- Role-Based Access Control (Admin, Manager, User)
- Task CRUD operations
- Task assignment to users
- Task analytics (user & team)
- Overdue task tracking
- Rate limiting on sensitive routes
- Real-time notifications via Socket.io
- Redis caching

---

## Tech Stack

- Node.js + Express
- MongoDB
- Redis
- Socket.io
- JWT Authentication
- Docker (for Redis)

---

## Prerequisites

- Node.js v18+ installed
- MongoDB running locally or in the cloud
- Docker installed (for Redis)
- Git installed

---

## Setup Instructions

### 1️⃣ Clone Repository
```bash
git clone <https://github.com/Vikashkumar81021/Task-management>
cd task-management-system
### 2️⃣ Install Dependencies
npm install
### 3️⃣ Configure Environment Variables
Create a .env file in the root directory:
PORT=8000
MONGO_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
NODE_ENV=development
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

###4️⃣ Run Redis via Docker
Pull Redis image if not already done:
docker pull redis:latest
Run Redis container:
docker run --name my-redis -p 6379:6379 -d redis
Check Redis status:
docker ps
Test connection:
docker exec -it my-redis redis-cli

###5️⃣ Run the Backend Server
node --watch src/server.js
Server will start on http://localhost:8000
###6️⃣ API Documentation

Swagger UI is available at:
https://task-management-ilmz.onrender.com/api-docs/


# Full Stack Internship Project (MySQL)

Author: D.J. Hassain Baba

## Overview
Backend: Node.js + Express + Sequelize + MySQL + JWT
Frontend: React (Vite) + Tailwind + Axios

## Setup

### MySQL
- Ensure MySQL is running.
- Create database:
  CREATE DATABASE internship_db;

### Backend
cd backend
npm install
# ensure .env has correct DB credentials (DB_USER, DB_PASS, DB_HOST, DB_PORT, DB_NAME)
npm run dev

### Frontend
cd frontend
npm install
npm run dev

## Notes
- Backend .env is preconfigured for:
  DB_USER=root
  DB_PASS=1234
  DB_NAME=internship_db


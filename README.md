Recycling Production Line Manager Selection System

A full-stack web application to evaluate and rank candidates for a Recycling Production Line Manager role using skill-based scoring and a visual dashboard.

FEATURES

Generates 40 realistic candidate profiles using Faker.js

Evaluates candidates on Crisis Management, Sustainability Knowledge, and Team Motivation

Automatic ranking and leaderboard

Heatmap for quick score comparison

Detailed candidate profile cards

TECH STACK
Frontend: React 18, Vite, Mantine UI
Backend: Node.js, Express
Database: MySQL 8.0
Utilities: Faker.js, Mock AI evaluator

PROJECT STRUCTURE
backend/
frontend/
database/
ai-prompts/

SETUP

Clone the repository
git clone https://github.com/GopalGandhi16/Recycling_Production_Line_Manager.git

cd Recycling_Production_Line_Manager

Setup database
mysql -u root -p
source database/schema.sql
exit

Generate candidate data
cd database
npm install
npm run generate

Start backend
cd ../backend
npm install
cp .env.example .env
npm start

Start frontend
cd ../frontend
npm install
npm run dev

API ENDPOINTS
GET /api/health
GET /api/candidates/all
GET /api/candidates/leaderboard
GET /api/candidates/:id

NOTES

Uses a logic-based Mock AI for scoring

Can be easily replaced with real AI APIs

Built as an internship assignment

AUTHOR
Gopal Gandhi
GitHub: https://github.com/GopalGandhi16

# Recycling Production Line Manager Selection System

A full-stack web app to evaluate and rank candidates for a Recycling Production Line Manager role using skill-based scoring and a visual dashboard.

---

## Features
- Generate 40 realistic candidates using Faker.js  
- Evaluate candidates on 3 criteria:
  - Crisis Management
  - Sustainability Knowledge
  - Team Motivation
- Automatic ranking and leaderboard
- Heatmap for quick score comparison
- Detailed candidate profiles

---

## Tech Stack
- Frontend: React 18, Vite, Mantine UI  
- Backend: Node.js, Express  
- Database: MySQL 8.0  
- Utilities: Faker.js, Mock AI evaluator

---

## Project Structure
backend/
frontend/
database/
ai-prompts/


---

## Setup

### 1. Clone repo
```bash
git clone https://github.com/yourusername/recycling-manager-selection.git
cd recycling-manager-selection
2. Setup database
mysql -u root -p
source database/schema.sql
exit
Generate data:

cd database
npm install
npm run generate
3. Start backend
cd ../backend
npm install
cp .env.example .env
npm start
4. Start frontend
cd ../frontend
npm install
npm run dev
API Endpoints
GET /api/health
GET /api/candidates/all
GET /api/candidates/leaderboard
GET /api/candidates/:id
Notes
Uses a logic-based Mock AI for scoring

Easily replaceable with real AI APIs

Built as an internship assignment





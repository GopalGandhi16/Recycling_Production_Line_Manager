# Recycling Production Line Manager Selection System

A candidate evaluation dashboard that ranks 40 applicants using AI-based assessment on crisis management, sustainability knowledge, and team motivation skills.

## What It Does

- Generates 40 realistic candidates using Faker.js
- Evaluates each candidate on 3 key criteria (1-10 scoring)
- Displays rankings in an interactive dashboard
- Shows leaderboard, score heatmap, and detailed profiles

---

## Tech Stack

**Frontend:** React + Vite + Mantine UI  
**Backend:** Node.js + Express  
**Database:** MySQL 8.0  
**AI:** Mock AI (can swap for Claude/OpenAI)

---

## Quick Setup

### 1. Database
```bash
mysql -u root -p
source database/schema.sql
exit

cd database
npm install
npm run generate
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL password
npm start
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:3000**

---

## Features

✅ Top 10 candidate leaderboard  
✅ Color-coded score heatmap  
✅ Detailed candidate profiles  
✅ Statistics dashboard  
✅ Auto-ranked by AI evaluation  

---

## Database Schema

```
candidates (id, name, experience, skills)
    ↓
evaluations (candidate_id, crisis_management, sustainability, team_motivation)
    ↓
rankings (candidate_id, total_score, rank_position)
```

---

## API Endpoints

```
GET /api/health              - Health check
GET /api/candidates/all      - All 40 candidates
GET /api/candidates/leaderboard  - Top 10
GET /api/candidates/:id      - Single candidate
```

---

## AI Evaluation

Three criteria scored 1-10:
- **Crisis Management** - Emergency handling, problem-solving
- **Sustainability** - Environmental knowledge, regulations
- **Team Motivation** - Leadership, communication

**Total Score:** Sum of all three (3-30 range)

Currently using **Mock AI** for speed and cost. Real AI prompts ready in `/ai-prompts/`.

---

## Project Structure

```
recycling-manager-selection/
├── backend/          # Express API + Mock AI
├── frontend/         # React dashboard
├── database/         # SQL schema + Faker generator
├── ai-prompts/       # AI evaluation prompts
└── screenshots/      # Dashboard images
```

---

## Testing

**Regenerate candidates:**
```bash
cd database
npm run generate
```

**Test API:**
```bash
curl http://localhost:5000/api/candidates/leaderboard
```

---

## Notes

- Built as internship assignment
- ~15 hours total development time
- Mock AI can be swapped for real Claude/OpenAI API
- See `/ai-prompts/AI_PROMPTS.md` for evaluation details

---

## Contact

**Gopal Gandhi**  
Email:  gopalgandhi016@gmail.com
GitHub: github.com/GopalGandhi16

---

Built with ☕ and React

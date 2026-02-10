const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

const mockAI = require('../backend/utils/mockAI');

function generateCandidates(count = 40) {
  const candidates = [];

  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();

    candidates.push({
      name: `${firstName} ${lastName}`,
      experience: faker.number.int({ min: 3, max: 15 }),
      skills: generateSkills()
    });
  }

  return candidates;
}

async function insertData() {
  let connection;

  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'recycling_manager_db'
    });

    const candidates = generateCandidates(40);

    await connection.query('DELETE FROM rankings');
    await connection.query('DELETE FROM evaluations');
    await connection.query('DELETE FROM candidates');
    await connection.query('ALTER TABLE candidates AUTO_INCREMENT = 1');

    for (const candidate of candidates) {
      const [result] = await connection.query(
        'INSERT INTO candidates (name, experience, skills) VALUES (?, ?, ?)',
        [candidate.name, candidate.experience, candidate.skills]
      );

      const candidateId = result.insertId;
      const evaluation = mockAI.evaluateCandidate({ ...candidate, id: candidateId });

      await connection.query(
        'INSERT INTO evaluations (candidate_id, crisis_management, sustainability, team_motivation) VALUES (?, ?, ?, ?)',
        [
          candidateId,
          evaluation.crisis_management,
          evaluation.sustainability,
          evaluation.team_motivation
        ]
      );
    }

    await connection.query(`
      INSERT INTO rankings (candidate_id, total_score, rank_position)
      SELECT
        candidate_id,
        total_score,
        RANK() OVER (ORDER BY total_score DESC)
      FROM evaluations
    `);

    const [top5] = await connection.query(`
      SELECT
        c.name,
        c.experience,
        e.crisis_management,
        e.sustainability,
        e.team_motivation,
        e.total_score,
        r.rank_position
      FROM candidates c
      JOIN evaluations e ON c.id = e.candidate_id
      JOIN rankings r ON c.id = r.candidate_id
      ORDER BY r.rank_position
      LIMIT 5
    `);

    top5.forEach((c, i) => {
      console.log(
        `${i + 1}. ${c.name} | Exp: ${c.experience} | Total: ${c.total_score} | Rank: ${c.rank_position}`
      );
    });

  } catch (err) {
    console.error(err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertData();

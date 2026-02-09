const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

// Import mock AI (we'll create this)
const mockAI = require('../backend/utils/mockAI');

// ... (keep existing skillsPool and generateSkills functions)

// REMOVE THIS OLD FUNCTION:
// function generateScores() {
//   return {
//     crisis_management: faker.number.int({ min: 5, max: 10 }),
//     sustainability: faker.number.int({ min: 5, max: 10 }),
//     team_motivation: faker.number.int({ min: 5, max: 10 })
//   };
// }

// Generate candidates WITHOUT scores (AI will evaluate them)
function generateCandidates(count = 40) {
  const candidates = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    candidates.push({
      name: `${firstName} ${lastName}`,
      experience: faker.number.int({ min: 3, max: 15 }),
      skills: generateSkills()
      // No scores here - AI will generate them
    });
  }
  
  return candidates;
}

async function insertData() {
  let connection;
  
  try {
    console.log('🔌 Connecting to database...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'recycling_manager_db'
    });

    console.log('✅ Database connected successfully');

    const candidates = generateCandidates(40);
    console.log(`📊 Generated ${candidates.length} random candidates`);

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await connection.query('DELETE FROM rankings');
    await connection.query('DELETE FROM evaluations');
    await connection.query('DELETE FROM candidates');
    await connection.query('ALTER TABLE candidates AUTO_INCREMENT = 1');

    // Insert candidates and use MOCK AI to evaluate them
    console.log('🤖 Using Mock AI to evaluate candidates...');
    for (const candidate of candidates) {
      const [result] = await connection.query(
        'INSERT INTO candidates (name, experience, skills) VALUES (?, ?, ?)',
        [candidate.name, candidate.experience, candidate.skills]
      );

      const candidateId = result.insertId;
      
      // Create candidate object with ID for AI evaluation
      const candidateWithId = { ...candidate, id: candidateId };

      // 🤖 USE MOCK AI TO GENERATE SCORES
      const aiEvaluation = mockAI.evaluateCandidate(candidateWithId);

      // Insert AI-generated evaluation
      await connection.query(
        'INSERT INTO evaluations (candidate_id, crisis_management, sustainability, team_motivation) VALUES (?, ?, ?, ?)',
        [candidateId, aiEvaluation.crisis_management, aiEvaluation.sustainability, aiEvaluation.team_motivation]
      );
      
      console.log(`   ✓ ${candidate.name}: Crisis=${aiEvaluation.crisis_management}, Sustainability=${aiEvaluation.sustainability}, Motivation=${aiEvaluation.team_motivation}`);
    }

    console.log('✅ All candidates evaluated by Mock AI');

    // Generate rankings
    console.log('📈 Generating rankings...');
    await connection.query(`
      INSERT INTO rankings (candidate_id, total_score, rank_position)
      SELECT 
        candidate_id,
        total_score,
        RANK() OVER (ORDER BY total_score DESC) as rank_position
      FROM evaluations
      ORDER BY total_score DESC
    `);

    console.log('✅ Rankings generated');

    // Show top 5
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

    console.log('\n🏆 TOP 5 CANDIDATES (Evaluated by Mock AI):');
    console.log('═══════════════════════════════════════════════════════════');
    top5.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.name}`);
      console.log(`   Experience: ${candidate.experience} years`);
      console.log(`   🤖 AI Scores: Crisis=${candidate.crisis_management}, Sustainability=${candidate.sustainability}, Motivation=${candidate.team_motivation}`);
      console.log(`   Total: ${candidate.total_score}/30 | Rank: #${candidate.rank_position}`);
      console.log('───────────────────────────────────────────────────────────');
    });

    console.log('\n✨ Mock AI evaluation complete!');
    console.log('🚀 You can now start your backend and frontend servers\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

insertData();
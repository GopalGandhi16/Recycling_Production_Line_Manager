const { faker } = require('@faker-js/faker');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '../backend/.env' });

// Skills pool for recycling manager
const skillsPool = [
  'Waste Management', 'Team Leadership', 'ISO 14001', 'Lean Manufacturing',
  'Recycling Operations', 'Process Optimization', 'Safety Compliance',
  'Quality Control', 'Sustainability Planning', 'Staff Training',
  'Equipment Maintenance', 'Budget Management', 'Environmental Regulations',
  'Crisis Response', 'Stakeholder Management', 'Strategic Planning',
  'Production Scheduling', 'Resource Allocation', 'Six Sigma',
  'Continuous Improvement', 'Recycling Technology', 'Team Motivation',
  'Performance Metrics', 'Vendor Relations', 'Waste Sorting',
  'Health & Safety', 'Logistics Coordination', 'Data Analysis',
  'Circular Economy', 'Change Management', 'Budget Control',
  'Training Development', 'Production Line Management',
  'Sustainability Reporting', 'Risk Assessment', 'Process Engineering',
  'Environmental Compliance', 'Team Building', 'Cost Reduction',
  'Innovation Management', 'Recycling Processes', 'Problem Solving',
  'Inventory Management', 'Quality Assurance', 'Waste Stream Analysis',
  'Leadership Development', 'Green Technologies', 'Project Management',
  'Operations Management', 'Communication Skills', 'Equipment Optimization',
  'Safety Protocols', 'Material Recovery', 'Conflict Resolution',
  'Performance Monitoring', 'Resource Planning', 'Environmental Systems',
  'Team Coordination', 'Regulatory Compliance', 'Efficiency Improvement'
];

// Generate random skills
function generateSkills() {
  const numSkills = faker.number.int({ min: 3, max: 6 });
  const selectedSkills = faker.helpers.arrayElements(skillsPool, numSkills);
  return selectedSkills.join(', ');
}

// Generate random scores
function generateScores() {
  return {
    crisis_management: faker.number.int({ min: 5, max: 10 }),
    sustainability: faker.number.int({ min: 5, max: 10 }),
    team_motivation: faker.number.int({ min: 5, max: 10 })
  };
}

// Generate candidates
function generateCandidates(count = 40) {
  const candidates = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    
    candidates.push({
      name: `${firstName} ${lastName}`,
      experience: faker.number.int({ min: 3, max: 15 }),
      skills: generateSkills(),
      scores: generateScores()
    });
  }
  
  return candidates;
}

// Insert into database
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

    // Insert candidates
    console.log('💾 Inserting candidates...');
    for (const candidate of candidates) {
      const [result] = await connection.query(
        'INSERT INTO candidates (name, experience, skills) VALUES (?, ?, ?)',
        [candidate.name, candidate.experience, candidate.skills]
      );

      const candidateId = result.insertId;

      await connection.query(
        'INSERT INTO evaluations (candidate_id, crisis_management, sustainability, team_motivation) VALUES (?, ?, ?, ?)',
        [candidateId, candidate.scores.crisis_management, candidate.scores.sustainability, candidate.scores.team_motivation]
      );
    }

    console.log('✅ All candidates and evaluations inserted');

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

    console.log('\n🏆 TOP 5 CANDIDATES:');
    console.log('═══════════════════════════════════════════════════════════');
    top5.forEach((candidate, index) => {
      console.log(`${index + 1}. ${candidate.name}`);
      console.log(`   Experience: ${candidate.experience} years`);
      console.log(`   Scores: Crisis=${candidate.crisis_management}, Sustainability=${candidate.sustainability}, Motivation=${candidate.team_motivation}`);
      console.log(`   Total: ${candidate.total_score}/30 | Rank: #${candidate.rank_position}`);
      console.log('───────────────────────────────────────────────────────────');
    });

    console.log('\n✨ Data generation complete!');
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

// Run
insertData();
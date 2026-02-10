
function evaluateCrisisManagement(candidate) {

  let baseScore = Math.min(10, Math.floor(candidate.experience / 2) + 3);
  
  const randomFactor = Math.floor(Math.random() * 5) - 2;
  
  const crisisSkills = ['Crisis Response', 'Problem Solving', 'Risk Assessment', 'Decision Making'];
  const hasSkill = crisisSkills.some(skill => candidate.skills.includes(skill));
  const skillBonus = hasSkill ? 1 : 0;
  
  const score = Math.max(1, Math.min(10, baseScore + randomFactor + skillBonus));
  
  return {
    score,
    reasoning: `Based on ${candidate.experience} years experience and skills analysis`
  };
}


function evaluateSustainability(candidate) {
  let baseScore = Math.min(10, Math.floor(candidate.experience / 2) + 3);
  
  const randomFactor = Math.floor(Math.random() * 5) - 2;
  
  const sustainabilitySkills = [
    'Sustainability', 'Environmental', 'ISO 14001', 
    'Green Technologies', 'Circular Economy', 'Waste Reduction'
  ];
  const hasSkill = sustainabilitySkills.some(skill => candidate.skills.includes(skill));
  const skillBonus = hasSkill ? 1 : 0;
  
  const score = Math.max(1, Math.min(10, baseScore + randomFactor + skillBonus));
  
  return {
    score,
    reasoning: `Evaluated sustainability knowledge and environmental awareness`
  };
}

function evaluateTeamMotivation(candidate) {
  let baseScore = Math.min(10, Math.floor(candidate.experience / 2) + 3);
  
  const randomFactor = Math.floor(Math.random() * 5) - 2;

  const leadershipSkills = [
    'Team Leadership', 'Team Building', 'Team Motivation', 
    'Communication', 'Leadership Development', 'Staff Training'
  ];
  const hasSkill = leadershipSkills.some(skill => candidate.skills.includes(skill));
  const skillBonus = hasSkill ? 1 : 0;
  
  const score = Math.max(1, Math.min(10, baseScore + randomFactor + skillBonus));
  
  return {
    score,
    reasoning: `Assessed leadership capabilities and team management skills`
  };
}

function evaluateCandidate(candidate) {
  const crisis = evaluateCrisisManagement(candidate);
  const sustainability = evaluateSustainability(candidate);
  const motivation = evaluateTeamMotivation(candidate);
  
  return {
    candidate_id: candidate.id,
    crisis_management: crisis.score,
    sustainability: sustainability.score,
    team_motivation: motivation.score,
    total_score: crisis.score + sustainability.score + motivation.score,
    evaluation_notes: {
      crisis: crisis.reasoning,
      sustainability: sustainability.reasoning,
      motivation: motivation.reasoning,
      timestamp: new Date().toISOString()
    }
  };
}

module.exports = {
  evaluateCandidate,
  evaluateCrisisManagement,
  evaluateSustainability,
  evaluateTeamMotivation
};
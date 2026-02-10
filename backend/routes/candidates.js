const express = require('express');
const router = express.Router();
const db = require('../config/db');


router.get('/all', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.id,
                c.name,
                c.experience,
                c.skills,
                e.crisis_management,
                e.sustainability,
                e.team_motivation,
                e.total_score,
                r.rank_position
            FROM candidates c
            LEFT JOIN evaluations e ON c.id = e.candidate_id
            LEFT JOIN rankings r ON c.id = r.candidate_id
            ORDER BY r.rank_position ASC
        `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching candidates:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidates',
            error: error.message
        });
    }
});

router.get('/leaderboard', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.id,
                c.name,
                c.experience,
                c.skills,
                e.crisis_management,
                e.sustainability,
                e.team_motivation,
                e.total_score,
                r.rank_position
            FROM candidates c
            INNER JOIN evaluations e ON c.id = e.candidate_id
            INNER JOIN rankings r ON c.id = r.candidate_id
            ORDER BY r.rank_position ASC
            LIMIT 10
        `);
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch leaderboard',
            error: error.message
        });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT 
                c.id,
                c.name,
                c.experience,
                c.skills,
                e.crisis_management,
                e.sustainability,
                e.team_motivation,
                e.total_score,
                r.rank_position
            FROM candidates c
            LEFT JOIN evaluations e ON c.id = e.candidate_id
            LEFT JOIN rankings r ON c.id = r.candidate_id
            WHERE c.id = ?
        `, [req.params.id]);

        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Candidate not found'
            });
        }

        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching candidate:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch candidate',
            error: error.message
        });
    }
});

module.exports = router;
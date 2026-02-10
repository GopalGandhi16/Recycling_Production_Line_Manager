const express = require('express');
const cors = require('cors');
require('dotenv').config();

const candidatesRoutes = require('./routes/candidates');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/candidates', candidatesRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});


app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
});
const express = require('express');
const app = express();

// Middleware to parse JSON (with size limit for safety)
app.use(express.json({ limit: '1mb' }));

// Simple in-memory storage
let dataStore = [];

// GET endpoint (health check)
const os = require('os');

app.get('/status', (req, res) => {
    res.status(200).json({
        status: 'ok',
        container: os.hostname(),
        port: process.env.PORT || 3000
    });
});

// POST endpoint
app.post('/data', (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({
            error: 'Name is required'
        });
    }

    const newData = { name };
    dataStore.push(newData);

    res.status(201).json({
        message: 'Data received',
        storedData: newData
    });
});

// Handle invalid JSON errors
app.use((err, req, res, next) => {
    console.error(err.message); // helpful for logs

    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({
            error: 'Invalid JSON format'
        });
    }

    return res.status(500).json({
        error: 'Internal Server Error'
    });
});

const PORT = process.env.PORT || 3000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
const errorMiddleware = require('./middleware/errorMiddleware');
const express = require('express');
const cors = require('cors');

const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Task Management System API is running'
    });
});

// Task API routes
app.use('/api/tasks', taskRoutes);
app.use(errorMiddleware);

// Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

module.exports = app;


const express = require('express');

const {
    createTaskController,
    getAllTasksController,
    getTaskByIdController,
    updateTaskController,
    deleteTaskController
} = require('../controllers/taskController');

const router = express.Router();

// Create a task
router.post('/', createTaskController);

// Get all tasks
router.get('/', getAllTasksController);

// Get one task by ID
router.get('/:id', getTaskByIdController);

// Update a task by ID
router.put('/:id', updateTaskController);
// delete a task by ID
router.delete('/:id', deleteTaskController);

module.exports = router;


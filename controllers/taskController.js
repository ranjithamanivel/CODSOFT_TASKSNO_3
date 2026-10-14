const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require('../models/taskModel');

const { validateTask } = require('../utils/validateTask');

async function createTaskController(req, res) {
    try {
        if (
            req.body === null ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Request body must be a JSON object.'
            });
        }

        const errors = validateTask(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors
            });
        }

        const task = await createTask({
            ...req.body,
            title: req.body.title.trim(),
            description: req.body.description?.trim() || null,
            category: req.body.category?.trim() || null,
            due_date: req.body.due_date || null
        });

        return res.status(201).json({
            success: true,
            message: 'Task created successfully.',
            data: task
        });
    } catch (error) {
        console.error('Create task error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}


// GET /api/tasks 
async function getAllTasksController(req, res) {
    try {
        const {
            status,
            search,
            priority,
            category,
            page = '1',
            limit = '10',
            sortBy = 'id',
            order = 'desc'
        } = req.query;

        // Validate status
        if (
            status !== undefined &&
            (typeof status !== 'string' ||
                !['pending', 'completed'].includes(status))
        ) {
            return res.status(400).json({
                success: false,
                message: 'Status must be pending or completed.'
            });
        }

        // Validate priority
        if (
            priority !== undefined &&
            (typeof priority !== 'string' ||
                !['low', 'medium', 'high'].includes(priority))
        ) {
            return res.status(400).json({
                success: false,
                message: 'Priority must be low, medium, or high.'
            });
        }

        // Validate search and category
        if (
            search !== undefined &&
            (typeof search !== 'string' || !search.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: 'Search must be a non-empty string.'
            });
        }

        if (
            category !== undefined &&
            (typeof category !== 'string' || !category.trim())
        ) {
            return res.status(400).json({
                success: false,
                message: 'Category must be a non-empty string.'
            });
        }

        // Validate page and limit
        if (
            !/^[1-9]\d*$/.test(page) ||
            !/^[1-9]\d*$/.test(limit)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Page and limit must be positive integers.'
            });
        }

        const pageNumber = Number(page);
        const limitNumber = Number(limit);

        if (
            !Number.isSafeInteger(pageNumber) ||
            !Number.isSafeInteger(limitNumber) ||
            limitNumber > 100
        ) {
            return res.status(400).json({
                success: false,
                message: 'Page must be a safe integer and limit must not exceed 100.'
            });
        }

        // Validate sorting
        const allowedSortColumns = [
            'id',
            'title',
            'status',
            'priority',
            'due_date',
            'created_at'
        ];

        if (
            typeof sortBy !== 'string' ||
            !allowedSortColumns.includes(sortBy)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid sortBy column.'
            });
        }

        if (
            typeof order !== 'string' ||
            !['asc', 'desc'].includes(order)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Order must be asc or desc.'
            });
        }

        // Retrieve filtered, sorted and paginated tasks
        const result = await getAllTasks({
            status,
            search: search?.trim(),
            priority,
            category: category?.trim(),
            page: pageNumber,
            limit: limitNumber,
            sortBy,
            order
        });

        return res.status(200).json({
            success: true,
            count: result.tasks.length,
            total: result.total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(result.total / limitNumber),
            data: result.tasks
        });
    } catch (error) {
        console.error('Get tasks error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}


// GET /api/tasks/:id
async function getTaskByIdController(req, res) {
    try {
        const idValue = req.params.id;

        if (!/^[1-9]\d*$/.test(idValue)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID must be a positive integer.'
            });
        }

        const id = Number(idValue);

        if (!Number.isSafeInteger(id)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID is outside the supported range.'
            });
        }

        const task = await getTaskById(id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        return res.status(200).json({
            success: true,
            data: task
        });
    } catch (error) {
        console.error('Get task by ID error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}


async function updateTaskController(req, res) {
    try {
        // 1. Validate the task ID from the URL
        const idValue = req.params.id;

        if (!/^[1-9]\d*$/.test(idValue)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID must be a positive integer.'
            });
        }

        const id = Number(idValue);

        if (!Number.isSafeInteger(id)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID is outside the supported range.'
            });
        }

        // 2. Validate the request body
        if (
            req.body === null ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body)
        ) {
            return res.status(400).json({
                success: false,
                message: 'Request body must be a JSON object.'
            });
        }

        // 3. Validate the task fields
        const errors = validateTask(req.body);

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed.',
                errors
            });
        }

        // 4. Check whether the task exists
        const existingTask = await getTaskById(id);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        // 5. Prepare the updated task data
        const taskData = {
            title: req.body.title.trim(),
            description: req.body.description?.trim() || null,
            status: req.body.status ?? 'pending',
            priority: req.body.priority ?? 'medium',
            category: req.body.category?.trim() || null,
            due_date: req.body.due_date || null
        };

        // 6. Update the database record
        const updatedTask = await updateTask(id, taskData);

        // 7. Send the successful response
        return res.status(200).json({
            success: true,
            message: 'Task updated successfully.',
            data: updatedTask
        });
    } catch (error) {
        console.error('Update task error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}


async function deleteTaskController(req, res) {
    try {
        // 1. Read the task ID from the URL
        const idValue = req.params.id;

        // 2. Validate the ID
        if (!/^[1-9]\d*$/.test(idValue)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID must be a positive integer.'
            });
        }

        const id = Number(idValue);

        if (!Number.isSafeInteger(id)) {
            return res.status(400).json({
                success: false,
                message: 'Task ID is outside the supported range.'
            });
        }

        // 3. Check whether the task exists
        const existingTask = await getTaskById(id);

        if (!existingTask) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        // 4. Delete the task
        const deleted = await deleteTask(id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Task not found.'
            });
        }

        // 5. Send the success response
        return res.status(200).json({
            success: true,
            message: 'Task deleted successfully.',
            data: existingTask
        });
    } catch (error) {
        console.error('Delete task error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Internal server error.'
        });
    }
}



module.exports = {
    createTaskController,
    getAllTasksController,
    getTaskByIdController,
    updateTaskController,
    deleteTaskController
};


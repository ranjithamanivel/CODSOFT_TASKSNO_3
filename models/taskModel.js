
const { pool } = require('../config/db');

// Existing function: create a task
async function createTask(task) {
    const {
        title,
        description,
        priority,
        category,
        due_date
    } = task;

    const sql = `
        INSERT INTO tasks
            (title, description, priority, category, due_date)
        VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        description ?? null,
        priority ?? 'medium',
        category ?? null,
        due_date ?? null
    ];

    const [result] = await pool.execute(sql, values);

    const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE id = ?',
        [result.insertId]
    );

    return rows[0];
}

// Get all tasks

async function getAllTasks(filters = {}) {
    const conditions = [];
    const values = [];

    // Filter by status
    if (filters.status) {
        conditions.push('status = ?');
        values.push(filters.status);
    }

    // Search by title
    if (filters.search) {
        conditions.push('title LIKE ?');
        values.push(`%${filters.search}%`);
    }

    // Filter by priority
    if (filters.priority) {
        conditions.push('priority = ?');
        values.push(filters.priority);
    }

    // Filter by category
    if (filters.category) {
        conditions.push('category = ?');
        values.push(filters.category);
    }

    let whereClause = '';

    if (conditions.length > 0) {
        whereClause = ' WHERE ' + conditions.join(' AND ');
    }

    // Count all matching tasks before pagination
    const countSql =
        'SELECT COUNT(*) AS total FROM tasks' + whereClause;

    const [countRows] = await pool.execute(countSql, values);
    const total = countRows[0].total;

    // Allow only known column names for sorting
    const allowedSortColumns = {
        id: 'id',
        title: 'title',
        status: 'status',
        priority: 'priority',
        due_date: 'due_date',
        created_at: 'created_at'
    };

    const sortColumn =
        allowedSortColumns[filters.sortBy] || 'id';

    const sortOrder =
        filters.order === 'asc' ? 'ASC' : 'DESC';

    // Calculate pagination values
    const limit = filters.limit ?? 10;
    const offset = (filters.page - 1) * limit;

    // Fetch the requested page
    const sql =
        'SELECT * FROM tasks' +
        whereClause +
        ` ORDER BY ${sortColumn} ${sortOrder}` +
        ' LIMIT ? OFFSET ?';

    const [tasks] = await pool.execute(
        sql,
        [...values, limit, offset]
    );

    return {
        tasks,
        total
    };
}



// Get one task by ID
async function getTaskById(id) {
    const sql = 'SELECT * FROM tasks WHERE id = ?';

    const [rows] = await pool.execute(sql, [id]);

    return rows[0] || null;
}

// Update an existing task
async function updateTask(id, task) {
    const {
        title,
        description,
        status,
        priority,
        category,
        due_date
    } = task;

    const sql = `
        UPDATE tasks
        SET
            title = ?,
            description = ?,
            status = ?,
            priority = ?,
            category = ?,
            due_date = ?
        WHERE id = ?
    `;

    const values = [
        title,
        description ?? null,
        status ?? 'pending',
        priority ?? 'medium',
        category ?? null,
        due_date ?? null,
        id
    ];

    await pool.execute(sql, values);

    // Return the updated task
    const [rows] = await pool.execute(
        'SELECT * FROM tasks WHERE id = ?',
        [id]
    );

    return rows[0] || null;
}

async function deleteTask(id) {
    const sql = 'DELETE FROM tasks WHERE id = ?';

    const [result] = await pool.execute(sql, [id]);

    return result.affectedRows > 0;
}

module.exports = {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask
};


function validateTask(data) {
    const errors = [];

    if (
        typeof data.title !== 'string' ||
        data.title.trim().length === 0
    ) {
        errors.push('Title is required and must be a non-empty string.');
    } else if (data.title.trim().length > 150) {
        errors.push('Title cannot exceed 150 characters.');
    }

    if (
        data.description != null &&
        typeof data.description !== 'string'
    ) {
        errors.push('Description must be a string.');
    }

    if (
        data.category != null &&
        typeof data.category !== 'string'
    ) {
        errors.push('Category must be a string.');
    } else if (
        typeof data.category === 'string' &&
        data.category.length > 100
    ) {
        errors.push('Category cannot exceed 100 characters.');
    }

    if (
        data.priority != null &&
        !['low', 'medium', 'high'].includes(data.priority)
    ) {
        errors.push('Priority must be low, medium, or high.');
    }

    if (data.due_date != null && data.due_date !== '') {
        if (
            typeof data.due_date !== 'string' ||
            !/^\d{4}-\d{2}-\d{2}$/.test(data.due_date)
        ) {
            errors.push('Due date must use YYYY-MM-DD format.');
        } else {
            const date = new Date(`${data.due_date}T00:00:00Z`);

            if (
                Number.isNaN(date.getTime()) ||
                date.toISOString().slice(0, 10) !== data.due_date
            ) {
                errors.push('Due date must be a valid calendar date.');
            }
        }
    }
    
    if (
        data.status != null &&
        !['pending', 'completed'].includes(data.status)
    ) {
        errors.push('Status must be pending or completed.');
    }


    return errors;
}

module.exports = { validateTask };

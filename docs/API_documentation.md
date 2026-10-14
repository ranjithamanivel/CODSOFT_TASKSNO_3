
# Task Management System API

## 1. Project Overview

A REST API built with Node.js, Express.js, and MySQL
to create, retrieve, update, delete, search, and filter tasks.

## 2. Technologies Used

- Node.js
- Express.js
- MySQL
- mysql2
- dotenv
- cors
- Postman

## 3. Base URL

http://localhost:3000

## 4. Task Fields

| Field | Type | Description |
|---|---|---|
| id | Integer | Automatically generated task ID |
| title | String | Required task title |
| description | String | Optional task description |
| status | String | pending or completed |
| priority | String | low, medium, or high |
| category | String | Optional task category |
| due_date | Date | Optional date in YYYY-MM-DD format |
| created_at | Timestamp | Task creation time |
| updated_at | Timestamp | Last update time |

## 5. API Endpoints

### Create a task

POST /api/tasks

Example request:

{
  "title": "Learn Node.js",
  "description": "Study REST APIs",
  "status": "pending",
  "priority": "high",
  "category": "Learning",
  "due_date": "2026-10-25"
}

Expected status: 201 Created

### Retrieve all tasks

GET /api/tasks

Expected status: 200 OK

### Retrieve a task by ID

GET /api/tasks/:id

Example: GET /api/tasks/1

Expected statuses:
- 200 OK
- 400 Bad Request for an invalid ID
- 404 Not Found if the task does not exist

### Update a task

PUT /api/tasks/:id

Example: PUT /api/tasks/1

Send the complete task representation, including a valid title.

Expected statuses:
- 200 OK
- 400 Bad Request for invalid data
- 404 Not Found if the task does not exist

### Delete a task

DELETE /api/tasks/:id

Example: DELETE /api/tasks/1

Expected statuses:
- 200 OK
- 400 Bad Request for an invalid ID
- 404 Not Found if the task does not exist

## 6. Search and Filtering

Search by title:

GET /api/tasks?search=Java

Filter by status:

GET /api/tasks?status=pending

Filter by priority:

GET /api/tasks?priority=high

Filter by category:

GET /api/tasks?category=Backend

Combine filters:

GET /api/tasks?status=pending&priority=high

## 7. Pagination and Sorting

Pagination:

GET /api/tasks?page=1&limit=5

Sort by title:

GET /api/tasks?sortBy=title&order=asc

Combined example:

GET /api/tasks?status=pending&page=1&limit=5&sortBy=created_at&order=desc

Supported sortBy values:
- id
- title
- status
- priority
- due_date
- created_at

Supported order values:
- asc
- desc

Maximum page limit: 100

## 8. HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Task created |
| 400 | Invalid input |
| 404 | Resource or route not found |
| 500 | Internal server error |

## 9. Error Response Example

{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    "Title is required and must be a non-empty string."
  ]
}

## 10. Running the Project

1. Install Node.js and MySQL.
2. Create the task_management_db database and tasks table.
3. Configure database credentials in the .env file.
4. Install dependencies using npm install.
5. Start the development server using npm run dev.
6. Test endpoints using Postman.

## 11. Security Notes

- SQL queries use parameterized values.
- Request fields are validated.
- Database credentials are stored in .env.
- The .env file should not be committed to GitHub.

Note: Authentication and authorization are not implemented
in this version of the project.

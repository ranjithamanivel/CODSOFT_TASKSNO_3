
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: Number(process.env.DB_PORT) || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    let connection;

    try {
        connection = await pool.getConnection();

        console.log('MySQL connected successfully!');

        const [rows] = await connection.query(
            'SELECT DATABASE() AS databaseName'
        );

        console.log('Connected database:', rows[0].databaseName);

        return true;
    } catch (error) {
        console.error('MySQL connection failed:', error.message);
        throw error;
    } finally {
        if (connection) {
            connection.release();
        }
    }
}

module.exports = {
    pool,
    testConnection
};

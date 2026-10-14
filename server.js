
require('dotenv').config();

const app = require('./app');
const { testConnection } = require('./config/db');

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await testConnection();

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error(
            'Unable to start server because the database connection failed.'
        );

        process.exit(1);
    }
}

startServer();


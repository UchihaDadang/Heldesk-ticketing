import { configDotenv } from 'dotenv';
import mysql from 'mysql2/promise';

configDotenv();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

pool.getConnection()
    .then((connection) => {
        console.log('Connected to database');
        connection.release();
    })
    .catch((err) => {
        console.error('Error connecting to database:', err);
    });

const [result] = await pool.execute('SELECT 1');
console.log("Database connection test:", result);


export default pool;
import bcrypt from 'bcrypt';
import pool from './connect.js';

async function createAdmin(username, password) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute(
            'INSERT INTO admin (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );
        console.log('Admin berhasil dibuat');
    } catch (error) {
        console.error('Error:', error);
    }
}

createAdmin('admin', 'password123');
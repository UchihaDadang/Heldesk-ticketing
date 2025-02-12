import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from './connect.js';

const JWT_SECRET = 'your_jwt_secret_key';

const handlerLoginAdmin = async (request, h) => {
    try {
        const { username, password } = request.payload;
        console.log('Received login request:', { username, password });

        const [rows] = await pool.execute(
            'SELECT * FROM admin WHERE username = ?',
            [username]
        );

        if (rows.length === 0) {
            return h.response({ message: 'Username tidak ditemukan' }).code(401);
        }

        const admin = rows[0];
        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return h.response({ message: 'Password salah' }).code(401);
        }

        const token = jwt.sign(
            { id: admin.id, username: admin.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        return { token };
    } catch (error) {
        console.error('Error in handlerLoginAdmin:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};



const handlerLoginUser = async (request, h) => {
    try {
        const { credential } = request.payload;
        
        const decoded = jwt.decode(credential);
        
        const { email, name, sub: googleId, picture } = decoded;

        const [user] = await pool.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );

        let userId;
        if (user.length === 0) {
            const [result] = await pool.execute(
                'INSERT INTO users (email, name, google_id, profile_picture) VALUES (?, ?, ?, ?)',
                [email, name, googleId, picture]
            );
            userId = result.insertId;
        } else {
            userId = user[0].id;
        }

        const token = jwt.sign(
            { id: userId, email, name },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        return { token, user: { email, name, picture } };
    } catch (error) {
        console.error('Error in handlerLoginAdmin:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};


export { handlerLoginAdmin, handlerLoginUser };
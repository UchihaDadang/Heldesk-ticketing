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


const handlerSubmitReport = async (request, h) => {
    try {
        console.log('Received Payload:', request.payload);

        if (!request.payload || !request.payload.feature || !request.payload.data) {
            return h.response({ 
                message: "Invalid payload", 
                details: request.payload 
            }).code(400);
        }

        const { feature, data } = request.payload;

        let tableName = "";
        let columnMapping = {}; // Mapping untuk menyesuaikan nama kolom database

        switch (feature) {
            case "Tindak Kejahatan":
                tableName = "crime_reports";
                columnMapping = { "Nama": "nama", "Email": "email", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Deskripsi Tindak Kejahatan": "deskripsi_tindak_kejahatan" };
                break;
            case "Kehilangan":
                tableName = "missing_reports";
                columnMapping = { "Nama": "nama", "Email": "email", "Nomor Telepon": "nomor_telepon", "Informasi Objek Yang Hialng": "deskripsi_kehilangan" };
                break;
            case "KDRT":
                tableName = "domestic_violence_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Nama Pelaku": "nama_pelaku", "Status Pelaku": "status_pelaku", "Keterangan": "deskripsi_kdrt" };
                break;
            case "Bulying":
                tableName = "bullying_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Asal Sekolah": "asal_sekolah", "Nama Pelaku": "nama_pelaku", "Deskripsi": "deskripsi_bullying" };
                break;
            case "Tindakan Mencurigakan":
                tableName = "suspicious_activity_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Deskripsi Tindakan Mencurigakan": "deskripsi_mencurigakan" };
                break;
            case "Kritik dan Saran":
                tableName = "feedback";
                columnMapping = { "Kritik": "kritik", "Saran": "saran", "Komentar": "komentar" };
                break;
            default:
                return h.response({ 
                    message: "Fitur tidak valid", 
                    feature: feature 
                }).code(400);
        }

        // Ubah nama kolom frontend ke format database
        const dbColumns = Object.keys(data).map(key => `\`${columnMapping[key] || key}\``).join(", ");
        const values = Object.values(data);
        const placeholders = values.map(() => "?").join(", ");

        const query = `INSERT INTO ${tableName} (${dbColumns}) VALUES (${placeholders})`;

        console.log("Executing Query:", query);
        console.log("With Values:", values);

        await pool.query(query, values);

        return h.response({ 
            message: "Laporan berhasil disimpan!", 
            feature: feature 
        }).code(201);
    } catch (error) {
        console.error('Detailed Error in handlerSubmitReport:', {
            message: error.message,
            stack: error.stack,
            payload: request.payload
        });

        return h.response({ 
            message: 'Internal server error', 
            error: error.message 
        }).code(500);
    }
};


export { handlerLoginAdmin, handlerLoginUser, handlerSubmitReport };
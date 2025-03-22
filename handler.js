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
        let columnMapping = {};

        switch (feature) {
            case "Tindak Kejahatan":
                tableName = "crime_reports";
                columnMapping = { "Nama": "nama", "Email": "email", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Deskripsi Tindak Kejahatan": "deskripsi" };
                break;
            case "Kehilangan":
                tableName = "missing_reports";
                columnMapping = { "Nama": "nama", "Email": "email", "Nomor Telepon": "nomor_telepon", "Informasi Objek Yang Hialng": "deskripsi" };
                break;
            case "KDRT":
                tableName = "domestic_violence_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Nama Pelaku": "nama_pelaku", "Status Pelaku": "status_pelaku", "Keterangan": "deskripsi" };
                break;
            case "Bulying":
                tableName = "bullying_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Asal Sekolah": "asal_sekolah", "Nama Pelaku": "nama_pelaku", "Deskripsi": "deskripsi" };
                break;
            case "Tindakan Mencurigakan":
                tableName = "suspicious_activity_reports";
                columnMapping = { "Nama": "nama", "Nomor Telepon": "nomor_telepon", "Alamat": "alamat", "Deskripsi Tindakan Mencurigakan": "deskripsi" };
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

        const statusKey = "`status`";
        const statusValue = "Menunggu";

        let dbColumns = Object.keys(data).map(key => `\`${columnMapping[key] || key}\``);
        let values = Object.values(data);

        if (!dbColumns.includes(statusKey)) {
            dbColumns.push(statusKey);
            values.push(statusValue);
        }

        const placeholders = values.map(() => "?").join(", ");
        const query = `INSERT INTO ${tableName} (${dbColumns.join(", ")}) VALUES (${placeholders})`;

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

const handlerGetAllReports = async (request, h) => {
    try {
        const [crimeReports] = await pool.execute(
            'SELECT *, "Crime" AS type FROM crime_reports WHERE status = "Menunggu" ORDER BY tanggal_laporan DESC'
        );
        const [bullyingReports] = await pool.execute(
            'SELECT *, "Bullying" AS type FROM bullying_reports WHERE status = "Menunggu" ORDER BY tanggal_laporan DESC'
        );
        const [domesticViolenceReports] = await pool.execute(
            'SELECT *, "Domestic Violence" AS type FROM domestic_violence_reports WHERE status = "Menunggu" ORDER BY tanggal_laporan DESC'
        );
        const [missingReports] = await pool.execute(
            'SELECT *, "Missing" AS type FROM missing_reports WHERE status = "Menunggu" ORDER BY tanggal_laporan DESC'
        );
        const [suspiciousActivityReports] = await pool.execute(
            'SELECT *, "Suspicious Activity" AS type FROM suspicious_activity_reports WHERE status = "Menunggu" ORDER BY tanggal_laporan DESC'
        );
        

        const allReports = [
            ...crimeReports,
            ...bullyingReports,
            ...domesticViolenceReports,
            ...missingReports,
            ...suspiciousActivityReports
        ];
        allReports.sort((a, b) => new Date(b.tanggal_laporan) - new Date(a.tanggal_laporan));

        return h.response({ data: allReports }).code(200);
    } catch (error) {
        console.error('Error in handlerGetCrimeReports:', error.message || error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};

const handlerGetCrimeReports = async (request, h) => {
    try {
        const [rows] = await pool.execute(
            'SELECT *, "Crime" AS type FROM crime_reports WHERE status IN (?, ?) ORDER BY tanggal_laporan DESC',
            ["Diproses", "Selesai"]
        );

        if (rows.length === 0) {
            return h.response({ data: [] }).code(200);
        }

        return h.response({ data: rows }).code(200);
    } catch (error) {
        console.error("Error in handlerGetCrimeReports:", error);
        return h.response({ message: "Internal server error" }).code(500);
    }
};

const handlerUpdateReportStatus = async (request, h) => {
    try {
        const { id, type } = request.params;
        const { action } = request.payload;

        const tableMap = {
            crime: "crime_reports",
            bullying: "bullying_reports",
            missing: "missing_reports",
            domestic_violence: "domestic_violence_reports",
            suspicious_activity: "suspicious_activity_reports"
        };

        const tableName = tableMap[type.toLowerCase()];

        if (!tableName) {
            return h.response({ message: "Jenis laporan tidak valid" }).code(400);
        }

        const [rows] = await pool.execute(
            `SELECT status FROM ${tableName} WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return h.response({ message: "Laporan tidak ditemukan" }).code(404);
        }

        const currentStatus = rows[0].status;
        let newStatus;

        if (action === "proses" && currentStatus === "Menunggu") {
            newStatus = "Diproses";
        } else if (action === "selesai" && currentStatus === "Diproses") {
            newStatus = "Selesai";
        } else {
            return h.response({ 
                message: "Perubahan status tidak valid. Hanya dapat mengubah dari Menunggu ke Diproses atau dari Diproses ke Selesai" 
            }).code(400);
        }

        const [result] = await pool.execute(
            `UPDATE ${tableName} SET status = ? WHERE id = ?`,
            [newStatus, id]
        );

        if (result.affectedRows === 0) {
            return h.response({ message: "Gagal memperbarui status laporan" }).code(500);
        }

        return h.response({ 
            message: `Status laporan berhasil diperbarui menjadi ${newStatus}` 
        }).code(200);
    } catch (error) {
        console.error("Error updating report status:", error);
        return h.response({ message: "Internal server error" }).code(500);
    }
};

const handlerDeleteCompliteReport = async (request, h) => {
    try {
        const { type, id } = request.params;

        const tableMap = {
            crime: "crime_reports",
            bullying: "bullying_reports",
            missing: "missing_reports",
            domestic_violence: "domestic_violence_reports",
            suspicious_activity: "suspicious_activity_reports"
        };

        const tableName = tableMap[type.toLowerCase()];
        if (!tableName) {
            return h.response({ message: "Jenis laporan tidak valid" }).code(400);
        }

        const result = await pool.execute(
            `DELETE FROM ${tableName} WHERE id = ? AND status = ?`,
            [id, "Selesai"]
        );

        if (!Array.isArray(result) || result.length === 0) {
            return h.response({ message: "Gagal menghapus laporan" }).code(500);
        }

        const affectedRows = result[0].affectedRows;
        if (affectedRows === 0) {
            return h.response({ message: "Laporan tidak ditemukan atau belum berstatus 'Selesai'" }).code(404);
        }

        return h.response({ message: "Laporan berhasil dihapus" }).code(200);
    } catch (error) {
        console.error("Error deleting selected report:", error);
        return h.response({ message: "Internal server error" }).code(500);
    }
};

const handlerDeleteCompliteReportAll = async (request, h) => {
    try {
        const {type} = request.params;

        const tableMap = {
            crime: "crime_reports",
            bullying: "bullying_reports",
            missing: "missing_reports",
            domestic_violence: "domestic_violence_reports",
            suspicious_activity: "suspicious_activity_reports"
        };

        const tableName = tableMap[type.toLowerCase()];
        if (!tableName) {
            return h.response({ message: "Jenis laporan tidak valid" }).code(400);
        }

        const result = await pool.execute(
            `DELETE FROM ${tableName} WHERE status = ?`,
            ["Selesai"]
        );

        if (!Array.isArray(result) || result.length === 0) {
            return h.response({ message: "Gagal menghapus laporan" }).code(500);
        }

        const affectedRows = result[0].affectedRows;
        if (affectedRows === 0) {
            return h.response({ message: "Laporan tidak ditemukan atau belum berstatus 'Selesai'" }).code(404);
        }

        return h.response({ message: "Laporan berhasil dihapus" }).code(200);
    } catch (error) {
        console.error("Error deleting selected report:", error);
        return h.response({ message: "Internal server error" }).code(500);
    }
};




export { 
    handlerLoginAdmin, 
    handlerLoginUser, 
    handlerSubmitReport,
    handlerGetAllReports,
    handlerGetCrimeReports,
    handlerUpdateReportStatus,
    handlerDeleteCompliteReport,
    handlerDeleteCompliteReportAll,
};
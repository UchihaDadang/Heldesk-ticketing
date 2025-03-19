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
        const statusValue = "Menunggu"; // Nilai default

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
        // Ambil hanya data dengan status "Diproses" dan "Selesai"
        const [rows] = await pool.execute(
            'SELECT *, "Crime" AS type FROM crime_reports WHERE status IN (?, ?) ORDER BY tanggal_laporan DESC',
            ["Diproses", "Selesai"]
        );

        // Jika tidak ada data, kembalikan array kosong
        if (rows.length === 0) {
            return h.response({ data: [] }).code(200);
        }

        // Kembalikan data jika ada
        return h.response({ data: rows }).code(200);
    } catch (error) {
        console.error("Error in handlerGetCrimeReports:", error);
        return h.response({ message: "Internal server error" }).code(500);
    }
};

const handlerUpdateCrimeReportStatus = async (request, h) => {
    try {
        const { id } = request.params;

        const [result] = await pool.execute(
            'UPDATE crime_reports SET status = ? WHERE id = ?',
            ['Diproses', id]
        );

        if (result.affectedRows === 0) {
            console.log('No record updated for ID:', id);
            return h.response({ message: 'Laporan tidak ditemukan' }).code(404);
        }

        return h.response({ message: 'Status laporan berhasil diperbarui' }).code(200);
    } catch (error) {
        console.error('Error in handlerUpdateCrimeReportStatus:', error);
        return h.response({ message: 'Internal server error' }).code(500);
    }
};



// const handlerGetMissingReports = async (request, h) => {
//     try {
//         const { page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         const [rows] = await pool.execute(
//             'SELECT * FROM missing_reports ORDER BY created_at DESC LIMIT ? OFFSET ?',
//             [parseInt(limit), parseInt(offset)]
//         );
        
//         const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM missing_reports');
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerGetMissingReports:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

// const handlerGetDomesticViolenceReports = async (request, h) => {
//     try {
//         const { page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         const [rows] = await pool.execute(
//             'SELECT * FROM domestic_violence_reports ORDER BY created_at DESC LIMIT ? OFFSET ?',
//             [parseInt(limit), parseInt(offset)]
//         );
        
//         const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM domestic_violence_reports');
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerGetDomesticViolenceReports:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

// const handlerGetBullyingReports = async (request, h) => {
//     try {
//         const { page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         const [rows] = await pool.execute(
//             'SELECT * FROM bullying_reports ORDER BY created_at DESC LIMIT ? OFFSET ?',
//             [parseInt(limit), parseInt(offset)]
//         );
        
//         const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM bullying_reports');
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerGetBullyingReports:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

// const handlerGetSuspiciousActivityReports = async (request, h) => {
//     try {
//         const { page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         const [rows] = await pool.execute(
//             'SELECT * FROM suspicious_activity_reports ORDER BY created_at DESC LIMIT ? OFFSET ?',
//             [parseInt(limit), parseInt(offset)]
//         );
        
//         const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM suspicious_activity_reports');
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerGetSuspiciousActivityReports:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

// const handlerGetFeedback = async (request, h) => {
//     try {
//         const { page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         const [rows] = await pool.execute(
//             'SELECT * FROM feedback ORDER BY created_at DESC LIMIT ? OFFSET ?',
//             [parseInt(limit), parseInt(offset)]
//         );
        
//         const [countResult] = await pool.execute('SELECT COUNT(*) as total FROM feedback');
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerGetFeedback:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

// // const handlerGetReportStatistics = async (request, h) => {
// //     try {
// //         const [crimeStat] = await pool.execute('SELECT COUNT(*) as total FROM crime_reports');
// //         const [missingStat] = await pool.execute('SELECT COUNT(*) as total FROM missing_reports');
// //         const [dvStat] = await pool.execute('SELECT COUNT(*) as total FROM domestic_violence_reports');
// //         const [bullyStat] = await pool.execute('SELECT COUNT(*) as total FROM bullying_reports');
// //         const [suspiciousStat] = await pool.execute('SELECT COUNT(*) as total FROM suspicious_activity_reports');
// //         const [feedbackStat] = await pool.execute('SELECT COUNT(*) as total FROM feedback');
        
// //         const [latestCrimes] = await pool.execute('SELECT * FROM crime_reports ORDER BY created_at DESC LIMIT 5');
// //         const [latestMissing] = await pool.execute('SELECT * FROM missing_reports ORDER BY created_at DESC LIMIT 5');
        
// //         return {
// //             statistics: {
// //                 crimeReports: crimeStat[0].total,
// //                 missingReports: missingStat[0].total,
// //                 domesticViolenceReports: dvStat[0].total,
// //                 bullyingReports: bullyStat[0].total,
// //                 suspiciousActivityReports: suspiciousStat[0].total,
// //                 feedback: feedbackStat[0].total,
// //                 total: crimeStat[0].total + missingStat[0].total + dvStat[0].total + 
// //                        bullyStat[0].total + suspiciousStat[0].total + feedbackStat[0].total
// //             },
// //             latestReports: {
// //                 crimes: latestCrimes,
// //                 missing: latestMissing
// //             }
// //         };
// //     } catch (error) {
// //         console.error('Error in handlerGetReportStatistics:', error);
// //         return h.response({ message: 'Internal server error' }).code(500);
// //     }
// // };

// const handlerSearchReports = async (request, h) => {
//     try {
//         const { keyword, category, page = 1, limit = 10 } = request.query;
//         const offset = (page - 1) * limit;
        
//         let tableName, searchColumns;
        
//         switch (category) {
//             case "crime":
//                 tableName = "crime_reports";
//                 searchColumns = ["nama", "email", "alamat", "deskripsi_tindak_kejahatan"];
//                 break;
//             case "missing":
//                 tableName = "missing_reports";
//                 searchColumns = ["nama", "email", "deskripsi_kehilangan"];
//                 break;
//             case "domestic":
//                 tableName = "domestic_violence_reports";
//                 searchColumns = ["nama", "alamat", "nama_pelaku", "deskripsi_kdrt"];
//                 break;
//             case "bullying":
//                 tableName = "bullying_reports";
//                 searchColumns = ["nama", "asal_sekolah", "nama_pelaku", "deskripsi_bullying"];
//                 break;
//             case "suspicious":
//                 tableName = "suspicious_activity_reports";
//                 searchColumns = ["nama", "alamat", "deskripsi_mencurigakan"];
//                 break;
//             case "feedback":
//                 tableName = "feedback";
//                 searchColumns = ["kritik", "saran", "komentar"];
//                 break;
//             default:
//                 return h.response({ message: "Kategori tidak valid" }).code(400);
//         }
        
//         const searchConditions = searchColumns.map(column => `${column} LIKE ?`).join(" OR ");
//         const searchValues = searchColumns.map(() => `%${keyword}%`);
        
//         const query = `SELECT * FROM ${tableName} WHERE ${searchConditions} ORDER BY created_at DESC LIMIT ? OFFSET ?`;
//         const [rows] = await pool.execute(
//             query,
//             [...searchValues, parseInt(limit), parseInt(offset)]
//         );
        
//         const countQuery = `SELECT COUNT(*) as total FROM ${tableName} WHERE ${searchConditions}`;
//         const [countResult] = await pool.execute(countQuery, searchValues);
//         const total = countResult[0].total;
        
//         return {
//             data: rows,
//             pagination: {
//                 page: parseInt(page),
//                 limit: parseInt(limit),
//                 total,
//                 totalPages: Math.ceil(total / limit)
//             }
//         };
//     } catch (error) {
//         console.error('Error in handlerSearchReports:', error);
//         return h.response({ message: 'Internal server error' }).code(500);
//     }
// };

export { 
    handlerLoginAdmin, 
    handlerLoginUser, 
    handlerSubmitReport,
    handlerGetAllReports,
    handlerGetCrimeReports,
    handlerUpdateCrimeReportStatus,
    // handlerGetMissingReports,
    // handlerGetDomesticViolenceReports,
    // handlerGetBullyingReports,
    // handlerGetSuspiciousActivityReports,
    // handlerGetFeedback,
    // // handlerGetReportStatistics,
    // handlerSearchReports
};
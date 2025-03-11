import { HeaderPengaduan } from "../../../modal/ModalHeaders";
import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Spinner, Alert } from "react-bootstrap";
import axios from "axios";

const Pengaduan = () => {
    const [data, setData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCrimeReports();
    }, []);

    const fetchCrimeReports = async (page = 1, limit = 10) => {
        try {
            setLoading(true);
            setError("");
            
            const apiUrl = `http://localhost:3000/api/report/crime?page=${page}&limit=${limit}`;
            console.log("Fetching data from:", apiUrl);
    
            const response = await axios.get(apiUrl, { withCredentials: false });
    
            console.log("API Response:", response.data); // Cek apakah data masuk
    
            if (response.data && response.data.data) {
                setData(response.data.data);
                setPagination(response.data.pagination);
            } else {
                throw new Error("Data tidak ditemukan.");
            }
        } catch (error) {
            console.error("Error fetching crime reports:", error);
            setError("Gagal mengambil data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };
    

    const handlePageChange = (newPage) => {
        fetchCrimeReports(newPage, pagination.limit);
    };

    const handleShow = (item) => {
        setSelectedData(item);
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedData(null);
    };

    return (
        <>
            <HeaderPengaduan />
            <div className="container mt-4">
                <h2>Data Pengaduan Kejahatan</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {loading ? (
                    <div className="text-center">
                        <Spinner animation="border" role="status" />
                        <p>Memuat data...</p>
                    </div>
                ) : data.length > 0 ? (
                    <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Nama</th>
                                    <th>Email</th>
                                    <th>Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item) => (
                                    <tr key={item.id}>
                                        <td>{item.id}</td>
                                        <td>{item.nama}</td>
                                        <td>{item.email}</td>
                                        <td>
                                            <Button variant="info" onClick={() => handleShow(item)}>
                                                Lihat
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        <div className="d-flex justify-content-center mt-3">
                            <ul className="pagination">
                                <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(pagination.page - 1)}
                                        disabled={pagination.page === 1}
                                    >
                                        Sebelumnya
                                    </button>
                                </li>

                                {Array.from({ length: pagination.totalPages }, (_, i) => (
                                    <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? "active" : ""}`}>
                                        <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                            {i + 1}
                                        </button>
                                    </li>
                                ))}

                                <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(pagination.page + 1)}
                                        disabled={pagination.page === pagination.totalPages}
                                    >
                                        Selanjutnya
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <p className="text-center">Tidak ada data pengaduan yang ditemukan.</p>
                )}

                {/* Modal untuk Detail Data */}
                <Modal show={showModal} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Detail Pengaduan Kejahatan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedData ? (
                            <>
                                <p><strong>ID:</strong> {selectedData.id}</p>
                                <p><strong>Nama:</strong> {selectedData.nama}</p>
                                <p><strong>Email:</strong> {selectedData.email}</p>
                                {selectedData.alamat && <p><strong>Alamat:</strong> {selectedData.alamat}</p>}
                                {selectedData.tanggal && <p><strong>Tanggal Kejadian:</strong> {selectedData.tanggal}</p>}
                                {selectedData.deskripsi && <p><strong>Deskripsi:</strong> {selectedData.deskripsi}</p>}
                                {selectedData.status && <p><strong>Status:</strong> {selectedData.status}</p>}
                            </>
                        ) : (
                            <p>Data tidak tersedia.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>Tutup</Button>
                        <Button variant="danger">Hapus</Button>
                        <Button variant="warning">Edit</Button>
                        <Button variant="primary">Proses</Button>
                        <Button variant="success">Selesai</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default Pengaduan;

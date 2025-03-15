import { HeaderStatusPengaduan } from "../../../modal/ModalHeaders";
import React, { useState, useEffect, useCallback } from "react";
import { Table, Button, Modal, Spinner, Alert, Form, InputGroup, Row, Col, Pagination } from "react-bootstrap";
import axios from "axios";
import { FaCopy, FaSearch, FaFilter, FaSync } from "react-icons/fa";

const StatusPengaduan = () => {
    const [originalData, setOriginalData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [selectedData, setSelectedData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isProcessing, setIsProcessing] = useState(false);

    const [searchQuery, setSearchQuery] = useState("");
    const [filterAlphabet, setFilterAlphabet] = useState("");
    const [filterDate, setFilterDate] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    useEffect(() => {
        fetchReports(); 
    }, []);

    const fetchReports = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await axios.get("http://localhost:3000/api/reports/all");

            console.log("Fetched Reports:", response.data);

            if (response.data && response.data.data) {
                setOriginalData(response.data.data);
                setFilteredData(response.data.data);
            } else {
                throw new Error("Data tidak ditemukan.");
            }
        } catch (error) {
            setError("Gagal mengambil data. Silakan coba lagi.");
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = useCallback(() => {
        let filtered = [...originalData];

        if (searchQuery) {
            filtered = filtered.filter((item) =>
                item.nama?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterAlphabet) {
            filtered = filtered.filter((item) =>
                item.nama?.toLowerCase().startsWith(filterAlphabet.toLowerCase())
            );
        }

        if (filterDate) {
            filtered = filtered.filter((item) =>
                item.tanggal_laporan && item.tanggal_laporan.includes(filterDate)
            );
        }

        if (filterStatus) {
            filtered = filtered.filter((item) =>
                item.status === filterStatus
            );
        }

        setFilteredData(filtered);

        const totalPages = Math.ceil(filtered.length / itemsPerPage);
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(1);
        }
    }, [originalData, searchQuery, filterAlphabet, filterDate, filterStatus, currentPage, itemsPerPage]);

    useEffect(() => {
        if (originalData.length > 0) {
            applyFilters();
        }
    }, [searchQuery, filterAlphabet, filterDate, filterStatus, applyFilters]);

    const handleShow = (item) => {
        setSelectedData(item);
        setShowModal(true);
        setIsProcessing(false);
    };

    const handleClose = () => {
        setShowModal(false);
        setSelectedData(null);
    };

    const handleProses = async () => {
        if (!selectedData) return;

        try {
            const response = await axios.put(`http://localhost:3000/api/report/crime/${selectedData.id}`, { status: "Diproses" });

            if (response.status === 200) {
                const updatedItem = { ...selectedData, status: "Diproses" };
                
                setOriginalData(prevData =>
                    prevData.map(item =>
                        item.id === selectedData.id ? updatedItem : item
                    )
                );
                
                setFilteredData(prevFiltered =>
                    prevFiltered.map(item =>
                        item.id === selectedData.id ? updatedItem : item
                    )
                );
                
                setShowSuccessModal(true);
                setShowModal(false);
            }
        } catch (error) {
            console.error("Gagal memperbarui status:", error);
            alert("Gagal memperbarui status. Silakan coba lagi.");
        }
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        alert(`Teks berhasil disalin: ${text}`);
    };

    const handleRefresh = () => {
        fetchReports();
        setSearchQuery("");
        setFilterAlphabet("");
        setFilterDate("");
        setFilterStatus("");
        setCurrentPage(1); // Reset ke halaman pertama saat refresh
    };

    const paginate = (pageNumber) => {
        // Periksa jika pageNumber valid
        const maxPage = Math.max(1, Math.ceil(filteredData.length / itemsPerPage));
        if (pageNumber >= 1 && pageNumber <= maxPage) {
            setCurrentPage(pageNumber);
        }
    };

    const getPaginatedData = () => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        
        // Pastikan slice berada dalam rentang data yang valid
        if (filteredData.length > 0 && indexOfFirstItem >= filteredData.length) {
            // Jika start index melebihi jumlah data, kembali ke halaman 1
            setCurrentPage(1);
            return filteredData.slice(0, itemsPerPage);
        }
        return filteredData.slice(indexOfFirstItem, indexOfLastItem);
    };

    const currentItems = getPaginatedData();

    const renderPagination = () => {
        const totalPages = Math.ceil(filteredData.length / itemsPerPage);
        
        if (totalPages <= 1) {
            return null; // Tidak perlu pagination jika hanya ada 1 halaman
        }
        
        return (
            <Pagination className="justify-content-center mt-2">
                <Pagination.Prev 
                    onClick={() => paginate(currentPage - 1)} 
                    disabled={currentPage === 1}
                />
                
                {[...Array(totalPages)].map((_, index) => {
                    const pageNumber = index + 1;
                    return (
                        <Pagination.Item 
                            key={pageNumber} 
                            active={pageNumber === currentPage} 
                            onClick={() => paginate(pageNumber)}
                        >
                            {pageNumber}
                        </Pagination.Item>
                    );
                })}
                
                <Pagination.Next 
                    onClick={() => paginate(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        );
    };

    return (
        <>
            <HeaderStatusPengaduan />
            <div className="container">
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Search & Filter Bar */}
            <Row className="mb-2 d-flex flex-wrap align-items-center">
                <Col md={4} sm={12} className="mb-2">
                    <InputGroup>
                        <InputGroup.Text style={{height: "48px", marginTop: "24px"}}>
                            <FaSearch style={{ fontSize: "14px" }} />
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Cari nama atau email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={3} sm={6} className="mb-2">
                    <InputGroup>
                        <InputGroup.Text style={{height: "48px", marginTop: "24px"}}>
                            <FaFilter style={{ fontSize: "14px" }} />
                        </InputGroup.Text>
                        <Form.Control
                            type="date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </InputGroup>
                </Col>
                <Col md={2} className="text-end">
                    <Button onClick={handleRefresh} variant="primary">
                        <FaSync style={{ fontSize: "14px" }} /> Refresh
                    </Button>
                </Col>
            </Row>

            {/* Data Table with Scroll */}
            {loading ? (
                <div className="text-center mt-3">
                    <Spinner animation="border" role="status" />
                    <p>Memuat data...</p>
                </div>
            ) : currentItems.length > 0 ? (
                <div className="table-responsive" style={{ overflowX: "auto", maxHeight: "400px" }}>
                    <Table striped bordered hover responsive>
                        <thead className="table-dark text-center">
                            <tr>
                                <th>ID</th>
                                <th>Nama</th>
                                <th>Email</th>
                                <th>Alamat</th>
                                <th>Deskripsi</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                <tr key={item.id} onClick={() => handleShow(item)} className="text-center">
                                    <td>{item.id}</td>
                                    <td>{item.nama}</td>
                                    <td>{item.email}</td>
                                    <td>{item.alamat ? `${item.alamat.substring(0, 15)}...` : "-"}</td>
                                    <td>{item.deskripsi ? `${item.deskripsi.substring(0, 30)}...` : "-"}</td>
                                    <td>{item.tanggal_laporan ? item.tanggal_laporan.substring(0, 10) : "-"}</td>
                                    <td>
                                        <span className={`badge ${item.status === "Diproses" ? "bg-success" : "bg-warning"}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td>
                                        <Button variant="info" size="sm" onClick={() => handleShow(item)}>
                                            Detail
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                <p className="text-center text-muted mt-3">Tidak ada data pengaduan yang ditemukan.</p>
            )}
            

            <Pagination className="justify-content-center mt-2">
                {renderPagination()}
            </Pagination>

            {/* Modal untuk menampilkan detail data */}
            <Modal show={showModal} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Detail Pengaduan</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedData ? (
                        <div>
                            <p><strong>ID:</strong> {selectedData.id}</p>
                            <p><strong>Nama:</strong> {selectedData.nama}</p>
                            <p>
                                <strong>Email:</strong> {selectedData.email}
                                <Button size="sm" className="ms-2" onClick={()=>handleCopy(selectedData.email)}><FaCopy /></Button>
                            </p>
                            <p>
                                <strong>Nomor Hp:</strong> {selectedData.nomor_telepon || "-"}
                                <Button size="sm" className="ms-2" onClick={()=>handleCopy(selectedData.nomor_telepon)}><FaCopy /></Button>
                            </p>
                            <p><strong>Alamat:</strong> {selectedData.alamat || "-"}</p>
                            <p><strong>Deskripsi:</strong> {selectedData.deskripsi || "-"}</p>
                            <p><strong>Tanggal:</strong> {selectedData.tanggal_laporan || "-"}</p>
                            <p><strong>Status:</strong> <span className={`badge ${selectedData.status === "Diproses" ? "bg-success" : "bg-warning"}`}>{selectedData.status}</span></p>
                        </div>
                    ) : (
                        <p>Data tidak ditemukan.</p>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {selectedData && selectedData.status !== "Diproses" && (
                        <Button variant="success" onClick={handleProses}>
                            Proses
                        </Button>
                    )}
                    <Button variant="secondary" onClick={handleClose}>
                        Tutup
                    </Button>
                </Modal.Footer>
            </Modal>
            

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Berhasil!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Status pengaduan berhasil <b>"Diproses"</b>.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="success" onClick={() => setShowSuccessModal(false)}>OK</Button>
                </Modal.Footer>
            </Modal>

        </div>

        </>
    );
};

export default StatusPengaduan;
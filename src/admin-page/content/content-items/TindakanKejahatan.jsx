import { HeaderTindakanKejahatan } from "../../../modal/ModalHeaders";
import { Trash2, Printer } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Table, Form, Button, Pagination, Modal } from "react-bootstrap";
import { FaSync, FaEye, FaSearch } from "react-icons/fa";
import * as XLSX from 'xlsx';

const TindakanKejahatan = () => {
    const [data, setData] = useState([]);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("Diproses");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedData, setSelectedData] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showSuccessModalDelete, setShowSuccessModalDelete] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const itemsPerPage = 50;
    const tableRef = useRef(null);

    const fetchData = async () => {
        try {
            const response = await axios.get("http://localhost:3000/api/report/crime");
            if (response.data && response.data.data) {
                setData(response.data.data);
            } else {
                throw new Error("Data Tidak Ditemukan.");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setError("Gagal Mengambil Data, Silahkan Coba Lagi.");
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (tableRef.current) {
            tableRef.current.scrollTop = 0;
        }
    }, [currentPage]);

    const handleProses = async () => {
        if (!selectedData || !selectedData.type) return;
        
        try {
            const formattedType = selectedData.type.toLowerCase().replace(/ /g, '_');
                
            let payload;
            if (selectedData.status === "Menunggu") {
                payload = { action: "proses" };
            } else if (selectedData.status === "Diproses") {
                payload = { action: "selesai" };
            } else {
                alert("Status laporan tidak valid untuk diproses");
                return;
            }
                
            const response = await axios.put(
                `http://localhost:3000/api/report/${formattedType}/${selectedData.id}`,
                payload
            );
        
            console.log("Response dari server:", response);
    
            if (response.status === 200) {
                const newStatus = selectedData.status === "Menunggu" ? "Diproses" : "Selesai";
                setSelectedData(prev => ({ ...prev, status: newStatus }));
                setShowSuccessModal(true);
                setShowModal(false);
            } else {
                alert("Gagal memperbarui status. Server tidak mengembalikan status 200.");
            }
        } catch (error) {
            console.error("Gagal memperbarui status:", error);
            console.log("Error details:", error.response?.data);
                
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Gagal memperbarui status: ${errorMessage}`);
        }
    };

    const handleDelete = async () => {
        if (!selectedData || !selectedData.type || !selectedData.id) {
            alert("Data tidak valid");
            return;
        }
        
        try {
            const response = await axios.delete(
                `http://localhost:3000/api/report/${selectedData.type}/${selectedData.id}/delete`,
                {
                    data: { status: "Selesai" }
                }
            );
        
            console.log("Response dari server:", response);
    
            if (response.status === 200) {
                setShowSuccessModalDelete(true);
                setShowModal(false);
            } else {
                 alert("Gagal menghapus data");
            }
        } catch (error) {
            console.error("Gagal menghapus data", error);
            console.log("Error details:", error.response?.data);
        
            const errorMessage = error.response?.data?.message || error.message;
            alert(`Gagal menghapus data: ${errorMessage}`);
        }
    };

    const handleDeleteAll = async () => {
        if (filterStatus !== "Selesai") return;
    
        const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus semua data dengan status 'Selesai'?");
        if (!confirmDelete) return;
    
        try {
            const reportType = "crime";
    
            const response = await axios.delete(`http://localhost:3000/api/report/${reportType}/delete`, {
                data: { status: "Selesai" },
            });
    
            if (response.status === 200) {
                setShowSuccessModalDelete(true);
                setShowModal(false);
            } else {
                alert("Gagal menghapus data.");
            }
        } catch (error) {
            console.error("Gagal menghapus data:", error);
            alert("Terjadi kesalahan saat menghapus data.");
        }
    };    

    const filteredData = data.filter(
        (item) => filterStatus === "Diproses" || item.status === filterStatus
    );

    const searchedData = filteredData.filter((item) =>
        item.id.toString().includes(searchQuery) ||
        item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alamat.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.max(Math.ceil(searchedData.length / itemsPerPage), 1);

    const currentItems = searchedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleDownloadData = () => { 
        if (filterStatus !== "Selesai") return;
        
        try {
            const dataToExport = data.filter(item => item.status === "Selesai");
            
            if (dataToExport.length === 0) {
                alert("Tidak ada data dengan status Selesai untuk dieksport");
                return;
            }
            
            const wb = XLSX.utils.book_new();
            
            const exportableData = dataToExport.map(item => ({
                ID: item.id,
                Nama: item.nama || "",
                Email: item.email || "",
                Alamat: item.alamat || "",
                Deskripsi: item.deskripsi || "",
                Tanggal_Laporan: item.tanggal_laporan ? item.tanggal_laporan.substring(0, 10) : "",
                Status: item.status || ""
            }));
            
            const ws = XLSX.utils.json_to_sheet(exportableData);
            
            XLSX.utils.book_append_sheet(wb, ws, "Crime Reports");
            
            const fileName = `Crime_Reports_Selesai_${new Date().toISOString().split('T')[0]}.xlsx`;
            
            XLSX.writeFile(wb, fileName);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
            alert("Terjadi kesalahan saat mengekspor data ke Excel: " + error.message);
        }
    };

    return (
        <>
            <HeaderTindakanKejahatan />
            <div className="container">
                {error && <p className="text-danger">{error}</p>}

                <div className="d-flex justify-content-between align-items-center">
                    <Button onClick={fetchData} variant="primary">
                        <FaSync /> Refresh
                    </Button>

                    {filterStatus === "Selesai" && (
                        <div className="d-flex gap-2">
                            <Button onClick={handleDeleteAll} variant="danger" title="Hapus Semua">
                                <Trash2 size={20} /> Hapus Semua
                            </Button>

                            <Button onClick={handleDownloadData} variant="info" title="Cetak Data">
                                <Printer size={20} /> Download data
                            </Button>
                        </div>
                    )}

                    <div className="d-flex align-items-center">
                        <Form.Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            style={{ width: "200px", marginRight: "10px", height: "3rem" }}
                        >
                            <option value="Diproses">Diproses</option>
                            <option value="Selesai">Selesai</option>
                        </Form.Select>

                        <div className="d-flex align-items-center">
                            <FaSearch className="me-2" />
                            <Form.Control
                                type="text"
                                placeholder="Cari ID, Nama, Email, Alamat"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{ width: "300px" }}
                            />
                        </div>
                    </div>
                </div>

                <div
                    className="table-responsive"
                    style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                    }}
                    ref={tableRef}
                >
                    <Table striped bordered hover>
                        <thead
                            className="table-dark text-center"
                            style={{
                                position: "sticky",
                                top: 0,
                                zIndex: 10,
                                backgroundColor: "#343a40",
                            }}
                        >
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
                            {currentItems.length > 0 ? (
                                currentItems.map((item) => (
                                    <tr key={item.id} className="text-center">
                                        <td>{item.id}</td>
                                        <td>{item.nama ? `${item.nama.substring(0, 10)}...` : "_"}</td>
                                        <td>{item.email ? `${item.email.substring(0, 10)}...` : "_"}</td>
                                        <td>{item.alamat ? `${item.alamat.substring(0, 15)}...` : "-"}</td>
                                        <td>{item.deskripsi ? `${item.deskripsi.substring(0, 30)}...` : "-"}</td>
                                        <td>{item.tanggal_laporan ? item.tanggal_laporan.substring(0, 10) : "-"}</td>
                                        <td>
                                            <span className={`badge ${item.status === "Diproses" ? "bg-success" : "bg-warning"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedData(item);
                                                    setShowModal(true);
                                                }}
                                            >
                                                <FaEye /> Detail
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-muted">
                                        Tidak ada data yang ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </div>

                <Pagination className="justify-content-center mt-3">
                    <Pagination.Prev
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Prev
                    </Pagination.Prev>

                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item
                            key={index}
                            active={index + 1 === currentPage}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </Pagination.Item>
                    ))}

                    <Pagination.Next
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </Pagination.Next>
                </Pagination>
            </div>

            <>

                <Modal show={showModal} onHide={handleCloseModal} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Detail Pengaduan</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {selectedData ? (
                            <div>
                                <p><strong>ID:</strong> {selectedData.id}</p>
                                <p><strong>Nama:</strong> {selectedData.nama}</p>
                                <p><strong>Email:</strong> {selectedData.email}</p>
                                <p><strong>Alamat:</strong> {selectedData.alamat || "-"}</p>
                                <p><strong>Deskripsi:</strong> {selectedData.deskripsi || "-"}</p>
                                <p><strong>Tanggal:</strong> {selectedData.tanggal_laporan || "-"}</p>
                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`badge ${selectedData.status === "Diproses" ? "bg-success" : "bg-warning"}`}>
                                        {selectedData.status}
                                    </span>
                                </p>
                            </div>
                        ) : (
                            <p>Data tidak ditemukan.</p>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                    {selectedData && selectedData.status !== "Selesai" ? (
                         <Button variant="primary" onClick={handleProses}>
                             Selesai
                         </Button>
                     ) : (
                        <Button variant="danger" onClick={handleDelete}>
                            Hapus
                        </Button>) }                       
                        <Button variant="secondary" onClick={handleCloseModal}>Tutup</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Berhasil!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Status pengaduan telah <b>"Selesai"</b>.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setShowSuccessModal(false)}>OK</Button>
                    </Modal.Footer>
                </Modal>

                <Modal show={showSuccessModalDelete} onHide={() => setShowSuccessModalDelete(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Berhasil!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>Laporan Berhasil <b>"Dihapus"</b>.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="success" onClick={() => setShowSuccessModalDelete(false)}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </>
        </>
    );
};

export default TindakanKejahatan;

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Table, Container, Card, Button, Modal } from "react-bootstrap";

export default function Feedbackritik() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const tableBodyRef = useRef(null);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/feedback');
      setFeedbacks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      
      if (error.response) {
        if (error.response.status === 404) {
          setError("Kritik tidak ditemukan");
        } else {
          setError("Terjadi kesalahan saat memuat kritik");
        }
      } else {
        setError("Koneksi bermasalah");
      }
      
      setLoading(false);
    }
  };

  const handleDeleteAllFeedbacks = async () => {
    try {
      await axios.delete('http://localhost:3000/api/feedback');
      setFeedbacks([]);
    } catch (error) {
      console.error("Error deleting all feedbacks:", error);
      alert("Gagal menghapus semua komentar");
    }
  };

  const handleDeleteFeedback = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/feedback/${id}`);
      setFeedbacks(feedbacks.filter(f => f.id !== id));
      setShowModal(false);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      alert("Gagal menghapus komentar");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    const interval = setInterval(fetchFeedbacks, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (tableBodyRef.current) {
      const isAtTop = tableBodyRef.current.scrollTop === 0;
      if (isAtTop) {
        tableBodyRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  }, [feedbacks]);

  if (loading) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <div className="text-center">Memuat data...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5 d-flex justify-content-center">
        <div className="text-center text-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="mt-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4 w-100" style={{ maxWidth: "900px" }}>
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-center text-primary m-0">Daftar Komentar Pengguna</h2>
            {feedbacks.length > 0 && (
              <Button 
                variant="danger" 
                onClick={handleDeleteAllFeedbacks}
              >
                Hapus Semua
              </Button>
            )}
          </div>
          <div 
            ref={tableBodyRef}
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            <Table striped bordered hover responsive className="text-center">
              <thead className="bg-primary text-white" style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr>
                  <th>No</th>
                  <th>Email</th>
                  <th>Tanggal</th>
                  <th>Komentar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <tr key={feedback.id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-bold text-secondary">{feedback.email}</td>
                      <td>{new Date(feedback.created_at).toLocaleDateString()}</td>
                      <td className="text-start">
                        {feedback.komentar ? `${feedback.komentar.substring(0, 20)}...` : "_"}
                      </td>
                      <td>
                        <Button 
                          variant="info" 
                          size="sm" 
                          onClick={() => {
                            setSelectedFeedback(feedback);
                            setShowModal(true);
                          }}
                        >
                          Lihat Detail
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-3">
                      Tidak ada komentar tersedia
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Modal Detail Feedback */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Detail Komentar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFeedback && (
            <>
              <p><strong>Email:</strong> {selectedFeedback.email}</p>
              <p><strong>Tanggal:</strong> {new Date(selectedFeedback.created_at).toLocaleDateString()}</p>
              <p><strong>Komentar:</strong> {selectedFeedback.komentar}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
          <Button 
            variant="danger" 
            onClick={() => handleDeleteFeedback(selectedFeedback.id)}
          >
            Hapus Komentar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

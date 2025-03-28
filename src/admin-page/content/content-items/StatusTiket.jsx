import { HeaderStatusTiket } from "../../../modal/ModalHeaders";
import { Card, Button, Container, Row, Col, Modal, Toast, ToastContainer } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

const StatusTiket = () => {
  const [showResetModal, setShowResetModal] = useState(false);
  const [showSuccessReset, setShowSuccessReset] = useState(false);
  const [showSuccessUpdate, setShowSuccessUpdate] = useState(false);
  const [queues, setQueues] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/ticket/queues');
      if (response.data) {
        setQueues(response.data);
      } else {
        throw new Error('Data tidak ditemukan');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const updateQueue = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/ticket/queues/${id}`);
      setQueues(prevQueues => 
        prevQueues.map(queue => 
          queue.id === id ? { ...queue, ...response.data } : queue
        )
      );

      setShowSuccessUpdate(true);
      setTimeout(() => setShowSuccessUpdate(false), 2000);

    } catch (error) {
      console.error('Gagal memperbarui antrian:', error);
    }
  };

  const resetQueue = async (counterId = null) => {
    try {
      const response = await axios.put('http://localhost:3000/api/ticket/queues/reset', {
        counterId: counterId
      });

      setQueues(response.data); 
      setShowResetModal(false);

      setShowSuccessReset(true);
      setTimeout(() => setShowSuccessReset(false), 2000);

    } catch (error) {
      console.error('Gagal mereset antrian:', error);
    }
  };

  return (
    <>
      <HeaderStatusTiket />
      <Container className="mt-5">
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="danger" onClick={() => setShowResetModal(true)}>Reset Antrian</Button>
        </div>
        <Row className="mt-3">
          {queues.map((queue, index) => (
            <Col md={4} key={index} className="mb-4">
              <Card className="text-center shadow-sm">
                <Card.Body>
                  <Card.Title className="fw-bold">{queue.title}</Card.Title>
                  <h2 className="display-5 text-primary">{ queue.queueNumber}</h2>
                  <Button variant="primary" onClick={() => updateQueue(queue.id)}>
                    Selanjutnya
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Modal show={showResetModal} onHide={() => setShowResetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Reset Nomor Antrian</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Pilih loket yang ingin direset atau reset semua loket:</p>
          <div className="list-group">
            {queues.map((queue, index) => (
              <button 
                key={index}  
                className="list-group-item list-group-item-action"
                onClick={() => resetQueue(queue.id)}
              >
                Reset {queue.title}
              </button>
            ))}
            <button 
              className="list-group-item list-group-item-action list-group-item-danger"
              onClick={() => resetQueue()}
            >
              Reset Semua Loket
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={showSuccessReset} centered>
        <Modal.Body className="text-center">
          <h4 className="text-success">✅ Reset Berhasil!</h4>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-end" className="p-3">
        <Toast show={showSuccessUpdate} bg="success" autohide delay={2000}>
          <Toast.Body className="text-white">✅ Nomor Antrian Berhasil Ditambahkan!</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default StatusTiket;

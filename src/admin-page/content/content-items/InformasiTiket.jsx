import { HeaderInformasiTiket } from "../../../modal/ModalHeaders"
import { useState } from "react";
import { Modal, Button, Card, ListGroup, Container, Row, Col } from "react-bootstrap";

const lokets = [
    { id: "A", admin: "Budi", status: "Jam Kerja", info: "SIM Roda Dua", queue: "AA001" },
    { id: "B", admin: "Sari", status: "Jam Kerja", info: "SIM Roda Empat", queue: "AB001" },
    { id: "C", admin: "Doni", status: "Istirahat", info: "SIM Roda >6", queue: "AC001" },
    { id: "D", admin: "Lina", status: "Tutup", info: "SKCK", queue: "AD001" },
    { id: "E", admin: "Rian", status: "Jam Kerja", info: "Surat Bebas Narkoba & Kesehatan", queue: "AE001" },
    { id: "F", admin: "Hadi", status: "Jam Kerja", info: "Berkas Lain-lain", queue: "AF001" },
  ];

const InformaiTiket = () => {
    const [selectedLoket, setSelectedLoket] = useState(null);
    return(
        <>
        <HeaderInformasiTiket/>
        <Container className="mt-4">
            <h2 className="text-center mb-4">Informasi Loket</h2>
            <Row>
                {lokets.map((loket) => (
                <Col md={4} key={loket.id} className="mb-3">
                    <Card className="text-center shadow-sm">
                    <Card.Body>
                        <Card.Title>Loket {loket.id}</Card.Title>
                        <Card.Text>Admin: {loket.admin}</Card.Text>
                        <Card.Text>Status: {loket.status}</Card.Text>
                        <Button variant="primary" onClick={() => setSelectedLoket(loket)}>
                        Lihat Detail
                        </Button>
                    </Card.Body>
                    </Card>
                </Col>
                ))}
            </Row>

            {selectedLoket && (
                <Modal show={true} onHide={() => setSelectedLoket(null)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Informasi Loket {selectedLoket.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <ListGroup>
                    <ListGroup.Item><strong>Admin:</strong> {selectedLoket.admin}</ListGroup.Item>
                    <ListGroup.Item><strong>Status:</strong> {selectedLoket.status}</ListGroup.Item>
                    <ListGroup.Item><strong>Layanan:</strong> {selectedLoket.info}</ListGroup.Item>
                    <ListGroup.Item><strong>Nomor Antrian:</strong> {selectedLoket.queue}</ListGroup.Item>
                    </ListGroup>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setSelectedLoket(null)}>
                    Tutup
                    </Button>
                </Modal.Footer>
                </Modal>
            )}
            </Container>
        </>
    )
}

export default InformaiTiket
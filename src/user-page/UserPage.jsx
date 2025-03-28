import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button, Navbar, Nav, Modal, Form } from "react-bootstrap";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const UserPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [feedbackData, setFeedbackData] = useState({ kritik: "", saran: "", komentar: "" });
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({});
  const sliderRef = useRef(null);
  const [queues, setQueues] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/ticket/queues');
      if (response.data){
        setQueues(response.data);
      } else {
        throw new Error('Data tidak ditemukan');
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    };
};

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      id: 1,
      title: "Tindak Kejahatan",
      description: "Form untuk menangani laporan tindak kejahatan",
      fields: ["Nama", "Email", "Nomor Telepon","Alamat" ,"Deskripsi Tindak Kejahatan"]
    },
    {
      id: 2,
      title: "Kehilangan",
      description: "Form untuk menangani laporan kehilangan",
      fields: ["Nama", "Email", "Nomor Telepon", "Informasi Objek Yang Hialng"]
    },
    {
      id: 3,
      title: "KDRT",
      description: "Form untuk menangani laporan kekeransan dalam rumah tangga",
      fields: ["Nama", "Nomor Telepon", "Alamat", "Nama Pelaku","Status Pelaku","Keterangan"]
    },
    {
      id: 4,
      title: "Bulying",
      description: "Form untuk menangani laporan pembulian",
      fields: ["Nama","Nomor Telepon", "Asal Sekolah", "Nama Pelaku", "Deskripsi"]
    },
    {
      id: 5,
      title: "Tindakan Mencurigakan",
      description: "Form untun menangani laporan tindakan mencurigakan",
      fields: ["Nama", "Nomor Telepon", "Alamat", "Deskripsi Tindakan Mencurigakan"]
    },
    {
      id: 6,
      title: "Kritik dan Saran",
      description: "Berikan kritik dan saran anda untuk meningkatkan fungsionalitas sistem",
      fields: ["Kritik", "Saran", "Komentar"]
    }
  ];

  const handleShowModal = (feature) => {
    setSelectedFeature(feature);
    setShowModal(true);
  };

  const handleInputChange = (e, field) => {
    setFormData({
      ...formData,
      [field]: e.target.value,
    });
  };

  const validateForm = () => {
    const requiredFields = selectedFeature?.fields || [];
    return requiredFields.every((field) => formData[field]);
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Harap lengkapi semua field.");
      return;
    }
  
    const requestData = {
      feature: selectedFeature.title,
      data: formData,
    };
  
    try {
      const response = await fetch("http://localhost:3000/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify(requestData),
      });
  
      console.log('Response Status:', response.status);
      const responseBody = await response.text();
      console.log('Response Body:', responseBody);
  
      if (!response.ok) {
        throw new Error(responseBody || "Gagal mengirim data");
      }
  
      const result = JSON.parse(responseBody);
      alert(result.message || "Data berhasil dikirim!");
      setFormData({});
      setShowModal(false);
    } catch (error) {
      console.error("Full Error:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token); 
        setUser(decoded); 
      } catch (error) {
        console.error("Token tidak valid", error);
        localStorage.removeItem("userToken");
      }
    }
  }, []);

  const handleFeedbackChange = (e) => {
    const { name, value } = e.target;
    setFeedbackData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFeedbackSubmit = async () => {
    const token = localStorage.getItem("userToken");

    if (!token || !user) {
      alert("Anda harus login terlebih dahulu");
      return;
    }

    try {
      const completeData = {
        ...feedbackData,
        user_id: user.id, 
        email: user.email,
        name: user.name,
      };

      await axios.post("http://localhost:3000/api/feedback", completeData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Feedback berhasil dikirim");
      setFeedbackData({ kritik: "", saran: "", komentar: "" }); 
    } catch (error) {
      console.error("Gagal mengirim feedback", error);
      alert("Gagal mengirim feedback");
    }
  };
  
  return (
    <div className="d-flex flex-column" style={{ minHeight: "100vh" }}>
      <Navbar expand="lg" fixed="top" className="w-100">
        <Container>
          <Navbar.Brand href="#home">Helpdesk Polres ATAM</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#account">Account</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <main style={{ marginTop: "56px", paddingTop: "20px", paddingBottom: "20px" }}>
        <Container className="text-center my-4">
          <h1>Selamat Datang di sistem informasi Helpdesk</h1>
          <p>Segera laporkan segala bentuk tindak kejahatan, kami selalu ada untuk masyarakat!</p>
        </Container>

        <Container>
          <Row>
            {features.map((feature) => (
              <Col md={4} className="mb-4" key={feature.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                    <Button variant="primary" onClick={() => handleShowModal(feature)}>
                      Action
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        <Container className="my-5">
        <h2 className="text-center mb-4">Informasi Nomor Antrian</h2>

        <div className="position-relative">
          <Button
            variant="light"
            className="position-absolute top-50 start-0 translate-middle-y rounded-circle shadow"
            onClick={() => sliderRef.current.scrollBy({ left: -300, behavior: "smooth" })}
            style={{
              width: "40px",
              height: "40px",
              zIndex: 1,
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginLeft: "-20px",
            }}
          >&lt;
          </Button>

          <div
              ref={sliderRef}
              className="d-flex overflow-auto pb-3"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                scrollSnapType: "x mandatory",
                gap: "15px",
              }}
            >
              {queues.map((queue) => (
                <Card
                  key={queue.id}
                  className="flex-shrink-0"
                  style={{
                    width: "220px",
                    scrollSnapAlign: "start",
                    borderLeft: "4px solid #007BFF",
                    minHeight: "130px",
                  }}
                >
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title className="text-primary">{queue.title}</Card.Title>
                    <div>
                      <div className="text-muted small">Nomor Antrian:</div>
                      <div className="display-4 text-center font-weight-bold">{queue.queueNumber}</div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>

          <Button
            variant="light"
            className="position-absolute top-50 end-0 translate-middle-y z-index-1 rounded-circle shadow"
            onClick={() => sliderRef.current.scrollBy({ left: 300, behavior: "smooth" })}
            style={{
              width: "40px",
              height: "40px",
              padding: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "-20px",
            }}
          >&gt;
          </Button>
        </div>
      </Container>

      <Container className="mt-5">
        <h2 className="text-center mb-4">Berikan Kritik, Saran, dan Komentar</h2>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Kritik</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="kritik"
              value={feedbackData.kritik}
              onChange={handleFeedbackChange}
              placeholder="Masukkan kritik Anda"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Saran</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="saran"
              value={feedbackData.saran}
              onChange={handleFeedbackChange}
              placeholder="Masukkan saran Anda"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Komentar</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="komentar"
              value={feedbackData.komentar}
              onChange={handleFeedbackChange}
              placeholder="Masukkan komentar Anda"
            />
          </Form.Group>
          <Button variant="primary" onClick={handleFeedbackSubmit}>
            Kirim Masukan
          </Button>
        </Form>
      </Container>
      </main>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setFormData({});
        }}
        centered
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{selectedFeature?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{selectedFeature?.description}</p>
          <Form>
            {selectedFeature?.fields.map((field, index) => (
              <Form.Group className="mb-3" key={index}>
                <Form.Label>{field}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={`Masukkan ${field}`}
                  value={formData[field] || ""}
                  onChange={(e) => handleInputChange(e, field)}
                />
              </Form.Group>
            ))}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Tutup
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>

      <footer className="py-3 text-center mt-auto">
        <Container>
          <p className="mb-0">&copy; {new Date().getFullYear()} MyApp. All Rights Reserved.</p>
        </Container>
      </footer>
    </div>
  );
};

export default UserPage;
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import './Contact.css'

function Contact() {
  return (
    <section className="py-5 bg-light Contact-section" >
      <Container className="py-5 bg-light">
        <h2 className="text-center mb-4">Contacto</h2>
        <Row className="justify-content-center text-center">
          <Col md={4} className="mb-4">
            <FaEnvelope size={30} className="mb-2 text-primary" />
            <h5>Email</h5>
            <p>gen.impositivo@gmail.com
            </p>
          </Col>
          <Col md={4} className="mb-4">
            <FaPhoneAlt size={30} className="mb-2 text-success" />
            <h5>Teléfono</h5>
            <p>+54 351 8582855</p>
          </Col>
          <Col md={4} className="mb-4">
            <FaMapMarkerAlt size={30} className="mb-2 text-danger" />
            <h5>Ubicación</h5>
            <p>Córdoba Capital, Argentina</p>
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default Contact;
